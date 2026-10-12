import { PAYMENT_PACKAGES } from "../../supabase/functions/_shared/catalog";
export { PAYMENT_PACKAGES };
type GatewayEnv = { SUPABASE_URL?: string; PAYMENT_GATEWAY_SECRET?: string; PAYMENT_EDGE_ENABLED?: string };
export function paymentEnv(context: unknown): GatewayEnv { return (context as { cloudflare?: { env?: GatewayEnv } })?.cloudflare?.env ?? {}; }
export function paymentJson(body: unknown,status=200) { return Response.json(body,{status,headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer","X-Content-Type-Options":"nosniff"}}); }
async function edge(env: GatewayEnv,action: string,body="{}",origin="https://sitenova.dev",ip="local",adminToken?:string) {
 const recovery=action==="status" || action==="verify" || action==="receipt" || action==="receipt-link";
 if((env.PAYMENT_EDGE_ENABLED!=="true" && !adminToken && !recovery) || !env.PAYMENT_GATEWAY_SECRET || env.PAYMENT_GATEWAY_SECRET.length<32 || !env.SUPABASE_URL) return paymentJson({error:"Online payments are not available yet. Please contact SiteNova."},503);
 const base=new URL(env.SUPABASE_URL);
 if(base.protocol!=="https:" || !base.hostname.endsWith(".supabase.co") || base.username || base.password) throw new Error("Invalid backend URL");
 const response=await fetch(base.origin+"/functions/v1/razorpay-payments/"+action,{method:"POST",redirect:"manual",signal:AbortSignal.timeout(35000),headers:{"Content-Type":"application/json","x-payment-gateway-secret":env.PAYMENT_GATEWAY_SECRET,"x-payment-origin":origin,"x-payment-client-ip":ip,...(adminToken ? {"x-payment-admin-token":adminToken} : {})},body});
 if(response.status>=300 && response.status<400) throw new Error("Payment backend redirect rejected");
 return response;
}
export async function paymentConfiguration(context: unknown) {
 try { const response=await edge(paymentEnv(context),"config"); if(!response.ok) throw new Error("Unavailable"); const config=await response.json(); return {enabled:config.enabled===true,testMode:config.testMode===true,packages:PAYMENT_PACKAGES}; }
 catch { return {enabled:false,testMode:false,packages:PAYMENT_PACKAGES}; }
}
export async function paymentAction(request: Request,context: unknown,action:"order"|"retry"|"verify"|"status"|"checkout") {
 if(request.method!=="POST") return paymentJson({error:"Method not allowed"},405);
 if(request.headers.get("origin")!==new URL(request.url).origin) return paymentJson({error:"Invalid origin"},403);
 try { const body=await request.text(); if(body.length>6000) return paymentJson({error:"Request too large"},413); const response=await edge(paymentEnv(context),action,body,new URL(request.url).origin,request.headers.get("cf-connecting-ip")??"local"); return paymentJson(await response.json(),response.status); }
 catch { return paymentJson({error:"Unable to confirm payment. Check status before retrying."},503); }
}
export const paymentWebhook=(_request:Request,_context:unknown)=>paymentJson({error:"Use the Supabase webhook endpoint"},410);

export async function adminTestPaymentAction(request:Request,context:unknown,action:string) {
 if(request.method!=="POST") return paymentJson({error:"Method not allowed"},405);
 if(request.headers.get("origin")!==new URL(request.url).origin) return paymentJson({error:"Invalid origin"},403);
 if(!["order","checkout","verify","status","queue","history","recheck","paid","acknowledge","investigations","receipt-link"].includes(action)) return paymentJson({error:"Not found"},404);
 const authorization=request.headers.get("authorization") ?? "";
 if(!authorization.startsWith("Bearer ") || authorization.length>8010 || authorization.length<8) return paymentJson({error:"Admin sign-in required"},401);
 try {
  const body=await request.text(); if(body.length>6000) return paymentJson({error:"Request too large"},413);
  const channel=["queue","history","recheck","paid","acknowledge","investigations"].includes(action)?"admin-queue/":"admin-test/";
  const response=await edge(paymentEnv(context),channel+action,body,new URL(request.url).origin,request.headers.get("cf-connecting-ip")??"local",authorization.slice(7));
  return paymentJson(await response.json(),response.status);
 } catch { return paymentJson({error:"Unable to confirm test payment. Check status before retrying."},503); }
}
export async function receiptAction(request:Request,context:unknown,action:"receipt"|"receipt-link"){
 if(request.method!=="POST")return paymentJson({error:"Method not allowed"},405);
 if(request.headers.get("origin")!==new URL(request.url).origin)return paymentJson({error:"Invalid origin"},403);
 try{const body=await request.text();if(body.length>4000)return paymentJson({error:"Request too large"},413);const response=await edge(paymentEnv(context),action,body,new URL(request.url).origin,request.headers.get("cf-connecting-ip")??"local");return paymentJson(await response.json(),response.status);}catch{return paymentJson({error:"Receipt unavailable"},503);}
}
