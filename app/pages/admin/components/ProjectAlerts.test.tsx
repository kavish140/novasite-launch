import {it,expect} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import PaymentAlerts from "./PaymentAlerts";
import {paymentAlertCount} from "@/lib/payment-health";
it("shows project balance review/acknowledgement alerts only for admins and clears after resolution",()=>{
 const now=Date.now(),health={observedAt:new Date(now).toISOString(),lastCompletedAt:new Date(now).toISOString(),lastSuccessfulAt:new Date(now).toISOString(),latestRunFailed:false,needsReconciliation:0,overdue:0,refunded:0,disputes:[],projectReview:2};
 const view=render(<PaymentAlerts health={health} isAdmin={false} error={false} now={now} onOpen={()=>{}}/>);expect(screen.queryByRole("alert")).toBeNull();view.rerender(<PaymentAlerts health={health} isAdmin error={false} now={now} onOpen={()=>{}}/>);expect(screen.getByText(/2 project balance/)).toBeTruthy();expect(paymentAlertCount(health,now)).toBe(2);view.rerender(<PaymentAlerts health={{...health,projectReview:0}} isAdmin error={false} now={now} onOpen={()=>{}}/>);expect(screen.queryByRole("alert")).toBeNull();cleanup();
});
