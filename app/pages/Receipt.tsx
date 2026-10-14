import {useEffect,useState} from "react";
import {formatINR} from "@/lib/payments";
import {ArrowLeft, CheckCircle2, Loader2, LockKeyhole, Mail, Printer, ReceiptText, RotateCcw, Zap} from "lucide-react";
import {EMAIL, SITE_NAME} from "@/lib/constants";
import "./receipt.css";
type Receipt={package:string;amount:number;status:string};
const serviceNames:Record<string,string>={starter:"Starter website",business:"Business website",test:"Test payment"};
export default function Receipt(){
 const [receipt,setReceipt]=useState<Receipt|null>(null),[error,setError]=useState("");
 useEffect(()=>{let active=true;const controller=new AbortController();async function load(){try{const token=window.location.hash.slice(1);if(!token)throw new Error("Open your complete receipt link.");const response=await fetch("/api/payments/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token}),signal:controller.signal});const body=await response.json();if(!response.ok)throw new Error(body.error??"Receipt unavailable");if(active)setReceipt(body);}catch(e){if(active)setError(e instanceof Error?e.message:"Receipt unavailable");}}void load();return()=>{active=false;controller.abort();};},[]);
 const refunded=receipt?.status==="refunded",paid=receipt?.status==="paid";
 const statusLabel=refunded?"Refund recorded":paid?"Payment received":"Payment status";
 const service=receipt?(serviceNames[receipt.package]??receipt.package):"";
 return <main className="receipt-page min-h-screen bg-[#0c1221] px-4 py-10 text-slate-100 sm:px-6 sm:py-16">
  <div className="mx-auto max-w-xl">
   <header className="mb-8 flex items-center justify-between gap-4">
    <a href="/" className="flex items-center gap-3 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300" aria-label={`${SITE_NAME} home`}><span className="rounded-xl bg-gradient-to-br from-blue-500 to-teal-400 p-2.5"><Zap className="h-5 w-5" aria-hidden="true"/></span><span className="font-heading text-xl font-bold tracking-tight">{SITE_NAME}</span></a>
    <span className="flex items-center gap-2 text-xs text-slate-400"><LockKeyhole className="h-3.5 w-3.5" aria-hidden="true"/>Private receipt</span>
   </header>
   <section className="receipt-paper overflow-hidden rounded-3xl bg-white text-slate-900 shadow-2xl" aria-labelledby="receipt-title">
    <div className="h-1.5 bg-gradient-to-r from-blue-500 via-cyan-400 to-teal-400"/>
    <div className="px-6 py-8 sm:px-10 sm:py-10">
     <div className="mb-8 flex items-center justify-between"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Payment receipt</p><ReceiptText className="h-5 w-5 text-slate-400" aria-hidden="true"/></div>
     {receipt?<>
      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${refunded?"bg-amber-50 text-amber-700":paid?"bg-emerald-50 text-emerald-600":"bg-slate-100 text-slate-500"}`}>
       {refunded?<RotateCcw aria-hidden="true"/>:paid?<CheckCircle2 aria-hidden="true"/>:<ReceiptText aria-hidden="true"/>}
      </div>
      <h1 id="receipt-title" className="font-heading text-3xl font-bold tracking-tight">{statusLabel}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">{refunded?"A refund has been recorded for this payment. Contact us for the refund amount and details.":paid?"Your payment is confirmed in our records. Keep this receipt for your reference.":"This is the current status in our payment records."}</p>
      <dl className="mt-8">
       <div className="rounded-2xl bg-slate-50 p-5 sm:p-6"><dt className="text-xs font-medium uppercase tracking-wider text-slate-500">Original payment amount</dt><dd className="mt-2 font-heading text-4xl font-bold tracking-tight sm:text-5xl">{formatINR(receipt.amount)}</dd><p className="mt-2 text-xs text-slate-500">Indian rupees · INR</p></div>
       <div className="mt-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-5"><dt className="text-sm text-slate-500">Service</dt><dd className="text-right text-sm font-semibold break-words">{service}</dd></div>
       <div className="flex items-center justify-between gap-4 pt-5"><dt className="text-sm text-slate-500">Status</dt><dd className={`rounded-full px-3 py-1 text-xs font-semibold ${refunded?"bg-amber-50 text-amber-800":paid?"bg-emerald-50 text-emerald-700":"bg-slate-100 text-slate-700"}`}>{receipt.status}</dd></div>
      </dl>
      {receipt.package!=="test"&&<p className="mt-7 border-t border-dashed border-slate-200 pt-5 text-xs leading-5 text-slate-500">This payment summary is not a tax invoice. Your project scope, final price and delivery schedule follow your agreed proposal.</p>}
     </>:error?<div role="alert"><h1 id="receipt-title" className="font-heading text-2xl font-bold">Receipt unavailable</h1><p className="mt-3 text-sm leading-6 text-slate-500">{error}</p><p className="mt-3 text-xs text-slate-500">You can reopen the original receipt link or contact us for help.</p></div>:<div role="status" className="py-10 text-center"><Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-blue-600 motion-reduce:animate-none" aria-hidden="true"/><h1 id="receipt-title" className="font-heading text-xl font-semibold">Checking receipt…</h1><p className="mt-2 text-sm text-slate-500">Loading your payment summary.</p></div>}
    </div>
    <footer className="border-t border-slate-100 bg-slate-50 px-6 py-5 sm:px-10"><p className="text-xs leading-5 text-slate-500">Issued by <strong className="font-semibold text-slate-700">{SITE_NAME}</strong> · Web design & development</p></footer>
   </section>
   <div className="receipt-actions mt-6 flex flex-wrap gap-3">
    {receipt&&<button type="button" onClick={()=>window.print()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"><Printer className="h-4 w-4" aria-hidden="true"/>Print / save PDF</button>}
    <a href={`mailto:${EMAIL}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-medium text-slate-200 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"><Mail className="h-4 w-4" aria-hidden="true"/>Contact SiteNova</a>
   </div>
   <p className="receipt-privacy mx-auto mt-6 max-w-sm text-center text-xs leading-5 text-slate-400">Keep this link private. Anyone with the complete link can view this payment summary.</p>
   <a href="/" className="receipt-actions mt-6 flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-white"><ArrowLeft className="h-3.5 w-3.5" aria-hidden="true"/>Back to SiteNova</a>
  </div>
 </main>;
}
