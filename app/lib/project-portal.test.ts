// @vitest-environment node
import {beforeEach,afterEach,it,expect,vi} from "vitest";
const mocks=vi.hoisted(()=>({project:vi.fn(),list:vi.fn(),balance:vi.fn(),balances:vi.fn(),byOrder:vi.fn(),byPayment:vi.fn(),reserve:vi.fn(),authorize:vi.fn(),acknowledge:vi.fn(),attach:vi.fn(),record:vi.fn(),recordDispute:vi.fn(),save:vi.fn(),history:vi.fn(),due:vi.fn(),checkpoint:vi.fn(),byRequest:vi.fn(),advanceCheck:vi.fn(),hasEvent:vi.fn()}));
vi.mock("../../supabase/functions/_shared/project-store.ts",async original=>({...await original<typeof import("../../supabase/functions/_shared/project-store.ts")>(),projectStore:()=>mocks}));
vi.mock("../../supabase/functions/_shared/payment-store.ts",()=>({paymentStore:()=>mocks}));
vi.mock("../../supabase/functions/_shared/razorpay.ts",async importOriginal=>({...await importOriginal<typeof import("../../supabase/functions/_shared/razorpay.ts")>(),fetchStoredPaymentStatus:mocks.advanceCheck}));
import {projectToken,projectCustomer,projectAdmin,checkBalance,projectWebhook,recoverProjectBalances} from "../../supabase/functions/_shared/project-portal";
import {handleWebhookEdge} from "../../supabase/functions/_shared/edge-handler";
import {ProjectStoreError} from "../../supabase/functions/_shared/project-store";
const env={PROJECT_PORTAL_ENABLED:"true",RAZORPAY_ENABLED:"true",PAYMENT_RECEIPT_SECRET:"test-project-signing-secret-over-32-chars",RAZORPAY_KEY_ID:"rzp_test_example",RAZORPAY_KEY_SECRET:"fake-api-secret",RAZORPAY_WEBHOOK_SECRET:"fake-webhook",SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake-service",PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}};
const project={id:"00000000-0000-4000-8000-000000000001",advance_request:"00000000-0000-4000-8000-000000000002",share_id:"00000000-0000-4000-8000-000000000003",link_enabled:true,title:"Client website",stage:"design",customer_update:"Design ready for review",total_amount:1000000,balance_enabled:true,updated_at:new Date().toISOString()};
const balance={id:"00000000-0000-4000-8000-000000000004",project_id:project.id,amount:500000,key_id:env.RAZORPAY_KEY_ID,order_id:"order_balance",payment_id:null,status:"pending",refunded_amount:0,created_at:new Date().toISOString(),paid_at:null};
let fetcher=vi.fn<(url:string,options:RequestInit)=>Promise<Response>>();
function provider(items:unknown[]=[],amount=500000,currency="INR"){fetcher.mockImplementation(async(url:string)=>Response.json(url.endsWith("/payments")?{items}:{id:"order_balance",amount,currency,status:items.length?"paid":"created",notes:{project_balance:balance.id}}));}
async function req(extra:Record<string,unknown>={}){return new Request("https://example.test",{method:"POST",headers:{"x-payment-origin":"http://localhost:8788"},body:JSON.stringify({token:await projectToken(project,env.PAYMENT_RECEIPT_SECRET),...extra})});}
beforeEach(()=>{vi.resetAllMocks();fetcher=vi.fn<(url:string,options:RequestInit)=>Promise<Response>>();vi.stubGlobal("fetch",fetcher);mocks.project.mockResolvedValue(project);mocks.balance.mockResolvedValue(null);mocks.balances.mockImplementation(async()=>{const item=await mocks.balance();return item?[item]:[];});mocks.byOrder.mockResolvedValue(balance);mocks.byRequest.mockResolvedValue({request_id:project.advance_request,status:"paid",amount:500000,refunded_amount:0,customer:{email:"private@example.test"}});mocks.advanceCheck.mockResolvedValue({status:"paid"});mocks.reserve.mockResolvedValue({created:false,record:balance});mocks.authorize.mockResolvedValue(true);mocks.checkpoint.mockResolvedValue(new Date().toISOString());mocks.record.mockResolvedValue(true);mocks.hasEvent.mockResolvedValue(false);});
afterEach(()=>vi.unstubAllGlobals());
it("returns only a project's summary from its signed link without exposing contact data or other project records",async()=>{const response=await projectCustomer(await req(),env,"view");expect(response.status).toBe(200);expect(await response.json()).toMatchObject({title:project.title,advancePaid:500000,remaining:500000,canPay:true});expect(mocks.project).toHaveBeenCalledWith(project.id);expect(fetcher).not.toHaveBeenCalled();});
it("rejects unsigned, tampered, rotated and disabled private links before any provider request",async()=>{
 for(const token of [project.id,`${project.id}.${project.share_id}.${"0".repeat(64)}`])expect((await projectCustomer(await req({token}),env,"view")).status).toBe(403);
 mocks.project.mockResolvedValueOnce({...project,share_id:"different"}).mockResolvedValueOnce({...project,link_enabled:false});for(let i=0;i<2;i++)expect((await projectCustomer(await req(),env,"view")).status).toBe(403);expect(fetcher).not.toHaveBeenCalled();
});
it("keeps reads working with public collection off and refuses balance creation without any provider calls",async()=>{const disabled={...env,RAZORPAY_ENABLED:"false"};expect((await projectCustomer(await req(),disabled,"view")).status).toBe(200);expect((await projectCustomer(await req(),disabled,"checkout")).status).toBe(503);expect(mocks.reserve).not.toHaveBeenCalled();expect(fetcher).not.toHaveBeenCalled();});
it("rejects browser price/status overrides and applies rate limits before private lookup",async()=>{expect((await projectCustomer(await req({amount:1,status:"paid"}),env,"checkout")).status).toBe(400);expect(mocks.reserve).not.toHaveBeenCalled();const limited={...env,PAYMENT_RATE_LIMITER:{limit:async()=>({success:false})}};mocks.project.mockClear();expect((await projectCustomer(await req(),limited,"view")).status).toBe(429);expect(mocks.project).not.toHaveBeenCalled();});
it("blocks live checkout outside sitenova and blocks a freshly refunded advance",async()=>{
 expect((await projectCustomer(await req(),{...env,RAZORPAY_KEY_ID:"rzp_live_example"},"checkout")).status).toBe(403);
 mocks.advanceCheck.mockResolvedValue({status:"refunded"});expect((await projectCustomer(await req(),env,"checkout")).status).toBe(409);expect(mocks.reserve).not.toHaveBeenCalled();
});
it("creates exactly the database-priced order and resumes it without another POST after dismissal",async()=>{
 mocks.reserve.mockResolvedValueOnce({created:true,record:{...balance,order_id:null,status:"reserved"}});provider();
 expect((await projectCustomer(await req(),env,"checkout")).status).toBe(200);expect((await projectCustomer(await req(),env,"checkout")).status).toBe(200);
 const creates=fetcher.mock.calls.filter(([,options])=>(options as RequestInit)?.method==="POST");expect(creates).toHaveLength(1);expect(JSON.parse((creates[0][1] as RequestInit).body as string)).toEqual({amount:500000,currency:"INR",receipt:balance.id,partial_payment:false,notes:{project_balance:balance.id}});expect(mocks.attach).toHaveBeenCalledWith(balance.id,"order_balance");
});
it("never replaces an unattached or attempted balance order and never treats browser failures as proof",async()=>{
 mocks.reserve.mockResolvedValueOnce({created:false,record:{...balance,order_id:null}});expect((await projectCustomer(await req(),env,"checkout")).status).toBe(409);
 provider([{id:"pay_failed",order_id:balance.order_id,amount:500000,currency:"INR",status:"failed"}]);expect((await projectCustomer(await req(),env,"checkout")).status).toBe(409);
 expect(fetcher.mock.calls.every(([,options])=>(options as RequestInit).method==="GET")).toBe(true);
});
it("validates paise, INR, provider identity and every returned payment before settlement",async()=>{
 for(const [amount,currency] of [[5000,"INR"],[500000,"USD"]] as const){provider([],amount,currency);await expect(checkBalance(env,balance,"cron")).rejects.toThrow();}
 provider([{id:"pay_wrong",order_id:"order_other",amount:500000,currency:"INR",status:"captured"}]);await expect(checkBalance(env,balance,"cron")).rejects.toThrow();expect(mocks.record).not.toHaveBeenCalled();
});
it("only confirms captured payments, records partial refunds separately and never edits project progress",async()=>{
 provider([{id:"pay_1",order_id:balance.order_id,amount:500000,currency:"INR",status:"authorized"}]);expect((await checkBalance(env,balance,"customer")).state).toBe("needs_reconciliation");
 provider([{id:"pay_1",order_id:balance.order_id,amount:500000,currency:"INR",status:"captured",amount_refunded:100}]);expect((await checkBalance(env,balance,"cron")).state).toBe("refunded");expect(mocks.record).toHaveBeenLastCalledWith(balance,"refunded","pay_1",100,"cron",null);expect(mocks.save).not.toHaveBeenCalled();
});
it("uses GET-only webhook recovery and passes the event ID to atomic settlement",async()=>{mocks.byOrder.mockResolvedValue(balance);provider([{id:"pay_1",order_id:balance.order_id,amount:500000,currency:"INR",status:"captured"}]);expect(await projectWebhook(env,{payload:{payment:{entity:{order_id:balance.order_id}}}},"evt_1")).toBe(true);expect(mocks.record).toHaveBeenCalledWith(balance,"paid","pay_1",0,"webhook","evt_1");expect(fetcher.mock.calls.every(([,options])=>(options as RequestInit).method==="GET")).toBe(true);});
it("rejects bad and missing webhook signatures before balance lookup",async()=>{for(const signature of ["","0".repeat(64)]){const request=new Request("https://example.test",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_fake"},body:JSON.stringify({payload:{payment:{entity:{order_id:balance.order_id}}}})});expect((await handleWebhookEdge(request,env)).status).toBe(403);}expect(mocks.byOrder).not.toHaveBeenCalled();});
it("requires a valid callback signature before checking or claiming success",async()=>{mocks.balance.mockResolvedValue(balance);expect((await projectCustomer(await req({razorpay_order_id:balance.order_id,razorpay_payment_id:"pay_fake",razorpay_signature:"0".repeat(64)}),env,"verify")).status).toBe(403);expect(fetcher).not.toHaveBeenCalled();});
it("rejects duplicate webhook events before provider access and recovers refunds whose capture callback was missed",async()=>{
 mocks.byOrder.mockResolvedValue(balance);mocks.hasEvent.mockResolvedValueOnce(true);
 expect(await projectWebhook(env,{payload:{payment:{entity:{order_id:balance.order_id}}}},"evt_duplicate")).toBe(true);expect(fetcher).not.toHaveBeenCalled();
 mocks.byPayment.mockResolvedValue(null);fetcher.mockImplementation(async url=>Response.json(url.includes("payments/pay_")?{id:"pay_1",order_id:balance.order_id,amount:500000,currency:"INR",status:"refunded",amount_refunded:100}:url.endsWith("/payments")?{items:[{id:"pay_1",order_id:balance.order_id,amount:500000,currency:"INR",status:"refunded",amount_refunded:100}]}:{id:balance.order_id,amount:500000,currency:"INR",status:"paid",notes:{project_balance:balance.id}}));
 expect(await projectWebhook(env,{payload:{refund:{entity:{payment_id:"pay_1"}}}},"evt_refund")).toBe(true);expect(mocks.record).toHaveBeenLastCalledWith(balance,"refunded","pay_1",100,"webhook","evt_refund");
});
it("verifies a real callback HMAC and still requires captured provider state",async()=>{
 mocks.balance.mockResolvedValue(balance);provider([{id:"pay_1",order_id:balance.order_id,amount:500000,currency:"INR",status:"captured"}]);
 const encoder=new TextEncoder(),key=await crypto.subtle.importKey("raw",encoder.encode(env.RAZORPAY_KEY_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
 const signature=Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(`${balance.order_id}|pay_1`))),byte=>byte.toString(16).padStart(2,"0")).join("");
 expect((await projectCustomer(await req({razorpay_order_id:balance.order_id,razorpay_payment_id:"pay_1",razorpay_signature:signature}),env,"verify")).status).toBe(200);expect(mocks.record).toHaveBeenCalledWith(balance,"paid","pay_1",0,"customer",null);
});
it("recovers stuck balances with GET only and flags outages without setting paid",async()=>{mocks.due.mockResolvedValue([balance]);provider([{id:"pay_1",order_id:balance.order_id,amount:500000,currency:"INR",status:"captured"}]);expect(await recoverProjectBalances(env,Date.now()+10000)).toEqual({checked:1,errors:0});fetcher.mockRejectedValue(new Error("secret provider body"));expect(await recoverProjectBalances(env,Date.now()+10000)).toEqual({checked:1,errors:1});expect(mocks.record).toHaveBeenLastCalledWith(balance,"needs_reconciliation",null,0,"cron",null,"Provider check failed; owner review required.");});
it("provides admin link controls without permitting a paid override",async()=>{
 const make=(body:unknown)=>new Request("https://example.test",{method:"POST",body:JSON.stringify(body)});
 expect((await projectAdmin(make({id:project.id}),env,"project-link",{id:"",email:""})).status).toBe(403);
 expect((await projectAdmin(make({requestId:project.advance_request,status:"paid"}),env,"project-save",{id:"owner",email:"owner@example.test"})).status).toBe(400);expect(mocks.save).not.toHaveBeenCalled();
 expect((await projectAdmin(make({id:project.id}),env,"project-link",{id:"owner",email:"owner@example.test"})).status).toBe(200);
});
it("records a failed checkout authorization check without creating a replacement order",async()=>{
 fetcher.mockRejectedValue(new Error("private-provider-detail"));const response=await projectCustomer(await req(),env,"checkout");expect(response.status).toBe(503);expect(await response.text()).not.toContain("private-provider-detail");expect(mocks.record).toHaveBeenCalledWith(balance,"needs_reconciliation",null,0,"customer",null,"Checkout authorization check failed; owner review required.");expect(mocks.attach).not.toHaveBeenCalled();
});
it("records failed admin rechecks for review without a manual paid override",async()=>{
 mocks.balance.mockResolvedValue(balance);fetcher.mockRejectedValue(new Error("private-provider-detail"));const request=new Request("https://example.test",{method:"POST",body:JSON.stringify({id:project.id})});expect((await projectAdmin(request,env,"project-recheck",{id:"owner",email:"owner@example.test"})).status).toBe(503);expect(mocks.record).toHaveBeenCalledWith(balance,"needs_reconciliation",null,0,"admin",null,"Admin provider check failed; owner review required.");expect(mocks.save).not.toHaveBeenCalled();
});
it("does not intercept a signed dispute for a balance order before the existing dispute recorder",async()=>{
 const event={event:"payment.dispute.lost",payload:{payment:{entity:{order_id:balance.order_id,id:"pay_1"}},dispute:{entity:{id:"disp_1",status:"lost",amount:100,currency:"INR"}}}};
 const raw=JSON.stringify(event),encoder=new TextEncoder(),key=await crypto.subtle.importKey("raw",encoder.encode(env.RAZORPAY_WEBHOOK_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign"]),signature=Array.from(new Uint8Array(await crypto.subtle.sign("HMAC",key,encoder.encode(raw))),byte=>byte.toString(16).padStart(2,"0")).join("");
 mocks.recordDispute.mockResolvedValue(true);const response=await handleWebhookEdge(new Request("https://example.test",{method:"POST",headers:{"x-razorpay-signature":signature,"x-razorpay-event-id":"evt_lost"},body:raw}),env);
 expect(response.status).toBe(200);expect(mocks.recordDispute).toHaveBeenCalledWith("evt_lost","payment.dispute.lost",expect.objectContaining({id:"disp_1",orderId:balance.order_id,status:"lost"}));expect(mocks.byOrder).not.toHaveBeenCalled();expect(mocks.record).not.toHaveBeenCalled();expect(fetcher).not.toHaveBeenCalled();
});
it("fails visibly on missing provider settlement for a previously paid order and incomplete payment pages",async()=>{
 provider();await expect(checkBalance(env,{...balance,status:"paid"},"cron")).rejects.toThrow("Stored settlement");expect(mocks.record).not.toHaveBeenCalled();
 fetcher.mockImplementation(async url=>Response.json(url.endsWith("/payments")?{items:[],has_more:true}:{id:balance.order_id,amount:500000,currency:"INR",status:"created",notes:{project_balance:balance.id}}));await expect(checkBalance(env,balance,"cron")).rejects.toThrow("Payment list incomplete");expect(mocks.record).not.toHaveBeenCalled();
});
it("withholds checkout options after a final database authorization detects owner revocation",async()=>{
 provider();mocks.authorize.mockRejectedValue(new ProjectStoreError("Project approval or private link changed; reload your project",409));const response=await projectCustomer(await req(),env,"checkout");expect(response.status).toBe(409);expect(await response.json()).not.toHaveProperty("orderId");expect(mocks.authorize).toHaveBeenCalledWith(project.id,project.share_id,env.RAZORPAY_KEY_ID,balance.id);
});
it("hides expired checkout eligibility and refuses provider work after the time budget expires",async()=>{
 mocks.balance.mockResolvedValue({...balance,created_at:new Date(Date.now()-25*3600000).toISOString()});const response=await projectCustomer(await req(),env,"view");expect(await response.json()).toMatchObject({canPay:false,needsReview:true});await expect(checkBalance(env,balance,"cron",null,Date.now()-1)).rejects.toThrow("time budget");expect(fetcher).not.toHaveBeenCalled();
});

it("classifies only fresh hard declines or explicit provider expiry as retryable",async()=>{
 const payment={id:"pay_decline",order_id:balance.order_id,amount:500000,currency:"INR",status:"failed"};
 const serve=(reason:string|null,status="attempted")=>fetcher.mockImplementation(async url=>Response.json(url.endsWith("/payments")?{items:[{...payment,error_reason:reason}]}:{id:balance.order_id,amount:500000,currency:"INR",status,notes:{project_balance:balance.id}}));
 serve("insufficient_funds");expect((await checkBalance(env,balance,"customer")).state).toBe("failed");
 for(const reason of [null,"payment_timed_out","website_mismatch"]){serve(reason);expect((await checkBalance(env,balance,"customer")).state).toBe("needs_reconciliation");}
 serve("incorrect_pin","paid");expect((await checkBalance(env,balance,"customer")).state).toBe("needs_reconciliation");
 fetcher.mockImplementation(async url=>Response.json(url.endsWith("/payments")?{items:[]}:{id:balance.order_id,amount:500000,currency:"INR",status:"expired",notes:{project_balance:balance.id}}));expect((await checkBalance(env,balance,"customer")).state).toBe("expired");
});
it("freshly checks a declined predecessor before reserving a successor and blocks uncertainty or late capture",async()=>{
 const prior={...balance,status:"failed",active:true};mocks.balances.mockResolvedValue([prior]);
 const serve=(status:string,reason?:string)=>fetcher.mockImplementation(async url=>Response.json(url.endsWith("/payments")?{items:[{id:"pay_prior",order_id:balance.order_id,amount:500000,currency:"INR",status,error_reason:reason}]}:{id:balance.order_id,amount:500000,currency:"INR",status:status==="captured"?"paid":"attempted",notes:{project_balance:balance.id}}));
 serve("failed","incorrect_pin");await projectCustomer(await req({retryId:prior.id}),env,"checkout");expect(mocks.reserve).toHaveBeenCalledWith(project.id,env.RAZORPAY_KEY_ID,project.share_id,project.total_amount,prior.id);
 mocks.reserve.mockClear();for(const status of ["authorized","captured"]){serve(status);expect((await projectCustomer(await req({retryId:prior.id}),env,"checkout")).status).toBe(409);expect(mocks.reserve).not.toHaveBeenCalled();}
 serve("failed","payment_timed_out");expect((await projectCustomer(await req({retryId:prior.id}),env,"checkout")).status).toBe(409);expect(mocks.reserve).not.toHaveBeenCalled();expect(fetcher.mock.calls.every(([,options])=>options.method==="GET")).toBe(true);
});
it("keeps late predecessor capture traceable and exposes a review instead of offering more checkout",async()=>{
 const old={...balance,active:false,status:"paid",payment_id:"pay_old"},current={...balance,id:"00000000-0000-4000-8000-000000000005",active:true};mocks.balance.mockResolvedValue(current);mocks.balances.mockResolvedValue([old,current]);
 const response=await projectCustomer(await req(),env,"view");expect(await response.json()).toMatchObject({balancePaid:500000,remaining:0,needsReview:true,canPay:false});
});
it("paginates admin projects and rejects malformed search/page inputs",async()=>{
 mocks.list.mockResolvedValue(Array.from({length:26},()=>project));mocks.history.mockResolvedValue([]);const make=(data:unknown)=>new Request("https://example.test",{method:"POST",body:JSON.stringify(data)}),admin={id:"owner",email:"owner@example.test"};
 const response=await projectAdmin(make({offset:25,search:"Older"}),env,"projects",admin);expect(mocks.list).toHaveBeenCalledWith(25,"Older");const result=await response.json();expect(result.projects).toHaveLength(25);expect(result.nextOffset).toBe(50);expect(result.projects[0]).not.toHaveProperty("share_id");
 for(const input of [{offset:-1},{search:"a".repeat(121)},{status:"paid"}])expect((await projectAdmin(make(input),env,"projects",admin)).status).toBe(400);
});

it("opens a fresh successor only after verified decline and resumes that successor without another POST",async()=>{
 const prior={...balance,status:"failed",active:false},next={...balance,id:"00000000-0000-4000-8000-000000000005",order_id:"order_next",active:true};mocks.balances.mockResolvedValue([prior]);mocks.reserve.mockResolvedValueOnce({created:true,record:{...next,order_id:null,status:"reserved"}}).mockResolvedValue({created:false,record:next});
 fetcher.mockImplementation(async(url,options)=>{
  if(options.method==="POST")return Response.json({id:"order_next",amount:500000,currency:"INR",status:"created",notes:{project_balance:next.id}});
  const old=url.includes("order_balance");return Response.json(url.endsWith("/payments")?{items:old?[{id:"pay_decline",order_id:balance.order_id,amount:500000,currency:"INR",status:"failed",error_reason:"insufficient_funds"}]:[]}:{id:old?"order_balance":"order_next",amount:500000,currency:"INR",status:old?"attempted":"created",notes:{project_balance:old?balance.id:next.id}});
 });
 expect((await projectCustomer(await req({retryId:prior.id}),env,"checkout")).status).toBe(200);mocks.balances.mockResolvedValue([prior,next]);expect((await projectCustomer(await req({retryId:prior.id}),env,"checkout")).status).toBe(200);
 expect(fetcher.mock.calls.filter(([,options])=>options.method==="POST")).toHaveLength(1);expect(mocks.attach).toHaveBeenCalledWith(next.id,"order_next");
});

it("rejects callback orders belonging to a different private project before provider work",async()=>{
 mocks.byOrder.mockResolvedValue({...balance,project_id:"00000000-0000-4000-8000-000000000099"});const response=await projectCustomer(await req({razorpay_order_id:balance.order_id,razorpay_payment_id:"pay_other",razorpay_signature:"0".repeat(64)}),env,"verify");expect(response.status).toBe(403);expect(fetcher).not.toHaveBeenCalled();expect(mocks.record).not.toHaveBeenCalled();
});

it("binds final checkout authorization to the exact provider order reservation",async()=>{
 provider();expect((await projectCustomer(await req(),env,"checkout")).status).toBe(200);expect(mocks.authorize).toHaveBeenCalledWith(project.id,project.share_id,env.RAZORPAY_KEY_ID,balance.id);
});
it("acknowledges only the selected payment instead of all current project settlements",async()=>{
 const make=(value:unknown)=>new Request("https://example.test",{method:"POST",body:JSON.stringify(value)}),admin={id:"owner",email:"owner@example.test"};
 expect((await projectAdmin(make({id:project.id}),env,"project-acknowledge",admin)).status).toBe(400);expect(mocks.acknowledge).not.toHaveBeenCalled();
 expect((await projectAdmin(make({id:project.id,balanceId:balance.id}),env,"project-acknowledge",admin)).status).toBe(200);expect(mocks.acknowledge).toHaveBeenCalledWith(project.id,balance.id);
});
it("flags verification errors on previously paid balances without downgrading the saved paid status",async()=>{
 mocks.balances.mockResolvedValue([{...balance,status:"paid",payment_id:"pay_paid",review_required:true}]);const response=await projectCustomer(await req(),env,"view");expect(await response.json()).toMatchObject({balancePaid:500000,remaining:0,balanceStatus:"paid",needsReview:true,canPay:false});
});
it("processes known balance order-only webhooks with verified GETs and the shared event ID",async()=>{
 provider([{id:"pay_paid",order_id:balance.order_id,amount:500000,currency:"INR",status:"captured"}]);expect(await projectWebhook(env,{event:"order.paid",payload:{order:{entity:{id:balance.order_id}}}},"evt_order_only")).toBe(true);expect(mocks.record).toHaveBeenCalledWith(balance,"paid","pay_paid",0,"webhook","evt_order_only");
});
it("rejects contradictory refund data rather than presenting an inaccurate net balance",async()=>{
 for(const payment of [{status:"refunded",amount_refunded:0},{status:"authorized",amount_refunded:100}]){provider([{id:"pay_bad",order_id:balance.order_id,amount:500000,currency:"INR",...payment}]);await expect(checkBalance(env,balance,"cron")).rejects.toThrow("Refund details need owner review");}expect(mocks.record).not.toHaveBeenCalled();
});

it("shows review rather than a retry button once the ten-order limit is exhausted",async()=>{
 mocks.balances.mockResolvedValue(Array.from({length:10},(_,index)=>({...balance,id:`00000000-0000-4000-8000-${String(index+1).padStart(12,"0")}`,active:index===9,status:"failed"})));const response=await projectCustomer(await req(),env,"view");expect(await response.json()).toMatchObject({needsReview:true,canPay:false});
});

it("reports malformed provider order creation as uncertain service failure without exposing data or replacing the reservation",async()=>{
 mocks.reserve.mockResolvedValueOnce({created:true,record:{...balance,order_id:null,status:"reserved"}}).mockResolvedValue({created:false,record:{...balance,order_id:null,status:"reserved"}});fetcher.mockResolvedValue(Response.json({private_provider_detail:"must-not-leak"}));const response=await projectCustomer(await req(),env,"checkout");expect(response.status).toBe(503);expect(await response.text()).not.toContain("must-not-leak");expect(mocks.attach).not.toHaveBeenCalled();expect((await projectCustomer(await req(),env,"checkout")).status).toBe(409);expect(fetcher.mock.calls.filter(([,options])=>options.method==="POST")).toHaveLength(1);
});
