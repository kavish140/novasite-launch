import {PGlite} from '@electric-sql/pglite';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const db=new PGlite();await db.exec('create role anon;create role authenticated;create role service_role bypassrls;');
for(const file of ['20261010170200_razorpay_backend_payments.sql','20261011085842_payment_webhook_events.sql','20261011100002_payment_dispute_audit.sql'])await db.exec(await readFile(`supabase/migrations/${file}`,'utf8'));
await db.query("insert into payment_intents(request_id,payload_hash,dedupe_hash,package,amount,key_id,customer,terms_version,order_id,status,payment_id) values('00000000-0000-4000-8000-000000000001','hash','dedupe','starter',500000,'fake','{}','2026-10-10','order_1','paid','pay_1')");
for(const role of ['anon','authenticated']){
 await db.exec(`set role ${role}`);await assert.rejects(db.query('select dispute from payment_webhook_events'),/permission denied/);await assert.rejects(db.query("select record_payment_dispute_event('evt','payment.dispute.created',null,'{}')"),/permission denied/);await db.exec('reset role');
}
await db.exec('set role service_role');
const sql='select record_payment_dispute_event($1,$2,$3,$4) as inserted';
const dispute={id:'disp_1',status:'open',amount:100,paymentId:'pay_1',orderId:'order_1',responseDueAt:'2026-10-12T00:00:00Z'};
assert.equal((await db.query(sql,['evt_1','payment.dispute.created','order_1',dispute])).rows[0].inserted,true);
assert.equal((await db.query(sql,['evt_1','payment.dispute.closed','order_1',{...dispute,status:'closed'}])).rows[0].inserted,false);
assert.equal((await db.query("select complete_payment_webhook('evt_1','order_1','pay_1','refunded',100) as inserted")).rows[0].inserted,false);
assert.equal((await db.query(sql,['evt_unknown','payment.dispute.future_event',null,{id:'disp_unknown',paymentId:'pay_unknown',status:'unknown'}])).rows[0].inserted,true);
const ledger=(await db.query('select status,payment_id,refunded_amount from payment_intents')).rows[0];
assert.deepEqual(ledger,{status:'paid',payment_id:'pay_1',refunded_amount:0});
assert.equal((await db.query('select count(*)::int as n from payment_webhook_events')).rows[0].n,2);
assert.deepEqual((await db.query("select dispute from payment_webhook_events where event_id='evt_1'")).rows[0].dispute,dispute);
await db.close();console.log('PASS: additive dispute audit, shared event-ID deduplication, unknown payment recording, paid ledger unchanged, browser denial.');
