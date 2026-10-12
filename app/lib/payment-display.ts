export function paymentDate(value:string|null|undefined){
 if(!value||!Number.isFinite(Date.parse(value)))return "Not recorded";
 return new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Kolkata",day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit",hourCycle:"h23"}).format(new Date(value))+" IST";
}
export function paymentCheckSource(source:string|null|undefined){
 return source==="cron"?"Automatic status check":source==="admin"?"Admin re-check":source==="retry"?"Retry eligibility check":"Status check";
}
export function checkoutState(order:{status:string;reconciliation_state:string;last_checked_at:string|null}){
 if(order.status==="paid")return "Paid — verified";
 if(order.status==="refunded")return "Refund recorded";
 if(order.reconciliation_state==="failed")return "Failed attempt — provider confirmed";
 if(order.reconciliation_state==="expired")return "Expired — provider confirmed";
 if(order.reconciliation_state==="needs_reconciliation")return "Payment status uncertain — review required";
 if(order.reconciliation_state==="pending"&&order.last_checked_at)return "Unpaid checkout — no attempt at last check";
 return "Not yet verified";
}
