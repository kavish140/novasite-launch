// @vitest-environment node
import {afterEach,it,expect,vi} from "vitest";
import {paymentStore} from "../../supabase/functions/_shared/payment-store";
const env={SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake"};
afterEach(()=>vi.unstubAllGlobals());
it("counts the entire ledger, excludes resolved orders, and uses scheduled completion rather than admin checks for cron freshness",async()=>{
 const fetcher=vi.fn<typeof fetch>(async(input,options)=>{
  const url=new URL(String(input));
  if(options?.method==="HEAD")return new Response(null,{headers:{"content-range":"*/61"}});
  if(url.pathname.endsWith("payment_webhook_events"))return Response.json([]);
  if(url.pathname.endsWith("payment_dispute_acknowledgements"))return Response.json([]);
  if(url.pathname.endsWith("payment_dispute_snapshots"))return Response.json([]);
  if(url.searchParams.get("select")==="state")return Response.json([{state:"failed"}]);
  return Response.json([{finished_at:"2026-10-11T10:00:00Z"}]);
 });vi.stubGlobal("fetch",fetcher);
 const health=await paymentStore(env).health();
 expect(health.needsReconciliation).toBe(61);expect(health.overdue).toBe(61);expect(health.refunded).toBe(61);expect(health.latestRunFailed).toBe(true);
 const calls=fetcher.mock.calls.map(([url,options])=>({url:new URL(String(url)),options}));
 const head=calls.filter(call=>call.options?.method==="HEAD");expect(head).toHaveLength(5);
 expect(health.investigations).toBe(61);
 expect(health.unacknowledgedPaid).toBe(61);
 expect(head.every(call=>call.url.searchParams.get("limit")===null)).toBe(true);
 const overdue=head.find(call=>call.url.searchParams.has("created_at"))!;
 expect(overdue.url.searchParams.get("status")).toBe("eq.pending");expect(overdue.url.searchParams.get("reconciliation_state")).toBe("in.(pending,needs_reconciliation)");
 for(const call of calls.filter(call=>call.url.searchParams.get("select")==="finished_at"))expect(call.url.searchParams.get("source")).toBe("eq.cron");
 expect(calls.every(call=>!call.url.searchParams.get("select")?.match(/customer|key_id|payload_hash/))).toBe(true);
});
it("fails closed instead of reporting zero issues when any health query fails",async()=>{
 vi.stubGlobal("fetch",vi.fn(async()=>Response.json({message:"denied"},{status:403})));
 await expect(paymentStore(env).health()).rejects.toThrow("Payment health unavailable");
});
