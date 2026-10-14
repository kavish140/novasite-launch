import {useCallback,useEffect,useState} from "react";
import {Button} from "@/components/ui/button";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
import {formatINR} from "@/lib/payments";
import {checkoutState,paymentCheckSource,paymentDate} from "@/lib/payment-display";
import type {PaymentHealth} from "@/lib/payment-health";
import PaymentCronHealth from "../components/PaymentCronHealth";
import PaidOrders from "../components/PaidOrders";
import PaymentInvestigations from "../components/PaymentInvestigations";
import ClientProjects from "../components/ClientProjects";
import ResumeCheckoutLink from "../components/ResumeCheckoutLink";
type Order={request_id:string;order_id:string|null;package:string;amount:number;status:string;reconciliation_state:string;created_at:string;last_checked_at:string|null;last_check_source?:string|null};
type History={id:string;old_state:string;new_state:string;error:string|null;alert:boolean;created_at:string;source?:string|null};
type Queue={orders:Order[];runs:{id:string;source?:string;error:string|null;started_at:string}[];alerts:{id:string;request_id:string;order_id:string|null;new_state:string;error:string|null;created_at:string}[];nextOffset:number|null};
type HistoryPage={history:History[];nextOffset:number|null};
const time=paymentDate;
export default function PaymentsTab({health,refreshHealth,now=Date.now()}:{health?:PaymentHealth|null;refreshHealth?:()=>Promise<void>;now?:number}){
  const [queue,setQueue]=useState<Queue|null>(null),[offset,setOffset]=useState(0),[selected,setSelected]=useState<Order|null>(null),[history,setHistory]=useState<HistoryPage>({history:[],nextOffset:null});
  const [busy,setBusy]=useState(false),[error,setError]=useState(""),[notice,setNotice]=useState("");
  const refresh=useCallback(async()=>{setBusy(true);setError("");try{setQueue(await adminPaymentRequest<Queue>("queue",{offset}));}catch(e){setError(e instanceof Error?e.message:"Unable to load payments.");}finally{setBusy(false);}},[offset]);
  useEffect(()=>{void refresh();},[refresh]);
  async function showHistory(order:Order,more=false){
    setBusy(true);setError("");if(!more){setSelected(order);setHistory({history:[],nextOffset:null});}
    try{const page=await adminPaymentRequest<HistoryPage>("history",{requestId:order.request_id,offset:more?history.nextOffset:0});setHistory(previous=>({history:more?[...previous.history,...page.history]:page.history,nextOffset:page.nextOffset}));}
    catch(e){setError(e instanceof Error?e.message:"Unable to load history.");}finally{setBusy(false);}
  }
  async function recheck(order:Order){
    setBusy(true);setError("");setNotice("");
    try{
      const result=await adminPaymentRequest<{state:string;needsReview:boolean}>("recheck",{requestId:order.request_id});
      setNotice(`${order.order_id??order.request_id}: ${result.state.replace(/_/g," ")}${result.needsReview?" — owner review required":""}.`);
      setQueue(await adminPaymentRequest<Queue>("queue",{offset}));
      await showHistory(order);
      await refreshHealth?.();
    }catch(e){setError(e instanceof Error?e.message:"Unable to check payment.");}finally{setBusy(false);}
  }
  const orders=[...new Map((queue?.orders??[]).map(order=>[order.request_id,order])).values()];
  return <div className="space-y-6">
    <PaidOrders refreshHealth={refreshHealth}/>
    <ClientProjects refreshHealth={refreshHealth}/>
    <PaymentInvestigations/>
    {!!health?.lostDisputes?.length&&<section className="rounded-xl border-2 border-destructive p-5"><h2 className="font-semibold">Lost disputes — acknowledgement required</h2>{health.lostDisputes.map(dispute=><div key={dispute.eventId} className="mt-3 text-sm break-all"><p>{dispute.id} · Payment: {dispute.paymentId??"Unknown"} · {dispute.amount===null?"Amount not supplied":dispute.currency==="INR"?formatINR(dispute.amount):`${dispute.amount} subunits (${dispute.currency??"unknown"})`}</p><p>Acknowledging records your review. It does not change payment status or move money.</p><Button variant="outline" disabled={busy} onClick={async()=>{setBusy(true);setError("");try{await adminPaymentRequest("acknowledge",{kind:"dispute",eventId:dispute.eventId});await refreshHealth?.();}catch{setError("Unable to acknowledge lost dispute.");}finally{setBusy(false);}}}>Acknowledge lost dispute</Button></div>)}</section>}
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Checkout orders below are not confirmed payments. Status checks do not create orders or take money. All times use IST (24-hour clock).</p><Button variant="outline" disabled={busy} onClick={()=>{void refresh();void refreshHealth?.();}}>Refresh payments</Button></div>
    {!!health?.disputes.length&&<section className="rounded-xl border border-amber-500 p-5"><h2 className="font-semibold">Open disputes</h2>{health.disputes.map(dispute=><div key={dispute.id} className="mt-3 border-t border-border pt-3 text-sm break-all"><p>{dispute.id} · {dispute.status.replace(/_/g," ")}</p><p>Payment: {dispute.paymentId??"Not supplied"} · Order: {dispute.orderId??"Unknown / not supplied"}</p><p>Disputed amount: {dispute.amount===null?"Not supplied":dispute.currency==="INR"?formatINR(dispute.amount):`${dispute.amount} subunits (${dispute.currency??"currency not supplied"})`}</p><p>Response due: {dispute.responseDueAt?time(dispute.responseDueAt):"Not supplied by Razorpay"}</p><p className="text-muted-foreground">Respond in the Razorpay dashboard. This audit entry does not change paid status.</p></div>)}</section>}
    {error&&<p role="alert" className="text-destructive">{error}</p>}{notice&&<p role="status">{notice}</p>}
    {!!queue?.runs.length&&(!health||health.latestRunFailed)&&<section className="rounded-xl border border-destructive/40 p-4"><h2 className="font-semibold mb-2">Reconciliation failures — review required</h2>{queue.runs.map(run=><p key={run.id} className="text-sm">{time(run.started_at)} · {run.error??"A scheduled check failed."}</p>)}</section>}
    <section className="rounded-xl border border-border bg-card p-5 space-y-4">
      <h2 className="font-semibold text-lg">Unpaid &amp; unconfirmed checkouts</h2>
      <p className="text-sm text-muted-foreground">Each checkout appears once. The checkout amount is requested, not proof of a debit. A status-check time is not a payment time.</p>
      {queue&&<p className="text-sm">{orders.length} checkout order(s) on this page.</p>}
      <div className="overflow-x-auto"><table aria-label="Unpaid and unconfirmed checkout orders" className="w-full text-sm"><thead><tr className="text-left border-b border-border"><th className="p-3">Checkout order</th><th className="p-3">Checkout amount</th><th className="p-3">Current status</th><th className="p-3">Last status check</th><th className="p-3">Actions</th></tr></thead><tbody>{orders.map(order=>{
        const overdue=order.status==="pending"&&["pending","needs_reconciliation"].includes(order.reconciliation_state)&&now-Date.parse(order.created_at)>86400000;
        return <tr key={order.request_id} className="border-b border-border"><td className="p-3 min-w-52"><p className="break-all">{order.order_id??"Order creation unconfirmed"}</p><p className="text-muted-foreground mt-1">{order.package==="test"?"₹1 test checkout":order.package}</p><p className="text-muted-foreground mt-1">Order created: {paymentDate(order.created_at)}</p></td><td className="p-3 whitespace-nowrap align-top">{formatINR(order.amount)}</td><td className="p-3 min-w-44 align-top"><p>{checkoutState(order)}</p>{overdue&&<p className="mt-2 text-amber-500">Unresolved for over 24 hours</p>}</td><td className="p-3 min-w-48 align-top"><p>{order.last_checked_at?paymentCheckSource(order.last_check_source):"Not checked yet"}</p>{order.last_checked_at&&<p className="text-muted-foreground mt-1">{paymentDate(order.last_checked_at)}</p>}</td><td className="p-3 align-top"><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={busy} onClick={()=>void recheck(order)}>Re-check with Razorpay</Button><Button variant="ghost" disabled={busy} onClick={()=>void showHistory(order)}>History</Button>{order.order_id&&["starter","business"].includes(order.package)&&<ResumeCheckoutLink requestId={order.request_id}/>}</div></td></tr>;
      })}</tbody></table>{queue&&!orders.length&&<p className="py-4 text-muted-foreground">No unpaid or unconfirmed checkouts in this queue.</p>}{!queue&&busy&&<p className="py-4">Loading checkout orders…</p>}</div>
    </section>
    {(offset>0||queue?.nextOffset!=null)&&<div className="flex flex-wrap gap-3"><Button variant="outline" disabled={busy||offset===0} onClick={()=>setOffset(Math.max(0,offset-50))}>Previous</Button><Button variant="outline" disabled={busy||queue?.nextOffset==null} onClick={()=>setOffset(queue!.nextOffset!)}>Next</Button></div>}
    {selected&&<section className="rounded-xl border border-border p-5"><h2 className="font-semibold break-all mb-3">Status-check history: {selected.order_id??selected.request_id}</h2><p className="text-sm text-muted-foreground mb-3">These entries are checks of this order, not additional payments.</p><Button variant="outline" disabled={busy} onClick={()=>void recheck(selected)}>Re-check with Razorpay</Button>{history.history.map(item=><div key={item.id} className="border-t border-border py-3 mt-3"><p className="text-sm">{paymentCheckSource(item.source)} · {time(item.created_at)} · {item.old_state.replace(/_/g," ")} → {item.new_state.replace(/_/g," ")}</p>{item.alert&&<p className="text-amber-500 text-sm">Flagged for review</p>}{item.error&&<p className="text-sm text-destructive">{item.error}</p>}</div>)}{!history.history.length&&!busy&&<p className="mt-3 text-sm text-muted-foreground">No reconciliation checks recorded yet.</p>}{history.nextOffset!==null&&<Button variant="outline" disabled={busy} onClick={()=>void showHistory(selected,true)}>Load older checks</Button>}</section>}
    <details className="rounded-xl border border-border p-5"><summary className="font-semibold cursor-pointer">Automatic checks — scheduler health</summary><div className="mt-4"><PaymentCronHealth health={health} now={now}/></div><p className="mt-3 text-sm text-muted-foreground">These checks review existing orders. Their timestamps are not payment times.</p></details>
  </div>;
}
