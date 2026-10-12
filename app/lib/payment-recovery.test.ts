// @vitest-environment node
import {beforeEach,it,expect,vi} from "vitest";
const ledger=vi.hoisted(()=>({recentPaid:vi.fn(),recordReconciliation:vi.fn(),find:vi.fn(),recordDispute:vi.fn(),saveDisputeSnapshot:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>ledger}));
vi.mock("../../supabase/functions/_shared/payment-operations.ts",()=>({operationsStore:()=>ledger}));
import {recoverRecentPaid,syncProviderDisputes} from "../../supabase/functions/_shared/payment-recovery";
const env={RAZORPAY_KEY_ID:"rzp_test_fake",RAZORPAY_KEY_SECRET:"fake"};
const record={request_id:"00000000-0000-4000-8000-000000000001",order_id:"order_1",package:"starter",amount:500000,key_id:env.RAZORPAY_KEY_ID,created_at:new Date().toISOString(),status:"paid"};
const fetcher=vi.fn();
beforeEach(()=>{vi.resetAllMocks();vi.stubGlobal("fetch",fetcher);ledger.recentPaid.mockResolvedValue([record]);ledger.find.mockResolvedValue(record);ledger.recordReconciliation.mockResolvedValue("refunded");});
it("recovers a missed partial refund from a paid order in the 30-day window using only GET",async()=>{
 fetcher.mockImplementation(async(url:string)=>Response.json(url.endsWith("/payments")?{items:[{id:"pay_1",order_id:"order_1",amount:500000,currency:"INR",status:"captured",amount_refunded:100}]}:{id:"order_1",amount:500000,currency:"INR",status:"paid",notes:{package:"starter"}}));
 expect(await recoverRecentPaid(env,"run",Date.now()+10000)).toEqual({checked:1,errors:0});
 expect(Math.abs(Date.parse(ledger.recentPaid.mock.calls[0][0])-(Date.now()-30*86400000))).toBeLessThan(1000);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith("run",record,{status:"refunded",paymentId:"pay_1",refundedAmount:100},null);
 expect(fetcher.mock.calls.every(([,options])=>options.method==="GET")).toBe(true);
});
it("never downgrades a paid order on a provider mismatch or outage",async()=>{
 fetcher.mockRejectedValue(new Error("secret"));
 expect(await recoverRecentPaid(env,"run",Date.now()+10000)).toEqual({checked:1,errors:1});
 expect(ledger.recordReconciliation).toHaveBeenCalledWith("run",record,{status:"pending"},expect.not.stringContaining("secret"));
});
it("syncs disputes with GET only, keeps minimal snapshots and stable IDs without settlement",async()=>{
 fetcher.mockImplementation(async(url:string)=>Response.json(url.includes("/disputes?")?{items:[{id:"disp_1",payment_id:"pay_1",status:"lost",amount:100,currency:"INR",respond_by:1791799200,evidence:{summary:"private"}}]}:{id:"pay_1",order_id:"order_1",amount:500000,currency:"INR"}));
 await syncProviderDisputes(env,Date.now()+10000);await syncProviderDisputes(env,Date.now()+10000);
 expect(ledger.recordDispute).toHaveBeenCalledTimes(2);expect(ledger.recordDispute.mock.calls[0][0]).toBe(ledger.recordDispute.mock.calls[1][0]);
 expect(ledger.saveDisputeSnapshot.mock.calls[0][1]).toEqual(expect.objectContaining({status:"lost",orderId:"order_1",amount:100}));
 expect(JSON.stringify(ledger.recordDispute.mock.calls)).not.toContain("private");expect(ledger.recordReconciliation).not.toHaveBeenCalled();
 expect(fetcher.mock.calls.every(([,options])=>options.method==="GET")).toBe(true);
});
it("fails visibly when dispute listing is unavailable and refuses mismatched linked payments",async()=>{
 fetcher.mockResolvedValue(Response.json({error:"private"},{status:403}));await expect(syncProviderDisputes(env,Date.now()+10000)).rejects.toThrow("Provider read failed");
 expect(ledger.recordDispute).not.toHaveBeenCalled();
});
it("refuses mismatched dispute payment identity, currency and amount before recording anything",async()=>{
 for(const payment of [{id:"pay_wrong",amount:500000,currency:"INR"},{id:"pay_1",amount:500000,currency:"USD"},{id:"pay_1",amount:99,currency:"INR"}]){
  fetcher.mockImplementation(async(url:string)=>Response.json(url.includes("/disputes?")?{items:[{id:"disp_1",payment_id:"pay_1",status:"open",amount:100,currency:"INR"}]}:{...payment,order_id:"order_1"}));
  await expect(syncProviderDisputes(env,Date.now()+10000)).rejects.toThrow("Dispute reference mismatch");
 }
 expect(ledger.recordDispute).not.toHaveBeenCalled();expect(ledger.saveDisputeSnapshot).not.toHaveBeenCalled();
});
it("continues paid recovery beyond a full page and stops without any provider request when its budget is exhausted",async()=>{
 const page=Array.from({length:100},(_,i)=>({...record,request_id:`request-${i}`}));ledger.recentPaid.mockResolvedValueOnce(page).mockResolvedValueOnce([record]);
 fetcher.mockImplementation(async(url:string)=>Response.json(url.endsWith("/payments")?{items:[{id:"pay_1",order_id:"order_1",amount:500000,currency:"INR",status:"captured",amount_refunded:0}]}:{id:"order_1",amount:500000,currency:"INR",status:"paid",notes:{package:"starter"}}));
 expect(await recoverRecentPaid(env,"run",Date.now()+30000)).toEqual({checked:101,errors:0});expect(ledger.recentPaid.mock.calls[1][1]).toBe("request-99");
 fetcher.mockClear();ledger.recentPaid.mockClear();await expect(recoverRecentPaid(env,"run",Date.now()-1)).rejects.toThrow("incomplete");expect(fetcher).not.toHaveBeenCalled();expect(ledger.recentPaid).not.toHaveBeenCalled();
});
it("paginates dispute reads past 100 entries and rejects redirects rather than following them",async()=>{
 const entity={id:"disp_1",payment_id:"pay_1",status:"closed",amount:100,currency:"INR"};
 fetcher.mockImplementation(async(url:string)=>Response.json(url.includes("/disputes?")?{items:url.endsWith("skip=0")?Array.from({length:100},(_,i)=>({...entity,id:`disp_${i}`})):[]}:{id:"pay_1",order_id:"order_1",amount:500000,currency:"INR"}));
 await syncProviderDisputes(env,Date.now()+30000);expect(fetcher.mock.calls.some(([url])=>url.endsWith("skip=100"))).toBe(true);expect(ledger.saveDisputeSnapshot).toHaveBeenCalledTimes(100);
 expect(fetcher.mock.calls.every(([,options])=>options.redirect==="error")).toBe(true);
 fetcher.mockResolvedValue(new Response(null,{status:302,headers:{Location:"https://example.test"}}));await expect(syncProviderDisputes(env,Date.now()+10000)).rejects.toThrow("Provider read failed");
});
it("accepts the live empty dispute collection without items and makes no writes",async()=>{
 fetcher.mockResolvedValue(Response.json({entity:"collection",has_more:false}));
 await syncProviderDisputes(env,Date.now()+10000);
 expect(fetcher).toHaveBeenCalledTimes(1);expect(ledger.recordDispute).not.toHaveBeenCalled();expect(ledger.saveDisputeSnapshot).not.toHaveBeenCalled();
});
it("rejects missing dispute items unless the collection is explicitly empty and terminal",async()=>{
 for(const page of [{},{entity:"collection"},{entity:"collection",has_more:true},{entity:"collection",has_more:false,error:"private"},{entity:"collection",has_more:false,count:1},{items:[],has_more:true}]){
  fetcher.mockResolvedValue(Response.json(page));await expect(syncProviderDisputes(env,Date.now()+10000)).rejects.toThrow();
 }
 expect(ledger.recordDispute).not.toHaveBeenCalled();expect(ledger.saveDisputeSnapshot).not.toHaveBeenCalled();
});
it("honours has_more on a short dispute page and stops at the explicit terminal page",async()=>{
 fetcher.mockImplementation(async(url:string)=>Response.json(url.includes("/disputes?")?(url.endsWith("skip=0")?{items:[{id:"disp_1",payment_id:"pay_1",status:"closed",amount:100,currency:"INR"}],has_more:true}:{entity:"collection",has_more:false}):{id:"pay_1",order_id:"order_1",amount:500000,currency:"INR"}));
 await syncProviderDisputes(env,Date.now()+10000);expect(fetcher.mock.calls.some(([url])=>url.endsWith("skip=1"))).toBe(true);expect(ledger.saveDisputeSnapshot).toHaveBeenCalledTimes(1);
});
