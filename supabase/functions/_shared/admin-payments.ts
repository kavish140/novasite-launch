import {z} from "zod";
import {paymentJson,type PaymentEnv,type VerifiedTestAdmin} from "./razorpay.ts";
import {paymentStore} from "./payment-store.ts";
import {reconcileOne} from "./reconciliation.ts";
import {operationsStore} from "./payment-operations.ts";

// Called only after the gateway verifies Auth identity AND site_admins membership.
export async function adminPayments(request: Request, env: PaymentEnv, action: string, admin: VerifiedTestAdmin) {
  if(!admin?.id) return paymentJson({error:"Admin sign-in required"},401);
  if(!["queue","history","recheck","paid","acknowledge","investigations"].includes(action)) return paymentJson({error:"Not found"},404);
  let run:string|undefined;
  const store=paymentStore(env);
  try {
    if(!await env.PAYMENT_RATE_LIMITER?.limit({key:`check:admin:${admin.id}`}).then(result=>result.success)) return paymentJson({error:"Too many checks. Try again in a minute."},429);
    const raw=await request.text();if(raw.length>1000)return paymentJson({error:"Request too large"},413);
    const body=JSON.parse(raw);
    const offset=z.number().int().min(0).max(100000).default(0);
    if(action==="investigations")return paymentJson(await operationsStore(env).investigations(z.object({offset}).strict().parse(body).offset));
    if(action==="paid")return paymentJson(await operationsStore(env).paid(z.object({offset}).strict().parse(body).offset));
    if(action==="acknowledge"){
      const input=z.discriminatedUnion("kind",[z.object({kind:z.literal("paid"),id:z.string().uuid(),acknowledged:z.boolean()}).strict(),z.object({kind:z.literal("dispute"),eventId:z.string().regex(/^[A-Za-z0-9_-]{1,200}$/)}).strict()]).parse(body);
      if(input.kind==="paid")await operationsStore(env).acknowledgePaid(input.id,input.acknowledged,admin.id);
      else await operationsStore(env).acknowledgeDispute(input.eventId,admin.id);
      return paymentJson({acknowledged:input.kind==="paid"?input.acknowledged:true});
    }
    if(action==="queue"){
      const input=z.object({offset,summaryOnly:z.boolean().optional()}).strict().parse(body);
      if(input.summaryOnly)return paymentJson(await store.health());
      return paymentJson(await store.queue(input.offset));
    }
    const input=z.object({requestId:z.string().uuid(),...(action==="history"?{offset}:{})}).strict().parse(body);
    const record=await store.byRequest(input.requestId);
    if(!record) return paymentJson({error:"Order not found"},404);
    if(action==="history") return paymentJson(await store.history(input.requestId,(input as {offset:number}).offset));
    run=await store.startRun("admin");
    const result=await reconcileOne(env,run,record);
    await store.finishRun(run,1,result.error?1:0,result.error?"Provider verification failed; owner review required.":null);
    return paymentJson({state:result.state,needsReview:result.error});
  } catch(error) {
    if(run){try{await store.finishRun(run,0,1,"Admin reconciliation did not complete; owner review required.");}catch{/* Cron watchdog flags abandoned runs. */}}
    if(error instanceof z.ZodError || error instanceof SyntaxError) return paymentJson({error:"Invalid payment request"},400);
    return paymentJson({error:"Unable to check payments. Try again later."},503);
  }
}
