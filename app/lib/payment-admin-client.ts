import {supabase} from "./supabaseClient";
export async function adminPaymentRequest<T>(action:"pricing"|"pricing-save"|"queue"|"history"|"recheck"|"paid"|"acknowledge"|"investigations"|"order-receipt"|"resume-checkout"|"projects"|"project-save"|"project-link"|"project-recheck"|"project-acknowledge",body:unknown):Promise<T>{
  const {data,error}=await supabase.auth.getSession();
  if(error || !data.session?.access_token) throw new Error("Sign in again to check payments.");
  const response=await fetch(`/api/admin/payments/${action}`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${data.session.access_token}`},body:JSON.stringify(body),signal:AbortSignal.timeout(40000)});
  const result=await response.json();
  if(!response.ok) throw new Error(result.error||"Unable to load payments.");
  return result;
}
