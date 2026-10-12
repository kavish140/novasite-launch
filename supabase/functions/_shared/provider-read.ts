import type {PaymentEnv} from "./razorpay.ts";
// This module deliberately exposes GET only. No capture/order/refund API exists here.
export async function providerGet(env:PaymentEnv,path:string){
 if(!env.RAZORPAY_KEY_ID||!env.RAZORPAY_KEY_SECRET)throw new Error("Provider unavailable");
 const response=await fetch(`https://api.razorpay.com/v1/${path}`,{method:"GET",redirect:"error",signal:AbortSignal.timeout(15000),headers:{Authorization:`Basic ${btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`)}`}});
 if(!response.ok)throw new Error("Provider read failed");return response.json();
}
