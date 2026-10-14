// @vitest-environment node
import {beforeEach,it,expect,vi} from "vitest";
const rpc=vi.hoisted(()=>vi.fn());
const query=vi.hoisted(()=>({select:vi.fn(),order:vi.fn(),ilike:vi.fn(),range:vi.fn()}));
vi.mock("@supabase/supabase-js",()=>({createClient:()=>({rpc,from:()=>query})}));
import {projectStore} from "../../supabase/functions/_shared/project-store";
const env={SUPABASE_URL:"https://example.supabase.co",SUPABASE_SERVICE_ROLE_KEY:"fake"};
beforeEach(()=>{vi.resetAllMocks();rpc.mockResolvedValue({data:true,error:null});query.select.mockReturnValue(query);query.order.mockReturnValue(query);query.ilike.mockReturnValue(query);query.range.mockResolvedValue({data:[],error:null});});
it("returns safe actionable conflicts but never exposes unexpected SDK error bodies or prototype names",async()=>{
 rpc.mockResolvedValueOnce({data:null,error:{message:"balance_amount_locked"}});await expect(projectStore(env).authorize("id","share","key","balance")).rejects.toMatchObject({status:409,message:"The final total is locked because balance checkout has already started"});
 for(const message of ["secret-provider-error","constructor","__proto__"]){rpc.mockResolvedValueOnce({data:null,error:{message}});await expect(projectStore(env).authorize("id","share","key","balance")).rejects.toMatchObject({status:503,message:"Project storage unavailable"});}
});
it("uses the database clock and binds revision/share/price guards to service RPCs",async()=>{
 await projectStore(env).reserve("project","key","share",1000000);expect(rpc).toHaveBeenCalledWith("reserve_project_balance",{p_project:"project",p_key:"key",p_share:"share",p_total:1000000,p_retry:null});
 await projectStore(env).checkpoint();expect(rpc).toHaveBeenCalledWith("project_reconciliation_clock");await projectStore(env).due("db-clock");expect(rpc).toHaveBeenCalledWith("due_project_balances",{p_checkpoint:"db-clock"});
});

it("pages projects with stable ordering and treats search wildcards as literal characters",async()=>{
 await projectStore(env).list(25,"50%_client");expect(query.order).toHaveBeenCalledWith("updated_at",{ascending:false});expect(query.order).toHaveBeenCalledWith("id");expect(query.range).toHaveBeenCalledWith(25,50);expect(query.ilike).toHaveBeenCalledWith("title",String.raw`%50\%\_client%`);
});
