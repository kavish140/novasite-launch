import {afterEach,beforeEach,it,expect,vi} from "vitest";
import {render,screen,fireEvent,cleanup,waitFor,act} from "@testing-library/react";
import Project from "./Project";
import {projectRequest} from "@/lib/project-client";
import {loadRazorpay} from "@/lib/razorpay-client";
import {preparePaymentConfirmation} from "@/lib/payment-confirmation-client";
vi.mock("@/lib/payment-confirmation-client",()=>({preparePaymentConfirmation:vi.fn().mockResolvedValue(undefined)}));
const {navigate}=vi.hoisted(()=>({navigate:vi.fn()}));
vi.mock("react-router",async original=>({...await original<typeof import("react-router")>(),useNavigate:()=>navigate}));
vi.mock("@/lib/project-client",async original=>({...await original<typeof import("@/lib/project-client")>(),projectRequest:vi.fn()}));
vi.mock("@/lib/razorpay-client",()=>({loadRazorpay:vi.fn()}));
const summary={title:"Client website",stage:"design",update:"Review your design",updatedAt:"2026-10-13T10:00:00Z",total:1000000,advancePaid:500000,balancePaid:0,remaining:500000,balanceStatus:"not_started",needsReview:false,canPay:false};
beforeEach(()=>{vi.clearAllMocks();window.location.hash="private-token";vi.mocked(projectRequest).mockResolvedValue(summary);vi.mocked(loadRazorpay).mockResolvedValue();});
afterEach(()=>{cleanup();window.location.hash="";delete window.Razorpay;vi.useRealTimers();});
it("shows admin progress and verified amounts while payment collection is disabled",async()=>{render(<Project/>);expect(await screen.findByText("Client website")).toBeTruthy();expect(screen.getByText("Review your design")).toBeTruthy();expect(screen.queryByRole("button",{name:"Pay remaining balance"})).toBeNull();expect(projectRequest).toHaveBeenCalledWith("view","private-token");});
it("uses the private fragment rather than public name/email lookup and makes no call without a link",async()=>{window.location.hash="";render(<Project/>);expect(await screen.findByText(/Open the private project link/)).toBeTruthy();expect(projectRequest).not.toHaveBeenCalled();expect(screen.queryByRole("textbox")).toBeNull();});
it("opens a single backend-priced checkout and confirms only after server verification",async()=>{
 vi.mocked(projectRequest).mockResolvedValueOnce({...summary,canPay:true}).mockResolvedValueOnce({orderId:"order_balance",amount:500000,keyId:"rzp_test_fake",testMode:true}).mockResolvedValueOnce({...summary,balancePaid:500000,remaining:0,balanceStatus:"paid",canPay:false});
 const opened=vi.fn();window.Razorpay=class{constructor(private options:ConstructorParameters<NonNullable<typeof window.Razorpay>>[0]){}open(){opened(this.options);this.options.handler({razorpay_order_id:"order_balance",razorpay_payment_id:"pay_balance",razorpay_signature:"fake-signature"});}on(){}};
 render(<Project/>);const pay=await screen.findByRole("button",{name:"Pay remaining balance"});fireEvent.click(pay);fireEvent.click(pay);
 expect(await screen.findByText("Balance payment confirmed.")).toBeTruthy();expect(opened).toHaveBeenCalledTimes(1);expect(opened.mock.calls[0][0]).toMatchObject({amount:500000,retry:{enabled:false}});
 expect(projectRequest).toHaveBeenCalledWith("checkout","private-token",{});expect(projectRequest).toHaveBeenCalledWith("verify","private-token",expect.objectContaining({razorpay_payment_id:"pay_balance"}));
 await waitFor(()=>expect(navigate).toHaveBeenCalledWith("/payment-thank-you?kind=balance#private-token",{replace:true}));
 expect(preparePaymentConfirmation).toHaveBeenCalledWith({kind:"balance",token:"private-token"});
});
it("retains recovery and blocks payment after an uncertain provider check",async()=>{
 vi.mocked(projectRequest).mockResolvedValueOnce({...summary,canPay:true}).mockRejectedValueOnce(new Error("Provider unavailable"));render(<Project/>);await screen.findByText("Client website");fireEvent.click(screen.getByRole("button",{name:"Check payment status"}));await waitFor(()=>expect(screen.getByRole("alert").textContent).toContain("Provider unavailable"));expect(screen.queryByRole("button",{name:"Pay remaining balance"})).toBeNull();
});
it("clears stale private data and Pay on a failed poll, then clears the warning after recovery",async()=>{
 vi.useFakeTimers();vi.mocked(projectRequest).mockResolvedValueOnce({...summary,canPay:true}).mockRejectedValueOnce(new Error("Project access unavailable")).mockResolvedValueOnce(summary);
 render(<Project/>);await act(async()=>{});expect(screen.getByText("Client website")).toBeTruthy();
 await act(async()=>{await vi.advanceTimersByTimeAsync(60000);});expect(screen.getByRole("alert").textContent).toContain("Project access unavailable");expect(screen.queryByText("Client website")).toBeNull();expect(screen.queryByRole("button",{name:"Pay remaining balance"})).toBeNull();expect(screen.getByRole("button",{name:"Reload project"})).toBeTruthy();
 await act(async()=>{await vi.advanceTimersByTimeAsync(60000);});expect(screen.queryByRole("alert")).toBeNull();expect(screen.getByText("Client website")).toBeTruthy();
});
it("switches private links on hash change and never applies a stale response from the old project",async()=>{
 let old!: (value:typeof summary)=>void;vi.mocked(projectRequest).mockResolvedValueOnce(summary).mockImplementationOnce(()=>new Promise(resolve=>{old=resolve;})).mockResolvedValueOnce({...summary,title:"Second project"});
 render(<Project/>);await screen.findByText("Client website");fireEvent.click(screen.getByRole("button",{name:"Check payment status"}));
 await act(async()=>{window.location.hash="second-token";window.dispatchEvent(new HashChangeEvent("hashchange"));});expect(await screen.findByText("Second project")).toBeTruthy();
 await act(async()=>old({...summary,title:"Old response"}));expect(screen.queryByText("Old response")).toBeNull();expect(screen.getByText("Second project")).toBeTruthy();expect(projectRequest).toHaveBeenCalledWith("view","second-token");
});
it("does not start backend checkout or open Razorpay after leaving while the script loads",async()=>{
 let loaded!:()=>void;vi.mocked(loadRazorpay).mockReturnValue(new Promise(resolve=>{loaded=resolve;}));vi.mocked(projectRequest).mockResolvedValue({...summary,canPay:true});const view=render(<Project/>);fireEvent.click(await screen.findByRole("button",{name:"Pay remaining balance"}));view.unmount();await act(async()=>loaded());expect(projectRequest).not.toHaveBeenCalledWith("checkout",expect.anything());
});
it("ignores dismissal while verification is in flight and cannot reopen checkout early",async()=>{
 let verified!:(value:typeof summary)=>void,options!:ConstructorParameters<NonNullable<typeof window.Razorpay>>[0];
 vi.mocked(projectRequest).mockResolvedValueOnce({...summary,canPay:true}).mockResolvedValueOnce({orderId:"order_balance",amount:500000,keyId:"rzp_test_fake",testMode:true}).mockImplementationOnce(()=>new Promise(resolve=>{verified=resolve;}));
 window.Razorpay=class{constructor(value:typeof options){options=value;}open(){options.handler({razorpay_order_id:"order_balance",razorpay_payment_id:"pay_balance",razorpay_signature:"signature"});}on(){}};
 render(<Project/>);fireEvent.click(await screen.findByRole("button",{name:"Pay remaining balance"}));await waitFor(()=>expect(projectRequest).toHaveBeenCalledWith("verify",expect.anything(),expect.anything()));
 act(()=>options.modal.ondismiss());expect(screen.getByRole("button",{name:"Please wait…"}).hasAttribute("disabled")).toBe(true);expect(screen.queryByText(/Checkout closed/)).toBeNull();
 await act(async()=>verified({...summary,balancePaid:500000,remaining:0,balanceStatus:"paid",canPay:false}));expect(screen.getByText("Balance payment confirmed.")).toBeTruthy();
});
it("verifies late callbacks against their original private link without unlocking a newer checkout",async()=>{
 const options:ConstructorParameters<NonNullable<typeof window.Razorpay>>[0][]=[],failed:(()=>void)[]=[];
 vi.mocked(projectRequest).mockImplementation(async(action,token)=>action==="checkout"?{orderId:token==="private-token"?"order_first":"order_second",amount:500000,keyId:"rzp_test_fake",testMode:true}:{...summary,title:token==="private-token"?"First project":"Second project",canPay:action!=="verify",remaining:action==="verify"?0:500000});
 window.Razorpay=class{constructor(value:typeof options[number]){options.push(value);}open(){}on(_event:string,callback:()=>void){failed.push(callback);}};
 render(<Project/>);fireEvent.click(await screen.findByRole("button",{name:"Pay remaining balance"}));await waitFor(()=>expect(options).toHaveLength(1));act(()=>failed[0]());
 await act(async()=>{window.location.hash="second-token";window.dispatchEvent(new HashChangeEvent("hashchange"));});await screen.findByText("Second project");fireEvent.click(screen.getByRole("button",{name:"Pay remaining balance"}));await waitFor(()=>expect(options).toHaveLength(2));
 await act(async()=>{await options[0].handler({razorpay_order_id:"order_first",razorpay_payment_id:"pay_first",razorpay_signature:"signature"});});
 expect(projectRequest).toHaveBeenCalledWith("verify","private-token",expect.anything());expect(screen.getByText("Second project")).toBeTruthy();expect(screen.getByRole("button",{name:"Please wait…"}).hasAttribute("disabled")).toBe(true);expect(screen.queryByText("Balance payment confirmed.")).toBeNull();
});

