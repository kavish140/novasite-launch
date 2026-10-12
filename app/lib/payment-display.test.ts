import {it,expect} from "vitest";
import {checkoutState,paymentCheckSource,paymentDate} from "./payment-display";
it("shows the screenshot's automatic check at 21:20 IST separately from the actual 14:38 checkout creation",()=>{
 expect(paymentDate("2026-10-12T15:50:02Z")).toBe("12 Oct 2026, 21:20:02 IST");
 expect(paymentDate("2026-10-12T09:08:35Z")).toBe("12 Oct 2026, 14:38:35 IST");
 expect(paymentDate(null)).toBe("Not recorded");expect(paymentDate("bad")).toBe("Not recorded");
});
it("labels checks by source and never calls a check a payment",()=>{
 expect(paymentCheckSource("cron")).toBe("Automatic status check");expect(paymentCheckSource("admin")).toBe("Admin re-check");expect(paymentCheckSource("retry")).toBe("Retry eligibility check");expect(paymentCheckSource(null)).toBe("Status check");
});
it("distinguishes freshly unattempted, uncertain, failed, expired, paid and not-yet-checked orders",()=>{
 const order={status:"pending",reconciliation_state:"pending",last_checked_at:"2026-10-12T15:50:02Z"};
 expect(checkoutState(order)).toBe("Unpaid checkout — no attempt at last check");expect(checkoutState({...order,last_checked_at:null})).toBe("Not yet verified");
 expect(checkoutState({...order,reconciliation_state:"needs_reconciliation"})).toContain("uncertain");expect(checkoutState({...order,reconciliation_state:"failed"})).toContain("provider confirmed");expect(checkoutState({...order,reconciliation_state:"expired"})).toContain("provider confirmed");expect(checkoutState({...order,status:"paid"})).toBe("Paid — verified");expect(checkoutState({...order,status:"refunded"})).toBe("Refund recorded");
});
