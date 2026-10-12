// @vitest-environment node
import {beforeEach,it,expect,vi} from "vitest";
const ops=vi.hoisted(()=>({paid:vi.fn(),acknowledgePaid:vi.fn(),acknowledgeDispute:vi.fn(),investigations:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-operations.ts",()=>({operationsStore:()=>ops}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>({})}));
import {adminPayments} from "../../supabase/functions/_shared/admin-payments";
const env={PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}},admin={id:"00000000-0000-4000-8000-000000000001",email:"owner@example.test"};
const req=(body:unknown)=>new Request("https://example.test",{method:"POST",body:JSON.stringify(body)});
beforeEach(()=>vi.resetAllMocks());
it("reads paid and investigation pages and accepts only acknowledgement metadata",async()=>{
 ops.paid.mockResolvedValue({orders:[],nextOffset:null});ops.investigations.mockResolvedValue({items:[],nextOffset:null});
 expect((await adminPayments(req({offset:50}),env,"paid",admin)).status).toBe(200);expect(ops.paid).toHaveBeenCalledWith(50);
 expect((await adminPayments(req({}),env,"investigations",admin)).status).toBe(200);
 expect((await adminPayments(req({kind:"paid",id:admin.id,acknowledged:true}),env,"acknowledge",admin)).status).toBe(200);expect(ops.acknowledgePaid).toHaveBeenCalledWith(admin.id,true,admin.id);
 expect((await adminPayments(req({kind:"dispute",eventId:"evt_lost"}),env,"acknowledge",admin)).status).toBe(200);expect(ops.acknowledgeDispute).toHaveBeenCalledWith("evt_lost",admin.id);
});
it("rejects manual status, amount and actor overrides and missing admin identity",async()=>{
 for(const extra of [{status:"paid"},{amount:1},{acknowledged_by:"attacker"}])expect((await adminPayments(req({kind:"paid",id:admin.id,acknowledged:true,...extra}),env,"acknowledge",admin)).status).toBe(400);
 expect((await adminPayments(req({}),env,"paid",{id:"",email:""})).status).toBe(401);expect(ops.paid).not.toHaveBeenCalled();expect(ops.acknowledgePaid).not.toHaveBeenCalled();
});