it("offers a retry only from a backend summary and sends its exact predecessor reference on an explicit click",async()=>{
 vi.mocked(projectRequest).mockResolvedValueOnce({...summary,canPay:true,balanceStatus:"failed",retryId:"00000000-0000-4000-8000-000000000004"}).mockResolvedValueOnce({orderId:"order_retry",amount:500000,keyId:"rzp_test_fake",testMode:true});const open=vi.fn();window.Razorpay=class{open(){open();}on(){}};
 render(<Project/>);const button=await screen.findByRole("button",{name:"Retry remaining balance payment"});expect(loadRazorpay).not.toHaveBeenCalled();expect(open).not.toHaveBeenCalled();fireEvent.click(button);await waitFor(()=>expect(open).toHaveBeenCalledTimes(1));expect(projectRequest).toHaveBeenCalledWith("checkout","private-token",{retryId:"00000000-0000-4000-8000-000000000004"});
});

it("shows reload progress and a persistent-failure outcome, then restores the project after successful retry",async()=>{
 let fail!: (reason:Error)=>void;
 vi.mocked(projectRequest).mockRejectedValueOnce(new Error("Network unavailable")).mockImplementationOnce(()=>new Promise((_resolve,reject)=>{fail=reject;})).mockResolvedValueOnce(summary);
 render(<Project/>);fireEvent.click(await screen.findByRole("button",{name:"Reload project"}));expect((screen.getByRole("button",{name:"Reloading…"}) as HTMLButtonElement).disabled).toBe(true);expect(screen.getByRole("alert").getAttribute("aria-busy")).toBe("true");
 await act(async()=>fail(new Error("Network unavailable")));expect(await screen.findByText(/Still unable to reload your project/)).toBeTruthy();expect(screen.queryByText("Client website")).toBeNull();expect(projectRequest).toHaveBeenNthCalledWith(2,"view","private-token");
 fireEvent.click(screen.getByRole("button",{name:"Reload project"}));expect(await screen.findByText("Project reloaded successfully.")).toBeTruthy();expect(screen.getByText("Client website")).toBeTruthy();expect(screen.queryByRole("alert")).toBeNull();expect(screen.queryByRole("button",{name:"Pay remaining balance"})).toBeNull();
});
