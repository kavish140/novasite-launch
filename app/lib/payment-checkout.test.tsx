import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import Pay from "@/pages/Pay";
import { paymentRequest, restorePayment, savePayment, loadRazorpay } from "./razorpay-client";
import type { PaymentSession } from "./payments";
import { PAYMENT_PACKAGES } from "./razorpay.server";

vi.mock("./razorpay-client", () => ({ paymentRequest: vi.fn(), restorePayment: vi.fn(), savePayment: vi.fn(), loadRazorpay: vi.fn() }));
const session: PaymentSession = { token: "signed-test-token", orderId: "order_example", package: "starter" };
const checkout = { ...session, keyId: "rzp_test_example", amount: 500000, testMode: true };
function show(enabled = true) {
  return render(<RouterProvider router={createMemoryRouter([{ id: "pay", path: "/pay", loader: () => ({ enabled, testMode: true, packages: PAYMENT_PACKAGES }), element: <Pay /> }], { initialEntries: ["/pay?package=starter"], hydrationData: { loaderData: { pay: { enabled, testMode: true, packages: PAYMENT_PACKAGES } } } })} />);
}
async function fillAndSubmit() {
  for (const [label, value] of [["Full name", "Test Client"], ["Business or project name", "Test Business"], ["Email address", "test@example.com"], ["Mobile number", "9876543210"]])
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole("checkbox"));
  fireEvent.click(screen.getByRole("button", { name: /Pay.*advance/ }));
}
beforeEach(() => {
  vi.clearAllMocks(); vi.mocked(restorePayment).mockReturnValue(null); vi.mocked(loadRazorpay).mockResolvedValue();
  window.Razorpay = class {
    constructor(private options: ConstructorParameters<NonNullable<typeof window.Razorpay>>[0]) {}
    open() { this.options.handler({ razorpay_order_id: session.orderId, razorpay_payment_id: "pay_example", razorpay_signature: "test-signature" }); }
    on() {}
  };
});
afterEach(() => { cleanup(); delete window.Razorpay; });

describe("package checkout", () => {
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
    expect(screen.queryByRole("button", { name: /Continue checkout/ })).toBeNull();
  });
  it("recovers paid orders on refresh without creating another order", async () => {
    vi.mocked(restorePayment).mockReturnValue(session);
    vi.mocked(paymentRequest).mockResolvedValueOnce({ status: "paid", paymentId: "pay_recovered" });
    show(); expect(await screen.findByText("Test payment verified")).toBeTruthy();
    expect(paymentRequest).toHaveBeenCalledTimes(1); expect(paymentRequest).toHaveBeenCalledWith("status", { token: session.token });
  });
  it("keeps uncertain payment recoverable without claiming success", async () => {
    vi.mocked(paymentRequest).mockResolvedValueOnce(session).mockResolvedValueOnce({ status: "pending", checkout }).mockRejectedValueOnce(new Error("offline"));
    show(); await screen.findByLabelText("Full name"); await fillAndSubmit();
    await waitFor(() => expect(screen.getByRole("alert").textContent).toContain("couldn't confirm"));
    expect(screen.queryByText("Test payment verified")).toBeNull();
    expect(screen.getByRole("button", { name: "Check payment status" })).toBeTruthy();
    expect(paymentRequest).toHaveBeenCalledTimes(3);
  });
});
