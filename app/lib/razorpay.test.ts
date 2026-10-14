// @vitest-environment node
import { createHmac } from "node:crypto";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { PAYMENT_PACKAGES, createPaymentToken, paymentAction, paymentsEnabled, paymentWebhook } from "../../supabase/functions/_shared/razorpay";
import {PaymentConflictError} from "../../supabase/functions/_shared/payment-conflict";

const ledger = vi.hoisted(() => ({ reserve: vi.fn(), attach: vi.fn(), find: vi.fn(), settle: vi.fn(), hasEvent: vi.fn(), completeWebhook: vi.fn() }));
vi.mock("../../supabase/functions/_shared/payment-store.ts", () => ({ paymentStore: () => ledger }));
vi.mock("../../supabase/functions/_shared/package-pricing.ts",async()=>({pricingStore:()=>({current:async()=>({version:"00000000-0000-4000-8000-000000000000",packages:(await import("../../supabase/functions/_shared/catalog")).PAYMENT_PACKAGES})}),pricingAdmin:vi.fn()}));
const env = { SUPABASE_URL: "https://example.supabase.co", SUPABASE_SERVICE_ROLE_KEY: "fake-service-role", RAZORPAY_WEBHOOK_SECRET: "fake-webhook-secret", RAZORPAY_ENABLED: "true", RAZORPAY_KEY_ID: "rzp_test_example", RAZORPAY_KEY_SECRET: "test-secret-never-real", PAYMENT_RATE_LIMITER: { limit: vi.fn(async () => ({ success: true })) } };
const context = { env };
const details = { requestId: "00000000-0000-4000-8000-000000000001", package: "starter", name: "Test Client", email: "test@example.com", phone: "9876543210", business: "Test Project",requirements:"A landing page showing our services and contact form.",timeline:"Flexible", accepted: true };
const order = { id: "order_123", amount: 500000, currency: "INR", status: "created", notes: { package: "starter" } };
const payment = { id: "pay_123", order_id: order.id, amount: order.amount, currency: "INR", status: "captured", amount_refunded: 0 };
const mockFetch = vi.fn();
const req = (body: unknown, origin = "https://sitenova.dev") => new Request("https://sitenova.dev/api/payments/order", { method: "POST", headers: { origin }, body: JSON.stringify(body) });
const response = (body: unknown) => ({ ok: true, json: async () => body });
async function token(issuedAt = Date.now()) { return createPaymentToken({ orderId: order.id, amount: order.amount, package: "starter", keyId: env.RAZORPAY_KEY_ID, issuedAt }, env.RAZORPAY_KEY_SECRET); }
async function callback(signature?: string) { return { token: await token(), razorpay_order_id: order.id, razorpay_payment_id: payment.id, razorpay_signature: signature ?? createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(`${order.id}|${payment.id}`).digest("hex") }; }
beforeEach(() => {
 ledger.hasEvent.mockReset().mockResolvedValue(false); ledger.completeWebhook.mockReset().mockResolvedValue(true);
 ledger.reserve.mockReset().mockImplementation(async record => ({created:true,record:{...record,created_at:new Date().toISOString()}}));
 ledger.attach.mockReset().mockResolvedValue(undefined); ledger.settle.mockReset().mockResolvedValue(undefined);
 ledger.find.mockReset().mockResolvedValue({ order_id: order.id, amount: order.amount, package: "starter", key_id: env.RAZORPAY_KEY_ID, created_at:new Date().toISOString() }); vi.stubGlobal("fetch", mockFetch); mockFetch.mockReset(); env.PAYMENT_RATE_LIMITER.limit.mockResolvedValue({ success: true }); });
afterEach(() => vi.unstubAllGlobals());

