// @vitest-environment node
import {afterEach,beforeEach,it,expect,vi} from "vitest";
const mocks=vi.hoisted(()=>({byRequest:vi.fn(),check:vi.fn(),sign:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>mocks}));
vi.mock("../../supabase/functions/_shared/razorpay.ts",async original=>({...await original<typeof import("../../supabase/functions/_shared/razorpay")>(),fetchStoredPaymentStatus:mocks.check,createPaymentToken:mocks.sign}));
import {adminPayments} from "../../supabase/functions/_shared/admin-payments";
const requestId="00000000-0000-4000-8000-000000000001",env={RAZORPAY_KEY_SECRET:"fake",PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}},admin={id:"owner",email:"owner@example.test"};
const record={request_id:requestId,order_id:"order_original",package:"business",amount:750000,key_id:"rzp_test_fake",status:"pending",created_at:new Date().toISOString()};
const request=(extra={})=>new Request("https://example.test/admin",{method:"POST",body:JSON.stringify({requestId,...extra})});
beforeEach(()=>{vi.clearAllMocks();mocks.byRequest.mockResolvedValue(record);mocks.check.mockResolvedValue({status:"unattempted"});mocks.sign.mockResolvedValue("private-token");});afterEach(()=>vi.resetAllMocks());
it("issues an admin-only private link for the original provider-confirmed untouched order",async()=>{
 const response=await adminPayments(request(),env,"resume-checkout",admin);expect(response.status).toBe(200);expect((await response.json()).url).toBe("https://sitenova.dev/pay?package=business#resume=private-token");expect(mocks.check).toHaveBeenCalledWith(env,record);expect(mocks.sign).toHaveBeenCalledWith(expect.objectContaining({orderId:record.order_id,amount:750000,issuedAt:Date.parse(record.created_at)}),"fake");
});
it.each(["pending","paid","refunded","failed","expired"])("does not mint recovery links when provider state is %s",async status=>{mocks.check.mockResolvedValue({status});expect((await adminPayments(request(),env,"resume-checkout",admin)).status).toBe(409);expect(mocks.sign).not.toHaveBeenCalled();});
it.each([{status:"paid"},{status:"refunded"},{order_id:null},{retry_reserved_at:"now"},{created_at:new Date(Date.now()-25*3600000).toISOString()},{package:"test"}])("blocks unsafe ledger records: %j",async change=>{mocks.byRequest.mockResolvedValue({...record,...change});expect((await adminPayments(request(),env,"resume-checkout",admin)).status).toBe(409);expect(mocks.check).not.toHaveBeenCalled();expect(mocks.sign).not.toHaveBeenCalled();});
it("blocks provider outage, anonymous actor and browser overrides without exposing tokens",async()=>{
 mocks.check.mockRejectedValue(new Error("private provider detail"));const response=await adminPayments(request(),env,"resume-checkout",admin);expect(response.status).toBe(503);expect(await response.text()).not.toContain("private provider detail");expect((await adminPayments(request(),env,"resume-checkout",{id:"",email:""})).status).toBe(401);expect((await adminPayments(request({amount:1}),env,"resume-checkout",admin)).status).toBe(400);expect(mocks.sign).not.toHaveBeenCalled();
});
