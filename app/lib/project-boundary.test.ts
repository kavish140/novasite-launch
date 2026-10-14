// @vitest-environment node
import {beforeEach,it,expect,vi} from "vitest";
const mocks=vi.hoisted(()=>({getUser:vi.fn(),membership:vi.fn(),projectAdmin:vi.fn(),projectCustomer:vi.fn()}));
vi.mock("@supabase/supabase-js",()=>({createClient:()=>({auth:{getUser:mocks.getUser},from:()=>({select:()=>({eq:()=>({maybeSingle:mocks.membership})})})})}));
vi.mock("../../supabase/functions/_shared/project-portal.ts",()=>({projectAdmin:mocks.projectAdmin,projectCustomer:mocks.projectCustomer,projectWebhook:vi.fn()}));
import {handlePaymentEdge} from "../../supabase/functions/_shared/edge-handler";
import {projectAction,adminTestPaymentAction} from "./razorpay.server";
const env={PROJECT_PORTAL_ENABLED:"true",PAYMENT_GATEWAY_SECRET:"fake-gateway-secret-over-thirty-two-chars",SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake-service"};
function request(action:string,token?:string,secret=env.PAYMENT_GATEWAY_SECRET){return new Request(`https://example.supabase.co/functions/v1/razorpay-payments/admin-queue/${action}`,{method:"POST",headers:{"x-payment-gateway-secret":secret,"x-payment-origin":"https://sitenova.dev",...(token?{"x-payment-admin-token":token}:{})},body:"{}"});}
beforeEach(()=>{vi.resetAllMocks();mocks.getUser.mockResolvedValue({data:{user:{id:"customer",email:"customer@example.test"}},error:null});mocks.membership.mockResolvedValue({data:null,error:null});mocks.projectAdmin.mockResolvedValue(Response.json({projects:[]}));});
it("denies missing, forged and non-admin identities on every project admin action",async()=>{
 for(const action of ["projects","project-save","project-link","project-recheck","project-acknowledge"]){expect((await handlePaymentEdge(request(action),env)).status).toBe(401);expect((await handlePaymentEdge(request(action,"customer-jwt"),env)).status).toBe(403);}
 mocks.getUser.mockResolvedValue({error:{message:"invalid"},data:{user:null}});expect((await handlePaymentEdge(request("projects","forged"),env)).status).toBe(401);expect(mocks.projectAdmin).not.toHaveBeenCalled();
});
it("revalidates admin membership for each action and blocks direct calls without the gateway credential",async()=>{
 mocks.membership.mockResolvedValueOnce({data:{user_id:"customer"},error:null});expect((await handlePaymentEdge(request("projects","admin-jwt"),env)).status).toBe(200);expect((await handlePaymentEdge(request("projects","admin-jwt"),env)).status).toBe(403);expect((await handlePaymentEdge(request("project-save","admin-jwt","forged"),env)).status).toBe(401);expect(mocks.projectAdmin).toHaveBeenCalledTimes(1);
});
it("keeps website balance creation disabled independently of private project reads",async()=>{
 const fetcher=vi.fn(async(_url:string,_options:RequestInit)=>Response.json({title:"Client project",canPay:true}));vi.stubGlobal("fetch",fetcher);const context={cloudflare:{env:{...env,PAYMENT_EDGE_ENABLED:"false"}}};
 const make=(action:string)=>new Request(`https://sitenova.dev/api/project/${action}`,{method:"POST",headers:{origin:"https://sitenova.dev","cf-connecting-ip":"192.0.2.1"},body:'{"token":"fake"}'});
 expect((await projectAction(make("checkout"),context,"checkout")).status).toBe(503);expect(fetcher).not.toHaveBeenCalled();const view=await projectAction(make("view"),context,"view");expect(view.status).toBe(200);expect((await view.json()).canPay).toBe(false);
 expect(new Headers(fetcher.mock.calls[0][1]?.headers).get("x-payment-client-ip")).toBe("192.0.2.1");
 expect((await adminTestPaymentAction(new Request("https://sitenova.dev/api/admin/payments/projects",{method:"POST",headers:{origin:"https://sitenova.dev"},body:"{}"}),context,"projects")).status).toBe(401);vi.unstubAllGlobals();
});
