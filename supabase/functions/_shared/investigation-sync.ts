import {z} from "zod";
import {operationsStore} from "./payment-operations.ts";
import {providerGet} from "./provider-read.ts";
import type {PaymentEnv} from "./razorpay.ts";
const order=z.object({id:z.string().regex(/^order_[A-Za-z0-9]+$/),receipt:z.string().nullable(),amount:z.number().int().nonnegative(),currency:z.string(),status:z.string()});
export async function syncUnattachedOrders(env:PaymentEnv,deadline:number){
 const store=operationsStore(env);let after:string|undefined;const pending=new Map<string,string>();let earliest=Date.now();
 while(true){if(Date.now()>deadline)throw new Error("Investigation scan incomplete");const page=await store.unattached(after);for(const row of page){if(row.key_id===env.RAZORPAY_KEY_ID){pending.set(row.request_id,row.created_at);earliest=Math.min(earliest,Date.parse(row.created_at));}}if(page.length<100)break;after=page.at(-1)!.request_id;}
 if(!pending.size)return;
 const from=Math.floor(earliest/1000)-60,to=Math.floor(Date.now()/1000);let skip=0;
 while(true){
  if(Date.now()>deadline)throw new Error("Investigation scan incomplete");
  const page=z.object({items:z.array(order)}).parse(await providerGet(env,`orders?from=${from}&to=${to}&count=100&skip=${skip}`));
  for(const item of page.items)if(item.receipt&&pending.has(item.receipt))await store.recordInvestigation({kind:"unattached_order",orderId:item.id,paymentId:null,requestId:item.receipt,amount:item.amount,currency:item.currency,status:item.status});
  if(page.items.length<100)break;skip+=100;
 }
}
