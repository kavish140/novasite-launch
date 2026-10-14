import {useEffect,useState,useRef} from "react";
import {Button} from "@/components/ui/button";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
import {formatINR,type PackageCatalog} from "@/lib/payments";
import {packagePricesSchema,rupeesToPaise} from "../../../../supabase/functions/_shared/pricing-schema";
type Snapshot={version:string;updatedAt:string;packages:PackageCatalog};
type Read=Snapshot&{history?:Snapshot[]};
type Fields={starter:{startingPrice:string;advance:string};business:{startingPrice:string;advance:string}};
const fields=(p:PackageCatalog):Fields=>({starter:{startingPrice:String(p.starter.startingPrice/100),advance:String(p.starter.advance/100)},business:{startingPrice:String(p.business.startingPrice/100),advance:String(p.business.advance/100)}});
export default function PackagePricing(){
 const mounted=useRef(false),[data,setData]=useState<Read|null>(null),[form,setForm]=useState<Fields|null>(null),[busy,setBusy]=useState(true),[error,setError]=useState(""),[notice,setNotice]=useState("");
 async function reload(){setBusy(true);setError("");setNotice("");try{const result=await adminPaymentRequest<Read>("pricing",{});if(mounted.current){setData(result);setForm(fields(result.packages));}}catch{if(mounted.current)setError("Unable to load package pricing. Current public prices have not been changed.");}finally{if(mounted.current)setBusy(false);}}
 useEffect(()=>{mounted.current=true;void reload();return()=>{mounted.current=false;};},[]);
 async function save(){
  if(!data||!form||busy)return;
  setError("");setNotice("");let prices;
  try{prices=packagePricesSchema.parse(Object.fromEntries(Object.entries(form).map(([key,value])=>[key,{startingPrice:rupeesToPaise(value.startingPrice),advance:rupeesToPaise(value.advance)}])));}catch{setError("Use amounts from ₹1 to ₹10,00,000 with at most two decimal places. Each advance must be no more than its package price.");return;}
  setBusy(true);
  try{const result=await adminPaymentRequest<Snapshot>("pricing-save",{version:data.version,prices});if(mounted.current){setData({...result,history:[result,...(data.history??[]).filter(row=>row.version!==result.version)].slice(0,10)});setForm(fields(result.packages));setNotice("Package prices saved. New bookings use these amounts; existing orders keep their original prices.");}}
  catch(e){if(mounted.current)setError(e instanceof Error?e.message:"Unable to confirm the save. Reload prices before retrying.");}
  finally{if(mounted.current)setBusy(false);}
 }
 return <section aria-label="Package pricing" className="rounded-xl border border-border bg-card p-5 sm:p-6">
  <div className="flex flex-wrap justify-between gap-3"><div><h2 className="text-xl font-semibold">Package pricing</h2><p className="mt-2 text-sm text-muted-foreground">Set the starting price and advance separately. These changes apply to new bookings. Existing orders, receipts and agreed project totals keep their original amounts.</p></div><Button type="button" variant="outline" disabled={busy} onClick={()=>void reload()}>Reload prices</Button></div>
  {error&&<p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}{notice&&<p role="status" className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{notice}</p>}
  {!form&&busy&&<p className="mt-4 text-sm">Loading package prices…</p>}
  {form&&data&&<form onSubmit={e=>{e.preventDefault();void save();}} className="mt-5 space-y-5"><fieldset disabled={busy} className="grid gap-5 sm:grid-cols-2">{(["starter","business"] as const).map(key=><div key={key} className="space-y-3 rounded-lg border border-border p-4"><h3 className="font-semibold">{data.packages[key].name}</h3>{(["startingPrice","advance"] as const).map(field=><label key={field} className="block text-sm">{data.packages[key].name} {field==="startingPrice"?"starting price":"advance"} (₹)<input inputMode="decimal" required value={form[key][field]} onChange={e=>setForm({...form,[key]:{...form[key],[field]:e.target.value}})} className="mt-1 block w-full min-w-0 rounded-md border border-border bg-background p-2.5"/></label>)}</div>)}</fieldset><p className="text-xs text-muted-foreground">Amounts are in Indian rupees. The advance can be any positive amount up to the starting price; it does not have to be 50%. Premium/custom projects remain quote-only. Saving prices does not turn payment collection on or off.</p><Button type="submit" disabled={busy}>{busy?"Saving…":"Save package prices"}</Button><p className="text-xs text-muted-foreground">Last pricing update: {new Date(data.updatedAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST</p></form>}
  {!!data?.history?.length&&<details className="mt-5"><summary className="cursor-pointer text-sm font-medium">Recent price changes</summary><ul className="mt-3 space-y-3 text-sm">{data.history.map(row=><li key={row.version} className="rounded-lg border border-border p-3"><p>{new Date(row.updatedAt).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"})} IST</p><p>Starter {formatINR(row.packages.starter.startingPrice)} · Advance {formatINR(row.packages.starter.advance)}</p><p>Business {formatINR(row.packages.business.startingPrice)} · Advance {formatINR(row.packages.business.advance)}</p></li>)}</ul></details>}
 </section>;
}
