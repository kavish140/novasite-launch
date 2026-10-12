import { beforeEach,afterEach,it,expect,vi } from "vitest";
import { act,cleanup,render,screen,fireEvent,waitFor } from "@testing-library/react";
const mocks=vi.hoisted(()=>({toast:vi.fn(),getSession:vi.fn(),load:vi.fn()}));
vi.mock("@/lib/supabaseClient",()=>({supabase:{auth:{getSession:mocks.getSession}}}));
vi.mock("@/hooks/use-toast",()=>({useToast:()=>({toast:mocks.toast})}));
vi.mock("@/lib/razorpay-client",()=>({loadRazorpay:mocks.load}));
import TestPaymentButton from "./TestPaymentButton";
let options:ConstructorParameters<NonNullable<typeof window.Razorpay>>[0];
const fetcher=vi.fn();
beforeEach(()=>{
 vi.clearAllMocks();sessionStorage.clear();vi.stubGlobal("fetch",fetcher);vi.stubGlobal("crypto",{randomUUID:()=>"00000000-0000-4000-8000-000000000001"});vi.stubGlobal("AbortSignal",{timeout:()=>undefined});
 mocks.getSession.mockResolvedValue({data:{session:{access_token:"admin-jwt",user:{id:"owner"}}}});mocks.load.mockResolvedValue(undefined);
 window.Razorpay=class{constructor(input:typeof options){options=input;}open(){}on(){}};
 fetcher.mockImplementation(async(url:string)=>Response.json(url.endsWith("/order")?{token:"signed",orderId:"order_test"}:url.endsWith("/checkout")?{status:"pending",checkout:{keyId:"rzp_live_example",orderId:"order_test",amount:100}}:{status:"paid",paymentId:"pay_test"}));
});
afterEach(()=>{cleanup();vi.unstubAllGlobals();delete window.Razorpay;});
it("opens only the authorized ₹1 Test checkout and verifies the callback",async()=>{
 render(<TestPaymentButton/>);fireEvent.click(screen.getByRole("button",{name:"Test ₹1 payment"}));fireEvent.click(screen.getByRole("button",{name:"Test ₹1 payment"}));
 await waitFor(()=>expect(fetcher).toHaveBeenCalledTimes(2));
 expect(options.amount).toBe(100);expect(options.description).toBe("Test");
 expect(options.retry).toEqual({enabled:false});
 expect(fetcher.mock.calls[0][1].headers.Authorization).toBe("Bearer admin-jwt");
 await act(async()=>{await options.handler({razorpay_order_id:"order_test",razorpay_payment_id:"pay_test",razorpay_signature:"signature"});});
 await waitFor(()=>expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({title:"₹1 Test payment verified"})));
});
it("reuses the saved order after dismissal and recovers status after refresh",async()=>{
 const view=render(<TestPaymentButton/>);fireEvent.click(screen.getByRole("button",{name:"Test ₹1 payment"}));
 await waitFor(()=>expect(fetcher).toHaveBeenCalledTimes(2));act(()=>options.modal.ondismiss());
 fireEvent.click(screen.getByRole("button",{name:"Test ₹1 payment"}));
 await waitFor(()=>expect(fetcher).toHaveBeenCalledTimes(3));
 expect(fetcher.mock.calls.filter(([url])=>url.endsWith("/order"))).toHaveLength(1);
 act(()=>options.modal.ondismiss());view.unmount();render(<TestPaymentButton/>);
 fireEvent.click(await screen.findByRole("button",{name:"Check status"}));
 await waitFor(()=>expect(fetcher.mock.calls.at(-1)?.[0]).toBe("/api/admin/payments/status"));
});
it("retains uncertain order retries and does not claim payment success",async()=>{
 fetcher.mockRejectedValueOnce(new Error("offline"));render(<TestPaymentButton/>);
 fireEvent.click(screen.getByRole("button",{name:"Test ₹1 payment"}));
 await waitFor(()=>expect(mocks.toast).toHaveBeenCalledWith(expect.objectContaining({title:"Test payment unavailable"})));
 const first=JSON.parse(fetcher.mock.calls[0][1].body).requestId;
 fireEvent.click(screen.getByRole("button",{name:"Test ₹1 payment"}));
 await waitFor(()=>expect(fetcher).toHaveBeenCalledTimes(3));
 expect(JSON.parse(fetcher.mock.calls[1][1].body).requestId).toBe(first);
 expect(mocks.toast).not.toHaveBeenCalledWith(expect.objectContaining({title:"₹1 Test payment verified"}));
});