it("returns a clear 409 for a duplicate checkout without creating another provider order",async()=>{
 ledger.reserve.mockRejectedValueOnce(new PaymentConflictError("existing_booking"));const response=await paymentAction(req(details),context,"order");expect(response.status).toBe(409);expect(await response.json()).toEqual({error:expect.stringContaining("original checkout tab"),code:"checkout_conflict"});expect(mockFetch).not.toHaveBeenCalled();expect(ledger.attach).not.toHaveBeenCalled();
});
it("recovers an abandoned checkout in another tab using its original order and fresh checkout checks",async()=>{
 const earlier={request_id:"00000000-0000-4000-8000-000000000002",order_id:order.id,amount:order.amount,key_id:env.RAZORPAY_KEY_ID,created_at:new Date().toISOString()};ledger.reserve.mockResolvedValueOnce({created:false,record:earlier});
 const resumed=await paymentAction(req(details),context,"order");const session=await resumed.json();expect(session.orderId).toBe(order.id);expect(mockFetch).not.toHaveBeenCalled();
 mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[]}));const checked=await paymentAction(req({token:session.token}),context,"checkout");expect((await checked.json()).checkout.orderId).toBe(order.id);expect(mockFetch.mock.calls.every(([,options])=>options.method==="GET")).toBe(true);expect(ledger.attach).not.toHaveBeenCalled();
});

