import {afterEach,it,expect,vi} from "vitest";
import {render,screen,fireEvent,waitFor,cleanup} from "@testing-library/react";
import PaidOrders from "./PaidOrders";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
vi.mock("@/lib/payment-admin-client",()=>({adminPaymentRequest:vi.fn()}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
it("shows stored contact and project details and acknowledges without changing settlement",async()=>{
 const refresh=vi.fn(),order={request_id:"request",paid_at:"2026-10-11T10:00:00Z",acknowledged_at:null,payment_intents:{order_id:"order_1",package:"starter",amount:500000,status:"paid",customer:{name:"Customer",email:"customer@example.test",business:"Website project",requirements:"Booking website"}}};
 vi.mocked(adminPaymentRequest).mockImplementation(async(action)=>action==="paid"?{orders:[order],nextOffset:null}:{});
 render(<PaidOrders refreshHealth={refresh}/>);
 expect(await screen.findByText("email: customer@example.test")).toBeTruthy();expect(screen.getByText("requirements: Booking website")).toBeTruthy();
 fireEvent.click(screen.getByRole("checkbox",{name:"Acknowledged"}));
 await waitFor(()=>expect(adminPaymentRequest).toHaveBeenCalledWith("acknowledge",{kind:"paid",id:"request",acknowledged:true}));
 await waitFor(()=>expect(refresh).toHaveBeenCalled());
 expect(vi.mocked(adminPaymentRequest).mock.calls.every(([action])=>["paid","acknowledge"].includes(action))).toBe(true);
});
