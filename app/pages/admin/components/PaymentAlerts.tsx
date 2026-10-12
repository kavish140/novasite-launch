import {AlertTriangle} from "lucide-react";
import {Button} from "@/components/ui/button";
import {paymentAlertCount,staleCron,type PaymentHealth} from "@/lib/payment-health";
export const paymentTime=(value:string)=>new Date(value).toLocaleString("en-IN",{timeZone:"Asia/Kolkata"});
export default function PaymentAlerts({health,isAdmin,error,now,onOpen}:{health:PaymentHealth|null;isAdmin:boolean;error:boolean;now:number;onOpen:()=>void}){
 if(!isAdmin)return null;
 if(error)return <section role="alert" className="mb-6 rounded-xl border-2 border-amber-500 bg-amber-500/10 p-5"><h2 className="font-semibold">Payment monitoring unavailable</h2><p className="mt-1 text-sm">Unable to confirm payment alerts. Open Payments and refresh; monitoring is unverified.</p><Button className="mt-3" variant="outline" onClick={onOpen}>Open Payments</Button></section>;
 if(!health||!paymentAlertCount(health,now))return null;
 return <section role="alert" aria-label="Payment alerts" className="mb-6 rounded-xl border-2 border-amber-500 bg-amber-500/10 p-5">
  <h2 className="flex items-center gap-2 text-lg font-semibold"><AlertTriangle className="h-5 w-5"/>Payments need attention</h2>
  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
   {!!health.unacknowledgedPaid&&<li>{health.unacknowledgedPaid} paid order(s) awaiting acknowledgement.</li>}
   {!!health.investigations&&<li>{health.investigations} payment record(s) need investigation.</li>}
   {!!health.lostDisputes?.length&&<li>{health.lostDisputes.length} lost dispute(s) awaiting acknowledgement. Review the financial loss in Razorpay.</li>}
   {health.latestRunFailed&&<li>The latest reconciliation run failed.</li>}
   {staleCron(health,now)&&<li>No scheduled reconciliation has completed in the last 30 minutes. The scheduler may be stopped.</li>}
   {!!health.overdue&&<li>{health.overdue} order(s) unresolved for over 24 hours.</li>}
   {!!health.needsReconciliation&&<li>{health.needsReconciliation} order(s) need reconciliation.</li>}
   {!!health.refunded&&<li>{health.refunded} payment(s) refunded, including partial refunds.</li>}
   {!!health.disputes.length&&<li>{health.disputes.length} open dispute(s).{health.disputes[0].responseDueAt?` Earliest response due: ${paymentTime(health.disputes[0].responseDueAt)} IST.`:" Response deadline not supplied."}</li>}
  </ul>
  {!!health.disputes.length&&<ul className="mt-3 space-y-1 text-sm">{health.disputes.map(dispute=><li key={dispute.id} className="break-all">{dispute.id} · {dispute.status.replace(/_/g," ")} · Response due: {dispute.responseDueAt?`${paymentTime(dispute.responseDueAt)} IST`:"not supplied"}</li>)}</ul>}
  <Button className="mt-4" variant="outline" onClick={onOpen}>Review Payments</Button>
 </section>;
}
