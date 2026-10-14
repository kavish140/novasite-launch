// @vitest-environment node
import {afterEach,it,expect,vi} from "vitest";
import {pricingAdmin,pricingStore} from "../../supabase/functions/_shared/package-pricing";
const version="00000000-0000-4000-8000-000000000001";
const env={SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake-service",PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}};
const admin={id:version,email:"owner@example.test"};
const row={id:version,created_at:"2026-10-14T11:00:00Z",starter_price:1200055,starter_advance:420025,business_price:2000000,business_advance:600000};
const prices={starter:{startingPrice:1200055,advance:420025},business:{startingPrice:2000000,advance:600000}};
const request=(body:unknown)=>new Request("https://example.test/pricing",{method:"POST",body:JSON.stringify(body)});
afterEach(()=>vi.unstubAllGlobals());
it("reads current version and bounded history, with no customer or payment query",async()=>{
 const fetcher=vi.fn<typeof fetch>(async input=>Response.json(String(input).includes("payment_price_current")?{prices:row}:[row]));vi.stubGlobal("fetch",fetcher);
 const result=await pricingAdmin(request({}),env,"pricing",admin);expect(result.status).toBe(200);expect((await result.json()).history[0].packages.starter.advance).toBe(420025);
 const urls=fetcher.mock.calls.map(([url])=>new URL(String(url)));expect(urls[0].searchParams.get("singleton")).toBe("eq.true");expect(urls[1].searchParams.get("limit")).toBe("10");expect(urls.every(url=>!url.pathname.includes("payment_intents"))).toBe(true);
});
it("saves only validated paise, reviewed version and the freshly authenticated admin ID",async()=>{
 const fetcher=vi.fn<typeof fetch>(async()=>Response.json(row));vi.stubGlobal("fetch",fetcher);
 const result=await pricingAdmin(request({version,prices}),env,"pricing-save",admin);expect(result.status).toBe(200);
 expect(JSON.parse(String(fetcher.mock.calls[0][1]?.body))).toEqual({p_admin:admin.id,p_version:version,p_prices:prices});
 expect(String(fetcher.mock.calls[0][0])).toContain("/rpc/save_payment_package_prices");
});
it("rejects overrides, excess advances, fractional paise and oversized bodies before database calls",async()=>{
 const fetcher=vi.fn();vi.stubGlobal("fetch",fetcher);
 for(const body of [{version,prices,admin:"attacker"},{version,prices:{...prices,starter:{startingPrice:100,advance:101}}},{version,prices:{...prices,starter:{startingPrice:1200055,advance:420025.1}}}])expect((await pricingAdmin(request(body),env,"pricing-save",admin)).status).toBe(400);
 expect((await pricingAdmin(request({notes:"x".repeat(3100)}),env,"pricing",admin)).status).toBe(413);expect(fetcher).not.toHaveBeenCalled();
});
it("fails closed under the admin-specific rate limit",async()=>{
 const limiter=vi.fn(async()=>({success:false})),fetcher=vi.fn();vi.stubGlobal("fetch",fetcher);
 expect((await pricingAdmin(request({}),{...env,PAYMENT_RATE_LIMITER:{limit:limiter}},"pricing",admin)).status).toBe(429);
 expect(limiter).toHaveBeenCalledWith({key:`admin-pricing:${admin.id}`});expect(fetcher).not.toHaveBeenCalled();
});
it("reports concurrent edits as a conflict without leaking database errors",async()=>{
 vi.stubGlobal("fetch",vi.fn(async()=>Response.json({message:"pricing_changed_reload",code:"P0001"},{status:400})));
 expect((await pricingAdmin(request({version,prices}),env,"pricing-save",admin)).status).toBe(409);
 vi.stubGlobal("fetch",vi.fn(async()=>Response.json({message:"private-database-detail",code:"P0001"},{status:400})));
 const response=await pricingAdmin(request({version,prices}),env,"pricing-save",admin);expect(response.status).toBe(503);expect(await response.text()).not.toContain("private-database-detail");
});
it("refuses malformed catalog data instead of publishing misleading amounts",async()=>{
 vi.stubGlobal("fetch",vi.fn(async()=>Response.json({prices:{...row,starter_advance:row.starter_price+1}})));
 await expect(pricingStore(env).current()).rejects.toThrow();
});