describe("Razorpay package advances", () => {
  it.each([['starter',500000],['business',750000]] as const)("verifies the %s immutable paise amount and rejects wrong currency", async (selected, amount) => {
    const savedOrder = {...order, amount, notes:{package:selected}};
    const captured = {...payment, amount};
    ledger.find.mockResolvedValue({order_id:order.id,amount,package:selected,key_id:env.RAZORPAY_KEY_ID,created_at:new Date().toISOString()});
    const signed = await createPaymentToken({orderId:order.id,amount,package:selected,keyId:env.RAZORPAY_KEY_ID,issuedAt:Date.now()},env.RAZORPAY_KEY_SECRET);
    const body = {...await callback(),token:signed};
    mockFetch.mockResolvedValueOnce(response(savedOrder)).mockResolvedValueOnce(response(captured));
    expect(await (await paymentAction(req(body),context,'verify')).json()).toEqual({status:'paid',paymentId:payment.id});
    expect(ledger.settle).toHaveBeenCalledWith(order.id,payment.id,'paid',0);
    ledger.settle.mockClear();
    mockFetch.mockResolvedValueOnce(response(savedOrder)).mockResolvedValueOnce(response({...captured,currency:'USD'}));
    expect((await paymentAction(req(body),context,'verify')).status).toBe(403);
    expect(ledger.settle).not.toHaveBeenCalled();
  });
  it("keeps payments disabled without explicit configuration", async () => {
    expect(paymentsEnabled({})).toBe(false);
    expect(paymentsEnabled({ ...env, RAZORPAY_ENABLED: "false" })).toBe(false);
    expect(paymentsEnabled({ ...env, PAYMENT_RATE_LIMITER: undefined })).toBe(false);
    const res = await paymentAction(req(details), { env: {} }, "order");
    expect(res.status).toBe(503); expect(mockFetch).not.toHaveBeenCalled();
  });
  it("creates an order using the server amount and persists project details in Razorpay", async () => {
    mockFetch.mockResolvedValueOnce(response(order));
    const res = await paymentAction(req(details), context, "order");
    const data = await res.json(); expect(res.status).toBe(200); expect(data.orderId).toBe(order.id);
    expect(data).not.toHaveProperty("amount"); expect(data).not.toHaveProperty("keyId");
    expect(data).not.toHaveProperty("RAZORPAY_KEY_SECRET");
    const sent = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(sent.amount).toBe(PAYMENT_PACKAGES.starter.advance); expect(sent.partial_payment).toBe(false); expect(sent.notes.business).toBe(details.business); expect(sent.notes.terms_version).toBe("2026-10-14");
  });
  it("uses the Business advance of 750000 paise", async () => {
    mockFetch.mockResolvedValueOnce(response({ ...order, amount: 750000, notes: { package: "business" } }));
    const res = await paymentAction(req({ ...details, package: "business" }), context, "order");
    expect((await res.json()).package).toBe("business");
    expect(JSON.parse(mockFetch.mock.calls[0][1].body).amount).toBe(750000);
  });
  it("rejects client prices, custom packages and missing acceptance", async () => {
    for (const body of [{ ...details, amount: 1 }, { ...details, package: "premium" }, { ...details, accepted: false }]) {
      expect((await paymentAction(req(body), context, "order")).status).toBe(400);
    }
    expect(mockFetch).not.toHaveBeenCalled();
  });
  it("rejects cross-origin requests and rate-limited order creation", async () => {
    expect((await paymentAction(req(details, "https://evil.example"), context, "order")).status).toBe(403);
    env.PAYMENT_RATE_LIMITER.limit.mockResolvedValueOnce({ success: false });
    expect((await paymentAction(req(details), context, "order")).status).toBe(429); expect(mockFetch).not.toHaveBeenCalled();
  });
  it("rejects tampered session tokens before making provider requests", async () => {
    expect((await paymentAction(req({ token: `${await token()}bad` }), context, "status")).status).toBe(403); expect(mockFetch).not.toHaveBeenCalled();
  });
  it("rejects forged signatures and swapped checkout order IDs", async () => {
    mockFetch.mockResolvedValue(response(order));
    expect((await paymentAction(req(await callback("0".repeat(64))), context, "verify")).status).toBe(403);
    expect((await paymentAction(req({ ...await callback(), razorpay_order_id: "order_other" }), context, "verify")).status).toBe(403);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
  it("confirms only captured payments and makes replay verification read-only", async () => {
    const body = await callback();
    for (const state of ["authorized", "captured", "captured"]) {
      mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({ ...payment, status: state }));
      const res = await paymentAction(req(body), context, "verify");
      expect((await res.json()).status).toBe(state === "captured" ? "paid" : "pending");
    }
    expect(mockFetch.mock.calls.every(([, options]) => options.method === "GET")).toBe(true);
  });
  it("rejects a mismatched payment amount or order fetched from Razorpay", async () => {
    for (const changed of [{ ...payment, amount: 1 }, { ...payment, order_id: "order_other" }]) {
      mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response(changed));
      expect((await paymentAction(req(await callback()), context, "verify")).status).toBe(403);
    }
  });
  it("recovers captured payments on refresh without a client callback", async () => {
    mockFetch.mockResolvedValueOnce(response({ ...order, status: "paid" })).mockResolvedValueOnce(response({ items: [payment] }));
    const res = await paymentAction(req({ token: await token() }), context, "status");
    expect(await res.json()).toEqual({ status: "paid", paymentId: payment.id });
  });
  it("blocks reopening authorized/paid/aged orders and reports refunds", async () => {
    for (const [state, age] of [["authorized", 0], ["created", 25 * 3600000]] as const) {
      mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({ items: state === "authorized" ? [{ ...payment, status: state }] : [] }));
      const res = await paymentAction(req({ token: await token(Date.now() - age) }), context, "checkout");
      if (state === "authorized") { expect(res.status).toBe(409); expect(await res.json()).not.toHaveProperty("checkout"); }
      else expect(await res.json()).toEqual({ status: "pending" });
    }
    mockFetch.mockResolvedValueOnce(response({ ...order, status: "paid" })).mockResolvedValueOnce(response({ items: [{ ...payment, amount_refunded: 500000, status: "refunded" }] }));
    const res = await paymentAction(req({ token: await token() }), context, "status");
    expect(await res.json()).toEqual({ status: "refunded", paymentId: payment.id, refundedAmount: 500000 });
  });
  it("fails closed on provider outages and malformed payloads", async () => {
    mockFetch.mockResolvedValueOnce({ ok: false });
    expect((await paymentAction(req(details), context, "order")).status).toBe(503);
    const malformed = new Request("https://sitenova.dev/api/payments/order", { method: "POST", headers: { origin: "https://sitenova.dev" }, body: "{" });
    expect((await paymentAction(malformed, context, "order")).status).toBe(400);
  });
  it("authorizes checkout exclusively with server-verified order details", async () => {
    const sessionToken = await token();
    mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({ items: [] }));
    const res = await paymentAction(req({ token: sessionToken }), context, "checkout");
    expect(await res.json()).toEqual({ status: "pending", checkout: { token: sessionToken, orderId: order.id, package: "starter", amount: 500000, keyId: env.RAZORPAY_KEY_ID, testMode: true } });
    expect(mockFetch.mock.calls.every(([, options]) => options.method === "GET")).toBe(true);
  });
  it("never releases checkout options for paid or refunded orders", async () => {
    for (const state of ["captured", "refunded"]) {
      mockFetch.mockResolvedValueOnce(response({ ...order, status: "paid" })).mockResolvedValueOnce(response({ items: [{ ...payment, status: state }] }));
      const res = await paymentAction(req({ token: await token() }), context, "checkout");
      const result = await res.json(); expect(result).not.toHaveProperty("checkout");
      expect(result.status).toBe(state === "captured" ? "paid" : "refunded");
    }
  });
  it("does not treat a status check as checkout permission", async () => {
    mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({ items: [] }));
    const res = await paymentAction(req({ token: await token() }), context, "status");
    expect(await res.json()).toEqual({ status: "pending" });
  });
});

