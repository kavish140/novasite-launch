// @vitest-environment node
import {afterEach,it,expect,vi} from "vitest";
import {operationsStore} from "../../supabase/functions/_shared/payment-operations";
const env={SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake"};
afterEach(()=>vi.unstubAllGlobals());
it("reads paid orders newest first, restricts receipts to minimal fields, and limits recovery to 30 days",async()=>{
 const fetcher=vi.fn<typeof fetch>(async()=>Response.json([]));vi.stubGlobal("fetch",fetcher);const ops=operationsStore(env);
 await ops.paid(50);await ops.recentPaid("2026-09-11T00:00:00Z","after");await ops.receipt("id");await ops.unattached();
 const urls=fetcher.mock.calls.map(([url])=>new URL(String(url)));
 expect(urls[0].searchParams.get("payment_intents.status")).toBe("in.(paid,refunded)");expect(urls[0].searchParams.get("order")).toContain("paid_at.desc");expect(urls[0].searchParams.get("offset")).toBe("50");
 expect(urls[0].searchParams.get("select")).not.toMatch(/key_id|payload_hash|dedupe_hash|receipt_id/);
 expect(urls[1].searchParams.get("paid_at")).toBe("gte.2026-09-11T00:00:00Z");expect(urls[1].searchParams.get("request_id")).toBe("gt.after");
 expect(urls[2].searchParams.get("select")).toBe("payment_intents!inner(package,amount,status)");
 expect(urls[3].searchParams.get("order_id")).toBe("is.null");expect(urls[3].searchParams.get("created_at")).toMatch(/^lt\./);
});
it("acknowledges only a recorded lost event and never accepts a browser actor for settlement",async()=>{
 const fetcher=vi.fn<typeof fetch>(async(input)=>String(input).includes("payment_webhook_events")?Response.json([{event_id:"evt_lost",dispute:{id:"disp_1",status:"lost"}}]):Response.json({}));vi.stubGlobal("fetch",fetcher);
 await operationsStore(env).acknowledgeDispute("evt_lost","verified-admin");const url=new URL(String(fetcher.mock.calls[0][0]));expect(url.searchParams.get("dispute->>status")).toBe("eq.lost");
 expect(fetcher.mock.calls.some(([url])=>String(url).includes("payment_intents"))).toBe(false);
});
