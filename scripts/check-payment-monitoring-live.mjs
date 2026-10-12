import assert from 'node:assert/strict';
const site='https://sitenova.dev';
for(const path of ['/admin','/admin/dashboard','/pricing','/api/booking-settings']){
 const response=await fetch(site+path);assert.equal(response.status,200,`Page unavailable: ${path}`);
 const html=await response.text();
 if(path==='/pricing')assert.doesNotMatch(html,/href=["'][^"']*\/pay(?:\?|["'])/,'Public payment links must be hidden');
 if(path==='/admin/dashboard'){
  const bundles=[...new Set(html.match(/\/assets\/admin\.dashboard-[A-Za-z0-9_-]+\.js/g)??[])];
  assert.ok(bundles.length,'Admin route bundle reference missing');
  const sources=await Promise.all(bundles.map(async path=>{const asset=await fetch(site+path);assert.equal(asset.status,200);return asset.text();}));
  assert.ok(sources.some(source=>source.includes('Payments need attention')&&source.includes('Reconciliation scheduler')),'Monitoring UI not found in deployed admin bundle');
 }
}
const pay=await fetch(site+'/pay?package=starter');assert.equal(pay.status,200);assert.match(await pay.text(),/Online payments are coming soon/);
const summary=await fetch(site+'/api/admin/payments/queue',{method:'POST',headers:{origin:site,'Content-Type':'application/json'},body:JSON.stringify({summaryOnly:true})});assert.equal(summary.status,401);
const webhook=await fetch('https://bklmtwblsoitafynpikc.supabase.co/functions/v1/razorpay-webhook',{method:'POST',headers:{'Content-Type':'application/json','x-razorpay-event-id':'invalid-signature-monitoring-probe','x-razorpay-signature':'invalid'},body:JSON.stringify({event:'payment.dispute.created',payload:{}})});assert.equal(webhook.status,403);
console.log('PASS: live admin monitoring bundle, page availability, hidden pricing payment links, disabled direct checkout, unauthenticated summary denial and bad dispute signature denial. No payment or signed synthetic event created.');
