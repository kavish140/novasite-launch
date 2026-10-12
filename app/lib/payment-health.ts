export {paymentAlertCount,staleCron, type PaymentHealth,type Dispute} from "../../supabase/functions/_shared/payment-health";
export function nextReconciliationAt(now:number){
 return new Date((Math.floor(now/(10*60000))+1)*10*60000).toISOString();
}
