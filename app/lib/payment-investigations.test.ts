// @vitest-environment node
import {createHmac} from "node:crypto";
import {beforeEach,it,expect,vi} from "vitest";
const mocks=vi.hoisted(()=>({hasEvent:vi.fn(),find:vi.fn(),recordInvestigation:vi.fn(),unattached:vi.fn(),completeWebhook:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>mocks}));
vi.mock("../../supabase/functions/_shared/payment-operations.ts",()=>({operationsStore:()=>mocks}));
import {paymentWebhook} from "../../supabase/functions/_shared/razorpay";
import {syncUnattachedOrders} from "../../supabase/functions/_shared/investigation-sync";
const env={SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake",RAZORPAY_KEY_ID:"rzp_test_fake",RAZORPAY_KEY_SECRET:"fake",RAZORPAY_WEBHOOK_SECRET:"fake"};
const fetcher=vi.fn(),id="00000000-0000-4000-8000-000000000001";
function request(bad=false){const raw=JSON.stringify({event:"payment.captured",payload:{payment:{entity:{id:"pay_unknown",order_id:"order_unknown",amount:100,currency:"INR",status:"captured",email:"must not be stored"}}}});return new Request("https://example.test/webhook",{method:"POST",body:raw,headers:{"x-razorpay-event-id":"evt_unknown","x-razorpay-signature":bad?"bad":createHmac("sha256","fake").update(raw).digest("hex")}});}
beforeEach(()=>{vi.resetAllMocks();vi.stubGlobal("fetch",fetcher);mocks.hasEvent.mockResolvedValue(false);mocks.find.mockResolvedValue(null);mocks.recordInvestigation.mockResolvedValue(true);});
it("records unknown signed payments atomically with their event IDs without settlement or personal data",async()=>{
 expect((await paymentWebhook(request(),{env})).status).toBe(200);
 expect(mocks.recordInvestigation).toHaveBeenCalledWith({kind:"unknown_payment",orderId:"order_unknown",paymentId:"pay_unknown",amount:100,currency:"INR",status:"captured"},"evt_unknown","payment.captured");
 expect(mocks.completeWebhook).not.toHaveBeenCalled();expect(fetcher).not.toHaveBeenCalled();
 mocks.recordInvestigation.mockResolvedValue(false);expect(await(await paymentWebhook(request(),{env})).json()).toEqual({received:true,alreadyProcessed:true});
});
it("rejects forged unknown events and retries storage failures",async()=>{
 expect((await paymentWebhook(request(true),{env})).status).toBe(403);expect(mocks.recordInvestigation).not.toHaveBeenCalled();
 mocks.recordInvestigation.mockRejectedValue(new Error("secret"));expect((await paymentWebhook(request(),{env})).status).toBe(503);
});
it("discovers unattached orders by server reservation receipt using GET only, without attaching or paying them",async()=>{
 mocks.unattached.mockResolvedValue([{request_id:id,created_at:new Date().toISOString(),key_id:env.RAZORPAY_KEY_ID}]);
 fetcher.mockResolvedValue(Response.json({items:[{id:"order_orphan",receipt:id,amount:500000,currency:"INR",status:"created"},{id:"order_other",receipt:"not ours",amount:100,currency:"INR",status:"created"}]}));
 await syncUnattachedOrders(env,Date.now()+10000);expect(mocks.recordInvestigation).toHaveBeenCalledTimes(1);
 expect(mocks.recordInvestigation).toHaveBeenCalledWith({kind:"unattached_order",orderId:"order_orphan",paymentId:null,requestId:id,amount:500000,currency:"INR",status:"created"});
 expect(fetcher.mock.calls[0][1].method).toBe("GET");
});
