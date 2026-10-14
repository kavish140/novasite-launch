import {z} from "zod";
import {paymentJson,paymentsEnabled,fetchStoredPaymentStatus,type PaymentEnv,type VerifiedTestAdmin} from "./razorpay.ts";
import {paymentStore} from "./payment-store.ts";
import {projectStore,ProjectStoreError,type Balance,type Project} from "./project-store.ts";
export type ProjectEnv=PaymentEnv&{PROJECT_PORTAL_ENABLED?:string};
const stages=z.enum(["queued","discovery","design","development","review","ready","launched","on_hold"]);
const tokenSchema=z.object({token:z.string().max(300)}).strict();
const encoder=new TextEncoder();
async function key(secret:string){return crypto.subtle.importKey("raw",encoder.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);}
async function sign(text:string,secret:string){return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",await key(secret),encoder.encode(text))),b=>b.toString(16).padStart(2,"0")).join("");}
async function signatureValid(text:string,signature:string,secret:string){if(!/^[a-f0-9]{64}$/.test(signature))return false;const bytes=new Uint8Array(signature.match(/../g)!.map(byte=>parseInt(byte,16)));return crypto.subtle.verify("HMAC",await key(secret),bytes,encoder.encode(text));}
export async function projectToken(project:Project,secret:string){const text=`${project.id}.${project.share_id}`;return `${text}.${await sign(`sitenova-project-v1:${text}`,secret)}`;}
async function access(token:string,env:ProjectEnv){
 const match=/^([0-9a-f-]{36})\.([0-9a-f-]{36})\.([0-9a-f]{64})$/.exec(token);if(!match)throw new PortalError("Invalid or revoked project link",403);
 const text=`${match[1]}.${match[2]}`,signature=new Uint8Array(match[3].match(/../g)!.map(byte=>parseInt(byte,16)));
 let valid=false;for(const secret of [env.PAYMENT_RECEIPT_SECRET,env.PAYMENT_RECEIPT_PREVIOUS_SECRET])if(secret&&secret.length>=32&&await crypto.subtle.verify("HMAC",await key(secret),signature,encoder.encode(`sitenova-project-v1:${text}`)))valid=true;
 if(!valid)throw new PortalError("Invalid or revoked project link",403);
 const project=await projectStore(env).project(match[1]);if(!project||!project.link_enabled||project.share_id!==match[2])throw new PortalError("Invalid or revoked project link",403);
 return project;
}
class PortalError extends Error{constructor(message:string,public status=409){super(message);}}
async function api(env:ProjectEnv,path:string,body?:unknown,deadline?:number){
 const remaining=deadline===undefined?15000:Math.min(15000,deadline-Date.now());if(remaining<=0)throw new PortalError("Provider check time budget exhausted",503);
 const response=await fetch(`https://api.razorpay.com/v1/${path}`,{method:body?"POST":"GET",redirect:"manual",headers:{Authorization:`Basic ${btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)}`,"Content-Type":"application/json"},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(remaining)});
 if(!response.ok)throw new PortalError("Payment provider unavailable; check status before retrying",503);return response.json();
}
function providerParse<T>(schema:z.ZodType<T>,data:unknown):T{const parsed=schema.safeParse(data);if(!parsed.success)throw new PortalError("Payment provider returned invalid data; check status before retrying",503);return parsed.data;}
const orderSchema=z.object({id:z.string(),amount:z.number().int(),currency:z.string(),status:z.string(),notes:z.object({project_balance:z.string()})});
const providerPayment=z.object({id:z.string().regex(/^pay_[A-Za-z0-9]+$/),order_id:z.string(),amount:z.number().int(),currency:z.string(),status:z.string(),error_reason:z.string().nullable().optional(),amount_refunded:z.number().int().nonnegative().default(0)});
const declines=new Set(["incorrect_pin","incorrect_atm_pin","incorrect_otp","incorrect_cvv","insufficient_funds","incorrect_card_details","incorrect_card_expiry_date"]);
// GET-only; provider identity, order, currency and paise values are verified before storage.
export async function checkBalance(env:ProjectEnv,balance:Balance,source:string,event:string|null=null,deadline?:number){
 if(!balance.order_id||balance.key_id!==env.RAZORPAY_KEY_ID)throw new PortalError("Balance needs owner review");
 const order=providerParse(orderSchema,await api(env,`orders/${balance.order_id}`,undefined,deadline));
 if(order.id!==balance.order_id||order.amount!==balance.amount||order.currency!=="INR"||order.notes.project_balance!==balance.id)throw new PortalError("Balance details do not match");
 const collection=providerParse(z.object({items:z.array(providerPayment),count:z.number().int().optional(),has_more:z.boolean().optional()}),await api(env,`orders/${balance.order_id}/payments`,undefined,deadline));
 if(collection.has_more||collection.count!==undefined&&collection.count!==collection.items.length)throw new PortalError("Payment list incomplete");
 for(const payment of collection.items)if(payment.order_id!==balance.order_id||payment.amount!==balance.amount||payment.currency!=="INR"||payment.amount_refunded>payment.amount)throw new PortalError("Payment details do not match");
 for(const payment of collection.items)if((payment.status==="refunded"&&payment.amount_refunded===0)||(payment.amount_refunded>0&&!["captured","refunded"].includes(payment.status)))throw new PortalError("Refund details need owner review");
 const settled=collection.items.filter(p=>p.status==="captured"||p.status==="refunded"||p.amount_refunded>0);
 if(settled.length>1)throw new PortalError("Multiple payments need owner review");
 if(!settled.length&&["paid","refunded"].includes(balance.status))throw new PortalError("Stored settlement requires owner review");
 const failed=["created","attempted"].includes(order.status)&&collection.items.length>0&&collection.items.every(p=>p.status==="failed"&&declines.has(p.error_reason??""));
 const expired=collection.items.length===0&&order.status==="expired";
 const payment=settled[0],state=payment?(payment.status==="refunded"||payment.amount_refunded>0?"refunded":"paid"):failed?"failed":expired?"expired":collection.items.length||order.status!=="created"?"needs_reconciliation":"pending";
 await projectStore(env).record(balance,state,payment?.id??null,payment?.amount_refunded??0,source,event);
 return {attempted:collection.items.length>0||order.status!=="created",state,paymentId:payment?.id};
}
async function snapshot(env:ProjectEnv,project:Project,records?:Balance[]){
 const advance=await paymentStore(env).byRequest(project.advance_request);if(!advance)throw new Error("Advance unavailable");
 const advanceNet=["paid","refunded"].includes(advance.status??"")?advance.amount-Number((advance as typeof advance&{refunded_amount?:number}).refunded_amount??0):0;
 const attempts=records??await projectStore(env).balances(project.id),balance=attempts.find(item=>item.active!==false)??null;
 const settled=attempts.filter(item=>["paid","refunded"].includes(item.status));
 const balanceNet=settled.reduce((sum,item)=>sum+item.amount-item.refunded_amount,0);
 const review=attempts.length>=10&&!!balance&&["failed","expired"].includes(balance.status)||attempts.some(item=>item.review_required)||attempts.length>10||settled.length>1||settled.some(item=>item.id!==balance?.id)||advance.status!=="paid"||advanceNet!==advance.amount||!!balance&&(["refunded","needs_reconciliation","reserved"].includes(balance.status)||balance.status==="pending"&&Date.now()-Date.parse(balance.created_at)>=86400000);
 const remaining=project.total_amount===null?null:Math.max(0,project.total_amount-advanceNet-balanceNet);
 return {title:project.title,stage:project.stage,update:project.customer_update,updatedAt:project.updated_at,total:project.total_amount,advancePaid:advanceNet,balancePaid:balanceNet,remaining,balanceStatus:balance?.status??"not_started",retryId:balance&&["failed","expired"].includes(balance.status)?balance.id:null,needsReview:review,canPay:paymentsEnabled(env)&&project.balance_enabled&&!review&&remaining!==null&&remaining>=100&&(!balance||["pending","failed","expired"].includes(balance.status))};
}
async function body(request:Request){const raw=await request.text();if(raw.length>4000)throw new PortalError("Request too large",413);return JSON.parse(raw);}
function failure(error:unknown){if(error instanceof PortalError||error instanceof ProjectStoreError)return paymentJson({error:error.message},error.status);if(error instanceof z.ZodError||error instanceof SyntaxError)return paymentJson({error:"Invalid project request"},400);return paymentJson({error:"Project service unavailable; check status before retrying"},503);}
export async function projectCustomer(request:Request,env:ProjectEnv,action:string){
 if(env.PROJECT_PORTAL_ENABLED!=="true"||!env.PAYMENT_RECEIPT_SECRET||env.PAYMENT_RECEIPT_SECRET.length<32)return paymentJson({error:"Project portal is not available yet"},503);
 try{
  const deadline=Date.now()+28000;
  if(!["view","refresh","checkout","verify"].includes(action))return paymentJson({error:"Not found"},404);
  if(!await env.PAYMENT_RATE_LIMITER?.limit({key:`check:project:${request.headers.get("x-payment-client-ip")??"local"}`}).then(r=>r.success))return paymentJson({error:"Too many requests; try again shortly"},429);
  const input=action==="verify"?tokenSchema.extend({razorpay_payment_id:z.string().regex(/^pay_[A-Za-z0-9]+$/),razorpay_order_id:z.string(),razorpay_signature:z.string().regex(/^[a-f0-9]{64}$/)}).parse(await body(request)):action==="checkout"?tokenSchema.extend({retryId:z.string().uuid().optional()}).parse(await body(request)):tokenSchema.parse(await body(request));
  const project=await access(input.token,env),store=projectStore(env);
  let balance:Balance|null=null;
  if(action==="verify"){
   const callback=input as z.infer<typeof tokenSchema>&{razorpay_payment_id:string;razorpay_order_id:string;razorpay_signature:string};
   balance=await store.byOrder(callback.razorpay_order_id);
   if(balance?.project_id!==project.id||!balance?.order_id||callback.razorpay_order_id!==balance.order_id||!await signatureValid(`${balance.order_id}|${callback.razorpay_payment_id}`,callback.razorpay_signature,env.RAZORPAY_KEY_SECRET!))throw new PortalError("Invalid payment confirmation",403);
  }
  if(action==="refresh"||action==="verify"){
   const checks=action==="verify"&&balance?[balance]:await store.balances(project.id);
   for(const balance of checks)if(balance?.order_id){try{await checkBalance(env,balance,"customer",null,deadline);}catch{await store.record(balance,"needs_reconciliation",null,0,"customer",null,"Provider check failed; owner review required.");throw new PortalError("Payment is uncertain; contact SiteNova before paying again",503);}}
  }
  if(action!=="checkout")return paymentJson(await snapshot(env,project));
  if(!paymentsEnabled(env))return paymentJson({error:"Payment collection is currently disabled"},503);
  if(env.RAZORPAY_KEY_ID?.startsWith("rzp_live_")&&request.headers.get("x-payment-origin")!=="https://sitenova.dev")throw new PortalError("Live checkout is available only on sitenova.dev",403);
  const original=await paymentStore(env).byRequest(project.advance_request);
  if(!original||original.status!=="paid"||(await fetchStoredPaymentStatus(env,original)).status!=="paid")throw new PortalError("Advance needs review before balance payment");
  if(deadline-Date.now()<5000)throw new PortalError("Provider checks took too long; no new balance order was started",503);
  const retryId=(input as {retryId?:string}).retryId;
  // Re-fetch every earlier order. A timeout, authorization, unknown decline or late capture blocks replacement.
  const previous=await store.balances(project.id);
  if(previous.length>10)throw new PortalError("Balance needs owner review");
  for(const prior of previous){
   if(!prior.order_id)throw new PortalError("Order creation is uncertain; contact SiteNova before retrying");
   let checked:Awaited<ReturnType<typeof checkBalance>>;
   try{checked=await checkBalance(env,prior,"customer",null,deadline);}catch{await store.record(prior,"needs_reconciliation",null,0,"customer",null,"Previous order verification failed; owner review required.");throw new PortalError("Previous payment is uncertain; no fresh payment allowed",503);}
   if(prior.active===false||retryId===prior.id){if(!["failed","expired"].includes(checked.state))throw new PortalError("Previous payment is uncertain or settled; no fresh payment allowed");}
  }
  if(retryId&&!previous.some(prior=>prior.id===retryId))throw new PortalError("Invalid previous balance",403);
  if(deadline-Date.now()<5000)throw new PortalError("Provider checks took too long; no new balance order was started",503);
  const reserved=await store.reserve(project.id,env.RAZORPAY_KEY_ID!,project.share_id,project.total_amount,retryId??null);balance=reserved.record;
  if(reserved.created){
   // Exactly one POST after an atomic reservation. Any uncertain POST/attachment blocks a second order.
   const order=providerParse(orderSchema,await api(env,"orders",{amount:balance.amount,currency:"INR",receipt:balance.id,partial_payment:false,notes:{project_balance:balance.id}},deadline));
   if(!/^order_[A-Za-z0-9]+$/.test(order.id)||order.amount!==balance.amount||order.currency!=="INR"||order.notes.project_balance!==balance.id)throw new PortalError("Unable to prepare balance checkout",503);
   await store.attach(balance.id,order.id);balance={...balance,order_id:order.id,status:"pending"};
  }
  if(!balance.order_id)throw new PortalError("Order creation is uncertain; contact SiteNova before retrying");
  let checked:Awaited<ReturnType<typeof checkBalance>>;try{checked=await checkBalance(env,balance,"customer",null,deadline);}catch{await store.record(balance,"needs_reconciliation",null,0,"customer",null,"Checkout authorization check failed; owner review required.");throw new PortalError("Unable to authorize payment; check status before retrying",503);}
  if(checked.attempted||checked.state!=="pending"||["paid","refunded"].includes(balance.status))throw new PortalError("This balance already has a payment attempt; check status before paying again");
  if(Date.now()-Date.parse(balance.created_at)>=86400000)throw new PortalError("Checkout is too old; owner review required");
  // Fence owner changes made while provider requests were in flight.
  if(await store.authorize(project.id,project.share_id,env.RAZORPAY_KEY_ID!,balance.id)!==true)throw new PortalError("Balance authorization failed; reload before retrying");
  return paymentJson({orderId:balance.order_id,amount:balance.amount,keyId:env.RAZORPAY_KEY_ID,testMode:env.RAZORPAY_KEY_ID!.startsWith("rzp_test_")});
 }catch(error){return failure(error);}
}
export async function projectAdmin(request:Request,env:ProjectEnv,action:string,admin:VerifiedTestAdmin){
 if(!admin?.id)return paymentJson({error:"Admin access required"},403);
 if(env.PROJECT_PORTAL_ENABLED!=="true"||!env.PAYMENT_RECEIPT_SECRET||env.PAYMENT_RECEIPT_SECRET.length<32)return paymentJson({error:"Project portal is not configured"},503);
 try{
  if(!await env.PAYMENT_RATE_LIMITER?.limit({key:`check:project-admin:${admin.id}`}).then(r=>r.success))return paymentJson({error:"Too many requests"},429);
  const store=projectStore(env),input=await body(request);
  if(action==="projects"){const {offset,search}=z.object({offset:z.number().int().min(0).max(100000).default(0),search:z.string().trim().max(120).default("")}).strict().parse(input);const page=await store.list(offset,search),projects=page.slice(0,25);return paymentJson({nextOffset:page.length>25?offset+25:null,projects:await Promise.all(projects.map(async p=>{const attempts=await store.balances(p.id);return {...p,share_id:undefined,summary:await snapshot(env,p,attempts),balance:attempts.find(item=>item.active!==false)??null,attempts,history:await store.history(p.id)};}))});}
  if(action==="project-save"){
   const data=z.object({requestId:z.string().uuid(),title:z.string().trim().min(2).max(120),stage:stages,update:z.string().trim().max(1200),total:z.number().int().min(100).max(100000000).nullable(),enabled:z.boolean(),linkEnabled:z.boolean(),rotate:z.boolean().default(false),projectId:z.string().uuid().nullable().default(null),version:z.string().datetime({offset:true}).nullable().default(null)}).strict().parse(input);
   const project=await store.save(data as Parameters<typeof store.save>[0]);return paymentJson({id:project.id});
  }
  if(action==="project-link"||action==="project-recheck"||action==="project-acknowledge"){
   const {id,balanceId}=z.object({id:z.string().uuid(),balanceId:z.string().uuid().optional()}).strict().parse(input);
   if(action!=="project-acknowledge"&&balanceId)throw new PortalError("Invalid project request",400);const project=await store.project(id);if(!project)throw new PortalError("Project not found",404);
   if(action==="project-link"){if(!project.link_enabled)throw new PortalError("Project link is disabled");return paymentJson({url:`https://sitenova.dev/project#${await projectToken(project,env.PAYMENT_RECEIPT_SECRET)}`});}
   if(action==="project-acknowledge"){if(!balanceId)throw new PortalError("Select the exact payment to acknowledge",400);await store.acknowledge(id,balanceId);return paymentJson({acknowledged:true});}
   const deadline=Date.now()+28000,balances=await store.balances(id);for(const balance of balances)if(balance?.order_id){try{await checkBalance(env,balance,"admin",null,deadline);}catch{await store.record(balance,"needs_reconciliation",null,0,"admin",null,"Admin provider check failed; owner review required.");throw new PortalError("Unable to verify balance; owner review required",503);}}return paymentJson(await snapshot(env,project));
  }
  return paymentJson({error:"Not found"},404);
 }catch(error){return failure(error);}
}
// Called only after existing raw-body webhook authentication has been verified.
export async function projectWebhook(env:ProjectEnv,event:unknown,eventId:string){
 const eventType=(event as {event?:unknown}|null)?.event;
 // Disputes must reach the existing record-only dispute branch, never settlement.
 if(typeof eventType==="string"&&eventType.startsWith("payment.dispute."))return false;
 const payload=z.object({payload:z.object({payment:z.object({entity:z.object({order_id:z.string().optional()})}).optional(),order:z.object({entity:z.object({id:z.string().regex(/^order_[A-Za-z0-9]+$/)})}).optional(),refund:z.object({entity:z.object({payment_id:z.string()})}).optional()})}).safeParse(event);
 if(!payload.success)return false;
 const store=projectStore(env),order=payload.data.payload.payment?.entity.order_id??payload.data.payload.order?.entity.id,payment=payload.data.payload.refund?.entity.payment_id;
 let balance=order?await store.byOrder(order):payment?await store.byPayment(payment):null;
 if(!balance&&!order&&payment&&/^pay_[A-Za-z0-9]+$/.test(payment)){const refunded=providerParse(providerPayment,await api(env,`payments/${payment}`));if(refunded.id!==payment)throw new Error("Refund reference mismatch");balance=await store.byOrder(refunded.order_id);}
 if(!balance)return false;
 if(await paymentStore(env).hasEvent(eventId))return true;
 await checkBalance(env,balance,"webhook",eventId);return true;
}
export async function recoverProjectBalances(env:ProjectEnv,deadline:number){
 const store=projectStore(env),checkpoint=await store.checkpoint();let checked=0,errors=0;
 while(true){const records=await store.due(checkpoint);if(!records.length)break;for(const balance of records){if(Date.now()>=deadline)throw new Error("Project recovery time budget exceeded");try{await checkBalance(env,balance,"cron",null,deadline);}catch{errors++;await store.record(balance,"needs_reconciliation",null,0,"cron",null,"Provider check failed; owner review required.");}checked++;}if(records.length<50)break;}
 return {checked,errors};
}
