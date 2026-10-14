import {afterEach,beforeEach,it,expect,vi} from "vitest";
import {paymentRequest,restorePayment,savePayment,restoreSharedPayment} from "./razorpay-client";
const session={package:"business" as const,orderId:"order_original",token:"private-signed-token"};
beforeEach(()=>{localStorage.clear();sessionStorage.clear();window.history.replaceState(null,"","/");vi.stubGlobal("AbortSignal",{timeout:()=>new AbortController().signal});});
afterEach(()=>{vi.unstubAllGlobals();vi.restoreAllMocks();localStorage.clear();sessionStorage.clear();});
it("recovers the private signed session after tab storage is lost without saving customer details",()=>{
 savePayment({...session,...{email:"never-store@example.test",phone:"9876543210",business:"Private",requirements:"Private brief"}});sessionStorage.clear();expect(restorePayment("business")).toEqual(session);
 const stored=localStorage.getItem("sitenova-payment-business")!;expect(stored).not.toMatch(/email|phone|business.*Private|requirements/);expect(restorePayment("starter")).toBeNull();
});
it("keeps the opaque original request UUID when a tab closes before the order response arrives",async()=>{
 const fetcher=vi.fn<typeof fetch>(async()=>Response.json(session));vi.stubGlobal("fetch",fetcher);
 const details={package:"business",name:"Fixture",email:"fixture@example.test",business:"Project",phone:"9876543210",accepted:true};
 await paymentRequest("order",details);const first=JSON.parse(String(fetcher.mock.calls[0][1]?.body));sessionStorage.clear();await paymentRequest("order",details);const second=JSON.parse(String(fetcher.mock.calls[1][1]?.body));expect(second.requestId).toBe(first.requestId);expect(localStorage.getItem("sitenova-payment-request-business")).toBe(first.requestId);
});
it("keeps confirmed-decline retry request IDs stable across closing tabs",async()=>{
 const fetcher=vi.fn<typeof fetch>(async()=>Response.json(session));vi.stubGlobal("fetch",fetcher);await paymentRequest("retry",{token:session.token,orderId:session.orderId});sessionStorage.clear();await paymentRequest("retry",{token:session.token,orderId:session.orderId});expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body)).requestId).toBe(JSON.parse(String(fetcher.mock.calls[1][1]?.body)).requestId);
});
it("migrates old tab-only storage and tolerates browsers blocking persistent storage",()=>{
 sessionStorage.setItem("sitenova-payment-business",JSON.stringify(session));expect(restorePayment("business")).toEqual(session);vi.spyOn(Storage.prototype,"setItem").mockImplementation(()=>{throw new Error("blocked");});expect(()=>savePayment(session)).not.toThrow();
});
it("rejects corrupt/foreign sessions and only reads correctly shaped owner-shared fragments",()=>{
 localStorage.setItem("sitenova-payment-business","invalid");expect(restorePayment("business")).toBeNull();
 const token=btoa(JSON.stringify({package:"business",orderId:"order_original"}))+"."+"a".repeat(64);window.history.replaceState(null,"",`/pay?package=business#resume=${encodeURIComponent(token)}`);expect(restoreSharedPayment("business")).toEqual({...session,token});expect(restoreSharedPayment("starter")).toBeNull();window.history.replaceState(null,"","/pay#resume=invalid");expect(restoreSharedPayment("business")).toBeNull();
});
