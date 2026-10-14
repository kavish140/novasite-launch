import {useCallback,useEffect,useRef,useState} from "react";
import {CheckCircle2,LockKeyhole,RefreshCw,Zap} from "lucide-react";
import {PROJECT_STAGES,projectRequest,type ProjectSummary} from "@/lib/project-client";
import {formatINR} from "@/lib/payments";
import {loadRazorpay} from "@/lib/razorpay-client";
import {EMAIL,SITE_NAME} from "@/lib/constants";
export default function Project(){
 const [summary,setSummary]=useState<ProjectSummary|null>(null),[error,setError]=useState(""),[notice,setNotice]=useState(""),[busy,setBusy]=useState(false);
 const token=useRef(""),opening=useRef(false),verifying=useRef(false),checking=useRef(false),mounted=useRef(false),revision=useRef(0),attempt=useRef(0);
 const update=useCallback(async(action:"view"|"refresh"="view")=>{
  const current=++revision.current,requestedToken=token.current;
  try{const result=await projectRequest<ProjectSummary>(action,requestedToken);if(mounted.current&&current===revision.current&&requestedToken===token.current){setSummary(result);setError("");}return result;}
  catch(e){if(mounted.current&&current===revision.current&&requestedToken===token.current){setSummary(null);setError(e instanceof Error?e.message:"Unable to check project. Contact SiteNova before paying again.");}throw e;}
 },[]);
 useEffect(()=>{
  mounted.current=true;
  const readLink=()=>{token.current=window.location.hash.slice(1);setSummary(null);setNotice("");setError("");if(!token.current){setError("Open the private project link shared by SiteNova.");return;}void update().catch(()=>{});};
  const changed=()=>{if(window.location.hash.slice(1)!==token.current)readLink();};
  readLink();window.addEventListener("hashchange",changed);
  const timer=window.setInterval(()=>{if(token.current&&!opening.current&&!checking.current)void update().catch(()=>{});},60000);
  return()=>{mounted.current=false;window.clearInterval(timer);window.removeEventListener("hashchange",changed);};
 },[update]);
 async function refresh(readOnly=false){if(opening.current||checking.current||busy)return;checking.current=true;const requestedToken=token.current;setBusy(true);setNotice("");try{await update(readOnly?"view":"refresh");if(mounted.current&&token.current===requestedToken)setNotice(readOnly?"Project reloaded successfully.":"Payment status checked.");}catch{if(mounted.current&&token.current===requestedToken)setNotice(readOnly?"Still unable to reload your project. Check your connection and try again, or contact SiteNova.":"Status check failed. Contact SiteNova before making another payment.");}finally{checking.current=false;if(mounted.current)setBusy(false);}}
 async function pay(){
  if(opening.current||checking.current||busy||!summary?.canPay)return;opening.current=true;setBusy(true);setError("");setNotice("");
  const requestedToken=token.current,generation=++attempt.current,belongs=()=>mounted.current&&token.current===requestedToken&&attempt.current===generation;
  const release=()=>{if(attempt.current!==generation)return;opening.current=false;verifying.current=false;if(mounted.current)setBusy(false);};
  try{await loadRazorpay();if(!belongs()){release();return;}const checkout=await projectRequest<{orderId:string;amount:number;keyId:string;testMode:boolean}>("checkout",requestedToken,summary.retryId?{retryId:summary.retryId}:{});if(!belongs()){release();return;}if(!window.Razorpay)throw new Error("Unable to load checkout");
   const modal=new window.Razorpay({key:checkout.keyId,order_id:checkout.orderId,amount:checkout.amount,currency:"INR",name:SITE_NAME,description:"Remaining project balance",retry:{enabled:false},theme:{color:"#2563eb"},modal:{ondismiss:()=>{if(attempt.current!==generation||verifying.current)return;release();if(belongs())setNotice("Checkout closed. Check payment status before trying again.");}},handler:async result=>{if(attempt.current===generation)verifying.current=true;try{const verified=await projectRequest<ProjectSummary>("verify",requestedToken,result);if(belongs()){revision.current++;setSummary(verified);setError("");setNotice(verified.remaining===0&&!verified.needsReview?"Balance payment confirmed.":"Payment is being checked. Contact SiteNova before paying again.");}}catch{if(belongs()){setError("We could not confirm payment. Check status before paying again.");setSummary(previous=>previous?{...previous,canPay:false}:previous);}}finally{release();}}});
   modal.on("payment.failed",()=>{if(attempt.current!==generation||verifying.current)return;release();if(belongs()){setNotice("Payment attempt reported a failure. Check status; do not pay again until confirmed.");setSummary(previous=>previous?{...previous,canPay:false}:previous);}});modal.open();
  }catch(e){release();if(belongs()){setError(e instanceof Error?e.message:"Unable to open checkout");setSummary(previous=>previous?{...previous,canPay:false}:previous);}}
 }
 const label=(stage:string)=>PROJECT_STAGES[stage as keyof typeof PROJECT_STAGES]??stage;
 return <main className="project-portal min-h-screen bg-[#0c1221] px-4 py-10 text-slate-100 sm:py-16"><div className="mx-auto max-w-3xl">
  <header className="mb-8 flex items-center justify-between gap-4"><a href="/" className="flex items-center gap-3 font-heading text-xl font-bold"><Zap className="text-cyan-400" aria-hidden="true"/>{SITE_NAME}</a><span className="flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="h-4 w-4" aria-hidden="true"/>Private project</span></header>
  {error&&<div role="alert" aria-busy={busy&&checking.current} className="mb-5 rounded-xl border border-red-400/40 bg-red-950/30 p-4 text-sm text-red-200"><p>{error}</p>{token.current&&<button disabled={busy} onClick={()=>void refresh(true)} className="mt-3 rounded-lg border border-red-400/40 px-4 py-2 disabled:opacity-50">{busy&&checking.current?"Reloading…":"Reload project"}</button>}</div>}{notice&&<p role="status" className="mb-5 rounded-xl border border-slate-700 p-4 text-sm">{notice}</p>}
  {summary?<>
   <section className="rounded-3xl bg-white p-6 text-slate-900 sm:p-9"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Your website project</p><h1 className="mt-3 break-words font-heading text-3xl font-bold">{summary.title}</h1><div className="mt-5 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700"><CheckCircle2 className="h-4 w-4" aria-hidden="true"/>{label(summary.stage)}</div><h2 className="mt-7 text-sm font-semibold">Latest update from SiteNova</h2><p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-600">{summary.update||"We will share your next project update here."}</p><p className="mt-4 text-xs text-slate-500">Project updated: {new Date(summary.updatedAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST</p></section>
   <section className="mt-5 rounded-3xl border border-slate-700 bg-slate-900 p-6 sm:p-9"><h2 className="font-heading text-xl font-semibold">Payments</h2><dl className="mt-5 space-y-4 text-sm"><div className="flex flex-wrap justify-between gap-3"><dt className="text-slate-400">Agreed project total</dt><dd>{summary.total===null?"Awaiting confirmation":formatINR(summary.total)}</dd></div><div className="flex flex-wrap justify-between gap-3"><dt className="text-slate-400">Recorded advance, less refunds</dt><dd>{formatINR(summary.advancePaid)}</dd></div><div className="flex flex-wrap justify-between gap-3"><dt className="text-slate-400">Recorded balance payment, less refunds</dt><dd>{formatINR(summary.balancePaid)}</dd></div><div className="flex flex-wrap justify-between gap-3 border-t border-slate-700 pt-5"><dt className="font-semibold">Remaining balance</dt><dd className="font-heading text-2xl font-bold">{summary.remaining===null?"Not confirmed":formatINR(summary.remaining)}</dd></div></dl>
    <p className="mt-4 text-sm text-slate-400">Balance payment: {summary.balanceStatus.replace(/_/g," ")}</p>
    {summary.needsReview&&<p className="mt-4 rounded-xl border border-amber-500/40 p-4 text-sm text-amber-200">Payment needs review. Contact SiteNova before making another payment.</p>}
    {summary.canPay?<button disabled={busy} onClick={()=>void pay()} className="mt-6 w-full rounded-xl bg-blue-500 px-5 py-3 font-semibold text-white hover:bg-blue-600 disabled:opacity-50">{busy?"Please wait…":summary.retryId?"Retry remaining balance payment":"Pay remaining balance"}</button>:summary.remaining!==0&&!summary.needsReview&&<p className="mt-5 text-sm text-slate-400">Balance checkout is not available yet. SiteNova will confirm when payment is due.</p>}
    <button disabled={busy} onClick={()=>void refresh()} className="mt-4 flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-50"><RefreshCw className="h-4 w-4" aria-hidden="true"/>Check payment status</button>
   </section>
  </>:!error&&<p role="status">Loading your project…</p>}
  <footer className="mt-7 text-center text-xs leading-6 text-slate-400"><p>Keep this link private. Anyone with the complete link can view this summary.</p><a className="underline underline-offset-4" href={`mailto:${EMAIL}`}>Contact SiteNova</a></footer>
 </div></main>;
}
