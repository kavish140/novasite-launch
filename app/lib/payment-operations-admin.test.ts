// @vitest-environment node
import {beforeEach,it,expect,vi} from "vitest";
const ops=vi.hoisted(()=>({paid:vi.fn(),acknowledgePaid:vi.fn(),acknowledgeDispute:vi.fn(),investigations:vi.fn(),receiptByRequest:vi.fn(),byRequest:vi.fn(),startRun:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-operations.ts",()=>({operationsStore:()=>ops}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>ops}));
import {adminPayments} from "../../supabase/functions/_shared/admin-payments";
import {receiptToken} from "../../supabase/functions/_shared/payment-receipt";
const env={PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}},admin={id:"00000000-0000-4000-8000-000000000001",email:"owner@example.test"};
const req=(body:unknown)=>new Request("https://example.test",{method:"POST",body:JSON.stringify(body)});
beforeEach(()=>vi.resetAllMocks());
it("reads paid and investigation pages and accepts only acknowledgement metadata",async()=>{
 ops.paid.mockResolvedValue({orders:[],nextOffset:null});ops.investigations.mockResolvedValue({items:[],nextOffset:null});
 expect((await adminPayments(req({offset:50}),env,"paid",admin)).status).toBe(200);expect(ops.paid).toHaveBeenCalledWith(50);
 expect((await adminPayments(req({}),env,"investigations",admin)).status).toBe(200);
 expect((await adminPayments(req({kind:"paid",id:admin.id,acknowledged:true}),env,"acknowledge",admin)).status).toBe(200);expect(ops.acknowledgePaid).toHaveBeenCalledWith(admin.id,true,admin.id);
 expect((await adminPayments(req({kind:"dispute",eventId:"evt_lost"}),env,"acknowledge",admin)).status).toBe(200);expect(ops.acknowledgeDispute).toHaveBeenCalledWith("evt_lost",admin.id);
});
it("rejects manual status, amount and actor overrides and missing admin identity",async()=>{
 for(const extra of [{status:"paid"},{amount:1},{acknowledged_by:"attacker"}])expect((await adminPayments(req({kind:"paid",id:admin.id,acknowledged:true,...extra}),env,"acknowledge",admin)).status).toBe(400);
 expect((await adminPayments(req({}),env,"paid",{id:"",email:""})).status).toBe(401);expect(ops.paid).not.toHaveBeenCalled();expect(ops.acknowledgePaid).not.toHaveBeenCalled();
});
it("retrieves the durable receipt for an existing ₹1 paid or refunded test without a checkout session or provider call",async()=>{
 const config={...env,PAYMENT_RECEIPT_SECRET:"test-receipt-secret-".repeat(3),RAZORPAY_ENABLED:"false"},receiptId="00000000-0000-4000-8000-000000000002";
 const fetcher=vi.fn();vi.stubGlobal("fetch",fetcher);
 try{for(const status of ["paid","refunded"]){
  ops.byRequest.mockResolvedValue({request_id:admin.id,package:"test",amount:100,status,customer:{email:"private@example.test"}});ops.receiptByRequest.mockResolvedValue(receiptId);
  const response=await adminPayments(req({requestId:admin.id}),config,"order-receipt",admin);
  expect(response.status).toBe(200);expect(await response.json()).toEqual({url:`https://sitenova.dev/receipt#${await receiptToken(receiptId,config.PAYMENT_RECEIPT_SECRET)}`});expect(response.headers.get("Cache-Control")).toBe("no-store");
 }expect(fetcher).not.toHaveBeenCalled();expect(ops.startRun).not.toHaveBeenCalled();}finally{vi.unstubAllGlobals();}
});
it("does not issue test receipts for unknown, unpaid or other package orders, invalid requests or missing signing configuration",async()=>{
 const config={...env,PAYMENT_RECEIPT_SECRET:"test-receipt-secret-".repeat(3)};
 for(const [record,status] of [[null,404],[{package:"test",amount:100,status:"pending"},409],[{package:"test",amount:100,status:"failed"},409],[{package:"starter",amount:500000,status:"paid"},400],[{package:"test",amount:1,status:"paid"},400]] as const){ops.byRequest.mockResolvedValue(record);expect((await adminPayments(req({requestId:admin.id}),config,"order-receipt",admin)).status).toBe(status);}
 ops.byRequest.mockResolvedValue({package:"test",amount:100,status:"paid"});expect((await adminPayments(req({requestId:admin.id}),env,"order-receipt",admin)).status).toBe(503);
 expect((await adminPayments(req({requestId:admin.id,status:"paid"}),config,"order-receipt",admin)).status).toBe(400);
 expect((await adminPayments(req({requestId:admin.id}),config,"order-receipt",{id:"",email:""})).status).toBe(401);
 expect(ops.receiptByRequest).not.toHaveBeenCalled();expect(ops.startRun).not.toHaveBeenCalled();
});
