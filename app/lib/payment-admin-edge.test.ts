// @vitest-environment node
import { describe,it,expect,vi,beforeEach } from "vitest";
const mocks=vi.hoisted(()=>({getUser:vi.fn(),owner:vi.fn(),payment:vi.fn(),queue:vi.fn()}));
vi.mock("../../supabase/functions/_shared/admin-payments.ts",()=>({adminPayments:mocks.queue}));
vi.mock("@supabase/supabase-js",()=>({createClient:()=>({auth:{getUser:mocks.getUser},from:()=>({select:()=>({eq:()=>({maybeSingle:mocks.owner})})})})}));
vi.mock("../../supabase/functions/_shared/razorpay.ts",async original=>({...await original<typeof import("../../supabase/functions/_shared/razorpay")>(),paymentAction:mocks.payment}));
import { handlePaymentEdge } from "../../supabase/functions/_shared/edge-handler";
const env={PAYMENT_GATEWAY_SECRET:"a".repeat(40),SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"server-key"};
const req=(token?:string)=>new Request("https://example.supabase.co/functions/v1/razorpay-payments/admin-test/order",{method:"POST",headers:{"x-payment-gateway-secret":env.PAYMENT_GATEWAY_SECRET,"x-payment-origin":"https://sitenova.dev",...(token?{"x-payment-admin-token":token}:{})},body:"{}"});
beforeEach(()=>{vi.clearAllMocks();mocks.getUser.mockResolvedValue({data:{user:{id:"owner",email:"owner@example.com"}},error:null});mocks.owner.mockResolvedValue({data:{user_id:"owner"},error:null});mocks.payment.mockResolvedValue(Response.json({ok:true}));mocks.queue.mockResolvedValue(Response.json({orders:[]}));});
describe("admin test payment authorization",()=>{
 it("denies non-admin summary requests before querying alert storage",async()=>{
  const original=req("nonadmin");mocks.owner.mockResolvedValueOnce({data:null,error:null});
  const summary=new Request(original.url.replace("admin-test/order","admin-queue/queue"),{method:"POST",headers:original.headers,body:JSON.stringify({summaryOnly:true})});
  expect((await handlePaymentEdge(summary,env)).status).toBe(403);expect(mocks.queue).not.toHaveBeenCalled();
 });
 it.each(["queue","history","recheck","paid","acknowledge","investigations","order-receipt"])("denies non-admins access to payment %s",async action=>{
  const queueReq=(token?:string)=>{const original=req(token);return new Request(original.url.replace("admin-test/order",`admin-queue/${action}`),original);};
  expect((await handlePaymentEdge(queueReq(),env)).status).toBe(401);
  mocks.getUser.mockResolvedValueOnce({data:{user:null},error:{message:"forged"}});
  expect((await handlePaymentEdge(queueReq("forged"),env)).status).toBe(401);
  mocks.owner.mockResolvedValueOnce({data:null,error:null});
  expect((await handlePaymentEdge(queueReq("nonadmin"),env)).status).toBe(403);
  expect(mocks.queue).not.toHaveBeenCalled();
  expect((await handlePaymentEdge(queueReq("admin"),env)).status).toBe(200);
  expect(mocks.queue).toHaveBeenLastCalledWith(expect.any(Request),expect.any(Object),action,{id:"owner",email:"owner@example.com"});
 });
 it("does not expose queue operations through public or test channels",async()=>{
  for(const path of ["queue","admin-test/queue","admin-queue/mark-paid","admin-queue/order"]){const original=req("admin");expect((await handlePaymentEdge(new Request(original.url.replace("admin-test/order",path),original),env)).status).toBe(404);}
  expect(mocks.queue).not.toHaveBeenCalled();
 });
 it("requires a fresh Auth-verified identity and database admin membership",async()=>{
  expect((await handlePaymentEdge(req(),env)).status).toBe(401);
  mocks.getUser.mockResolvedValueOnce({data:{user:null},error:{message:"invalid"}});
  expect((await handlePaymentEdge(req("forged"),env)).status).toBe(401);
  mocks.owner.mockResolvedValueOnce({data:null,error:null});
  expect((await handlePaymentEdge(req("signed-nonadmin"),env)).status).toBe(403);
  expect(mocks.payment).not.toHaveBeenCalled();
 });
 it("passes only verified identity to the fixed-price test flow",async()=>{
  expect((await handlePaymentEdge(req("signed-admin"),env)).status).toBe(200);
  expect(mocks.getUser).toHaveBeenCalledWith("signed-admin");
  expect(mocks.payment.mock.calls[0][3]).toEqual({id:"owner",email:"owner@example.com"});
 });
 it("fails closed when authorization storage is unavailable",async()=>{
  mocks.owner.mockResolvedValueOnce({data:null,error:{message:"offline"}});
  expect((await handlePaymentEdge(req("signed-admin"),env)).status).toBe(503);
  expect(mocks.payment).not.toHaveBeenCalled();
 });
});
