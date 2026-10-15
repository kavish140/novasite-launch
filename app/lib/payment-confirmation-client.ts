export async function preparePaymentConfirmation(access:{kind:"advance";package:"starter"|"business";token:string}|{kind:"balance";token:string}){
 const response=await fetch("/api/payments/confirmation",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(access),signal:AbortSignal.timeout(40000),redirect:"error"});
 if(!response.ok)throw new Error("Payment confirmation is unavailable. Check your original payment status before paying again.");
}
