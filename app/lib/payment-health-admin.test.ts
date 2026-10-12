// @vitest-environment node
import {beforeEach,it,expect,vi} from "vitest";
const store=vi.hoisted(()=>({health:vi.fn(),queue:vi.fn()}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>store}));
import {adminPayments} from "../../supabase/functions/_shared/admin-payments";
const env={PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}};
const admin={id:"owner",email:"owner@example.com"};
const req=(body:unknown)=>new Request("https://example.test",{method:"POST",body:JSON.stringify(body)});
beforeEach(()=>vi.clearAllMocks());
it("returns only the health projection through the existing queue operation",async()=>{
 store.health.mockResolvedValue({needsReconciliation:1});
 expect(await(await adminPayments(req({summaryOnly:true}),env,"queue",admin)).json()).toEqual({needsReconciliation:1});
 expect(store.health).toHaveBeenCalledTimes(1);expect(store.queue).not.toHaveBeenCalled();
});
it("denies missing identity and rejects mutation fields before querying alerts",async()=>{
 expect((await adminPayments(req({summaryOnly:true}),env,"queue",{id:"",email:""})).status).toBe(401);
 expect((await adminPayments(req({summaryOnly:true,status:"paid"}),env,"queue",admin)).status).toBe(400);
 expect(store.health).not.toHaveBeenCalled();
});
