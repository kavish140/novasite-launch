import {afterEach,it,expect,vi} from "vitest";
import {render,screen,fireEvent,waitFor,cleanup} from "@testing-library/react";
import PaidOrders from "./PaidOrders";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
vi.mock("@/lib/payment-admin-client",()=>({adminPaymentRequest:vi.fn()}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
it("uses accessible card buttons to expand details and undo a saved review",async()=>{
 const order={request_id:"reviewed",paid_at:"2026-10-11T10:00:00Z",acknowledged_at:"2026-10-11T11:00:00Z",payment_intents:{order_id:"order_reviewed",package:"starter",amount:500000,status:"paid",customer:{}}};
 vi.mocked(adminPaymentRequest).mockImplementation(async(action)=>action==="paid"?{orders:[order],nextOffset:null}:{});
 render(<PaidOrders/>);
 const details=await screen.findByRole("button",{name:"View details"});expect(details.getAttribute("aria-expanded")).toBe("false");
 fireEvent.click(details);expect(screen.getByRole("button",{name:"Hide details"}).getAttribute("aria-expanded")).toBe("true");
 expect(screen.queryByRole("checkbox")).toBeNull();
 fireEvent.click(screen.getByRole("button",{name:"Undo review"}));
 await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("acknowledge",{kind:"paid",id:"reviewed",acknowledged:false}));
 expect(vi.mocked(adminPaymentRequest).mock.calls.every(([action])=>["paid","acknowledge"].includes(action))).toBe(true);
});
it("shows stored contact and project details and acknowledges without changing settlement",async()=>{
 const refresh=vi.fn(),order={request_id:"request",paid_at:"2026-10-11T10:00:00Z",acknowledged_at:null,payment_intents:{order_id:"order_1",package:"starter",amount:500000,status:"paid",customer:{name:"Customer",email:"customer@example.test",business:"Website project",requirements:"Booking website",timeline:"Within 2–4 weeks",website_url:"https://example.test"}}};
 vi.mocked(adminPaymentRequest).mockImplementation(async(action)=>action==="paid"?{orders:[order],nextOffset:null}:{});
 render(<PaidOrders refreshHealth={refresh}/>);
 expect(await screen.findByText("email: customer@example.test")).toBeTruthy();expect(screen.getByText("Project brief: Booking website")).toBeTruthy();
 expect(screen.getByText("Preferred timeline: Within 2–4 weeks")).toBeTruthy();expect(screen.getByText("Existing website: https://example.test")).toBeTruthy();
 fireEvent.click(screen.getByRole("button",{name:"Mark as reviewed"}));
 await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("acknowledge",{kind:"paid",id:"request",acknowledged:true}));
 await waitFor(()=>expect(refresh).toHaveBeenCalled());
 expect(vi.mocked(adminPaymentRequest).mock.calls.every(([action])=>["paid","acknowledge"].includes(action))).toBe(true);
});
it("opens a saved ₹1 test receipt by ledger reference without starting payment or requiring browser checkout storage",async()=>{
 const url=`https://sitenova.dev/receipt#00000000-0000-4000-8000-000000000002.${"a".repeat(64)}`;
 vi.mocked(adminPaymentRequest).mockImplementation(async(action)=>action==="paid"?{orders:[{request_id:"test-request",paid_at:"2026-10-11T10:00:00Z",acknowledged_at:null,payment_intents:{order_id:"order_test",package:"test",amount:100,status:"paid",customer:{}}}],nextOffset:null}:{url});
 render(<PaidOrders/>);fireEvent.click(await screen.findByRole("button",{name:"Get ₹1 test receipt"}));
 expect((await screen.findByRole("link",{name:"Open receipt"})).getAttribute("href")).toBe(url);
 expect(adminPaymentRequest).toHaveBeenCalledWith("order-receipt",{requestId:"test-request"});expect(vi.mocked(adminPaymentRequest).mock.calls.every(([action])=>["paid","order-receipt"].includes(action))).toBe(true);
});
it("keeps payment recorded and exposes no unsafe link when receipt generation fails",async()=>{
 vi.mocked(adminPaymentRequest).mockImplementation(async(action)=>action==="paid"?{orders:[{request_id:"test-request",paid_at:"2026-10-11T10:00:00Z",acknowledged_at:null,payment_intents:{order_id:"order_test",package:"test",amount:100,status:"paid",customer:{}}}],nextOffset:null}:{url:"https://unsafe.example"});
 render(<PaidOrders/>);fireEvent.click(await screen.findByRole("button",{name:"Get ₹1 test receipt"}));
 expect((await screen.findByRole("alert")).textContent).toContain("Your payment remains recorded");expect(screen.queryByRole("link",{name:"Open receipt"})).toBeNull();
});
