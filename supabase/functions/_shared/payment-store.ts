import { createClient } from "@supabase/supabase-js";
import {operationsStore} from "./payment-operations.ts";
import {openDisputes,lostDisputes,type Dispute,type DisputeEvent,type PaymentHealth} from "./payment-health.ts";
type ServerEnv = { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string };
function serviceDb(env: ServerEnv) {
 if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Database unavailable");
 return createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
}

export type PaymentRecord = { request_id: string; payload_hash: string; order_id: string | null; package: string; amount: number; key_id: string; created_at: string; status?: string; reconciliation_state?: string; retry_parent?: string | null; retry_reserved_at?: string | null; customer?: Record<string, unknown> & { admin_id?: string } };
export function paymentStore(env: Partial<ServerEnv>) {
  const db = serviceDb(env as ServerEnv);
  return {
    async health():Promise<PaymentHealth> {
      const observedAt=new Date().toISOString(),before=new Date(Date.now()-24*60*60000).toISOString();
      const [latest,completed,successful,needs,overdue,refunded]=await Promise.all([
        db.from("payment_reconciliation_runs").select("state").in("state",["completed","failed"]).order("started_at",{ascending:false}).order("id").limit(1),
        db.from("payment_reconciliation_runs").select("finished_at").eq("source","cron").in("state",["completed","failed"]).not("finished_at","is",null).order("finished_at",{ascending:false}).limit(1),
        db.from("payment_reconciliation_runs").select("finished_at").eq("source","cron").eq("state","completed").order("finished_at",{ascending:false}).limit(1),
        db.from("payment_intents").select("request_id",{count:"exact",head:true}).eq("status","pending").eq("reconciliation_state","needs_reconciliation"),
        db.from("payment_intents").select("request_id",{count:"exact",head:true}).eq("status","pending").in("reconciliation_state",["pending","needs_reconciliation"]).lt("created_at",before),
        db.from("payment_intents").select("request_id",{count:"exact",head:true}).or("status.eq.refunded,refunded_amount.gt.0"),
      ]);
      if([latest,completed,successful,needs,overdue,refunded].some(result=>result.error))throw new Error("Payment health unavailable");
      const events:DisputeEvent[]=[];
      for(let offset=0;;offset+=1000){
        const page=await db.from("payment_webhook_events").select("event_id,processed_at,dispute").not("dispute","is",null).order("processed_at").order("id").range(offset,offset+999);
        if(page.error)throw new Error("Dispute history unavailable");
        events.push(...page.data as DisputeEvent[]);
        if(page.data.length<1000)break;
      }
      return {observedAt,lostDisputes:lostDisputes(events,await operationsStore(env).disputeAcknowledgements()),investigations:await operationsStore(env).investigationCount(),unacknowledgedPaid:await operationsStore(env).unacknowledged(),latestRunFailed:latest.data?.[0]?.state==="failed",lastCompletedAt:completed.data?.[0]?.finished_at??null,lastSuccessfulAt:successful.data?.[0]?.finished_at??null,needsReconciliation:needs.count??0,overdue:overdue.count??0,refunded:refunded.count??0,disputes:openDisputes([...events,...await operationsStore(env).disputeSnapshots()])};
    },
    async recordDispute(eventId:string,eventType:string,dispute:Dispute){
      const result=await db.rpc("record_payment_dispute_event",{p_event:eventId,p_type:eventType,p_order:dispute.orderId,p_dispute:dispute});
      if(result.error)throw new Error("Dispute storage unavailable");
      return result.data===true;
    },
    async queue(offset: number) {
      const since=new Date(Date.now()-24*60*60000).toISOString();
      const result=await db.from("payment_intents").select("request_id,order_id,payment_id,package,amount,status,reconciliation_state,created_at,last_checked_at,retry_parent,retry_reserved_at").eq("status","pending")
        .or(`reconciliation_state.in.(pending,needs_reconciliation),and(reconciliation_state.in.(failed,expired),last_checked_at.gte.${since})`)
        .order("created_at",{ascending:false}).order("request_id").range(offset,offset+49);
      if(result.error) throw new Error("Payment queue unavailable");
      const runs=await db.from("payment_reconciliation_runs").select("id,source,state,started_at,error,checked,errors").eq("alert",true).order("started_at",{ascending:false}).limit(20);
      const alerts=await db.from("payment_reconciliation_log").select("id,request_id,order_id,new_state,error,created_at,payment_intents!inner(status,reconciliation_state)").eq("alert",true).eq("payment_intents.status","pending").in("payment_intents.reconciliation_state",["pending","needs_reconciliation"]).order("created_at",{ascending:false}).limit(20);
      if(runs.error || alerts.error) throw new Error("Payment alerts unavailable");
      return {orders:result.data,runs:runs.data,alerts:alerts.data,nextOffset:result.data.length===50?offset+50:null};
    },
    async history(requestId: string, offset: number) {
      const result=await db.from("payment_reconciliation_log").select("id,order_id,old_state,new_state,error,alert,created_at,run_id").eq("request_id",requestId).order("created_at",{ascending:false}).order("id").range(offset,offset+49);
      if(result.error) throw new Error("Payment history unavailable");
      return {history:result.data,nextOffset:result.data.length===50?offset+50:null};
    },
    async byRequest(requestId: string): Promise<PaymentRecord|null> {
      const result=await db.from("payment_intents").select().eq("request_id",requestId).maybeSingle();
      if(result.error) throw new Error("Payment record unavailable");
      return result.data;
    },
    async startRun(source: "admin" | "retry") {
      const result=await db.from("payment_reconciliation_runs").insert({source,state:"running"}).select("id").single();
      if(result.error) throw new Error("Run storage unavailable");
      return result.data.id as string;
    },
    async reserveRetry(parent: string, record: Record<string, unknown>): Promise<{created:boolean;record:PaymentRecord}> {
      const result=await db.rpc("reserve_payment_retry",{p_parent:parent,p_record:record});
      if(result.error) throw new Error("Previous payment is not confirmed safe to retry. Check status or contact SiteNova.");
      return result.data;
    },
    async verifyScheduler(token: string) {
      const result=await db.rpc("verify_payment_scheduler",{p_token:token});
      if(result.error) throw new Error("Scheduler authentication unavailable");
      return result.data===true;
    },
    async claimRun(runId: string) {
      const result=await db.rpc("claim_payment_reconciliation_run",{p_run:runId});
      if(result.error) throw new Error("Run storage unavailable");
      return result.data===true;
    },
    async dueOrders(before: string, after?: string): Promise<PaymentRecord[]> {
      let query=db.from("payment_intents").select().eq("status","pending").lt("created_at",before).order("request_id").limit(100);
      if(after) query=query.gt("request_id",after);
      const result=await query;
      if(result.error) throw new Error("Payment queue unavailable");
      return result.data;
    },
    async recordReconciliation(runId: string, record: PaymentRecord, status: {status:string;paymentId?:string;refundedAmount?:number}, error: string|null) {
      const result=await db.rpc("record_payment_reconciliation",{p_run:runId,p_request:record.request_id,p_payment:status.paymentId??null,p_status:status.status,p_refunded:status.refundedAmount??0,p_error:error});
      if(result.error) throw new Error("Reconciliation storage unavailable");
      return result.data as string;
    },
    async finishRun(runId: string, checked: number, errors: number, error: string|null) {
      const result=await db.from("payment_reconciliation_runs").update({state:error||errors?"failed":"completed",checked,errors,error,alert:!!error||errors>0,finished_at:new Date().toISOString()}).eq("id",runId).eq("state","running");
      if(result.error) throw new Error("Run storage unavailable");
    },
    async hasEvent(eventId: string) {
      const result = await db.from("payment_webhook_events").select("event_id").eq("event_id",eventId).maybeSingle();
      if (result.error) throw new Error("Event storage unavailable");
      return !!result.data;
    },
    async completeWebhook(eventId: string, orderId: string | null, paymentId: string | null, status: string | null, refunded = 0) {
      const result = await db.rpc("complete_payment_webhook",{p_event:eventId,p_order:orderId,p_payment:paymentId,p_status:status,p_refunded:refunded});
      if (result.error) throw new Error("Event settlement unavailable");
      return result.data === true;
    },
    async reserve(record: Record<string, unknown>): Promise<{ created: boolean; record: PaymentRecord }> {
      const inserted = await db.from("payment_intents").insert(record).select().single();
      if (!inserted.error) return { created: true, record: inserted.data };
      if (inserted.error.code !== "23505") throw new Error("Payment storage unavailable");
      const existing = await db.from("payment_intents").select().eq("request_id", record.request_id).maybeSingle();
      if (existing.error || !existing.data || existing.data.payload_hash !== record.payload_hash) throw new Error("Payment request conflict. Contact SiteNova before retrying.");
      return { created: false, record: existing.data };
    },
    async attach(requestId: string, orderId: string) {
      const result = await db.from("payment_intents").update({ order_id: orderId }).eq("request_id", requestId).is("order_id", null).select("request_id").single();
      if (result.error || !result.data) throw new Error("Payment storage unavailable");
    },
    async find(orderId: string): Promise<PaymentRecord | null> {
      const result = await db.from("payment_intents").select().eq("order_id", orderId).maybeSingle();
      if (result.error) throw new Error("Payment storage unavailable");
      return result.data;
    },
    async settle(orderId: string, paymentId: string, status: string, refunded: number) {
      const result = await db.rpc("record_package_payment", { p_order: orderId, p_payment: paymentId, p_status: status, p_refunded: refunded });
      if (result.error) throw new Error("Payment storage unavailable");
    },
  };
}
