import {createCookie,redirect} from "react-router";
import {z} from "zod";
import {paymentAction,paymentJson,projectAction} from "./razorpay.server";

const accessSchema=z.discriminatedUnion("kind",[
 z.object({kind:z.literal("advance"),package:z.enum(["starter","business"]),token:z.string().min(1).max(2000)}).strict(),
 z.object({kind:z.literal("balance"),token:z.string().min(1).max(2000)}).strict(),
]);
type Access=z.infer<typeof accessSchema>;
function accessCookie(request:Request){return createCookie("sitenova-payment-confirmation",{httpOnly:true,secure:new URL(request.url).protocol==="https:",sameSite:"strict",path:"/payment-thank-you",maxAge:1800});}
async function verified(request:Request,context:unknown,access:Access){
 const check=new Request(new URL(access.kind==="balance"?"/api/project/view":"/api/payments/status",request.url),{method:"POST",headers:{"Content-Type":"application/json",origin:new URL(request.url).origin,...(request.headers.has("cf-connecting-ip")?{"cf-connecting-ip":request.headers.get("cf-connecting-ip")!}:{})},body:JSON.stringify({token:access.token})});
 const response=access.kind==="balance"?await projectAction(check,context,"view"):await paymentAction(check,context,"status");
 if(!response.ok)return false;
 const result=await response.json();
 // Claims select the package only after the backend has authenticated the token.
 return access.kind==="balance"?result.balanceStatus==="paid"&&result.remaining===0&&result.balancePaid>0&&result.needsReview===false:result.status==="paid"&&JSON.parse(atob(access.token.split(".")[0])).package===access.package;
}
export async function grantPaymentConfirmation(request:Request,context:unknown){
 if(request.method!=="POST")return paymentJson({error:"Method not allowed"},405);
 if(request.headers.get("origin")!==new URL(request.url).origin)return paymentJson({error:"Invalid origin"},403);
 try{
  const body=await request.text();if(body.length>3000)return paymentJson({error:"Request too large"},413);
  const access=accessSchema.parse(JSON.parse(body));
  if(!await verified(request,context,access))return paymentJson({error:"A verified completed payment is required."},403);
  return new Response(null,{status:204,headers:{"Set-Cookie":await accessCookie(request).serialize(access),"Cache-Control":"no-store","Referrer-Policy":"no-referrer"}});
 }catch{return paymentJson({error:"Unable to confirm payment access. Check your original payment status."},403);}
}
export async function requirePaymentConfirmation(request:Request,context:unknown){
 const url=new URL(request.url),kind=url.searchParams.get("kind"),pack=url.searchParams.get("package");
 const fallback=kind==="balance"?"/project":pack==="starter"||pack==="business"?`/pay?package=${pack}`:"/pricing";
 try{
  const access=accessSchema.parse(await accessCookie(request).parse(request.headers.get("Cookie")));
  const matches=access.kind==="balance"?kind==="balance"&&pack===null:kind===null&&pack===access.package;
  if(matches&&await verified(request,context,access))return;
 }catch{/* Missing, tampered or unverifiable access always returns to recovery. */}
 throw redirect(fallback,{headers:{"Cache-Control":"no-store","Referrer-Policy":"no-referrer","Set-Cookie":await accessCookie(request).serialize("",{maxAge:0})}});
}
