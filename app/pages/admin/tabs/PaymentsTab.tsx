import {useCallback,useEffect,useState} from "react";
import {Button} from "@/components/ui/button";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
import {formatINR} from "@/lib/payments";
import type {PaymentHealth} from "@/lib/payment-health";
import PaymentCronHealth from "../components/PaymentCronHealth";
import PaidOrders from "../components/PaidOrders";
import PaymentInvestigations from "../components/PaymentInvestigations";
type Order={request_id:string;order_id:string|null;package:string;amount:number;status:string;reconciliation_state:string;created_at:string;last_checked_at:string|null};
type History={id:string;old_state:string;new_state:string;error:string|null;alert:boolean;created_at:string};
type Queue={orders:Order[];runs:{id:string;error:string|null;started_at:string}[];alerts:{id:string;request_id:string;order_id:string|null;new_state:string;error:string|null;created_at:string}[];nextOffset:number|null};
type HistoryPage={history:History[];nextOffset:number|null};
const time=(value:string|null)=>value?new Date(value).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"}):"Not checked";
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
  return <div className="space-y-6">
    <PaymentCronHealth health={health} now={now}/>
    <PaidOrders refreshHealth={refreshHealth}/>
    <PaymentInvestigations/>
    {!!health?.lostDisputes?.length&&<section className="rounded-xl border-2 border-destructive p-5"><h2 className="font-semibold">Lost disputes — acknowledgement required</h2>{health.lostDisputes.map(dispute=><div key={dispute.eventId} className="mt-3 text-sm break-all"><p>{dispute.id} · Payment: {dispute.paymentId??"Unknown"} · {dispute.amount===null?"Amount not supplied":dispute.currency==="INR"?formatINR(dispute.amount):`${dispute.amount} subunits (${dispute.currency??"unknown"})`}</p><p>Acknowledging records your review. It does not change payment status or move money.</p><Button variant="outline" disabled={busy} onClick={async()=>{setBusy(true);setError("");try{await adminPaymentRequest("acknowledge",{kind:"dispute",eventId:dispute.eventId});await refreshHealth?.();}catch{setError("Unable to acknowledge lost dispute.");}finally{setBusy(false);}}}>Acknowledge lost dispute</Button></div>)}</section>}
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Pending payments and failures checked in the last 24 hours. Automatic checks run every 10 minutes. Times shown in IST.</p><Button variant="outline" disabled={busy} onClick={()=>{void refresh();void refreshHealth?.();}}>Refresh payments</Button></div>
    {!!health?.disputes.length&&<section className="rounded-xl border border-amber-500 p-5"><h2 className="font-semibold">Open disputes</h2>{health.disputes.map(dispute=><div key={dispute.id} className="mt-3 border-t border-border pt-3 text-sm break-all"><p>{dispute.id} · {dispute.status.replace(/_/g," ")}</p><p>Payment: {dispute.paymentId??"Not supplied"} · Order: {dispute.orderId??"Unknown / not supplied"}</p><p>Disputed amount: {dispute.amount===null?"Not supplied":dispute.currency==="INR"?formatINR(dispute.amount):`${dispute.amount} subunits (${dispute.currency??"currency not supplied"})`}</p><p>Response due: {dispute.responseDueAt?`${time(dispute.responseDueAt)} IST`:"Not supplied by Razorpay"}</p><p className="text-muted-foreground">Respond in the Razorpay dashboard. This audit entry does not change paid status.</p></div>)}</section>}
    {error&&<p role="alert" className="text-destructive">{error}</p>}{notice&&<p role="status">{notice}</p>}
    {!!queue?.runs.length&&(!health||health.latestRunFailed)&&<section className="rounded-xl border border-destructive/40 p-4"><h2 className="font-semibold mb-2">Reconciliation failures — review required</h2>{queue.runs.map(run=><p key={run.id} className="text-sm">{time(run.started_at)} · {run.error??"A scheduled check failed."}</p>)}</section>}
    {!!queue?.alerts.length&&<section className="rounded-xl border border-amber-500/40 p-4"><h2 className="font-semibold mb-2">Flagged orders</h2>{queue.alerts.map(alert=><div key={alert.id} className="text-sm py-2 break-all"><p>{alert.order_id??alert.request_id} · {time(alert.created_at)}</p><p>{alert.error??"Unresolved for over 24 hours — review required."}</p><Button variant="ghost" disabled={busy} onClick={()=>void showHistory({request_id:alert.request_id,order_id:alert.order_id,package:"",amount:0,status:"pending",reconciliation_state:alert.new_state,created_at:alert.created_at,last_checked_at:null})}>View history</Button></div>)}</section>}
    <div className="rounded-xl border border-border overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left border-b border-border"><th className="p-3">Order / service</th><th className="p-3">Amount</th><th className="p-3">State</th><th className="p-3">Last checked</th><th className="p-3">Actions</th></tr></thead><tbody>{queue?.orders.map(order=><tr key={order.request_id} className="border-b border-border"><td className="p-3 break-all">{order.order_id??"Order creation unresolved"}<span className="block text-muted-foreground">{order.package} · {time(order.created_at)}</span></td><td className="p-3 whitespace-nowrap">{formatINR(order.amount)}</td><td className="p-3">{order.reconciliation_state.replace(/_/g," ")}</td><td className="p-3">{time(order.last_checked_at)}</td><td className="p-3"><div className="flex flex-wrap gap-2"><Button variant="outline" disabled={busy} onClick={()=>void recheck(order)}>Re-check with Razorpay</Button><Button variant="ghost" disabled={busy} onClick={()=>void showHistory(order)}>History</Button></div></td></tr>)}</tbody></table>{queue&&!queue.orders.length&&<p className="p-5 text-muted-foreground">No payments in this queue.</p>}{!queue&&busy&&<p className="p-5">Loading payments…</p>}</div>
    <div className="flex gap-3"><Button variant="outline" disabled={busy||offset===0} onClick={()=>setOffset(Math.max(0,offset-50))}>Previous</Button><Button variant="outline" disabled={busy||queue?.nextOffset==null} onClick={()=>setOffset(queue!.nextOffset!)}>Next</Button></div>
    {selected&&<section className="rounded-xl border border-border p-5"><h2 className="font-semibold break-all mb-3">Reconciliation history: {selected.order_id??selected.request_id}</h2><Button variant="outline" disabled={busy} onClick={()=>void recheck(selected)}>Re-check with Razorpay</Button>{history.history.map(item=><div key={item.id} className="border-t border-border py-3 mt-3"><p className="text-sm">{time(item.created_at)} · {item.old_state.replace(/_/g," ")} → {item.new_state.replace(/_/g," ")}</p>{item.alert&&<p className="text-amber-500 text-sm">Flagged for review</p>}{item.error&&<p className="text-sm text-destructive">{item.error}</p>}</div>)}{!history.history.length&&!busy&&<p className="mt-3 text-sm text-muted-foreground">No reconciliation checks recorded yet.</p>}{history.nextOffset!==null&&<Button variant="outline" disabled={busy} onClick={()=>void showHistory(selected,true)}>Load older checks</Button>}</section>}
  </div>;
}
