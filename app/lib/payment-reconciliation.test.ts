// @vitest-environment node
import {beforeEach,it,expect,vi} from 'vitest';
const ledger=vi.hoisted(()=>({verifyScheduler:vi.fn(),claimRun:vi.fn(),dueOrders:vi.fn(),find:vi.fn(),recordReconciliation:vi.fn(),finishRun:vi.fn()}));
vi.mock('../../supabase/functions/_shared/payment-store.ts',()=>({paymentStore:()=>ledger}));
vi.mock('../../supabase/functions/_shared/investigation-sync.ts',()=>({syncUnattachedOrders:vi.fn(async()=>{})}));
vi.mock('../../supabase/functions/_shared/payment-recovery.ts',()=>({recoverRecentPaid:vi.fn(async()=>({checked:0,errors:0})),syncProviderDisputes:vi.fn(async()=>{})}));
import {handleReconciliation} from '../../supabase/functions/_shared/reconciliation';
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake',RAZORPAY_KEY_ID:'rzp_test_example',RAZORPAY_KEY_SECRET:'fake'};
const record={request_id:'00000000-0000-4000-8000-000000000001',order_id:'order_1',package:'starter',amount:500000,key_id:env.RAZORPAY_KEY_ID,created_at:new Date(Date.now()-3600000).toISOString(),status:'pending'};
const runId='00000000-0000-4000-8000-000000000002';
const req=(token='a'.repeat(64))=>new Request('https://example.supabase.co/functions/v1/razorpay-reconcile',{method:'POST',headers:{'x-payment-scheduler-token':token},body:JSON.stringify({runId})});
const fetcher=vi.fn();
beforeEach(()=>{vi.resetAllMocks();vi.stubGlobal('fetch',fetcher);ledger.verifyScheduler.mockResolvedValue(true);ledger.claimRun.mockResolvedValue(true);ledger.dueOrders.mockResolvedValueOnce([record]);ledger.find.mockResolvedValue(record);ledger.recordReconciliation.mockResolvedValue('paid');fetcher.mockImplementation(async(url:string)=>({ok:true,json:async()=>url.endsWith('/payments')?{items:[{id:'pay_1',order_id:'order_1',amount:500000,currency:'INR',status:'captured'}]}:{id:'order_1',amount:500000,currency:'INR',status:'paid',notes:{package:'starter'}}}));});
it('picks up a stuck order, validates provider state and records paid using only GET',async()=>{
 const response=await handleReconciliation(req(),env);expect(response.status).toBe(200);
 expect(await response.json()).toEqual({checked:1,errors:0});
 expect(ledger.dueOrders.mock.calls[0][0]).toMatch(/T/);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith(runId,record,{status:'paid',paymentId:'pay_1'},null);
 expect(fetcher.mock.calls.every(([,options])=>options.method==='GET')).toBe(true);
 expect(ledger.finishRun).toHaveBeenCalledWith(runId,1,0,null);
});
it('does not process the same run twice',async()=>{
 await handleReconciliation(req(),env);ledger.claimRun.mockResolvedValueOnce(false);
 expect(await (await handleReconciliation(req(),env)).json()).toEqual({alreadyProcessed:true});
 expect(fetcher).toHaveBeenCalledTimes(2);expect(ledger.recordReconciliation).toHaveBeenCalledTimes(1);
});
it('keeps a provider-confirmed untouched checkout pending without creating a new order',async()=>{
 fetcher.mockImplementation(async(url:string)=>({ok:true,json:async()=>url.endsWith('/payments')?{items:[]}:{id:'order_1',amount:500000,currency:'INR',status:'created',notes:{package:'starter'}}}));
 ledger.recordReconciliation.mockResolvedValue('pending');
 expect((await handleReconciliation(req(),env)).status).toBe(200);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith(runId,record,{status:'unattempted'},null);
 expect(fetcher.mock.calls.every(([,options])=>options.method==='GET')).toBe(true);
});
it.each(['attempted','paid','unknown'])('does not treat empty payment results for %s orders as untouched',async status=>{
 fetcher.mockImplementation(async(url:string)=>({ok:true,json:async()=>url.endsWith('/payments')?{items:[]}:{id:'order_1',amount:500000,currency:'INR',status,notes:{package:'starter'}}}));
 await handleReconciliation(req(),env);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith(runId,record,{status:'pending'},null);
});
it('flags provider outages without creating orders or logging provider secrets',async()=>{
 fetcher.mockRejectedValue(new Error('SECRET'));expect((await handleReconciliation(req(),env)).status).toBe(200);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith(runId,record,{status:'pending'},expect.not.stringContaining('SECRET'));
 expect(ledger.finishRun).toHaveBeenCalledWith(runId,1,1,expect.any(String));
 expect(fetcher.mock.calls.every(([,options])=>options.method==='GET')).toBe(true);
});
it('rejects mismatched paise amounts instead of recording paid',async()=>{
 fetcher.mockResolvedValue({ok:true,json:async()=>({id:'order_1',amount:1,currency:'INR',status:'paid',notes:{package:'starter'}})});
 await handleReconciliation(req(),env);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith(runId,record,{status:'pending'},expect.any(String));
});
it('rejects unauthorized scheduler requests before processing the queue',async()=>{
 expect((await handleReconciliation(req('invalid'),env)).status).toBe(401);
 ledger.verifyScheduler.mockResolvedValueOnce(false);expect((await handleReconciliation(req(),env)).status).toBe(401);
 expect(ledger.claimRun).not.toHaveBeenCalled();expect(fetcher).not.toHaveBeenCalled();
});
