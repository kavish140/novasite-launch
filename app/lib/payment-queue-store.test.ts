// @vitest-environment node
import {afterEach,it,expect,vi} from 'vitest';
import {paymentStore} from '../../supabase/functions/_shared/payment-store';
afterEach(()=>vi.unstubAllGlobals());
it('reads a paginated minimal queue and excludes resolved alerts through the ledger relationship',async()=>{
 const fetcher=vi.fn<typeof fetch>(async()=>Response.json([]));vi.stubGlobal('fetch',fetcher);
 const result=await paymentStore({SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake-service-key'}).queue(50);
 expect(result).toEqual({orders:[],runs:[],alerts:[],nextOffset:null});
 const urls=fetcher.mock.calls.map(call=>new URL(String(call[0])));
 expect(urls[0].searchParams.get('status')).toBe('eq.pending');
 expect(urls[0].searchParams.get('offset')).toBe('50');
 expect(urls[0].searchParams.get('select')).not.toMatch(/customer|key_id|payload_hash|dedupe_hash/);
 expect(urls[0].searchParams.get('or')).toContain('reconciliation_state.in.(failed,expired)');
 expect(urls[2].searchParams.get('select')).toContain('payment_intents!inner');
 expect(urls[2].searchParams.get('payment_intents.status')).toBe('eq.pending');
 expect(urls[2].searchParams.get('payment_intents.reconciliation_state')).toBe('in.(pending,needs_reconciliation)');
});
it('fails closed when queue storage denies access',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>Response.json({code:'42501',message:'permission denied'},{status:403})));
 await expect(paymentStore({SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake-service-key'}).queue(0)).rejects.toThrow('Payment queue unavailable');
});
it('attributes only the matching latest check and keeps audit rows out of the queue',async()=>{
 const at='2026-10-12T15:50:02Z';
 const fetcher=vi.fn<typeof fetch>(async input=>Response.json(String(input).includes('/payment_intents?')?[
  {request_id:'one',last_checked_at:at,payment_reconciliation_log:[{created_at:at,payment_reconciliation_runs:{source:'cron'}}]},
  {request_id:'two',last_checked_at:at,payment_reconciliation_log:[{created_at:'2026-10-12T15:40:02Z',payment_reconciliation_runs:{source:'admin'}}]},
  {request_id:'three',last_checked_at:null,payment_reconciliation_log:[]}
 ]:[]));vi.stubGlobal('fetch',fetcher);
 const result=await paymentStore({SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake'}).queue(0);
 expect(result.orders).toEqual([{request_id:'one',last_checked_at:at,last_check_source:'cron'},{request_id:'two',last_checked_at:at,last_check_source:null},{request_id:'three',last_checked_at:null,last_check_source:null}]);
 const url=new URL(String(fetcher.mock.calls[0][0]));
 expect(url.searchParams.get('payment_reconciliation_log.limit')).toBe('1');
 expect(url.searchParams.get('payment_reconciliation_log.order')).toBe('created_at.desc,id.desc');
 expect(fetcher.mock.calls.every(([,options])=>options?.method==='GET')).toBe(true);
});
it('returns check source in history without changing stored state',async()=>{
 vi.stubGlobal('fetch',vi.fn(async()=>Response.json([{id:'log',old_state:'pending',new_state:'pending',payment_reconciliation_runs:{source:'admin'}}])));
 const result=await paymentStore({SUPABASE_URL:'https://example.supabase.co',SUPABASE_SERVICE_ROLE_KEY:'fake'}).history('one',0);
 expect(result.history).toEqual([{id:'log',old_state:'pending',new_state:'pending',source:'admin'}]);
});
