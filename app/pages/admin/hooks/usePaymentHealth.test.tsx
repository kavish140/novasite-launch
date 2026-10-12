import {beforeEach,afterEach,it,expect,vi} from "vitest";
import {renderHook,act,cleanup} from "@testing-library/react";
const mock=vi.hoisted(()=>({identity:vi.fn(),membership:vi.fn(),request:vi.fn(),subscribe:vi.fn(),unsubscribe:vi.fn()}));
vi.mock("@/lib/supabaseClient",()=>({supabase:{auth:{getUser:mock.identity,onAuthStateChange:mock.subscribe},rpc:mock.membership}}));
vi.mock("@/lib/payment-admin-client",()=>({adminPaymentRequest:mock.request}));
import {usePaymentHealth} from "./usePaymentHealth";
const healthy={observedAt:"2026-10-11T10:00:00Z",lastCompletedAt:"2026-10-11T10:00:00Z",lastSuccessfulAt:"2026-10-11T10:00:00Z",latestRunFailed:false,needsReconciliation:0,overdue:0,refunded:0,disputes:[]};
let authChange:()=>void;
beforeEach(()=>{vi.useFakeTimers();vi.clearAllMocks();mock.identity.mockResolvedValue({data:{user:{id:"owner"}},error:null});mock.membership.mockResolvedValue({data:true,error:null});mock.request.mockResolvedValue(healthy);mock.subscribe.mockImplementation(callback=>{authChange=callback;return {data:{subscription:{unsubscribe:mock.unsubscribe}}};});});
afterEach(()=>{cleanup();vi.useRealTimers();});
const flush=()=>act(async()=>{await Promise.resolve();await Promise.resolve();await Promise.resolve();});
it.each(["anonymous","nonadmin","membership unavailable"])("never queries alert data for %s",async kind=>{
 if(kind==="anonymous")mock.identity.mockResolvedValue({data:{user:null},error:null});
 else mock.membership.mockResolvedValue({data:false,error:kind==="membership unavailable"?{}:null});
 const {result}=renderHook(usePaymentHealth);await flush();
 expect(mock.request).not.toHaveBeenCalled();expect(result.current.isAdmin).toBe(false);expect(result.current.health).toBeNull();
});
it("loads on landing and refreshes every minute, clearing resolved issues",async()=>{
 mock.request.mockResolvedValueOnce({...healthy,needsReconciliation:1});
 const {result}=renderHook(usePaymentHealth);await flush();
 expect(result.current.health?.needsReconciliation).toBe(1);
 await act(async()=>{await vi.advanceTimersByTimeAsync(60000);});
 expect(result.current.health?.needsReconciliation).toBe(0);
 expect(mock.request).toHaveBeenCalledTimes(2);expect(mock.request).toHaveBeenCalledWith("queue",{summaryOnly:true});
});
it("clears on logout and discards a late in-flight admin response",async()=>{
 let finish:(value:typeof healthy)=>void=()=>{};
 mock.request.mockImplementation(()=>new Promise(resolve=>{finish=resolve;}));
 const {result}=renderHook(usePaymentHealth);await flush();
 mock.identity.mockResolvedValue({data:{user:null},error:null});
 await act(async()=>{authChange();finish(healthy);await vi.advanceTimersByTimeAsync(1);});
 expect(result.current.health).toBeNull();expect(result.current.isAdmin).toBe(false);
});
it("checks membership again before each refresh and stops querying after revocation",async()=>{
 const {result}=renderHook(usePaymentHealth);await flush();
 mock.membership.mockResolvedValue({data:false,error:null});
 await act(async()=>{await vi.advanceTimersByTimeAsync(60000);});
 expect(mock.request).toHaveBeenCalledTimes(1);expect(result.current.health).toBeNull();
});
