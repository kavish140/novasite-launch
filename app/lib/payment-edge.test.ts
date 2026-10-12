// @vitest-environment node
import { describe,it,expect,vi,afterEach } from "vitest";
import { handlePaymentEdge,handleWebhookEdge } from "../../supabase/functions/_shared/edge-handler";
import { adminTestPaymentAction,paymentAction,paymentConfiguration } from "./razorpay.server";
const secret="test-gateway-secret-with-at-least-32-characters";
afterEach(()=>vi.unstubAllGlobals());
describe("Supabase payment boundary",()=>{
 it("keeps signed-session recovery available when new payments are disabled",async()=>{
  const fetcher=vi.fn(async()=>Response.json({status:"pending"}));vi.stubGlobal("fetch",fetcher);
  const context={cloudflare:{env:{SUPABASE_URL:"https://example.supabase.co",PAYMENT_GATEWAY_SECRET:secret,PAYMENT_EDGE_ENABLED:"false"}}};
  for(const action of ["status","verify"] as const){
   const request=new Request(`https://sitenova.dev/api/payments/${action}`,{method:"POST",headers:{origin:"https://sitenova.dev"},body:'{"token":"signed"}'});
   expect((await paymentAction(request,context,action)).status).toBe(200);
  }
  expect(fetcher).toHaveBeenCalledTimes(2);
 });
 it("uses Worker-compatible manual redirects and refuses redirected backend responses",async()=>{
  const fetcher=vi.fn(async(_url:string,_options:RequestInit)=>new Response(null,{status:307,headers:{location:"https://evil.test"}}));vi.stubGlobal("fetch",fetcher);
  const context={cloudflare:{env:{SUPABASE_URL:"https://example.supabase.co",PAYMENT_GATEWAY_SECRET:secret,PAYMENT_EDGE_ENABLED:"true"}}};
  const request=new Request("https://sitenova.dev/api/admin/payments/status",{method:"POST",headers:{origin:"https://sitenova.dev",authorization:"Bearer admin-jwt"},body:"{}"});
  expect((await adminTestPaymentAction(request,context,"status")).status).toBe(503);
  expect(fetcher.mock.calls[0][1].redirect).toBe("manual");
  expect(fetcher).toHaveBeenCalledTimes(1);
 });
 it("forwards admin tests with a bearer token while public checkout remains disabled",async()=>{
  const fetcher=vi.fn(async(_url:string,_options:RequestInit)=>Response.json({status:"pending"}));vi.stubGlobal("fetch",fetcher);
  const context={cloudflare:{env:{SUPABASE_URL:"https://example.supabase.co",PAYMENT_GATEWAY_SECRET:secret,PAYMENT_EDGE_ENABLED:"false"}}};
  const make=(origin:string,authorization?:string)=>new Request("https://sitenova.dev/api/admin/payments/order",{method:"POST",headers:{origin,...(authorization?{authorization}:{})},body:"{}"});
  expect((await adminTestPaymentAction(make("https://sitenova.dev"),context,"order")).status).toBe(401);
  expect((await adminTestPaymentAction(make("https://evil.test","Bearer admin-jwt"),context,"order")).status).toBe(403);
  expect(fetcher).not.toHaveBeenCalled();
  expect((await adminTestPaymentAction(make("https://sitenova.dev","Bearer admin-jwt"),context,"order")).status).toBe(200);
  expect(fetcher.mock.calls[0][0]).toBe("https://example.supabase.co/functions/v1/razorpay-payments/admin-test/order");
  expect(new Headers(fetcher.mock.calls[0][1].headers).get("x-payment-admin-token")).toBe("admin-jwt");
  expect((await paymentAction(make("https://sitenova.dev","Bearer admin-jwt"),context,"order")).status).toBe(503);
  expect(fetcher).toHaveBeenCalledTimes(1);
 });
 it("rejects direct public calls without the website credential",async()=>{
  const response=await handlePaymentEdge(new Request("https://example.supabase.co/functions/v1/razorpay-payments/order",{method:"POST",body:"{}"}),{PAYMENT_GATEWAY_SECRET:secret});
  expect(response.status).toBe(401);
 });
 it("keeps configured gateway disabled without Razorpay secrets",async()=>{
  const request=new Request("https://example.supabase.co/functions/v1/razorpay-payments/config",{method:"POST",headers:{"x-payment-gateway-secret":secret}});
  expect((await (await handlePaymentEdge(request,{PAYMENT_GATEWAY_SECRET:secret})).json()).enabled).toBe(false);
 });
 it("rejects unknown actions and unapproved forwarded origins",async()=>{
  for(const [action,origin,status] of [["anything","https://sitenova.dev",404],["order","https://evil.test",403]] as const){
   const request=new Request(`https://example.supabase.co/functions/v1/razorpay-payments/${action}`,{method:"POST",headers:{"x-payment-gateway-secret":secret,"x-payment-origin":origin},body:"{}"});
   expect((await handlePaymentEdge(request,{PAYMENT_GATEWAY_SECRET:secret})).status).toBe(status);
  }
 });
 it("keeps unconfigured webhook closed",async()=>{
  expect((await handleWebhookEdge(new Request("https://example.supabase.co/functions/v1/razorpay-webhook",{method:"POST",body:"{}"}),{})).status).toBe(503);
 });
 it("forwards only to the fixed Supabase backend without payment credentials",async()=>{
  const fetcher=vi.fn(async(_url: string,_options: RequestInit)=>Response.json({status:"pending"}));vi.stubGlobal("fetch",fetcher);
  const context={cloudflare:{env:{SUPABASE_URL:"https://example.supabase.co",PAYMENT_GATEWAY_SECRET:secret,PAYMENT_EDGE_ENABLED:"true"}}};
  const request=new Request("https://sitenova.dev/api/payments/status",{method:"POST",headers:{origin:"https://sitenova.dev"},body:'{"token":"test"}'});
  expect((await paymentAction(request,context,"status")).status).toBe(200);
  expect(fetcher.mock.calls[0][0]).toBe("https://example.supabase.co/functions/v1/razorpay-payments/status");
  expect(fetcher.mock.calls[0][1].headers).not.toHaveProperty("Authorization");
 });
 it("fails closed on backend outage and prevents cross-origin forwarding",async()=>{
  const fetcher=vi.fn(async()=>{throw new Error("offline")});vi.stubGlobal("fetch",fetcher);
  const context={cloudflare:{env:{SUPABASE_URL:"https://example.supabase.co",PAYMENT_GATEWAY_SECRET:secret,PAYMENT_EDGE_ENABLED:"true"}}};
  expect((await paymentConfiguration(context)).enabled).toBe(false);
  const request=new Request("https://sitenova.dev/api/payments/order",{method:"POST",headers:{origin:"https://evil.test"},body:"{}"});
  expect((await paymentAction(request,context,"order")).status).toBe(403);
  expect(fetcher).toHaveBeenCalledTimes(1);
 });
});