describe("durable backend payments", () => {
 it("returns 200 for a processed event without provider requests and for a concurrent insert conflict",async()=>{
   const body=JSON.stringify({payload:{payment:{entity:{order_id:order.id}}}});
   const signature=createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
   const request=()=>new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_duplicate"},body});
   ledger.hasEvent.mockResolvedValueOnce(true);
   expect(await (await paymentWebhook(request(),context)).json()).toEqual({received:true,alreadyProcessed:true});
   expect(mockFetch).not.toHaveBeenCalled();
   ledger.completeWebhook.mockResolvedValueOnce(false);
   mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[payment]}));
   expect(await (await paymentWebhook(request(),context)).json()).toEqual({received:true,alreadyProcessed:true});
   expect(ledger.settle).not.toHaveBeenCalled();
 });
 it("returns a retryable 503 if atomic event settlement fails",async()=>{
   const body=JSON.stringify({payload:{payment:{entity:{order_id:order.id}}}});
   const signature=createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
   mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[payment]}));
   ledger.completeWebhook.mockRejectedValueOnce(new Error("database unavailable"));
   expect((await paymentWebhook(new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_retry"},body}),context)).status).toBe(503);
 });
 it("blocks live order creation and checkout on localhost before provider or ledger access",async()=>{
   const live={env:{...env,RAZORPAY_KEY_ID:"rzp_live_example"}};
   for(const origin of ["http://127.0.0.1:8788","http://localhost:8788","https://preview.example"]) {
     for(const action of ["order","checkout"] as const) {
       const request=new Request(`${origin}/api/payments/${action}`,{method:"POST",headers:{origin},body:JSON.stringify(details)});
       expect((await paymentAction(request,live,action,{id:"owner",email:"owner@example.com"})).status).toBe(403);
     }
   }
   expect(ledger.reserve).not.toHaveBeenCalled(); expect(mockFetch).not.toHaveBeenCalled();
 });
 it("allows local Test Mode checkout but keeps failed or created payment attempts locked",async()=>{
   mockFetch.mockResolvedValueOnce(response(order));
   const local=new Request("http://localhost:8788/api/payments/order",{method:"POST",headers:{origin:"http://localhost:8788"},body:JSON.stringify(details)});
   expect((await paymentAction(local,context,"order")).status).toBe(200);
   for(const state of ["failed","created","authorized","unexpected"]){
     mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[{...payment,status:state}]}));
     const result=await paymentAction(req({token:await token()}),context,"checkout");
     expect(result.status).toBe(409);expect(await result.json()).not.toHaveProperty("checkout");
   }
   mockFetch.mockResolvedValueOnce(response({...order,status:"attempted"})).mockResolvedValueOnce(response({items:[]}));
   expect((await paymentAction(req({token:await token()}),context,"checkout")).status).toBe(409);
   ledger.find.mockResolvedValueOnce({order_id:order.id,amount:order.amount,package:"starter",key_id:env.RAZORPAY_KEY_ID,status:"paid"});
   mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[]}));
   expect((await paymentAction(req({token:await token()}),context,"checkout")).status).toBe(409);
 });
 it("recovers late capture after failure while public checkout is disabled",async()=>{
   const sessionToken=await token();const disabled={env:{...env,RAZORPAY_ENABLED:"false"}};
   mockFetch.mockResolvedValueOnce(response({...order,status:"attempted"})).mockResolvedValueOnce(response({items:[{...payment,status:"failed"}]}));
   expect(await (await paymentAction(req({token:sessionToken}),disabled,"status")).json()).toEqual({status:"pending"});
   expect(ledger.settle).not.toHaveBeenCalled();
   mockFetch.mockResolvedValueOnce(response({...order,status:"paid"})).mockResolvedValueOnce(response({items:[payment]}));
   expect(await (await paymentAction(req({token:sessionToken}),disabled,"status")).json()).toEqual({status:"paid",paymentId:payment.id});
   expect(ledger.settle).toHaveBeenCalledWith(order.id,payment.id,"paid",0);
 });
 it("creates fixed ₹1 admin tests with public checkout disabled and rejects supplied prices",async()=>{
 const admin={id:"owner",email:"owner@example.com"};
 const disabled={env:{...env,RAZORPAY_ENABLED:"false"}};
 const testOrder={...order,amount:100,notes:{package:"test"}};
 mockFetch.mockResolvedValueOnce(response(testOrder));
 expect((await paymentAction(req({requestId:details.requestId}),disabled,"order",admin)).status).toBe(200);
 const sent=JSON.parse(mockFetch.mock.calls[0][1].body);
 expect(sent.amount).toBe(100); expect(sent.notes.service).toBe("Test");
 expect(ledger.reserve.mock.calls[0][0].customer.admin_id).toBe("owner");
 expect((await paymentAction(req({requestId:details.requestId,amount:1}),disabled,"order",admin)).status).toBe(400);
 expect(mockFetch).toHaveBeenCalledTimes(1);
 });
 it("blocks test tokens through public endpoints and enforces stored admin ownership",async()=>{
 const testToken=await createPaymentToken({orderId:order.id,amount:100,package:"test",keyId:env.RAZORPAY_KEY_ID,issuedAt:Date.now()},env.RAZORPAY_KEY_SECRET);
 expect((await paymentAction(req({token:testToken}),context,"checkout")).status).toBe(403);
 ledger.find.mockResolvedValue({order_id:order.id,amount:100,package:"test",key_id:env.RAZORPAY_KEY_ID,customer:{admin_id:"another-owner"}});
 expect((await paymentAction(req({token:testToken}),context,"checkout",{id:"owner",email:"owner@example.com"})).status).toBe(403);
 expect(mockFetch).not.toHaveBeenCalled();
 });
 it("verifies capture and reconciles test webhooks using the same ledger",async()=>{
 const testOrder={...order,amount:100,notes:{package:"test"}};
 const testPayment={...payment,amount:100};
 ledger.find.mockResolvedValue({order_id:order.id,amount:100,package:"test",key_id:env.RAZORPAY_KEY_ID,created_at:new Date().toISOString(),customer:{admin_id:"owner"}});
 const testToken=await createPaymentToken({orderId:order.id,amount:100,package:"test",keyId:env.RAZORPAY_KEY_ID,issuedAt:Date.now()},env.RAZORPAY_KEY_SECRET);
 mockFetch.mockResolvedValueOnce(response(testOrder)).mockResolvedValueOnce(response(testPayment));
 expect((await paymentAction(req({...await callback(),token:testToken}),context,"verify",{id:"owner",email:"owner@example.com"})).status).toBe(200);
 const body=JSON.stringify({payload:{payment:{entity:{order_id:order.id}}}});
 const signature=createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
 mockFetch.mockResolvedValueOnce(response(testOrder)).mockResolvedValueOnce(response({items:[testPayment]}));
 expect((await paymentWebhook(new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_test"},body}),{env:{...env,RAZORPAY_ENABLED:"false"}})).status).toBe(200);
 expect(ledger.settle).toHaveBeenCalledTimes(1); expect(ledger.completeWebhook).toHaveBeenCalledTimes(1);
 });
 it("settles signed events while checkout is disabled",async()=>{
 const disabledContext={env:{...env,RAZORPAY_ENABLED:"false",PAYMENT_RATE_LIMITER:undefined}};
 const body=JSON.stringify({payload:{payment:{entity:{order_id:order.id}}}});
 const signature=createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
 mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[payment]}));
 const request=new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_test"},body});
 expect((await paymentWebhook(request,disabledContext)).status).toBe(200);
 expect(ledger.completeWebhook).toHaveBeenCalledWith("evt_test",order.id,payment.id,"paid",0);
 expect((await paymentAction(req(details),disabledContext,"order")).status).toBe(503);
 expect(mockFetch).toHaveBeenCalledTimes(2); expect(ledger.reserve).not.toHaveBeenCalled();
 });
 it("rejects unsigned and tampered events while checkout is disabled",async()=>{
 const disabledContext={env:{...env,RAZORPAY_ENABLED:"false"}};
 const body=JSON.stringify({payload:{payment:{entity:{order_id:order.id}}}});
 const signature=createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
 for(const headers of [{}, {"x-razorpay-signature":signature}]) {
 const request=new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",headers,body:body+" "});
 expect((await paymentWebhook(request,disabledContext)).status).toBe(403);
 }
 expect(ledger.find).not.toHaveBeenCalled(); expect(mockFetch).not.toHaveBeenCalled();
 });
 it("reconciles refund-only webhook payloads",async()=>{
 const body=JSON.stringify({payload:{refund:{entity:{payment_id:payment.id}}}});
 const signature=createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
 const refunded={...payment,status:"refunded",amount_refunded:250000};
 mockFetch.mockResolvedValueOnce(response(refunded)).mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[refunded]}));
 const request=new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_test"},body});
 expect((await paymentWebhook(request,context)).status).toBe(200);
 expect(ledger.completeWebhook).toHaveBeenCalledWith("evt_test",order.id,payment.id,"refunded",250000);
 });
 it("reuses a reserved order without creating another provider order",async()=>{
 ledger.reserve.mockResolvedValue({created:false,record:{order_id:order.id,created_at:new Date().toISOString()}});
 expect((await paymentAction(req(details),context,"order")).status).toBe(200); expect(mockFetch).not.toHaveBeenCalled();
 });
 it("blocks ambiguous order creation and database outages",async()=>{
 ledger.reserve.mockResolvedValueOnce({created:false,record:{order_id:null}});
 expect((await paymentAction(req(details),context,"order")).status).toBe(409);
 ledger.reserve.mockRejectedValueOnce(new Error("offline"));
 expect((await paymentAction(req(details),context,"order")).status).toBe(503); expect(mockFetch).not.toHaveBeenCalled();
 });
 it("does not report success if settlement cannot be stored",async()=>{
 mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response(payment)); ledger.settle.mockRejectedValueOnce(new Error("offline"));
 expect((await paymentAction(req(await callback()),context,"verify")).status).toBe(503);
 });
 it("rejects forged webhooks before reading the ledger",async()=>{
 const request=new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",body:"{}"});
 expect((await paymentWebhook(request,context)).status).toBe(403); expect(ledger.find).not.toHaveBeenCalled();
 });
 it("checks provider state and durably records signed webhook retries",async()=>{
 const body=JSON.stringify({payload:{payment:{entity:{order_id:order.id}}}});
 const signature=createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(body).digest("hex");
 for(let i=0;i<2;i++) {
 mockFetch.mockResolvedValueOnce(response(order)).mockResolvedValueOnce(response({items:[payment]}));
 const request=new Request("https://sitenova.dev/api/payments/webhook",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_test"},body});
 expect((await paymentWebhook(request,context)).status).toBe(200);
 }
 expect(ledger.settle).not.toHaveBeenCalled(); expect(ledger.completeWebhook).toHaveBeenCalledTimes(2);
 });
});
