// @vitest-environment node
import {createHmac} from "node:crypto";
import {beforeEach,it,expect,vi} from "vitest";
const store=vi.hoisted(()=>({hasEvent:vi.fn(),recordDispute:vi.fn(),completeWebhook:vi.fn(),settle:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>store}));
import {paymentWebhook} from "../../supabase/functions/_shared/razorpay";
import {openDisputes,lostDisputes,type DisputeEvent} from "../../supabase/functions/_shared/payment-health";
const env={SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake",RAZORPAY_KEY_ID:"rzp_test_fake",RAZORPAY_KEY_SECRET:"fake",RAZORPAY_WEBHOOK_SECRET:"fake-signing-secret"};
const event={event:"payment.dispute.created",created_at:1791712800,payload:{payment:{entity:{id:"pay_1",order_id:"order_1",status:"captured"}},dispute:{entity:{id:"disp_1",payment_id:"pay_1",amount:100,currency:"INR",status:"open",respond_by:1791799200}}}};
function req(body:unknown=event,bad=false){const raw=JSON.stringify(body);return new Request("https://example.test/webhook",{method:"POST",body:raw,headers:{"x-razorpay-event-id":"evt_1","x-razorpay-signature":bad?"bad":createHmac("sha256",env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest("hex")}});}
beforeEach(()=>{vi.clearAllMocks();store.hasEvent.mockResolvedValue(false);store.recordDispute.mockResolvedValue(true);});
it("records amount in paise, references and deadline without touching settlement or provider",async()=>{
 const fetch=vi.spyOn(globalThis,"fetch");
 expect((await paymentWebhook(req(),{env})).status).toBe(200);
 expect(store.recordDispute).toHaveBeenCalledWith("evt_1",event.event,expect.objectContaining({amount:100,paymentId:"pay_1",orderId:"order_1",status:"open",responseDueAt:new Date(1791799200000).toISOString()}));
 expect(store.completeWebhook).not.toHaveBeenCalled();expect(store.settle).not.toHaveBeenCalled();expect(fetch).not.toHaveBeenCalled();fetch.mockRestore();
});
it("deduplicates both replay and concurrent insert conflicts",async()=>{
 store.hasEvent.mockResolvedValueOnce(true);
 expect(await(await paymentWebhook(req(),{env})).json()).toEqual({received:true,alreadyProcessed:true});
 expect(store.recordDispute).not.toHaveBeenCalled();
 store.recordDispute.mockResolvedValueOnce(false);
 expect(await(await paymentWebhook(req(),{env})).json()).toEqual({received:true,alreadyProcessed:true});
});
it("records a dispute for an unknown payment with an unknown event name and returns 200",async()=>{
 const body={...event,event:"payment.dispute.future_event",payload:{dispute:{entity:{id:"disp_unknown",payment_id:"pay_unknown",status:"future_status",amount:100}}}};
 expect((await paymentWebhook(req(body),{env})).status).toBe(200);
 expect(store.recordDispute).toHaveBeenCalledWith("evt_1",body.event,expect.objectContaining({paymentId:"pay_unknown",orderId:null,status:"future_status"}));
});
it("rejects a bad signature before any storage query",async()=>{
 expect((await paymentWebhook(req(event,true),{env})).status).toBe(403);
 expect(store.hasEvent).not.toHaveBeenCalled();expect(store.recordDispute).not.toHaveBeenCalled();
});
it("uses provider event time and clears closed disputes, even with out-of-order delivery",()=>{
 const row=(status:string,occurredAt:string):DisputeEvent=>({event_id:status,processed_at:"2026-10-11T13:00:00Z",dispute:{id:"disp_1",event:"payment.dispute.created",status,amount:100,currency:"INR",paymentId:"pay_1",orderId:"order_1",responseDueAt:null,occurredAt}});
 expect(openDisputes([row("closed","2026-10-11T12:00:00Z"),row("open","2026-10-11T11:00:00Z")])).toEqual([]);
 expect(openDisputes([row("future_status","2026-10-11T12:00:00Z")])).toHaveLength(1);
});
it("keeps a lost dispute alert after closed until its loss event is acknowledged",()=>{
 const row=(status:string,time:string):DisputeEvent=>({event_id:`evt_${status}`,processed_at:time,dispute:{id:"disp_1",event:`payment.dispute.${status}`,status,amount:100,currency:"INR",paymentId:"pay_1",orderId:"order_1",responseDueAt:null,occurredAt:time}});
 const rows=[row("lost","2026-10-11T11:00:00Z"),row("closed","2026-10-11T12:00:00Z")];
 expect(openDisputes(rows)).toEqual([]);expect(lostDisputes(rows,new Set())).toHaveLength(1);
 expect(lostDisputes(rows,new Set(["disp_1"]))).toEqual([]);
 expect(lostDisputes([...rows,{...rows[0],event_id:"sync_lost",processed_at:"2026-10-11T14:00:00Z"}],new Set(["disp_1"]))).toEqual([]);
 expect(lostDisputes([row("won","2026-10-11T12:00:00Z")],new Set())).toEqual([]);
});
