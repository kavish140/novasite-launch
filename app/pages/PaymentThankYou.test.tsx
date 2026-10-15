import {afterEach,beforeEach,expect,it,vi} from "vitest";
import {cleanup,fireEvent,render,screen,waitFor,act} from "@testing-library/react";
import {createMemoryRouter,RouterProvider} from "react-router";
import PaymentThankYou from "./PaymentThankYou";
import {paymentRequest,restorePayment,restoreSharedPayment,savePayment} from "@/lib/razorpay-client";
import {projectRequest} from "@/lib/project-client";
import {headers,meta} from "@/routes/payment-thank-you";
import {suppressPromotions} from "@/lib/booking";
vi.mock("@/lib/razorpay-client",()=>({paymentRequest:vi.fn(),restorePayment:vi.fn(),restoreSharedPayment:vi.fn(),savePayment:vi.fn()}));
vi.mock("@/lib/project-client",()=>({projectRequest:vi.fn()}));
vi.mock("@/components/PaymentReceiptLink",()=>({default:({token}:{token:string})=><a href="/receipt#fixture" data-token={token}>Save payment receipt</a>}));
const session={package:"starter" as const,orderId:"order_original",token:"signed-private-session"};
const balance={title:"Private customer name",stage:"review",update:"Private project brief",updatedAt:"2026-10-15T09:00:00Z",total:1000000,advancePaid:500000,balancePaid:500000,remaining:0,balanceStatus:"paid",needsReview:false,canPay:false};
function show(path="/payment-thank-you?package=starter",testMode=false){return render(<RouterProvider router={createMemoryRouter([{path:"/payment-thank-you",element:<PaymentThankYou/>,loader:()=>({testMode})}],{initialEntries:[path],hydrationData:{loaderData:{"0":{testMode}}}})}/>);}
beforeEach(()=>{vi.clearAllMocks();window.history.replaceState(null,"","/payment-thank-you");vi.mocked(restoreSharedPayment).mockReturnValue(null);vi.mocked(restorePayment).mockReturnValue(session);vi.mocked(paymentRequest).mockResolvedValue({status:"paid",paymentId:"pay_confirmed"});vi.mocked(projectRequest).mockResolvedValue(balance);});
afterEach(()=>{cleanup();window.history.replaceState(null,"","/");});

