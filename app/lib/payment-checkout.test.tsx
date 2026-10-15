import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import Pay from "@/pages/Pay";
import { paymentRequest, restorePayment, restoreSharedPayment, savePayment, loadRazorpay } from "./razorpay-client";
import type { PaymentSession } from "./payments";
import { PAYMENT_PACKAGES } from "./razorpay.server";
const {navigate}=vi.hoisted(()=>({navigate:vi.fn()}));
vi.mock("react-router",async original=>({...await original<typeof import("react-router")>(),useNavigate:()=>navigate}));

vi.mock("./razorpay-client", () => ({ paymentRequest: vi.fn(), restorePayment: vi.fn(), restoreSharedPayment:vi.fn(), savePayment: vi.fn(), loadRazorpay: vi.fn() }));
const session: PaymentSession = { token: "signed-test-token", orderId: "order_example", package: "starter" };
const checkout = { ...session, keyId: "rzp_test_example", amount: 500000, testMode: true };
function show(enabled = true, selected = "starter",extra={}) {
  const data={enabled,testMode:true,packages:PAYMENT_PACKAGES,...extra};
  return render(<RouterProvider router={createMemoryRouter([{ id: "pay", path: "/pay", loader: () => data, element: <Pay /> }], { initialEntries: [`/pay?package=${selected}`], hydrationData: { loaderData: { pay: data } } })} />);
}
async function fillAndSubmit(brief="A landing page with our services, enquiry form and contact details.") {
  for (const [label, value] of [["Full name", "Test Client"], ["Business or project name", "Test Business"], ["Email address", "test@example.com"], ["Mobile number", "9876543210"]])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.change(screen.getByLabelText("What should your website include?"),{target:{value:brief}});
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: /Pay.*advance/ }));
}
beforeEach(() => {
  vi.clearAllMocks(); vi.mocked(restorePayment).mockReturnValue(null);vi.mocked(restoreSharedPayment).mockReturnValue(null); vi.mocked(loadRazorpay).mockResolvedValue();
  window.Razorpay = class {
    constructor(private options: ConstructorParameters<NonNullable<typeof window.Razorpay>>[0]) {}
    open() { this.options.handler({ razorpay_order_id: session.orderId, razorpay_payment_id: "pay_example", razorpay_signature: "test-signature" }); }
    on() {}
  };
});
afterEach(() => { cleanup(); delete window.Razorpay; });

