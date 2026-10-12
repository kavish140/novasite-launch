import {createClient} from "@supabase/supabase-js";
import type {PaymentEnv} from "./razorpay.ts";
import type {PaymentRecord} from "./payment-store.ts";
import type {Dispute,DisputeEvent} from "./payment-health.ts";
export function operationsStore(env:PaymentEnv){
 if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)throw new Error("Payment operations unavailable");
 const db=createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
 return {
  async receiptByRequest(requestId:string){
   const result=await db.from("payment_order_operations").select("receipt_id").eq("request_id",requestId).maybeSingle();if(result.error||!result.data)throw new Error("Receipt unavailable");return result.data.receipt_id as string;
  },
  async receipt(receiptId:string){
   const result=await db.from("payment_order_operations").select("payment_intents!inner(package,amount,status)").eq("receipt_id",receiptId).in("payment_intents.status",["paid","refunded"]).maybeSingle();
   if(result.error)throw new Error("Receipt unavailable");return result.data?.payment_intents as unknown as {package:string;amount:number;status:string}|null;
  },
  async recentPaid(since:string,after?:string):Promise<PaymentRecord[]>{
   let query=db.from("payment_order_operations").select("request_id,payment_intents!inner(*)").gte("paid_at",since).in("payment_intents.status",["paid","refunded"]).order("request_id").limit(100);
   if(after)query=query.gt("request_id",after);const result=await query;if(result.error)throw new Error("Recent settlement read failed");return result.data.map(row=>row.payment_intents as unknown as PaymentRecord);
  },
  async disputeSnapshots():Promise<DisputeEvent[]>{
   const rows:DisputeEvent[]=[];for(let offset=0;;offset+=1000){const page=await db.from("payment_dispute_snapshots").select("event_id,observed_at,dispute").order("id").range(offset,offset+999);if(page.error)throw new Error("Dispute sync read failed");rows.push(...page.data.map(row=>({event_id:row.event_id,processed_at:row.observed_at,dispute:row.dispute})));if(page.data.length<1000)break;}return rows;
  },
  async saveDisputeSnapshot(eventId:string,dispute:Dispute){
   const result=await db.from("payment_dispute_snapshots").upsert({id:dispute.id,event_id:eventId,dispute,observed_at:dispute.occurredAt},{onConflict:"id"});if(result.error)throw new Error("Dispute sync write failed");
  },
  async disputeAcknowledgements(){
   const ids:string[]=[];for(let offset=0;;offset+=1000){const page=await db.from("payment_dispute_acknowledgements").select("dispute_id").order("dispute_id").range(offset,offset+999);if(page.error)throw new Error("Dispute acknowledgements unavailable");ids.push(...page.data.map(row=>row.dispute_id));if(page.data.length<1000)break;}return new Set(ids);
  },
  async acknowledgeDispute(eventId:string,adminId:string){
   const event=await db.from("payment_webhook_events").select("event_id,dispute").eq("event_id",eventId).eq("dispute->>status","lost").maybeSingle();
   if(event.error||!event.data||typeof event.data.dispute?.id!=="string")throw new Error("Lost dispute not found");
   const result=await db.from("payment_dispute_acknowledgements").upsert({dispute_id:event.data.dispute.id,event_id:eventId,acknowledged_by:adminId},{onConflict:"dispute_id"});if(result.error)throw new Error("Dispute acknowledgement unavailable");
  },
  async investigations(offset=0){
   const result=await db.from("payment_investigations").select("id,kind,order_id,payment_id,request_id,amount,currency,provider_status,first_seen_at,last_seen_at").order("first_seen_at",{ascending:false}).order("id").range(offset,offset+49);
   if(result.error)throw new Error("Investigation queue unavailable");return {items:result.data,nextOffset:result.data.length===50?offset+50:null};
  },
  async investigationCount(){
   const result=await db.from("payment_investigations").select("id",{count:"exact",head:true});if(result.error)throw new Error("Investigation alerts unavailable");return result.count??0;
  },
  async recordInvestigation(input:{kind:string;orderId:string|null;paymentId:string|null;requestId?:string|null;amount:number|null;currency:string|null;status:string|null},eventId?:string,eventType?:string){
   const result=await db.rpc("record_payment_investigation",{p_kind:input.kind,p_order:input.orderId,p_payment:input.paymentId,p_request:input.requestId??null,p_amount:input.amount,p_currency:input.currency,p_status:input.status,p_event:eventId??null,p_type:eventType??null});
   if(result.error)throw new Error("Investigation storage unavailable");return result.data===true;
  },
  async unattached(after?:string){
   let query=db.from("payment_intents").select("request_id,created_at,key_id").is("order_id",null).lt("created_at",new Date(Date.now()-15*60000).toISOString()).order("request_id").limit(100);
   if(after)query=query.gt("request_id",after);const result=await query;if(result.error)throw new Error("Reservation read failed");return result.data as {request_id:string;created_at:string;key_id:string}[];
  },
  async paid(offset:number){
   const result=await db.from("payment_order_operations").select("request_id,paid_at,acknowledged_at,payment_intents!inner(order_id,package,amount,status,customer)").in("payment_intents.status",["paid","refunded"]).order("paid_at",{ascending:false}).order("request_id").range(offset,offset+49);
   if(result.error)throw new Error("Paid orders unavailable");
   return {orders:result.data,nextOffset:result.data.length===50?offset+50:null};
  },
  async unacknowledged(){
   const result=await db.from("payment_order_operations").select("request_id",{count:"exact",head:true}).is("acknowledged_at",null);
   if(result.error)throw new Error("Paid alerts unavailable");return result.count??0;
  },
  async acknowledgePaid(requestId:string,acknowledged:boolean,adminId:string){
   const result=await db.from("payment_order_operations").update({acknowledged_at:acknowledged?new Date().toISOString():null,acknowledged_by:acknowledged?adminId:null}).eq("request_id",requestId).select("request_id").maybeSingle();
   if(result.error||!result.data)throw new Error("Paid acknowledgement unavailable");
  },
 };
}
