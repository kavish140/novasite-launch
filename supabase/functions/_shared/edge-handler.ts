import { createClient } from "@supabase/supabase-js";
import { paymentAction, paymentWebhook, paymentJson, paymentsEnabled, PAYMENT_PACKAGES, type PaymentEnv } from "./razorpay.ts";
import { adminPayments } from "./admin-payments.ts";
import {paymentReceipt} from "./payment-receipt.ts";
import {projectAdmin,projectCustomer,projectWebhook,type ProjectEnv} from "./project-portal.ts";
import {pricingStore,pricingAdmin} from "./package-pricing.ts";
type EdgeEnv = PaymentEnv & ProjectEnv & { PAYMENT_GATEWAY_SECRET?: string };
async function sameSecret(actual: string, expected: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw",encoder.encode(expected),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);
  const signed = await crypto.subtle.sign("HMAC",key,encoder.encode(expected));
  return crypto.subtle.verify("HMAC",key,signed,encoder.encode(actual));
}
function configured(env: EdgeEnv) {
  return { ...env, PAYMENT_RATE_LIMITER: { async limit({ key }: { key: string }) {
    const encoder = new TextEncoder();
    const hmac = await crypto.subtle.importKey("raw",encoder.encode(env.PAYMENT_GATEWAY_SECRET ?? env.RAZORPAY_WEBHOOK_SECRET ?? ""),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
    const digest = await crypto.subtle.sign("HMAC",hmac,encoder.encode(key));
    const bucket = Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,"0")).join("");
    const db = createClient(env.SUPABASE_URL!,env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
    const result = await db.rpc("consume_payment_limit",{p_bucket:bucket});
    if (result.error) throw new Error("Rate limit unavailable");
    return { success: result.data === true };
  } } };
}
export async function handlePaymentEdge(request: Request, env: EdgeEnv) {
  if (request.method !== "POST") return paymentJson({error:"Method not allowed"},405);
  if (!env.PAYMENT_GATEWAY_SECRET || env.PAYMENT_GATEWAY_SECRET.length<32) return paymentJson({error:"Payments unavailable"},503);
  if (!await sameSecret(request.headers.get("x-payment-gateway-secret") ?? "",env.PAYMENT_GATEWAY_SECRET)) return paymentJson({error:"Unauthorized"},401);
  const action = new URL(request.url).pathname.split("/").pop();
  const adminTest = new URL(request.url).pathname.split("/").at(-2) === "admin-test";
  const adminQueue = new URL(request.url).pathname.split("/").at(-2) === "admin-queue";
  const projectChannel = new URL(request.url).pathname.split("/").at(-2) === "project";
  const projectActions=["projects","project-save","project-link","project-recheck","project-acknowledge"];
  const backend = configured(env);
  if (action === "config" && !adminQueue) {
   if(!env.SUPABASE_URL||!env.SUPABASE_SERVICE_ROLE_KEY)return paymentJson({enabled:false,testMode:false,packages:PAYMENT_PACKAGES});
   try{const prices=await pricingStore(env).current();return paymentJson({enabled:paymentsEnabled(backend),testMode:env.RAZORPAY_KEY_ID?.startsWith("rzp_test_")??false,packages:prices.packages,pricingVersion:prices.version});}
   catch{return paymentJson({error:"Package pricing unavailable"},503);}
  }
  if (!(projectChannel?["view","refresh","checkout","verify"]:adminQueue?["queue","history","recheck","paid","acknowledge","investigations","order-receipt","resume-checkout","pricing","pricing-save",...projectActions]:["order","retry","verify","status","checkout","receipt","receipt-link"]).includes(action ?? "")) return paymentJson({error:"Not found"},404);
  const origin = request.headers.get("x-payment-origin") ?? "";
  if (!/^https:\/\/sitenova\.dev$|^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return paymentJson({error:"Invalid origin"},403);
  const headers = new Headers({origin,"cf-connecting-ip":request.headers.get("x-payment-client-ip") ?? "local"});
  let admin;
  if (adminTest || adminQueue) {
    const token = request.headers.get("x-payment-admin-token");
    if (!token || token.length > 8000) return paymentJson({error:"Admin sign-in required"},401);
    if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return paymentJson({error:"Payments unavailable"},503);
    try {
      const db = createClient(env.SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
      const identity = await db.auth.getUser(token);
      if (identity.error || !identity.data.user || identity.data.user.is_anonymous) return paymentJson({error:"Admin sign-in required"},401);
      const owner = await db.from("site_admins").select("user_id").eq("user_id",identity.data.user.id).maybeSingle();
      if (owner.error) return paymentJson({error:"Unable to verify admin access"},503);
      if (!owner.data) return paymentJson({error:"Admin access required"},403);
      admin = {id:identity.data.user.id,email:identity.data.user.email ?? ""};
    } catch { return paymentJson({error:"Unable to verify admin access"},503); }
  }
  if(adminQueue && admin && ["pricing","pricing-save"].includes(action!))return pricingAdmin(request,backend,action!,admin);
  if(adminQueue && admin && projectActions.includes(action!))return projectAdmin(request,backend,action!,admin);
  if(adminQueue && admin) return adminPayments(request,backend,action!,admin);
  if(projectChannel)return projectCustomer(request,backend,action!);
  if(action==="receipt"||action==="receipt-link")return paymentReceipt(request,backend,action,admin);
  const forwarded = new Request(`${origin}/api/payments/${action}`,{method:"POST",headers,body:request.body,duplex:"half"} as RequestInit);
  return paymentAction(forwarded,{env:backend},action as "order"|"retry"|"verify"|"status"|"checkout",admin);
}
export async function handleWebhookEdge(request:Request,env:EdgeEnv){
 if(env.PROJECT_PORTAL_ENABLED==="true"&&request.method==="POST"&&env.RAZORPAY_WEBHOOK_SECRET){
  try{
   const raw=await request.clone().text(),signature=request.headers.get("x-razorpay-signature")??"",eventId=request.headers.get("x-razorpay-event-id")??"";
   if(raw.length>100000)return paymentJson({error:"Request too large"},413);
   if(!/^[a-f0-9]{64}$/.test(signature))return paymentJson({error:"Invalid signature"},403);
   const bytes=new Uint8Array(signature.match(/../g)!.map(byte=>parseInt(byte,16))),encoder=new TextEncoder();
   const key=await crypto.subtle.importKey("raw",encoder.encode(env.RAZORPAY_WEBHOOK_SECRET),{name:"HMAC",hash:"SHA-256"},false,["verify"]);
   if(!await crypto.subtle.verify("HMAC",key,bytes,encoder.encode(raw)))return paymentJson({error:"Invalid signature"},403);
   if(!/^[A-Za-z0-9_-]{1,200}$/.test(eventId))return paymentJson({error:"Invalid event ID"},400);
   if(await projectWebhook(env,JSON.parse(raw),eventId))return paymentJson({received:true});
  }catch{return paymentJson({error:"Unable to store payment event"},503);}
 }
 return paymentWebhook(request,{env:configured(env)});
}
