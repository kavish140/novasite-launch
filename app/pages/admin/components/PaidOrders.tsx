import {useCallback,useEffect,useState} from "react";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
import {paymentDate} from "@/lib/payment-display";
import {formatINR} from "@/lib/payments";
import {Button} from "@/components/ui/button";
import {CheckCheck,ChevronDown,ChevronUp,ReceiptText,RotateCcw} from "lucide-react";
type PaidOrder={request_id:string;paid_at:string;acknowledged_at:string|null;payment_intents:{order_id:string;payment_id?:string|null;created_at?:string;package:string;amount:number;status:string;customer:Record<string,unknown>}};
type Page={orders:PaidOrder[];nextOffset:number|null};
export default function PaidOrders({refreshHealth}:{refreshHealth?:()=>Promise<void>}){
 const [page,setPage]=useState<Page|null>(null),[offset,setOffset]=useState(0),[error,setError]=useState(""),[busy,setBusy]=useState(false);
 const [expanded,setExpanded]=useState<Record<string,boolean>>({});
 const [receipts,setReceipts]=useState<Record<string,string>>({});
 const refresh=useCallback(async()=>{setBusy(true);setError("");try{setPage(await adminPaymentRequest<Page>("paid",{offset}));}catch{setError("Unable to load paid orders.");}finally{setBusy(false);}},[offset]);
 useEffect(()=>{void refresh();},[refresh]);
 async function acknowledge(order:PaidOrder){setBusy(true);setError("");try{await adminPaymentRequest("acknowledge",{kind:"paid",id:order.request_id,acknowledged:!order.acknowledged_at});await refresh();await refreshHealth?.();}catch{setError("Unable to save acknowledgement.");}finally{setBusy(false);}}
 async function getReceipt(order:PaidOrder){setBusy(true);setError("");try{const result=await adminPaymentRequest<{url:string}>("order-receipt",{requestId:order.request_id});if(!/^https:\/\/sitenova\.dev\/receipt#[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.[0-9a-f]{64}$/.test(result.url))throw new Error("Invalid receipt link");setReceipts(current=>({...current,[order.request_id]:result.url}));}catch{setError("Unable to load this receipt. Your payment remains recorded; try again later.");}finally{setBusy(false);}}
 return <section className="payment-panel rounded-xl border border-border bg-card p-5">
  <div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-semibold text-lg">Recent paid orders</h2><p className="mt-2 max-w-2xl text-sm text-muted-foreground">Verified payments and recorded refunds. Review each payment, open its details or retrieve an available receipt.</p></div><Button variant="outline" disabled={busy} onClick={()=>void refresh()}>Refresh paid orders</Button></div>
  <p className="mt-3 text-xs text-muted-foreground">Confirmation timestamps show when SiteNova recorded the status, not the bank-transfer time. Reviewing a card does not change its payment status.</p>
  {error&&<p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
  {page&&<p className="text-sm mt-4">{page.orders.length} confirmed payment(s) on this page.</p>}
  <div className="payment-order-grid">
   {page?.orders.map(order=>{
    const p=order.payment_intents,open=!!expanded[order.request_id],reviewed=!!order.acknowledged_at;
    const detailId="paid-details-"+order.request_id;
    return <article key={order.request_id} className="payment-order-card" aria-label={String(p.customer.business??p.customer.name??p.package)+" payment"}>
     <div className="payment-card-top"><span className="payment-card-icon"><ReceiptText size={20} aria-hidden="true"/></span><div className="min-w-0 flex-1"><h3 className="font-semibold capitalize">{p.package==="test"?"₹1 test payment":p.package+" website"}</h3><p className="mt-1 text-xs text-muted-foreground break-words">{String(p.customer.business??p.customer.name??"Payment record")}</p></div><span className={p.status==="paid"?"payment-status payment-status-paid":"payment-status payment-status-refund"}>{p.status==="paid"?"Paid — verified":"Refund recorded"}</span></div>
     <div className="payment-card-amount"><div><p className="text-xs text-muted-foreground">Recorded amount</p><strong className="mt-1 block text-3xl font-semibold tracking-tight">{formatINR(p.amount)}</strong></div><span className={reviewed?"payment-review-state is-reviewed":"payment-review-state"}>{reviewed?<CheckCheck size={15} aria-hidden="true"/>:null}{reviewed?"Reviewed":"Needs review"}</span></div>
     <p className="text-xs leading-5 text-muted-foreground">Recorded confirmation: {paymentDate(order.paid_at)}</p>
     <div className="payment-card-actions">
      <Button variant={reviewed?"outline":"default"} disabled={busy} className="payment-review-button" onClick={()=>void acknowledge(order)}>{reviewed?<RotateCcw size={16} aria-hidden="true"/>:<CheckCheck size={16} aria-hidden="true"/>}{reviewed?"Undo review":"Mark as reviewed"}</Button>
      <Button variant="outline" aria-expanded={open} aria-controls={detailId} onClick={()=>setExpanded(current=>({...current,[order.request_id]:!open}))}>{open?<ChevronUp size={16} aria-hidden="true"/>:<ChevronDown size={16} aria-hidden="true"/>}{open?"Hide details":"View details"}</Button>
      {p.package==="test"&&p.amount===100&&<Button variant="outline" disabled={busy} onClick={()=>void getReceipt(order)}><ReceiptText size={16} aria-hidden="true"/>Get ₹1 test receipt</Button>}
     </div>
     {receipts[order.request_id]&&<a href={receipts[order.request_id]} className="mt-3 inline-flex min-h-11 items-center text-sm font-medium text-primary underline" referrerPolicy="no-referrer" target="_blank" rel="noopener noreferrer">Open receipt</a>}
     <div id={detailId} hidden={!open} className="payment-card-details">
      {p.created_at&&<p className="text-muted-foreground">Order created: {paymentDate(p.created_at)}</p>}
      <p className="break-all text-muted-foreground">Order ID: {p.order_id}</p>
      {p.payment_id&&<p className="break-all">Payment ID: {p.payment_id}</p>}
      {["name","email","phone","business","project_type","requirements","timeline","website_url"].map(key=>typeof p.customer[key]==="string"&&p.customer[key]?<p key={key} className="whitespace-pre-wrap break-words">{key==="requirements"?"Project brief":key==="timeline"?"Preferred timeline":key==="website_url"?"Existing website":key.replace(/_/g," ")}: {String(p.customer[key])}</p>:null)}
     </div>
    </article>;
   })}
  </div>
  {page&&!page.orders.length&&<p className="mt-4 text-muted-foreground">No paid orders yet.</p>}
  {!page&&busy&&<p role="status" className="py-6 text-sm text-muted-foreground">Loading paid orders…</p>}
  <div className="flex flex-wrap gap-2 mt-4"><Button variant="outline" disabled={busy||offset===0} onClick={()=>setOffset(Math.max(0,offset-50))}>Previous paid orders</Button><Button variant="outline" disabled={busy||page?.nextOffset==null} onClick={()=>setOffset(page!.nextOffset!)}>Next paid orders</Button></div>
 </section>;
}
