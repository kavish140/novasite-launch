import {test,expect,type Page} from '@playwright/test';
const id='00000000-0000-4000-8000-000000000001';
const user={id:'payment-preview-admin',email:'preview@example.test',aud:'authenticated',role:'authenticated',app_metadata:{},user_metadata:{},created_at:new Date().toISOString()};
async function session(page:Page){await page.addInitScript(user=>{const payload=btoa(JSON.stringify({sub:user.id,exp:Math.floor(Date.now()/1000)+3600}));localStorage.setItem('sb-bklmtwblsoitafynpikc-auth-token',JSON.stringify({access_token:`preview.${payload}.preview`,refresh_token:'preview-only',expires_at:Math.floor(Date.now()/1000)+3600,expires_in:3600,token_type:'bearer',user}));},user);}
async function isolate(page:Page,admin=true){
 await page.route(/googletagmanager|clarity\.ms|sentry\.io|razorpay\.com/,route=>route.abort());
 await page.route('**/api/booking-settings',route=>route.fulfill({json:{enabled:false,booking_url:null}}));
 await page.route(/\.supabase\.co\//,route=>{const url=new URL(route.request().url());return route.fulfill({json:url.pathname.endsWith('/auth/v1/user')?user:url.pathname.endsWith('/rpc/is_site_admin')?admin:[],headers:{'content-range':'0-0/0'}});});
}
test('combined admin queue acknowledges paid/lost alerts and keeps investigations record-only on mobile',async({page})=>{
 await isolate(page);await session(page);const errors:string[]=[];page.on('pageerror',error=>errors.push(error.message));let acknowledged=false,lost=true;
 await page.route('**/api/admin/payments/*',route=>{const action=new URL(route.request().url()).pathname.split('/').pop(),body=route.request().postDataJSON();
  const now=new Date().toISOString();const health={observedAt:now,latestRunFailed:false,lastCompletedAt:now,lastSuccessfulAt:now,needsReconciliation:0,overdue:0,refunded:0,disputes:[],unacknowledgedPaid:acknowledged?0:1,investigations:1,lostDisputes:lost?[{id:'disp_preview',eventId:'evt_preview',status:'lost',amount:100,currency:'INR',paymentId:'pay_preview',orderId:'order_preview'}]:[]};
  if(action==='acknowledge'){if(body.kind==='paid')acknowledged=body.acknowledged;else lost=false;return route.fulfill({json:{acknowledged:true}});}
  return route.fulfill({json:action==='queue'?body.summaryOnly?health:{orders:[],runs:[],alerts:[],nextOffset:null}:action==='paid'?{orders:[{request_id:id,paid_at:now,acknowledged_at:acknowledged?now:null,payment_intents:{order_id:'order_preview',package:'starter',amount:500000,status:'paid',customer:{name:'Preview Client',email:'preview@example.test',business:'Preview Studio',requirements:'A business website'}}}],nextOffset:null}:action==='investigations'?{items:[{id:'investigation',kind:'unknown_payment',order_id:'order_unknown',payment_id:'pay_unknown',request_id:null,amount:100,currency:'INR',provider_status:'captured'}],nextOffset:null}:{history:[],nextOffset:null}});
 });
 await page.goto('/admin/dashboard');await expect(page.getByText('1 paid order(s) awaiting acknowledgement.')).toBeVisible();await page.getByRole('button',{name:'Review Payments',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Recent paid orders'})).toBeVisible();await expect(page.getByText('Preview Studio',{exact:false})).toBeVisible();await page.getByRole('checkbox',{name:'Acknowledged',exact:true}).click();await expect(page.getByRole('checkbox',{name:'Acknowledged',exact:true})).toBeChecked();await expect(page.getByText('1 paid order(s) awaiting acknowledgement.')).toHaveCount(0);
 await page.getByRole('button',{name:'Acknowledge lost dispute',exact:true}).click();await expect(page.getByRole('heading',{name:'Lost disputes — acknowledgement required'})).toHaveCount(0);await expect(page.getByText('1 payment record(s) need investigation.')).toBeVisible();
 await expect(page.getByRole('button',{name:/mark.*paid|attach.*order/i})).toHaveCount(0);await page.setViewportSize({width:390,height:844});await expect(page.getByRole('heading',{name:'Recent paid orders'})).toBeVisible();await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);expect(errors).toEqual([]);
});
test('fresh devices and refresh read the minimal receipt without analytics or personal data',async({browser})=>{
 const token=`${id}.${'a'.repeat(64)}`;
 for(let device=0;device<2;device++){const context=await browser.newContext({viewport:{width:device?390:1440,height:900}}),page=await context.newPage();await isolate(page);let reads=0;
  await page.route('**/api/payments/receipt',route=>{expect(route.request().postDataJSON()).toEqual({token});reads++;return route.fulfill({json:{package:'starter',amount:500000,status:'paid'}});});
  await page.goto(`/receipt#${token}`);await expect(page.getByText('₹5,000.00',{exact:true})).toBeVisible();await page.reload();await expect(page.getByText('paid',{exact:true})).toBeVisible();expect(reads).toBe(2);
  expect(await page.locator('script[src*="googletagmanager"],script[src*="clarity"],script[src*="checkout.razorpay"]').count()).toBe(0);await expect(page.getByText(/preview@example|order_preview|pay_preview/)).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await context.close();
 }
});
test('non-admin cannot mount the queue or fetch payment alert data',async({page})=>{
 await isolate(page,false);await session(page);let queries=0;await page.route('**/api/admin/payments/*',route=>{queries++;return route.fulfill({status:403,json:{error:'Admin required'}});});
 await page.goto('/admin/dashboard');await expect(page.getByRole('heading',{name:'Overview',exact:true})).toBeVisible();await page.waitForTimeout(1000);expect(queries).toBe(0);await expect(page.getByRole('alert',{name:'Payment alerts'})).toHaveCount(0);
});
test('public checkout remains disabled in the production preview',async({page})=>{
 await isolate(page);await page.goto('/pay?package=starter');await expect(page.getByText('Online payments are coming soon',{exact:false})).toBeVisible();await expect(page.getByRole('button',{name:/Pay.*advance/})).toHaveCount(0);expect(await page.locator('script[src*="checkout.razorpay.com"]').count()).toBe(0);
});