it("waits for fresh backend paid confirmation, then shows the specialized advance page and receipt",async()=>{
 let finish!:(value:{status:"paid";paymentId:string})=>void;vi.mocked(paymentRequest).mockReturnValue(new Promise(resolve=>{finish=resolve;}));show();
 expect(screen.getByRole("heading",{name:"Checking your payment…"})).toBeTruthy();expect(screen.queryByText("Thank you for choosing SiteNova.")).toBeNull();
 await act(async()=>finish({status:"paid",paymentId:"pay_confirmed"}));expect(await screen.findByRole("heading",{name:"Thank you for choosing SiteNova."})).toBeTruthy();expect(screen.getByText("pay_confirmed")).toBeTruthy();expect(screen.getByText("Starter website advance")).toBeTruthy();expect(screen.getByRole("link",{name:"Save payment receipt"}).getAttribute("data-token")).toBe(session.token);
 expect(paymentRequest).toHaveBeenCalledExactlyOnceWith("status",{token:session.token});expect(screen.queryByRole("button",{name:/Pay.*advance/})).toBeNull();
});
it("rechecks on refresh without creating another order or trusting a success query",async()=>{
 show("/payment-thank-you?package=starter&paid=true");await screen.findByText("Verified paid");cleanup();show();await screen.findByText("Verified paid");expect(paymentRequest).toHaveBeenCalledTimes(2);expect(vi.mocked(paymentRequest).mock.calls.every(([action])=>action==="status")).toBe(true);
});
it("restores an owner-shared signed session and keeps the original package",async()=>{
 vi.mocked(restorePayment).mockReturnValue(null);vi.mocked(restoreSharedPayment).mockReturnValue({...session,package:"business"});show("/payment-thank-you?package=business");await screen.findByText("Verified paid");expect(screen.getByText("Business website advance")).toBeTruthy();expect(savePayment).toHaveBeenCalledWith({...session,package:"business"});
});
it.each(["/payment-thank-you","/payment-thank-you?package=custom&paid=true","/payment-thank-you?package=starter&kind=unknown"])("never shows success for an incomplete/forged route %s",async path=>{
 show(path);await screen.findByRole("alert");expect(screen.queryByText("Verified paid")).toBeNull();expect(paymentRequest).not.toHaveBeenCalled();expect(projectRequest).not.toHaveBeenCalled();
});
it("does not fetch or show success without the private session",async()=>{vi.mocked(restorePayment).mockReturnValue(null);show();await screen.findByRole("alert");expect(paymentRequest).not.toHaveBeenCalled();expect(screen.queryByRole("link",{name:"Save payment receipt"})).toBeNull();});
it("keeps pending payments out of success and can recover on an explicit recheck",async()=>{
 vi.mocked(paymentRequest).mockResolvedValueOnce({status:"pending"}).mockResolvedValueOnce({status:"paid",paymentId:"pay_late"});show();await screen.findByText("Your payment is still being checked");expect(screen.queryByText("Verified paid")).toBeNull();expect(screen.queryByRole("link",{name:"Save payment receipt"})).toBeNull();fireEvent.click(screen.getByRole("button",{name:"Check payment status"}));await screen.findByText("Verified paid");expect(screen.getByText("pay_late")).toBeTruthy();
});
it("shows refund state instead of a paid thank-you",async()=>{vi.mocked(paymentRequest).mockResolvedValue({status:"refunded",paymentId:"pay_original"});show();await screen.findByText("A refund has been recorded");expect(screen.queryByText("Verified paid")).toBeNull();expect(screen.queryByText("Thank you for choosing SiteNova.")).toBeNull();});
it("clears a previous success if rechecking fails rather than leaving stale paid status",async()=>{
 vi.mocked(paymentRequest).mockResolvedValueOnce({status:"paid"}).mockRejectedValueOnce(new Error("private provider detail"));show();await screen.findByText("Verified paid");fireEvent.click(screen.getByRole("button",{name:"Check payment status"}));await screen.findByText("Payment confirmation unavailable");expect(screen.queryByText("Verified paid")).toBeNull();expect(screen.queryByText("private provider detail")).toBeNull();
});
it("labels simulated confirmations without promising a real booking",async()=>{show(undefined,true);await screen.findByText("Test payment verified");expect(screen.getByText("This is a simulated payment and does not confirm a paid project.")).toBeTruthy();});
it("confirms a saved balance payment and links back privately without exposing project details",async()=>{
 window.location.hash="private-project-capability";show("/payment-thank-you?kind=balance");await screen.findByText("Thank you. Your balance is paid.");expect(screen.getByText("₹5,000.00")).toBeTruthy();expect(screen.getByRole("link",{name:"View project status"}).getAttribute("href")).toBe("/project#private-project-capability");expect(screen.queryByText(balance.title)).toBeNull();expect(screen.queryByText(balance.update)).toBeNull();expect(projectRequest).toHaveBeenCalledExactlyOnceWith("view","private-project-capability");expect(paymentRequest).not.toHaveBeenCalled();
});
it.each([{...balance,balanceStatus:"pending"},{...balance,needsReview:true},{...balance,balancePaid:0}])("does not infer paid balance just from a zero remaining amount",async summary=>{
 window.location.hash="private-project-capability";vi.mocked(projectRequest).mockResolvedValue(summary);show("/payment-thank-you?kind=balance");await screen.findByText("Your payment is still being checked");expect(screen.queryByText("Verified paid")).toBeNull();
});
it("requires the complete private balance capability",async()=>{show("/payment-thank-you?kind=balance");await screen.findByRole("alert");expect(projectRequest).not.toHaveBeenCalled();});
it("ignores a stale paid response after leaving the confirmation page",async()=>{
 let finish!:(value:{status:"paid"})=>void;vi.mocked(paymentRequest).mockReturnValue(new Promise(resolve=>{finish=resolve;}));const view=show();view.unmount();await act(async()=>finish({status:"paid"}));expect(screen.queryByText("Verified paid")).toBeNull();
});
it("is private, uncacheable, noindex and excluded from promotional controls",()=>{expect(headers()).toEqual({"Cache-Control":"no-store","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow"});expect(meta()).toContainEqual({name:"robots",content:expect.stringContaining("noindex")});expect(suppressPromotions("/payment-thank-you")).toBe(true);expect(suppressPromotions("/payment-thank-you/")).toBe(true);});
