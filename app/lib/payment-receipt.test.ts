// @vitest-environment node
import {beforeEach,it,expect,vi} from "vitest";
const ledger=vi.hoisted(()=>({find:vi.fn(),receiptByRequest:vi.fn(),receipt:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>ledger}));
vi.mock("../../supabase/functions/_shared/payment-operations.ts",()=>({operationsStore:()=>ledger}));
import {paymentReceipt,receiptToken} from "../../supabase/functions/_shared/payment-receipt";
import {createPaymentToken} from "../../supabase/functions/_shared/razorpay";
const env={PAYMENT_RECEIPT_SECRET:"fake-receipt-".repeat(4),RAZORPAY_KEY_ID:"rzp_test_example",RAZORPAY_KEY_SECRET:"fake",PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})},RAZORPAY_ENABLED:"false"};
const id="00000000-0000-4000-8000-000000000001",receiptId="00000000-0000-4000-8000-000000000002";
const req=(token:string)=>new Request("https://example.test",{method:"POST",body:JSON.stringify({token})});
async function checkoutToken(pack:"starter"|"test"="starter"){return createPaymentToken({orderId:"order_1",package:pack,amount:pack==="test"?100:500000,keyId:env.RAZORPAY_KEY_ID,issuedAt:Date.now()},env.RAZORPAY_KEY_SECRET);}
beforeEach(()=>{vi.resetAllMocks();ledger.find.mockResolvedValue({request_id:id,order_id:"order_1",key_id:env.RAZORPAY_KEY_ID,package:"starter",amount:500000,status:"paid",customer:{email:"private@example.test"}});ledger.receiptByRequest.mockResolvedValue(receiptId);ledger.receipt.mockResolvedValue({package:"starter",amount:500000,status:"paid",customer:"must never escape"});});
it("issues a durable signed receipt only for a confirmed ledger payment, with checkout disabled",async()=>{
 const response=await paymentReceipt(req(await checkoutToken()),env,"receipt-link");expect(response.status).toBe(200);
 expect(await response.json()).toEqual({url:`https://sitenova.dev/receipt#${await receiptToken(receiptId,env.PAYMENT_RECEIPT_SECRET)}`});
 ledger.find.mockResolvedValueOnce({...await ledger.find(),status:"pending"});expect((await paymentReceipt(req(await checkoutToken()),env,"receipt-link")).status).toBe(409);
});
it("works after refresh and on another device without exposing customer or payment identifiers",async()=>{
 const token=await receiptToken(receiptId,env.PAYMENT_RECEIPT_SECRET);
 for(let i=0;i<2;i++){const response=await paymentReceipt(req(token),env,"receipt");expect(await response.json()).toEqual({package:"starter",amount:500000,status:"paid"});expect(response.headers.get("Cache-Control")).toBe("no-store");}
 ledger.receipt.mockResolvedValueOnce({package:"starter",amount:500000,status:"refunded"});expect(await(await paymentReceipt(req(token),env,"receipt")).json()).toEqual({package:"starter",amount:500000,status:"refunded"});
});
it("rejects tampering, unsigned tokens and checkout tokens on the public receipt reader",async()=>{
 for(const token of [receiptId,`${receiptId}.${"0".repeat(64)}`,await checkoutToken()])expect((await paymentReceipt(req(token),env,"receipt")).status).toBe(403);
 expect(ledger.receipt).not.toHaveBeenCalled();
});
it("keeps links valid across Razorpay key rotation and supports a previous receipt signing key",async()=>{
 const token=await receiptToken(receiptId,env.PAYMENT_RECEIPT_SECRET);
 const rotated={...env,RAZORPAY_KEY_ID:"rzp_live_rotated",RAZORPAY_KEY_SECRET:"new",PAYMENT_RECEIPT_SECRET:"new-receipt-".repeat(4),PAYMENT_RECEIPT_PREVIOUS_SECRET:env.PAYMENT_RECEIPT_SECRET};
 expect((await paymentReceipt(req(token),rotated,"receipt")).status).toBe(200);
});
it("enforces test admin ownership and fails closed when signing or storage is unavailable",async()=>{
 const token=await checkoutToken("test");expect((await paymentReceipt(req(token),env,"receipt-link")).status).toBe(403);
 ledger.find.mockResolvedValueOnce({request_id:id,key_id:env.RAZORPAY_KEY_ID,package:"test",amount:100,status:"paid",customer:{admin_id:"another-admin"}});
 expect((await paymentReceipt(req(token),env,"receipt-link",{id:"owner",email:"owner@example.test"})).status).toBe(403);
 expect((await paymentReceipt(req(token),{...env,PAYMENT_RECEIPT_SECRET:undefined},"receipt-link")).status).toBe(503);
});
it("fails closed on receipt storage errors and enforces the reader rate limit",async()=>{
 const token=await receiptToken(receiptId,env.PAYMENT_RECEIPT_SECRET);
 ledger.receipt.mockRejectedValueOnce(new Error("sensitive-provider-body"));const response=await paymentReceipt(req(token),env,"receipt");expect(response.status).toBe(503);expect(await response.text()).not.toContain("sensitive-provider-body");
 ledger.receipt.mockClear();expect((await paymentReceipt(req(token),{...env,PAYMENT_RATE_LIMITER:{limit:async()=>({success:false})}},"receipt")).status).toBe(429);expect(ledger.receipt).not.toHaveBeenCalled();
});
it("returns no receipt for a missing record and rejects malformed or oversized input",async()=>{
 const token=await receiptToken(receiptId,env.PAYMENT_RECEIPT_SECRET);ledger.receipt.mockResolvedValueOnce(null);expect((await paymentReceipt(req(token),env,"receipt")).status).toBe(404);
 for(const body of ["{",JSON.stringify({token,customer:"override"})])expect((await paymentReceipt(new Request("https://example.test",{method:"POST",body}),env,"receipt")).status).toBe(400);
 expect((await paymentReceipt(req("x".repeat(4001)),env,"receipt")).status).toBe(413);
});
