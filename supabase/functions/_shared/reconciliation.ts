import { z } from "zod";
import { paymentStore, type PaymentRecord } from "./payment-store.ts";
import { fetchStoredPaymentStatus, paymentJson, type PaymentEnv } from "./razorpay.ts";
import {syncUnattachedOrders} from "./investigation-sync.ts";
import {recoverRecentPaid,syncProviderDisputes} from "./payment-recovery.ts";
import {recoverProjectBalances,type ProjectEnv} from "./project-portal.ts";

export async function reconcileOne(env: PaymentEnv, runId: string, record: PaymentRecord) {
  const store=paymentStore(env);
  try {
    const status=await fetchStoredPaymentStatus(env,record);
    const state=await store.recordReconciliation(runId,record,status,null);
    return {state,error:false};
  } catch {
    // Never persist provider bodies, authorization headers or raw exceptions.
    await store.recordReconciliation(runId,record,{status:"pending"},"Provider verification or ledger update failed; owner review required.");
    return {state:"needs_reconciliation",error:true};
  }
}
export async function handleReconciliation(request: Request, env: ProjectEnv) {
  if(request.method!=="POST") return paymentJson({error:"Method not allowed"},405);
  const token=request.headers.get("x-payment-scheduler-token")??"";
  if(!/^[a-f0-9]{64}$/.test(token)) return paymentJson({error:"Unauthorized"},401);
  const store=paymentStore(env);
  let runId:string|undefined,checked=0,errors=0;
  try {
    if(!await store.verifyScheduler(token)) return paymentJson({error:"Unauthorized"},401);
    const raw=await request.text();if(raw.length>1000) return paymentJson({error:"Request too large"},413);
    runId=z.object({runId:z.string().uuid()}).strict().parse(JSON.parse(raw)).runId;
    if(!await store.claimRun(runId)) return paymentJson({alreadyProcessed:true});
    const before=new Date(Date.now()-15*60000).toISOString();
    const deadline=Date.now()+110000;
    let after:string|undefined;
    while(true){
      const records=await store.dueOrders(before,after);
      if(!records.length) break;
      for(let offset=0;offset<records.length;offset+=4){
        if(Date.now()>deadline) throw new Error("Run time budget exceeded");
        const results=await Promise.all(records.slice(offset,offset+4).map(record=>reconcileOne(env,runId!,record)));
        checked+=results.length; errors+=results.filter(result=>result.error).length;
      }
      after=records.at(-1)!.request_id;
      if(records.length<100) break;
    }
    const recovered=await recoverRecentPaid(env,runId,deadline);checked+=recovered.checked;errors+=recovered.errors;
    await syncUnattachedOrders(env,deadline);
    await syncProviderDisputes(env,deadline);
    if(env.PROJECT_PORTAL_ENABLED==="true"){const balances=await recoverProjectBalances(env,deadline);checked+=balances.checked;errors+=balances.errors;}
    await store.finishRun(runId,checked,errors,errors?"One or more orders need owner review.":null);
    return paymentJson({checked,errors});
  } catch {
    if(runId){try{await store.finishRun(runId,checked,errors+1,"Reconciliation did not complete; retry scheduled.");}catch{/* SQL watchdog flags abandoned runs. */}}
    return paymentJson({error:"Reconciliation unavailable"},503);
  }
}
