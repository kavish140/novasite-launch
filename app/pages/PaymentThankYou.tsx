import {useEffect,useState} from "react";
import {Link,useLoaderData,useSearchParams} from "react-router";
import {ArrowRight,CheckCircle2,Loader2,LockKeyhole,MessageCircle,RefreshCw,Zap} from "lucide-react";
import PaymentReceiptLink from "@/components/PaymentReceiptLink";
import {EMAIL,SITE_NAME,buildWhatsAppUrl} from "@/lib/constants";
import {formatINR,type PaymentSession,type PaymentStatus} from "@/lib/payments";
import {paymentRequest,restorePayment,restoreSharedPayment,savePayment} from "@/lib/razorpay-client";
import {projectRequest,type ProjectSummary} from "@/lib/project-client";

type Confirmation={state:"paid"|"pending"|"refunded";session?:PaymentSession;projectToken?:string;paymentId?:string;amount?:number};
export default function PaymentThankYou(){
 const {testMode=false}=useLoaderData<{testMode?:boolean}>();
 const [params]=useSearchParams();
 const kind=params.get("kind"),selected=params.get("package");
 const packageId=selected==="starter"||selected==="business"?selected:null;
 const [confirmation,setConfirmation]=useState<Confirmation|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState(""),[revision,setRevision]=useState(0);
 useEffect(()=>{
  let active=true;setConfirmation(null);setBusy(true);setError("");
  async function check(){
   try{
    let result:Confirmation;
    if(kind==="balance"){
     const token=decodeURIComponent(window.location.hash.slice(1));
     if(!token||token.length>4096)throw new Error("Open the complete private project link shared by SiteNova.");
     const summary=await projectRequest<ProjectSummary>("view",token);
     const paid=summary.balanceStatus==="paid"&&summary.remaining===0&&summary.balancePaid>0&&!summary.needsReview;
     result={state:paid?"paid":summary.balanceStatus==="refunded"?"refunded":"pending",projectToken:token,...(paid?{amount:summary.balancePaid}:{})};
    }else{
     if(kind!==null||!packageId)throw new Error("Open your original payment link to check your payment.");
     const session=restoreSharedPayment(packageId)??restorePayment(packageId);
     if(!session)throw new Error("Open your original payment link in the browser you used to pay, or contact SiteNova for help.");
     savePayment(session);
     const status=await paymentRequest<PaymentStatus>("status",{token:session.token});
     result={state:status.status,session,paymentId:status.paymentId};
    }
    if(active)setConfirmation(result);
   }catch{if(active)setError("We couldn't confirm your payment here. Open your original payment or project link, or contact SiteNova. If you were debited, do not pay again while the status is uncertain.");}
   finally{if(active)setBusy(false);}
  }
  void check();return()=>{active=false;};
 },[kind,packageId,revision]);
 const paid=confirmation?.state==="paid";
 const projectUrl=confirmation?.projectToken?`/project#${encodeURIComponent(confirmation.projectToken)}`:null;
 const service=kind==="balance"?"Remaining project balance":packageId==="business"?"Business website advance":"Starter website advance";
 return <main className="min-h-screen bg-[#0c1221] px-4 py-9 text-slate-100 sm:px-6 sm:py-14"><div className="mx-auto max-w-2xl">
  <header className="mb-8 flex items-center justify-between gap-4"><Link reloadDocument to="/" className="flex items-center gap-3 font-heading text-xl font-bold"><span className="rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 p-2.5"><Zap className="h-5 w-5" aria-hidden="true"/></span>{SITE_NAME}</Link><span className="flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="h-4 w-4" aria-hidden="true"/>Private confirmation</span></header>
  <section className="overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl" aria-labelledby="payment-confirmation-title" aria-busy={busy}>
   <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400"/>
   <div className="p-6 sm:p-10" aria-live="polite">
    {busy?<div role="status" className="py-12 text-center"><Loader2 className="mx-auto mb-5 h-9 w-9 animate-spin text-blue-600 motion-reduce:animate-none" aria-hidden="true"/><h1 id="payment-confirmation-title" className="font-heading text-2xl font-bold">Checking your payment…</h1><p className="mt-3 text-sm text-slate-500">Please wait while we confirm the saved payment status.</p></div>:paid?<>
     <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2 className="h-9 w-9" aria-hidden="true"/></div>
     <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">{testMode?"Test payment verified":"Payment confirmed"}</p>
     <h1 id="payment-confirmation-title" className="mt-3 font-heading text-3xl font-bold tracking-tight sm:text-4xl">{testMode?"Your test payment is confirmed.":kind==="balance"?"Thank you. Your balance is paid.":"Thank you for choosing SiteNova."}</h1>
     <p className="mt-4 text-sm leading-7 text-slate-600">{testMode?"This is a simulated payment and does not confirm a paid project.":kind==="balance"?"Your remaining payment is confirmed in our records. Follow your private project page for delivery and launch updates.":"Your website advance is confirmed in our records. We’ll review your project brief and confirm the scope, agreed total and schedule with you."}</p>
     <dl className="mt-7 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm"><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-500">Payment for</dt><dd className="font-semibold">{service}</dd></div><div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-500">Status</dt><dd className="font-semibold text-emerald-700">Verified paid</dd></div>{confirmation?.amount!==undefined&&<div className="flex flex-wrap justify-between gap-2"><dt className="text-slate-500">Recorded balance payment</dt><dd className="font-semibold">{formatINR(confirmation.amount)}</dd></div>}{confirmation?.paymentId&&<div><dt className="text-slate-500">Payment reference</dt><dd className="mt-1 break-all font-medium">{confirmation.paymentId}</dd></div>}</dl>
     <div className="mt-8"><h2 className="font-heading text-lg font-bold">What happens next?</h2><ol className="mt-4 space-y-4 text-sm leading-6 text-slate-600"><li><strong className="text-slate-900">1. Keep your payment record.</strong> {kind==="balance"?"Your project page includes your recorded payment breakdown.":"Save the receipt link below for your records and access from another device."}</li><li><strong className="text-slate-900">2. Confirm the next step with us.</strong> {kind==="balance"?"Delivery and launch follow your agreed proposal.":"We’ll discuss your requirements and confirm the project plan with you."}</li><li><strong className="text-slate-900">3. Follow your project.</strong> {kind==="balance"?"Use your existing private project link for progress updates.":"SiteNova will share your private project link when your project is set up."}</li></ol></div>
     {confirmation?.session&&<div className="mt-7 border-t border-slate-200 pt-5"><h2 className="font-semibold">Your payment receipt</h2><PaymentReceiptLink token={confirmation.session.token}/></div>}
     {projectUrl&&<Link reloadDocument to={projectUrl} referrerPolicy="no-referrer" className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">View project status<ArrowRight className="h-4 w-4" aria-hidden="true"/></Link>}
    </>:<div role="alert"><h1 id="payment-confirmation-title" className="font-heading text-2xl font-bold">{confirmation?.state==="refunded"?"A refund has been recorded":confirmation?.state==="pending"?"Your payment is still being checked":"Payment confirmation unavailable"}</h1><p className="mt-4 text-sm leading-7 text-slate-600">{error|| (confirmation?.state==="refunded"?"Contact SiteNova for the refund amount and project details. This page does not confirm an active paid booking.":"We cannot show payment success yet. If your account was debited, do not start another payment. Check again or contact SiteNova.")}</p>{projectUrl&&<Link reloadDocument to={projectUrl} referrerPolicy="no-referrer" className="mt-4 inline-block text-sm font-semibold text-blue-700 underline">Return to your project</Link>}</div>}
    {!busy&&<button onClick={()=>setRevision(value=>value+1)} className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700 underline underline-offset-4"><RefreshCw className="h-4 w-4" aria-hidden="true"/>Check payment status</button>}
   </div>
  </section>
  <div className="mt-6 flex flex-wrap gap-3"><a href={buildWhatsAppUrl("Hi, I’d like to confirm the next steps for my SiteNova website project.")} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"><MessageCircle className="h-4 w-4" aria-hidden="true"/>Contact on WhatsApp</a><a href={`mailto:${EMAIL}`} className="flex flex-1 items-center justify-center rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800">Email SiteNova</a></div>
  <p className="mt-6 text-center text-xs leading-6 text-slate-400">Keep your payment and project links private. Payment confirmation does not change your agreed project scope or delivery schedule.</p>
 </div></main>;
}
