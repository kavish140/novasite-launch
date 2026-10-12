import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const db=new PGlite();await db.exec('create role anon;create role authenticated;create role service_role bypassrls;');
await db.exec(await readFile('supabase/migrations/20261010170200_razorpay_backend_payments.sql','utf8'));
await db.exec(await readFile('supabase/migrations/20261011090250_payment_reconciliation.sql','utf8'));
await db.exec(await readFile('supabase/migrations/20261011091631_payment_confirmed_retry.sql','utf8'));
await db.exec(await readFile('supabase/migrations/20261011105638_payment_unattempted_reconciliation.sql','utf8'));
// Observe the real pending -> paid transition, where fulfillment could attach.
// Repeated reconciliations must not produce a second transition.
await db.exec("create table fulfillment_observer(request_id uuid); grant insert on fulfillment_observer to service_role; create function observe_paid_transition() returns trigger language plpgsql as $$begin if old.status<>'paid' and new.status='paid' then insert into public.fulfillment_observer values(new.request_id); end if; return new; end;$$; create trigger paid_transition after update on payment_intents for each row execute function observe_paid_transition();");
for(const role of ['anon','authenticated']){await db.exec(`set role ${role}`);await assert.rejects(db.query('select * from payment_reconciliation_log'),/permission denied/);await assert.rejects(db.query("select verify_payment_scheduler('guess')"),/permission denied/);await db.exec('reset role');}
await db.exec('set role service_role');
const request='00000000-0000-4000-8000-000000000001',run='00000000-0000-4000-8000-000000000002';
await db.query("insert into payment_intents(request_id,payload_hash,dedupe_hash,package,amount,key_id,customer,terms_version,order_id,created_at) values($1,'hash','dedupe','starter',500000,'rzp_test_example','{}','2026-10-10','order_1',now()-interval '25 hours')",[request]);
await db.query('insert into payment_reconciliation_runs(id) values($1)',[run]);
assert.equal((await db.query('select claim_payment_reconciliation_run($1) as claimed',[run])).rows[0].claimed,true);
assert.equal((await db.query('select claim_payment_reconciliation_run($1) as claimed',[run])).rows[0].claimed,false);
const record="select record_payment_reconciliation($1,$2,$3,$4,$5,$6) as state";
await db.query(record,[run,request,null,'pending',0,null]);
assert.equal((await db.query('select alert from payment_reconciliation_log')).rows[0].alert,true);
assert.equal((await db.query(record,[run,request,null,'unattempted',0,null])).rows[0].state,'pending');
assert.equal((await db.query('select reconciliation_state from payment_intents')).rows[0].reconciliation_state,'pending');
assert.equal((await db.query('select alert from payment_reconciliation_log order by created_at desc limit 1')).rows[0].alert,true); // Over 24h remains flagged.
assert.equal((await db.query(record,[run,request,null,'unattempted',0,'Provider unavailable'])).rows[0].state,'needs_reconciliation');
await db.query("update payment_intents set created_at=now()-interval '1 hour' where request_id=$1",[request]);
await db.query(record,[run,request,null,'unattempted',0,null]);
assert.equal((await db.query('select alert from payment_reconciliation_log order by created_at desc limit 1')).rows[0].alert,false);
await assert.rejects(db.query("select reserve_payment_retry($1,'{}'::jsonb)",[request]),/retry_not_verified/);
await db.query(record,[run,request,'pay_1','paid',0,null]);
await db.query(record,[run,request,'pay_1','paid',0,null]);
await db.query(record,[run,request,null,'unattempted',0,null]); // Stale untouched result cannot undo capture.
await db.query(record,[run,request,null,'pending',0,'Provider unavailable']);
assert.equal((await db.query('select status from payment_intents')).rows[0].status,'paid');
await db.query(record,[run,request,'pay_1','refunded',250000,null]);
await db.query(record,[run,request,'pay_1','paid',0,null]);
const result=(await db.query('select status,refunded_amount from payment_intents')).rows[0];
assert.equal(result.status,'refunded');assert.equal(result.refunded_amount,250000);
await assert.rejects(db.query(record,[run,request,'pay_other','paid',0,null]),/conflicting/);
await db.exec('reset role');
assert.equal((await db.query('select count(*)::int as n from fulfillment_observer')).rows[0].n,1);
await db.close();console.log('PASS: run claim uniqueness, 24-hour flags, monotonic paid/refunded state, conflicting payment denial and browser denial.');
