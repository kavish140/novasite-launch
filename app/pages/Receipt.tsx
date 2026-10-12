import {useEffect,useState} from "react";
import {formatINR} from "@/lib/payments";
type Receipt={package:string;amount:number;status:string};
export default function Receipt(){
 const [receipt,setReceipt]=useState<Receipt|null>(null),[error,setError]=useState("");
 useEffect(()=>{let active=true;const controller=new AbortController();async function load(){try{const token=window.location.hash.slice(1);if(!token)throw new Error("Open your complete receipt link.");const response=await fetch("/api/payments/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({token}),signal:controller.signal});const body=await response.json();if(!response.ok)throw new Error(body.error??"Receipt unavailable");if(active)setReceipt(body);}catch(e){if(active)setError(e instanceof Error?e.message:"Receipt unavailable");}}void load();return()=>{active=false;controller.abort();};},[]);
 return <main className="min-h-screen bg-background px-5 py-14"><section className="mx-auto max-w-lg rounded-2xl border border-border p-7"><h1 className="text-2xl font-heading font-bold">SiteNova payment receipt</h1>{receipt?<dl className="mt-5 space-y-2"><dt>Package</dt><dd>{receipt.package}</dd><dt>Amount</dt><dd>{formatINR(receipt.amount)}</dd><dt>Status</dt><dd>{receipt.status}</dd></dl>:error?<p role="alert" className="mt-4">{error}</p>:<p className="mt-4">Checking receipt…</p>}<p className="mt-5 text-sm text-muted-foreground">Keep this link private. Anyone with the complete link can view this payment summary.</p></section></main>;
}
