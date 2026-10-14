// @vitest-environment node
import {afterEach,it,expect,vi} from "vitest";
import {paymentStore} from "../../supabase/functions/_shared/payment-store";
import {PaymentConflictError} from "../../supabase/functions/_shared/payment-conflict";
const env={SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake-service"};
const record={request_id:"00000000-0000-4000-8000-000000000001",payload_hash:"same-hash",dedupe_hash:"private-fingerprint"};
afterEach(()=>vi.unstubAllGlobals());
function responses(existing:unknown=[],insertCode="23505",lookupError=false){const fetcher=vi.fn<typeof fetch>(async(_url,options)=>options?.method==="POST"?Response.json({code:insertCode,message:"internal database detail"},{status:409}):lookupError?Response.json({code:"XX000",message:"internal lookup detail"},{status:400}):Response.json(existing));vi.stubGlobal("fetch",fetcher);return fetcher;}
it("blocks a duplicate booking from a fresh tab with an actionable conflict and no earlier booking disclosure",async()=>{
 const fetcher=responses();const error=await paymentStore(env).reserve(record).catch(error=>error);
 expect(error).toBeInstanceOf(PaymentConflictError);expect(error.message).toContain("original checkout tab");expect(error.message).not.toContain(record.dedupe_hash);expect(fetcher).toHaveBeenCalledTimes(2);
});
it("retains idempotent recovery for the same request and payload",async()=>{
 responses([{...record,order_id:"order_existing"}]);expect(await paymentStore(env).reserve(record)).toEqual({created:false,record:{...record,order_id:"order_existing"}});
});
it("recovers the same order only when the customer retains its opaque request UUID and matching payload",async()=>{
 const earlier={...record,request_id:"00000000-0000-4000-8000-000000000002",order_id:"order_original",amount:750000};
 const fetcher=responses([earlier]);expect(await paymentStore(env).reserve({...record,request_id:earlier.request_id})).toEqual({created:false,record:earlier});expect(fetcher.mock.calls.filter(([,options])=>options?.method==="POST")).toHaveLength(1);
 expect(new URL(String(fetcher.mock.calls[1][0])).searchParams.get("request_id")).toBe(`eq.${earlier.request_id}`);
});
it("does not use email or booking fingerprint alone to disclose another checkout",async()=>{
 const fetcher=vi.fn<typeof fetch>(async(input,options)=>options?.method==="POST"?Response.json({code:"23505"},{status:409}):Response.json(String(input).includes("dedupe_hash=")?[{...record,payload_hash:"different",order_id:"order_private"}]:[]));vi.stubGlobal("fetch",fetcher);
 const error=await paymentStore(env).reserve(record).catch(error=>error);expect(error).toBeInstanceOf(PaymentConflictError);expect(error.message).not.toContain("order_private");
});
it("rejects edited details without returning the saved checkout",async()=>{
 responses([{...record,payload_hash:"different",order_id:"order_existing"}]);const error=await paymentStore(env).reserve(record).catch(error=>error);expect(error).toBeInstanceOf(PaymentConflictError);expect(error.message).toContain("details differ");expect(error.message).not.toContain("order_existing");
});
it.each([["53300",false],["23505",true]])("keeps database/lookup failure %s/%s distinct from a known conflict",async(code,lookupError)=>{
 responses([],code,lookupError);const error=await paymentStore(env).reserve(record).catch(error=>error);expect(error).not.toBeInstanceOf(PaymentConflictError);expect(error.message).toBe("Payment storage unavailable");
});
