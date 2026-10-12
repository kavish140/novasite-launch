// @vitest-environment node
import {beforeEach,it,expect,vi} from 'vitest';
const ledger=vi.hoisted(()=>({queue:vi.fn(),history:vi.fn(),byRequest:vi.fn(),startRun:vi.fn(),finishRun:vi.fn(),recordReconciliation:vi.fn(),find:vi.fn()}));
vi.mock('../../supabase/functions/_shared/payment-store.ts',()=>({paymentStore:()=>ledger}));
import {adminPayments} from '../../supabase/functions/_shared/admin-payments';
const admin={id:'admin',email:'admin@example.com'},requestId='00000000-0000-4000-8000-000000000001';
const record={request_id:requestId,order_id:'order_1',package:'starter',amount:500000,key_id:'rzp_test_example',created_at:new Date().toISOString()};
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake',RAZORPAY_KEY_ID:'rzp_test_example',RAZORPAY_KEY_SECRET:'fake',PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}};
const fetcher=vi.fn();const req=(body:unknown)=>new Request('https://example.supabase.co',{method:'POST',body:JSON.stringify(body)});
beforeEach(()=>{vi.resetAllMocks();vi.stubGlobal('fetch',fetcher);ledger.byRequest.mockResolvedValue(record);ledger.find.mockResolvedValue(record);ledger.startRun.mockResolvedValue('run');ledger.recordReconciliation.mockResolvedValue('paid');ledger.queue.mockResolvedValue({orders:[],runs:[],alerts:[],nextOffset:null});ledger.history.mockResolvedValue({history:[],nextOffset:null});fetcher.mockImplementation(async(url:string)=>({ok:true,json:async()=>url.endsWith('/payments')?{items:[{id:'pay_1',order_id:'order_1',amount:500000,currency:'INR',status:'captured'}]}:{id:'order_1',amount:500000,currency:'INR',status:'paid',notes:{package:'starter'}}}));});
it('reads the queue and per-order history without changing provider or ledger state',async()=>{
 expect((await adminPayments(req({}),env,'queue',admin)).status).toBe(200);
 expect((await adminPayments(req({requestId,offset:50}),env,'history',admin)).status).toBe(200);
 expect(ledger.history).toHaveBeenCalledWith(requestId,50);expect(fetcher).not.toHaveBeenCalled();expect(ledger.startRun).not.toHaveBeenCalled();
});
it('re-checks through verified provider GETs and logs the resulting settlement',async()=>{
 const result=await adminPayments(req({requestId}),env,'recheck',admin);expect(await result.json()).toEqual({state:'paid',needsReview:false});
 expect(ledger.recordReconciliation).toHaveBeenCalledWith('run',record,{status:'paid',paymentId:'pay_1'},null);
 expect(fetcher.mock.calls.every(([,options])=>options.method==='GET')).toBe(true);
});
it('rejects manual paid, price and payment-ID overrides before provider access',async()=>{
 for(const extra of [{status:'paid'},{amount:1},{paymentId:'pay_fake'}])expect((await adminPayments(req({requestId,...extra}),env,'recheck',admin)).status).toBe(400);
 expect((await adminPayments(req({requestId}),env,'mark-paid',admin)).status).toBe(404);expect(fetcher).not.toHaveBeenCalled();
});
it('flags an unsuccessful check without exposing provider errors',async()=>{
 fetcher.mockRejectedValue(new Error('secret-value'));ledger.recordReconciliation.mockResolvedValue('needs_reconciliation');
 const result=await adminPayments(req({requestId}),env,'recheck',admin);expect(await result.json()).toEqual({state:'needs_reconciliation',needsReview:true});
 expect(ledger.finishRun).toHaveBeenCalledWith('run',1,1,expect.not.stringContaining('secret-value'));
});
