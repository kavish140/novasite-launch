import {z} from "zod";
import {operationsStore} from "./payment-operations.ts";
import {paymentStore} from "./payment-store.ts";
import {readToken,paymentJson,type PaymentEnv,type VerifiedTestAdmin} from "./razorpay.ts";
const encoder=new TextEncoder();
async function key(secret:string){return crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);}
export async function receiptToken(id:string,secret:string){
 const digest=await crypto.subtle.sign("HMAC",await key(secret),encoder.encode(`sitenova-receipt-v1:${id}`));
 return `${id}.${Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("")}`;
}
async function verifyReceipt(token:string,env:PaymentEnv){
 const match=/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.([0-9a-f]{64})$/.exec(token);if(!match)return null;
 const signature=new Uint8Array(match[2].match(/../g)!.map(byte=>parseInt(byte,16)));
 for(const secret of [env.PAYMENT_RECEIPT_SECRET,env.PAYMENT_RECEIPT_PREVIOUS_SECRET])if(secret&&secret.length>=32&&await crypto.subtle.verify("HMAC",await key(secret),signature,encoder.encode(`sitenova-receipt-v1:${match[1]}`)))return match[1];
 return null;
}
// Read-only capability endpoints. Never calls Razorpay or a settlement writer.
export async function paymentReceipt(request:Request,env:PaymentEnv,action:string,admin?:VerifiedTestAdmin){
 if(!env.PAYMENT_RECEIPT_SECRET||env.PAYMENT_RECEIPT_SECRET.length<32)return paymentJson({error:"Receipt links unavailable"},503);
 try{
  if(!await env.PAYMENT_RATE_LIMITER?.limit({key:`check:receipt:${request.headers.get("x-payment-client-ip")??"local"}`}).then(r=>r.success))return paymentJson({error:"Too many receipt requests"},429);
  const raw=await request.text();if(raw.length>4000)return paymentJson({error:"Request too large"},413);
  const input=z.object({token:z.string().max(3000)}).strict().parse(JSON.parse(raw));
  const ops=operationsStore(env);
  if(action==="receipt"){
   const id=await verifyReceipt(input.token,env);if(!id)return paymentJson({error:"Invalid receipt link"},403);
   const receipt=await ops.receipt(id);if(!receipt)return paymentJson({error:"Receipt not found"},404);
   // Explicit projection: no customer/order/payment identifiers may escape.
   return paymentJson({package:receipt.package,amount:receipt.amount,status:receipt.status});
  }
  const claims=await readToken(input.token,env);if((claims.package==="test")!==!!admin)return paymentJson({error:"Invalid receipt channel"},403);
  const record=await paymentStore(env).find(claims.orderId);
  if(!record||record.key_id!==claims.keyId||record.package!==claims.package||record.amount!==claims.amount||(admin&&record.customer?.admin_id!==admin.id))return paymentJson({error:"Invalid payment session"},403);
  if(!["paid","refunded"].includes(record.status??""))return paymentJson({error:"Payment is not yet confirmed"},409);
  const id=await ops.receiptByRequest(record.request_id);
  return paymentJson({url:`https://sitenova.dev/receipt#${await receiptToken(id,env.PAYMENT_RECEIPT_SECRET)}`});
 }catch(error){if(error instanceof z.ZodError||error instanceof SyntaxError)return paymentJson({error:"Invalid receipt request"},400);return paymentJson({error:"Receipt unavailable"},503);}
}
