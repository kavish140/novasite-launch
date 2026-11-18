import {test,expect} from '@playwright/test';
const details=['/services/business-websites','/services/ecommerce','/services/web-applications','/services/seo-optimization','/services/google-ads','/services/meta-ads','/portfolio/dr-dipti-ganatra','/portfolio/jupiter-fast-finance','/portfolio/corporate-zone'];
test.beforeEach(async({page})=>{await page.route(/https:\/\//,r=>r.abort());await page.route('**/api/booking-settings',r=>r.fulfill({json:{enabled:false,booking_url:null}}));});
for(const path of details)test('detail content renders independently at '+path,async({page})=>{
 const response=await page.goto(path);expect(response?.status()).toBe(200);
 await expect(page.locator('h1')).toBeVisible();
 await expect(page.locator('h1')).not.toHaveText(path.startsWith('/services/')?'Services':'Portfolio');
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href','https://sitenova.dev'+path);
});
test('unknown URLs return a genuine 404 and retain the designed page',async({page})=>{
 const response=await page.goto('/missing-route-regression-check');expect(response?.status()).toBe(404);
 await expect(page.locator('h1')).toContainText('404');
});
test('business website navigation opens a dedicated page on desktop and phone',async({page})=>{
 for(const width of [1440,390,320]){
  await page.setViewportSize({width,height:844});await page.goto('/');
  if(width===1440){await page.getByRole('button',{name:'Services',exact:true}).click();await page.getByRole('menuitem',{name:/Business websites/}).click();}
  else {await page.getByRole('button',{name:'Toggle mobile menu'}).click();await page.getByRole('dialog').locator('summary').filter({hasText:'Services'}).click();await page.getByRole('dialog').getByRole('link',{name:'Business websites',exact:true}).click();}
  await expect(page).toHaveURL(/\/services\/business-websites$/);await expect(page.locator('h1')).toContainText('A proper home');
  await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/business-service-'+width+'.png',fullPage:true});
  await page.getByRole('link',{name:'Discuss your website',exact:true}).first().click();
  await expect(page).toHaveURL(/\/quote$/);await expect(page.locator('#website-quote-form')).toContainText('Business Website · Business package');
  await expect(page.getByLabel('Project budget')).toHaveValue('Rs. 15,000 - 30,000');
 }
});

test('service estimates and calculator totals select matching editable budgets',async({page})=>{
 await page.goto('/services/ecommerce');
 await page.getByRole('button',{name:'Custom App',exact:true}).click();
 await page.getByRole('button',{name:'Get Custom Quote',exact:true}).click();
 await expect(page.getByLabel('Project budget')).toHaveValue('Rs. 30,000+');
 await expect(page.getByLabel('Anything else?')).toHaveValue(/Platform: Custom React/);

 await page.goto('/website-cost-calculator');
 await page.getByRole('link',{name:'Start My Quote',exact:true}).click();
 await expect(page.getByLabel('Project budget')).toHaveValue('Rs. 15,000 - 30,000');
 await page.getByLabel('Project budget').selectOption('Flexible / Custom');
 await page.getByRole('button',{name:'Back',exact:true}).click();
 await page.getByRole('button',{name:/Custom Web App From/}).click();
 await expect(page.getByLabel('Project budget')).toHaveValue('Flexible / Custom');
});
