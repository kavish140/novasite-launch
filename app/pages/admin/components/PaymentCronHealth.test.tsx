import {it,expect,afterEach} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import PaymentCronHealth from "./PaymentCronHealth";
import {nextReconciliationAt} from "@/lib/payment-health";
afterEach(cleanup);
const now=Date.parse("2026-10-11T10:07:00Z");
it("shows the successful scheduled completion and the next wall-clock cron run in IST",()=>{
 render(<PaymentCronHealth health={{observedAt:new Date(now).toISOString(),lastCompletedAt:"2026-10-11T10:00:02Z",lastSuccessfulAt:"2026-10-11T10:00:02Z",latestRunFailed:false,needsReconciliation:0,overdue:0,refunded:0,disputes:[]}} now={now}/>);
 expect(screen.getByText(/Last successful reconciliation run:/).textContent).toContain("15:30:02 IST");
 expect(screen.getByText(/Next expected run:/).textContent).toContain("15:40:00 IST");
 expect(nextReconciliationAt(now)).toBe("2026-10-11T10:10:00.000Z");
 expect(nextReconciliationAt(Date.parse("2026-10-11T10:10:00Z"))).toBe("2026-10-11T10:20:00.000Z");
});
it("never claims scheduler health is verified without data",()=>{
 render(<PaymentCronHealth health={null} now={now}/>);
 expect(screen.getByText(/Last successful reconciliation run:/).textContent).toContain("Unverified");
 expect(screen.getByText(/Next expected run:/).textContent).toContain("Unverified");
});