describe("package checkout", () => {
  it.each([['starter','₹5,000.00'],['business','₹7,500.00']])("shows the enabled %s advance and refuses incomplete details", async (selected, amount) => {
    show(true, selected);
    const button = await screen.findByRole('button', {name:`Pay ${amount} advance`});
    expect(screen.getByLabelText('Full name')).toBeTruthy();
    fireEvent.click(button);
    await screen.findByText('Enter your full name');
    expect(paymentRequest).not.toHaveBeenCalled();
    expect(loadRazorpay).not.toHaveBeenCalled();
  });
  it.each(['starter','business'])("keeps the disabled %s form and payment loader absent", async selected => {
    show(false, selected);
    await screen.findByText('Online payments are coming soon');
    expect(screen.queryByRole('button', {name:/Pay.*advance/})).toBeNull();
    expect(screen.queryByLabelText('Full name')).toBeNull();
    expect(paymentRequest).not.toHaveBeenCalled();
    expect(loadRazorpay).not.toHaveBeenCalled();
  });
  it("requests a backend-verified retry without opening checkout automatically", async () => {
    vi.mocked(restorePayment).mockReturnValue(session);
    vi.mocked(paymentRequest).mockResolvedValueOnce({status:"pending"}).mockResolvedValueOnce({...session,orderId:"order_fresh"});
    show();const button=await screen.findByRole("button",{name:"Check eligibility for a fresh checkout"});
    await waitFor(()=>expect(button.hasAttribute("disabled")).toBe(false));fireEvent.click(button);
    await waitFor(()=>expect(savePayment).toHaveBeenCalledWith(expect.objectContaining({orderId:"order_fresh"})));
    expect(paymentRequest).toHaveBeenLastCalledWith("retry",{token:session.token,orderId:session.orderId});
    expect(loadRazorpay).not.toHaveBeenCalled();
  });
  it("shows the KYC-ready unavailable state without a payment form", async () => {
    show(false);
    expect(await screen.findByText("Online payments are coming soon")).toBeTruthy();
    expect(screen.queryByLabelText("Full name")).toBeNull(); expect(paymentRequest).not.toHaveBeenCalled();
  });
  it("saves the order session and displays success only after server verification", async () => {
    vi.mocked(paymentRequest).mockResolvedValueOnce(session).mockResolvedValueOnce({ status: "pending", checkout }).mockResolvedValueOnce({ status: "paid", paymentId: "pay_example" });
    show(); await screen.findByLabelText("Full name"); await fillAndSubmit();
    expect(await screen.findByText("Test payment verified")).toBeTruthy();
    expect(savePayment).toHaveBeenCalledWith(session);
    expect(paymentRequest).toHaveBeenNthCalledWith(3, "verify", expect.objectContaining({ token: session.token, razorpay_payment_id: "pay_example" }));
    expect(navigate).toHaveBeenCalledWith(`/payment-thank-you?package=starter#resume=${encodeURIComponent(session.token)}`,{replace:true});
    expect(screen.queryByRole("button", { name: /Continue checkout/ })).toBeNull();
  });
  it("reopens the same recovered order after the checkout tab was closed without paying",async()=>{
    const opened:string[]=[];
    window.Razorpay=class {constructor(private options:ConstructorParameters<NonNullable<typeof window.Razorpay>>[0]){}open(){opened.push(this.options.order_id);this.options.modal.ondismiss();}on(){}};
    vi.mocked(paymentRequest).mockResolvedValueOnce(session).mockResolvedValueOnce({status:"pending",checkout});
    show();await screen.findByLabelText("Full name");await fillAndSubmit();await screen.findByText(/Checkout closed/);cleanup();
    // A fresh tab has no stored session. The server returns the earlier order.
    vi.mocked(restorePayment).mockReturnValue(null);vi.mocked(paymentRequest).mockResolvedValueOnce(session).mockResolvedValueOnce({status:"pending",checkout});
    show();await screen.findByLabelText("Full name");await fillAndSubmit();await screen.findByText(/Checkout closed/);
    expect(opened).toEqual([session.orderId,session.orderId]);expect(paymentRequest).not.toHaveBeenCalledWith("retry",expect.anything());expect(screen.queryByText("Test payment verified")).toBeNull();
  });
  it("recovers paid orders on refresh without creating another order", async () => {
    vi.mocked(restorePayment).mockReturnValue(session);
    vi.mocked(paymentRequest).mockResolvedValueOnce({ status: "paid", paymentId: "pay_recovered" });
    show(); expect(await screen.findByText("Test payment verified")).toBeTruthy();
    expect(paymentRequest).toHaveBeenCalledTimes(1); expect(paymentRequest).toHaveBeenCalledWith("status", { token: session.token });
    expect(navigate).toHaveBeenCalledWith(expect.stringContaining("/payment-thank-you?package=starter#resume="),{replace:true});
  });
  it("checks an owner-shared original checkout link before offering continuation",async()=>{
    window.history.replaceState(null,"","/pay?package=starter#resume=fixture&section=checkout");
    vi.mocked(restoreSharedPayment).mockReturnValue(session);vi.mocked(paymentRequest).mockResolvedValueOnce({status:"pending"});show();
    expect(await screen.findByRole("button",{name:"Continue checkout"})).toBeTruthy();expect(paymentRequest).toHaveBeenCalledWith("status",{token:session.token});expect(paymentRequest).toHaveBeenCalledTimes(1);expect(loadRazorpay).not.toHaveBeenCalled();expect(savePayment).toHaveBeenCalledWith(session);
    expect(window.location.hash).toBe("#section=checkout");
    window.history.replaceState(null,"","/");
  });
  it("collects the project brief, timeline and existing URL along with the reviewed pricing version",async()=>{
    const version="00000000-0000-4000-8000-000000000001";
    vi.mocked(paymentRequest).mockResolvedValueOnce(session).mockResolvedValueOnce({status:"pending"});
    show(true,"starter",{pricingVersion:version});await screen.findByLabelText("Full name");
    fireEvent.change(screen.getByLabelText("Preferred timeline"),{target:{value:"Within 2–4 weeks"}});
    fireEvent.change(screen.getByLabelText("Existing website (optional)"),{target:{value:"https://example.test"}});
    await fillAndSubmit();await waitFor(()=>expect(paymentRequest).toHaveBeenCalledWith("order",expect.objectContaining({requirements:"A landing page with our services, enquiry form and contact details.",timeline:"Within 2–4 weeks",website_url:"https://example.test",pricingVersion:version})));
  });
  it("requires a meaningful project brief before starting checkout",async()=>{
    show();await screen.findByLabelText("Full name");await fillAndSubmit("short");
    expect(await screen.findByText("Describe your project in at least 20 characters")).toBeTruthy();expect(paymentRequest).not.toHaveBeenCalled();expect(loadRazorpay).not.toHaveBeenCalled();
  });
  it("blocks checkout and fabricated prices when the catalog is unavailable",async()=>{
    show(true,"starter",{pricingAvailable:false});expect(await screen.findByRole("alert")).toBeTruthy();expect(screen.queryByLabelText("Full name")).toBeNull();expect(screen.queryByText("₹5,000.00")).toBeNull();expect(paymentRequest).not.toHaveBeenCalled();
  });
  it("does not label an older saved order with a newly edited advance",async()=>{
    vi.mocked(restorePayment).mockReturnValue(session);vi.mocked(paymentRequest).mockResolvedValue({status:"pending"});
    show(true,"starter",{packages:{...PAYMENT_PACKAGES,starter:{...PAYMENT_PACKAGES.starter,advance:420025}}});
    expect(await screen.findByText(/Your saved Starter order keeps its original advance/)).toBeTruthy();expect(screen.queryByText("₹4,200.25")).toBeNull();expect(paymentRequest).toHaveBeenCalledWith("status",{token:session.token});
  });
  it("keeps uncertain payment recoverable without claiming success", async () => {
    vi.mocked(paymentRequest).mockResolvedValueOnce(session).mockResolvedValueOnce({ status: "pending", checkout }).mockRejectedValueOnce(new Error("offline"));
    show(); await screen.findByLabelText("Full name"); await fillAndSubmit();
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("couldn't confirm"));
    expect(screen.queryByText("Test payment verified")).toBeNull();
    expect(screen.getByRole("button", { name: "Check payment status" })).toBeTruthy();
    expect(paymentRequest).toHaveBeenCalledTimes(3);
    expect(navigate).not.toHaveBeenCalled();
  });
});
