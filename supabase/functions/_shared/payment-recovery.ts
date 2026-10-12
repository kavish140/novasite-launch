import {z} from "zod";
import {operationsStore} from "./payment-operations.ts";
import {paymentStore} from "./payment-store.ts";
import {reconcileOne} from "./reconciliation.ts";
import {providerGet} from "./provider-read.ts";
import type {PaymentEnv} from "./razorpay.ts";
const seconds=z.number().int().positive().max(253402300799).nullable().optional();
const disputeSchema=z.object({id:z.string().regex(/^disp_[A-Za-z0-9]+$/),payment_id:z.string().regex(/^pay_[A-Za-z0-9]+$/),status:z.string().max(200),amount:z.number().int().nonnegative(),currency:z.string().max(20),respond_by:seconds});
// Live Razorpay returns no items field for an empty collection. Accept only
// that explicit terminal shape; malformed/error responses must still fail.
const disputePageSchema=z.union([
 z.object({items:z.array(disputeSchema),has_more:z.boolean().optional()}),
 z.object({entity:z.literal("collection"),has_more:z.literal(false),count:z.literal(0).optional()}).strict().transform(()=>({items:[],has_more:false})),
]);
export async function recoverRecentPaid(env:PaymentEnv,runId:string,deadline:number){
 const store=operationsStore(env),since=new Date(Date.now()-30*24*60*60000).toISOString();let after:string|undefined,checked=0,errors=0;
 while(true){
  if(Date.now()>deadline)throw new Error("Paid recovery incomplete");const page=await store.recentPaid(since,after);
  for(let offset=0;offset<page.length;offset+=4){if(Date.now()>deadline)throw new Error("Paid recovery incomplete");const results=await Promise.all(page.slice(offset,offset+4).map(record=>reconcileOne(env,runId,record)));checked+=results.length;errors+=results.filter(result=>result.error).length;}
  if(page.length<100)break;after=page.at(-1)!.request_id;
 }return {checked,errors};
}
export async function syncProviderDisputes(env:PaymentEnv,deadline:number){
 const ops=operationsStore(env);let skip=0;
 while(true){
  if(Date.now()>deadline)throw new Error("Dispute sync incomplete");
  const page=disputePageSchema.parse(await providerGet(env,`disputes?count=100&skip=${skip}`));
  for(const entity of page.items){
   if(Date.now()>deadline)throw new Error("Dispute sync incomplete");
   const payment=z.object({id:z.string(),order_id:z.string().nullable(),amount:z.number().int().nonnegative(),currency:z.string()}).parse(await providerGet(env,`payments/${entity.payment_id}`));
   if(payment.id!==entity.payment_id||payment.currency!==entity.currency||entity.amount>payment.amount)throw new Error("Dispute reference mismatch");
   const dispute={id:entity.id,event:"payment.dispute.sync",status:entity.status,paymentId:entity.payment_id,orderId:payment.order_id,amount:entity.amount,currency:entity.currency,responseDueAt:entity.respond_by?new Date(entity.respond_by*1000).toISOString():null,occurredAt:new Date().toISOString()};
   const identity=JSON.stringify({...dispute,occurredAt:null});
   const digest=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(identity));
   const eventId="sync_"+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");
   await paymentStore(env).recordDispute(eventId,dispute.event,dispute);
   await ops.saveDisputeSnapshot(eventId,dispute);
  }
  if(page.has_more===false||(page.has_more===undefined&&page.items.length<100))break;
  if(!page.items.length)throw new Error("Dispute pagination incomplete");
  skip+=page.items.length;
 }
}
