import {useEffect,useState} from "react";
import {supabase} from "@/lib/supabaseClient";
export default function PaymentReceiptLink({token,admin=false}:{token:string;admin?:boolean}){
 const [url,setUrl]=useState(""),[error,setError]=useState(false);
 useEffect(()=>{let active=true;const controller=new AbortController();setUrl("");setError(false);
  async function load(){try{const session=admin?await supabase.auth.getSession():null;if(admin&&!session?.data.session)throw new Error("Sign in required");const response=await fetch(admin?"/api/admin/payments/receipt-link":"/api/payments/receipt-link",{method:"POST",headers:{"Content-Type":"application/json",...(session?.data.session?{Authorization:`Bearer ${session.data.session.access_token}`}:{})},body:JSON.stringify({token}),signal:controller.signal});if(!response.ok)throw new Error("Receipt unavailable");const result=await response.json();if(!/^https:\/\/sitenova\.dev\/receipt#[0-9a-f.-]+$/.test(result.url))throw new Error("Invalid link");if(active)setUrl(result.url);}catch{if(active)setError(true);}}
  void load();return()=>{active=false;controller.abort();};
 },[token,admin]);
 return <div className="mt-3 text-sm">{url?<>{!admin&&<p>Save this receipt link to check your payment on another device.</p>}<a href={url} title="Save this receipt link to check payment on another device" className="text-primary underline break-all" referrerPolicy="no-referrer">{admin?"Payment receipt":url}</a></>:error?<p>Receipt link unavailable. Your verified payment remains recorded; try checking status again later.</p>:<p>Preparing receipt link…</p>}</div>;
}
