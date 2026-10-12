// @vitest-environment node
import {beforeEach,it,expect,vi} from 'vitest';
const ledger=vi.hoisted(()=>({find:vi.fn(),byRequest:vi.fn(),startRun:vi.fn(),recordReconciliation:vi.fn(),finishRun:vi.fn(),reserveRetry:vi.fn(),attach:vi.fn()}));
vi.mock('../../supabase/functions/_shared/payment-store.ts',()=>({paymentStore:()=>ledger}));
import {createPaymentToken,paymentAction} from '../../supabase/functions/_shared/razorpay';
const env={SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake',RAZORPAY_KEY_ID:'rzp_test_example',RAZORPAY_KEY_SECRET:'fake',RAZORPAY_WEBHOOK_SECRET:'fake',RAZORPAY_ENABLED:'true',PAYMENT_RATE_LIMITER:{limit:async()=>({success:true})}};
const requestId='00000000-0000-4000-8000-000000000002';
const record={request_id:'00000000-0000-4000-8000-000000000001',order_id:'order_old',package:'starter' as const,amount:500000,key_id:env.RAZORPAY_KEY_ID,created_at:new Date(Date.now()-3600000).toISOString(),status:'pending',customer:{package:'starter',name:'Test Client',email:'test@example.com',phone:'9876543210',business:'Test Project',accepted:true}};
const order={id:'order_old',amount:500000,currency:'INR',status:'attempted',notes:{package:'starter'}};
const payment={id:'pay_old',order_id:'order_old',amount:500000,currency:'INR',status:'failed',error_reason:'incorrect_pin'};
const fetcher=vi.fn();
async function req(extra={}){const token=await createPaymentToken({orderId:record.order_id,amount:record.amount,package:record.package,keyId:env.RAZORPAY_KEY_ID,issuedAt:Date.parse(record.created_at)},env.RAZORPAY_KEY_SECRET);return new Request('https://sitenova.dev/api/payments/retry',{method:'POST',headers:{origin:'https://sitenova.dev'},body:JSON.stringify({token,requestId,...extra})});}
beforeEach(()=>{vi.resetAllMocks();vi.stubGlobal('fetch',fetcher);ledger.find.mockResolvedValue(record);ledger.startRun.mockResolvedValue('run');ledger.reserveRetry.mockImplementation(async(parent,data)=>({created:true,record:{...data,created_at:new Date().toISOString()}}));fetcher.mockResolvedValueOnce({ok:true,json:async()=>order}).mockResolvedValueOnce({ok:true,json:async()=>({items:[payment]})}).mockResolvedValueOnce({ok:true,json:async()=>({...order,id:'order_new',status:'created'})});});
it('creates one fresh server-priced order only after provider-confirmed decline',async()=>{
 const response=await paymentAction(await req(),{env},'retry');expect(response.status).toBe(200);expect((await response.json()).orderId).toBe('order_new');
 expect(fetcher.mock.calls.map(([,options])=>options.method)).toEqual(['GET','GET','POST']);
 expect(JSON.parse(fetcher.mock.calls[2][1].body).amount).toBe(500000);
 expect(ledger.reserveRetry).toHaveBeenCalledWith(record.request_id,expect.objectContaining({customer:record.customer}));
 expect(ledger.recordReconciliation).toHaveBeenCalledWith('run',record,{status:'failed'},null);
});
it.each(['authorized','created','failed'])('blocks uncertain %s status and sends it to reconciliation',async status=>{
 fetcher.mockReset().mockResolvedValueOnce({ok:true,json:async()=>order}).mockResolvedValueOnce({ok:true,json:async()=>({items:[{...payment,status,error_reason:'payment_timed_out'}]})});
 expect((await paymentAction(await req(),{env},'retry')).status).toBe(409);expect(ledger.reserveRetry).not.toHaveBeenCalled();expect(fetcher.mock.calls.every(([,options])=>options.method==='GET')).toBe(true);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith('run',record,{status:'pending'},null);
});
it('blocks on provider outage and records a generic error',async()=>{
 fetcher.mockReset().mockRejectedValue(new Error('secret-value'));
 expect((await paymentAction(await req(),{env},'retry')).status).toBe(409);expect(ledger.reserveRetry).not.toHaveBeenCalled();
 expect(ledger.finishRun).toHaveBeenCalledWith('run',1,1,expect.not.stringContaining('secret-value'));
});
it('blocks captured orders, mismatched paise amounts and client failure overrides',async()=>{
 fetcher.mockReset().mockResolvedValueOnce({ok:true,json:async()=>order}).mockResolvedValueOnce({ok:true,json:async()=>({items:[{...payment,status:'captured'}]})});
 expect((await paymentAction(await req(),{env},'retry')).status).toBe(409);expect(ledger.recordReconciliation).toHaveBeenCalledWith('run',record,{status:'paid',paymentId:'pay_old'},null);
 fetcher.mockReset().mockResolvedValueOnce({ok:true,json:async()=>({...order,amount:1})});
 expect((await paymentAction(await req(),{env},'retry')).status).toBe(409);
 expect((await paymentAction(await req({failed:true}),{env},'retry')).status).toBe(400);expect(ledger.reserveRetry).not.toHaveBeenCalled();
});
it('keeps public retries disabled and never uses browser age as expiry proof',async()=>{
 expect((await paymentAction(await req(),{env:{...env,RAZORPAY_ENABLED:'false'}},'retry')).status).toBe(503);expect(fetcher).not.toHaveBeenCalled();
 fetcher.mockReset().mockResolvedValueOnce({ok:true,json:async()=>({...order,status:'created'})}).mockResolvedValueOnce({ok:true,json:async()=>({items:[]})});
 expect((await paymentAction(await req(),{env},'retry')).status).toBe(409);
});
it('blocks a reserved successor if an earlier attempt becomes captured before checkout',async()=>{
 ledger.find.mockResolvedValue({...record,retry_parent:'parent'});ledger.byRequest.mockResolvedValue(record);
 fetcher.mockReset().mockResolvedValueOnce({ok:true,json:async()=>({...order,status:'created'})}).mockResolvedValueOnce({ok:true,json:async()=>({items:[]})}).mockResolvedValueOnce({ok:true,json:async()=>order}).mockResolvedValueOnce({ok:true,json:async()=>({items:[{...payment,status:'captured'}]})});
 const original=await req();const body=await original.json();
 const request=new Request(original.url,{method:'POST',headers:{origin:'https://sitenova.dev'},body:JSON.stringify({token:body.token})});
 expect((await paymentAction(request,{env},'checkout')).status).toBe(409);
 expect(ledger.recordReconciliation).toHaveBeenCalledWith('run',record,{status:'paid',paymentId:'pay_old'},null);
 expect(fetcher.mock.calls.every(([,options])=>options.method==='GET')).toBe(true);
});
