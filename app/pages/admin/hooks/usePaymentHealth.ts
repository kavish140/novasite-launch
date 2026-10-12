import {useCallback,useEffect,useRef,useState} from "react";
import {supabase} from "@/lib/supabaseClient";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
import type {PaymentHealth} from "@/lib/payment-health";
export function usePaymentHealth(){
 const [health,setHealth]=useState<PaymentHealth|null>(null),[isAdmin,setAdmin]=useState(false),[error,setError]=useState(false);
 const [clock,setClock]=useState(Date.now());
 const refreshRef=useRef<()=>Promise<void>>(async()=>{});
 const refresh=useCallback(()=>refreshRef.current(),[]);
 useEffect(()=>{
  let alive=true,generation=0,busy=false,clockOffset=0;
  const clear=()=>{setHealth(null);setAdmin(false);setError(false);};
  const load=async()=>{
   if(busy)return;
   busy=true;const current=generation;
   try{
    // No payment request is made until fresh identity and database membership pass.
    const identity=await supabase.auth.getUser();
    if(!alive||current!==generation)return;
    if(identity.error||!identity.data.user){clear();return;}
    const membership=await supabase.rpc("is_site_admin");
    if(!alive||current!==generation)return;
    if(membership.error||membership.data!==true){clear();return;}
    setAdmin(true);
    const result=await adminPaymentRequest<PaymentHealth>("queue",{summaryOnly:true});
    if(!alive||current!==generation)return;
    clockOffset=Date.parse(result.observedAt)-Date.now();
    setClock(Date.now()+clockOffset);setHealth(result);setError(false);
   }catch{if(alive&&current===generation){setHealth(null);setError(true);}}
   finally{busy=false;if(alive&&current!==generation)void load();}
  };
  refreshRef.current=load;
  void load();
  const poll=window.setInterval(()=>void load(),60000);
  const timer=window.setInterval(()=>setClock(Date.now()+clockOffset),10000);
  const focus=()=>void load();window.addEventListener("focus",focus);
  const {data:{subscription}}=supabase.auth.onAuthStateChange(()=>{
   generation++;clear();
   // Supabase warns against awaiting Auth calls inside this callback.
   window.setTimeout(()=>{if(alive)void load();},0);
  });
  return ()=>{alive=false;generation++;window.clearInterval(poll);window.clearInterval(timer);window.removeEventListener("focus",focus);subscription.unsubscribe();refreshRef.current=async()=>{};};
 },[]);
 return {health,isAdmin,error,clock,refresh};
}
