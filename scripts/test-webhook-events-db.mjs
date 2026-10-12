import { PGlite } from '@electric-sql/pglite';
import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const db=new PGlite();
await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
await db.exec(await readFile('supabase/migrations/20261010170200_razorpay_backend_payments.sql','utf8'));
await db.exec(await readFile('supabase/migrations/20261011085842_payment_webhook_events.sql','utf8'));
for(const role of ['anon','authenticated']){
 await db.exec(`set role ${role}`);
 await assert.rejects(db.query('select * from payment_webhook_events'),/permission denied/);
 await assert.rejects(db.query("select complete_payment_webhook('evt_1',null,null,null,0)"),/permission denied/);
 await db.exec('reset role');
}
await db.exec('set role service_role');
await db.query("insert into payment_intents(request_id,payload_hash,dedupe_hash,package,amount,key_id,customer,terms_version,order_id) values('00000000-0000-4000-8000-000000000001','hash','dedupe','starter',500000,'rzp_test_example','{}','2026-10-10','order_1')");
const sql="select complete_payment_webhook($1,'order_1',$2,'paid',0) as inserted";
assert.equal((await db.query(sql,['evt_1','pay_1'])).rows[0].inserted,true);
assert.equal((await db.query(sql,['evt_1','pay_other'])).rows[0].inserted,false);
assert.equal((await db.query('select count(*)::int as n from payment_webhook_events')).rows[0].n,1);
assert.equal((await db.query('select payment_id,status from payment_intents')).rows[0].payment_id,'pay_1');
await assert.rejects(db.query(sql,['evt_failed','pay_other']),/conflicting/);
assert.equal((await db.query("select count(*)::int as n from payment_webhook_events where event_id='evt_failed'")).rows[0].n,0);
await assert.rejects(db.query("insert into payment_webhook_events(event_id) values('evt_1')"),/unique/);
await db.close();
console.log('PASS: UNIQUE event IDs, duplicate 200 semantics, atomic rollback and browser denial.');
