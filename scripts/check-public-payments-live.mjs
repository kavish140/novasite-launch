// Read-only launch checks. Every POST has deliberately invalid input and cannot
// reserve an order, settle a payment or accept a signed webhook.
import assert from 'node:assert/strict';
const site='https://sitenova.dev';
const pricing=await fetch(site+'/pricing');assert.equal(pricing.status,200);
const html=await pricing.text();
for(const packageId of ['starter','business'])assert.ok(html.includes(`/pay?package=${packageId}`),`${packageId} advance link missing`);
for(const [packageId,amount] of [['starter','5,000.00'],['business','7,500.00']]){
 const response=await fetch(site+`/pay?package=${packageId}`);assert.equal(response.status,200);
 const body=await response.text();assert.doesNotMatch(body,/Online payments are coming soon/);
 assert.ok(body.includes(amount),`Wrong ${packageId} displayed amount`);
 for(const field of ['pay-name','pay-business','pay-email','pay-phone'])assert.ok(body.includes(field),`${packageId} field missing: ${field}`);
 assert.ok(body.includes('/terms-and-conditions')&&body.includes('/refund-policy'),'Policy links missing');
 assert.doesNotMatch(body,/googletagmanager\.com|clarity\.ms|checkout\.razorpay\.com/,'Tracking/checkout scripts must not load before the customer explicitly starts payment');
 assert.equal((body.match(/<!DOCTYPE html>/gi)??[]).length,1,'Invalid SSR document');
}
async function post(path,body,origin=site,extra={}){
 return fetch(site+path,{method:'POST',headers:{origin,'Content-Type':'application/json',...extra},body:JSON.stringify(body)});
}
assert.equal((await post('/api/payments/order',{package:'starter',amount:1})).status,400,'Invalid browser amount/input not rejected');
assert.equal((await post('/api/payments/order',{},'https://untrusted.example')).status,403,'Cross-origin input not rejected');
for(const action of ['status','checkout','retry'])assert.equal((await post(`/api/payments/${action}`,{token:'invalid.signed.session',...(action==='retry'?{requestId:'00000000-0000-4000-8000-000000000000'}:{})})).status,403,`${action} invalid session not rejected`);
assert.equal((await post('/api/admin/payments/queue',{summaryOnly:true})).status,401,'Anonymous admin access not rejected');
assert.equal((await post('/api/admin/payments/projects',{},site,{authorization:'Bearer invalid-admin-token'})).status,401,'Forged admin access not rejected');
assert.equal((await post('/api/project/view',{token:'invalid.signed.project.link'})).status,403,'Invalid project capability not rejected');
const hook=await fetch('https://bklmtwblsoitafynpikc.supabase.co/functions/v1/razorpay-webhook',{method:'POST',headers:{'Content-Type':'application/json','x-razorpay-event-id':'invalid-signature-launch-probe','x-razorpay-signature':'invalid'},body:JSON.stringify({event:'payment.captured',payload:{}})});assert.equal(hook.status,403,'Bad webhook signature not rejected');
console.log('PASS: public Starter/Business links and exact advances, active forms/policies, single-doctype SSR, tracking suppression, invalid-price/session/origin denials, anonymous/forged admin denial, invalid project and bad webhook rejection. No order, charge or signed synthetic event created.');
