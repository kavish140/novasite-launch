import {nextReconciliationAt,type PaymentHealth} from "@/lib/payment-health";
import {paymentTime} from "./PaymentAlerts";
export default function PaymentCronHealth({health,now}:{health:PaymentHealth|null|undefined;now:number}){
 return <section aria-label="Reconciliation scheduler" className="rounded-xl border border-border bg-card p-5 text-sm space-y-2">
  <h2 className="font-semibold">Reconciliation scheduler</h2>
  <p>Last successful reconciliation run: {health?.lastSuccessfulAt?`${paymentTime(health.lastSuccessfulAt)} IST`:health?"No successful scheduled run recorded":"Unverified — monitoring data unavailable"}</p>
  <p>Next expected run: {health?`${paymentTime(nextReconciliationAt(now))} IST`:"Unverified"}</p>
  <p className="text-muted-foreground">Scheduled every 10 minutes. Admin re-checks do not reset scheduler health. This is the expected schedule, not confirmation that the next run will complete.</p>
 </section>;
}
