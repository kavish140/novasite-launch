import {useCallback,useEffect,useState} from "react";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
import {formatINR} from "@/lib/payments";
import {Button} from "@/components/ui/button";
type Item={id:string;kind:string;order_id:string|null;payment_id:string|null;request_id:string|null;amount:number|null;currency:string|null;provider_status:string|null};
type Page={items:Item[];nextOffset:number|null};
export default function PaymentInvestigations(){
 const [page,setPage]=useState<Page|null>(null),[offset,setOffset]=useState(0),[error,setError]=useState("");
 const refresh=useCallback(async()=>{setError("");try{setPage(await adminPaymentRequest<Page>("investigations",{offset}));}catch{setError("Unable to load investigations.");}},[offset]);useEffect(()=>{void refresh();},[refresh]);
 return <section className="rounded-xl border border-amber-500/50 p-5"><h2 className="font-semibold text-lg">Needs investigation</h2><p className="text-sm text-muted-foreground mt-2">Record-only evidence. Check these references in Razorpay before deciding the next step; this list cannot attach orders or change paid status.</p>{error&&<p role="alert">{error}</p>}{page?.items.map(item=><article key={item.id} className="mt-4 border-t border-border pt-3 text-sm break-all"><p>{item.kind.replace(/_/g," ")} · {item.provider_status??"Unknown status"}</p><p>Order: {item.order_id??"Unknown"} · Payment: {item.payment_id??"Not supplied"}</p>{item.request_id&&<p>Reservation: {item.request_id}</p>}<p>Amount: {item.amount===null?"Not supplied":item.currency==="INR"?formatINR(item.amount):`${item.amount} subunits (${item.currency??"unknown currency"})`}</p></article>)}{page&&!page.items.length&&<p className="mt-3 text-muted-foreground">No investigation records.</p>}<div className="flex flex-wrap gap-2 mt-3"><Button variant="outline" onClick={()=>void refresh()}>Refresh investigations</Button><Button variant="outline" disabled={offset===0} onClick={()=>setOffset(Math.max(0,offset-50))}>Previous investigations</Button><Button variant="outline" disabled={page?.nextOffset==null} onClick={()=>setOffset(page!.nextOffset!)}>Next investigations</Button></div></section>;
}

