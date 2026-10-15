import {beforeEach,expect,it,vi} from "vitest";
import {grantPaymentConfirmation,requirePaymentConfirmation} from "./payment-confirmation.server";
import {paymentAction,projectAction} from "./razorpay.server";
vi.mock("./razorpay.server",()=>({paymentAction:vi.fn(),projectAction:vi.fn(),paymentJson:(body:unknown,status=200)=>Response.json(body,{status})}));
const access={kind:"advance",package:"starter",token:`${btoa(JSON.stringify({package:"starter"}))}.signed-fixture`};
function request(body:unknown=access,origin="https://sitenova.dev"){return new Request("https://sitenova.dev/api/payments/confirmation",{method:"POST",headers:{origin,"Content-Type":"application/json"},body:JSON.stringify(body)});}
function visit(cookie?:string,path="?package=starter"){return new Request(`https://sitenova.dev/payment-thank-you${path}`,{headers:cookie?{Cookie:cookie}:{}});}
async function granted(body:unknown=access){const response=await grantPaymentConfirmation(request(body),{});expect(response.status).toBe(204);return response.headers.get("Set-Cookie")!;}
beforeEach(()=>{vi.clearAllMocks();vi.mocked(paymentAction).mockImplementation(async()=>Response.json({status:"paid"}));vi.mocked(projectAction).mockImplementation(async()=>Response.json({balanceStatus:"paid",balancePaid:50000,remaining:0,needsReview:false}));});
it("redirects a direct URL or forged success query before rendering confirmation",async()=>{
 for(const path of ["?package=starter","?package=starter&paid=true",""]){await expect(requirePaymentConfirmation(visit(undefined,path),{})).rejects.toMatchObject({status:302});}
 expect(paymentAction).not.toHaveBeenCalled();
});
it("issues private short-lived access only after fresh backend paid verification, then rechecks on entry",async()=>{
 const cookie=await granted();expect(cookie).toContain("HttpOnly");expect(cookie).toContain("Secure");expect(cookie).toContain("SameSite=Strict");expect(cookie).toContain("Max-Age=1800");expect(cookie).toContain("Path=/payment-thank-you");
 await expect(requirePaymentConfirmation(visit(cookie),{})).resolves.toBeUndefined();expect(paymentAction).toHaveBeenCalledTimes(2);
 const check=vi.mocked(paymentAction).mock.calls[0][0];expect(await check.json()).toEqual({token:access.token});expect(vi.mocked(paymentAction).mock.calls[0][2]).toBe("status");
});
it.each(["pending","refunded","failed",undefined])("does not grant confirmation for %s",async status=>{
 vi.mocked(paymentAction).mockResolvedValue(Response.json({status}));expect((await grantPaymentConfirmation(request(),{})).status).toBe(403);
});
it("rejects forged cookies and a cookie for a different package",async()=>{
 const cookie=await granted();await expect(requirePaymentConfirmation(visit(cookie,"?package=business"),{})).rejects.toMatchObject({status:302});await expect(requirePaymentConfirmation(visit("sitenova-payment-confirmation=forged"),{})).rejects.toMatchObject({status:302});
});
it("revokes page access after a refund or backend failure, even with an earlier valid cookie",async()=>{
 const cookie=await granted();vi.mocked(paymentAction).mockResolvedValueOnce(Response.json({status:"refunded"})).mockRejectedValueOnce(new Error("offline"));
 for(let i=0;i<2;i++)await expect(requirePaymentConfirmation(visit(cookie),{})).rejects.toMatchObject({status:302});
});
it("requires same-origin POST and rejects arbitrary status or price overrides",async()=>{
 expect((await grantPaymentConfirmation(request(access,"https://untrusted.example"),{})).status).toBe(403);
 expect((await grantPaymentConfirmation(request({...access,status:"paid"}),{})).status).toBe(403);
 expect((await grantPaymentConfirmation(visit(),{})).status).toBe(405);expect(paymentAction).not.toHaveBeenCalled();
});
it("does not relabel a paid Starter session as Business or accept a non-OK provider response",async()=>{
 expect((await grantPaymentConfirmation(request({...access,package:"business"}),{})).status).toBe(403);
 vi.mocked(paymentAction).mockResolvedValue(Response.json({status:"paid"},{status:503}));expect((await grantPaymentConfirmation(request(),{})).status).toBe(403);
});
it("requires a fully settled, reviewed balance on both grant and page entry",async()=>{
 const cookie=await granted({kind:"balance",token:"private-project"});await expect(requirePaymentConfirmation(visit(cookie,"?kind=balance"),{})).resolves.toBeUndefined();expect(projectAction).toHaveBeenCalledTimes(2);
 vi.mocked(projectAction).mockResolvedValue(Response.json({balanceStatus:"paid",balancePaid:50000,remaining:0,needsReview:true}));await expect(requirePaymentConfirmation(visit(cookie,"?kind=balance"),{})).rejects.toMatchObject({status:302});
 expect((await grantPaymentConfirmation(request({kind:"balance",token:"private-project"}),{})).status).toBe(403);
});
