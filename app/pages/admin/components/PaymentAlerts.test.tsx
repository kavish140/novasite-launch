import {afterEach,describe,it,expect} from "vitest";
import {render,screen,cleanup} from "@testing-library/react";
import PaymentAlerts from "./PaymentAlerts";
import {staleCron,type PaymentHealth} from "@/lib/payment-health";
const now=Date.parse("2026-10-11T10:00:00Z");
const healthy:PaymentHealth={observedAt:new Date(now).toISOString(),lastCompletedAt:new Date(now).toISOString(),lastSuccessfulAt:new Date(now).toISOString(),latestRunFailed:false,needsReconciliation:0,overdue:0,refunded:0,disputes:[]};
afterEach(cleanup);
describe("dashboard payment alerts",()=>{
 it.each([
  [{unacknowledgedPaid:2},"paid order(s) awaiting acknowledgement"],
  [{investigations:1},"payment record(s) need investigation"],
  [{lostDisputes:[{eventId:"evt_lost",id:"disp_lost",event:"payment.dispute.lost",status:"lost",paymentId:"pay_1",orderId:"order_1",amount:100,currency:"INR",responseDueAt:null,occurredAt:null}]},"lost dispute(s) awaiting acknowledgement"],
  [{latestRunFailed:true},"The latest reconciliation run failed."],
  [{lastCompletedAt:new Date(now-30*60000-1).toISOString()},"scheduler may be stopped"],
  [{overdue:1},"unresolved for over 24 hours"],
  [{needsReconciliation:1},"need reconciliation"],
  [{refunded:1},"refunded, including partial refunds"],
  [{disputes:[{id:"disp_1",event:"payment.dispute.created",status:"open",amount:100,currency:"INR",paymentId:"pay_1",orderId:"order_1",responseDueAt:"2026-10-12T10:00:00Z",occurredAt:healthy.observedAt}]},"Earliest response due"],
 ] as [Partial<PaymentHealth>,string][])("appears and clears for %j",(change,message)=>{
  const view=render(<PaymentAlerts health={{...healthy,...change}} isAdmin error={false} now={now} onOpen={()=>{}}/>);
  expect(screen.getByRole("alert").textContent).toContain(message);
  view.rerender(<PaymentAlerts health={healthy} isAdmin error={false} now={now} onOpen={()=>{}}/>);
  expect(screen.queryByRole("alert")).toBeNull();
 });
 it("uses the strict 30-minute boundary and treats missing runs as stale",()=>{
  expect(staleCron({...healthy,lastCompletedAt:new Date(now-30*60000).toISOString()},now)).toBe(false);
  expect(staleCron({...healthy,lastCompletedAt:new Date(now-30*60000-1).toISOString()},now)).toBe(true);
  expect(staleCron({...healthy,lastCompletedAt:null},now)).toBe(true);
 });
 it("never renders payment data for a non-admin",()=>{
  render(<PaymentAlerts health={{...healthy,refunded:2}} isAdmin={false} error now={now} onOpen={()=>{}}/>);
  expect(screen.queryByRole("alert")).toBeNull();
 });
 it("shows monitoring as unverified when the admin summary cannot be loaded",()=>{
  render(<PaymentAlerts health={null} isAdmin error now={now} onOpen={()=>{}}/>);
  expect(screen.getByRole("alert").textContent).toContain("monitoring is unverified");
 });
});
