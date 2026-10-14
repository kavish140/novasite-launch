import {afterEach,it,expect,vi} from "vitest";
import {render,screen,fireEvent,cleanup} from "@testing-library/react";
import ResumeCheckoutLink from "./ResumeCheckoutLink";
import {adminPaymentRequest} from "@/lib/payment-admin-client";
vi.mock("@/lib/payment-admin-client",()=>({adminPaymentRequest:vi.fn()}));
afterEach(()=>{cleanup();vi.resetAllMocks();});
it("requests only an admin-verified private recovery link and exposes it for owner sharing",async()=>{
 const url="https://sitenova.dev/pay?package=business#resume=fake-fixture-token";vi.mocked(adminPaymentRequest).mockResolvedValue({url});render(<ResumeCheckoutLink requestId="request"/>);fireEvent.click(screen.getByRole("button",{name:"Get recovery link"}));expect((await screen.findByRole("link",{name:"Open recovered checkout"})).getAttribute("href")).toBe(url);expect(adminPaymentRequest).toHaveBeenCalledWith("resume-checkout",{requestId:"request"});expect(screen.getByText(/does not create a new order/)).toBeTruthy();
});
it("does not publish an unsafe recovery URL or claim an uncertain order is payable",async()=>{
 vi.mocked(adminPaymentRequest).mockResolvedValue({url:"https://unsafe.example/pay#resume=fake"});render(<ResumeCheckoutLink requestId="request"/>);fireEvent.click(screen.getByRole("button",{name:"Get recovery link"}));expect(await screen.findByRole("alert")).toBeTruthy();expect(screen.queryByRole("link",{name:"Open recovered checkout"})).toBeNull();
});
