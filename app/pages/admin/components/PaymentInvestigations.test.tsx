import {afterEach,it,expect,vi} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import PaymentInvestigations from "./PaymentInvestigations";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
vi.mock("@/lib/payment-admin-client",()=>({adminPaymentRequest:vi.fn()}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
it("shows unknown payment and unattached reservation evidence without settlement controls",async()=>{
 vi.mocked(adminPaymentRequest).mockResolvedValue({items:[{id:"one",kind:"unknown_payment",order_id:"order_unknown",payment_id:"pay_unknown",request_id:null,amount:100,currency:"INR",provider_status:"captured"},{id:"two",kind:"unattached_order",order_id:"order_orphan",payment_id:null,request_id:"reservation",amount:100,currency:"INR",provider_status:"created"}],nextOffset:null});
 render(<PaymentInvestigations/>);expect(await screen.findByText(/pay_unknown/)).toBeTruthy();expect(screen.getByText("Reservation: reservation")).toBeTruthy();expect(screen.queryByRole("button",{name:/paid|attach/i})).toBeNull();
});
