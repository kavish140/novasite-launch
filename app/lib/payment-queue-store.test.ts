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
