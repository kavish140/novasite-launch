import {z} from "zod";
import {createClient} from "@supabase/supabase-js";
import {PAYMENT_PACKAGES} from "./catalog.ts";
import {packagePricesSchema} from "./pricing-schema.ts";
import {paymentJson,type PaymentEnv,type VerifiedTestAdmin} from "./razorpay.ts";
const amount=z.number().int().min(100).max(100000000);
export {packagePricesSchema} from "./pricing-schema.ts";
const rowSchema=z.object({id:z.string().uuid(),created_at:z.string(),starter_price:amount,starter_advance:amount,business_price:amount,business_advance:amount});
function publicPrices(row:z.infer<typeof rowSchema>){
 const prices=packagePricesSchema.parse({starter:{startingPrice:row.starter_price,advance:row.starter_advance},business:{startingPrice:row.business_price,advance:row.business_advance}});
 return {starter:{...PAYMENT_PACKAGES.starter,...prices.starter},business:{...PAYMENT_PACKAGES.business,...prices.business}};
}
export function pricingStore(env:PaymentEnv){
 const db=createClient(env.SUPABASE_URL!,env.SUPABASE_SERVICE_ROLE_KEY!,{auth:{persistSession:false,autoRefreshToken:false}});
 return {
  async current(){
   const result=await db.from("payment_price_current").select("prices:payment_package_prices(*)").eq("singleton",true).single();
   if(result.error)throw new Error("Package pricing unavailable");
   const row=rowSchema.parse(result.data.prices);return {version:row.id,updatedAt:row.created_at,packages:publicPrices(row)};
  },
  async history(){const result=await db.from("payment_package_prices").select("id,created_at,starter_price,starter_advance,business_price,business_advance").order("created_at",{ascending:false}).order("id").limit(10);if(result.error)throw new Error("Pricing history unavailable");return result.data.map(data=>{const row=rowSchema.parse(data);return {version:row.id,updatedAt:row.created_at,packages:publicPrices(row)};});},
  async save(admin:string,version:string,prices:z.infer<typeof packagePricesSchema>){
   const result=await db.rpc("save_payment_package_prices",{p_admin:admin,p_version:version,p_prices:prices});
   if(result.error){if(result.error.message==="pricing_changed_reload")throw new PricingConflict();throw new Error("Unable to save package pricing");}
   const row=rowSchema.parse(result.data);return {version:row.id,updatedAt:row.created_at,packages:publicPrices(row)};
  },
 };
}
class PricingConflict extends Error{}
export async function pricingAdmin(request:Request,env:PaymentEnv,action:string,admin:VerifiedTestAdmin){
 try{
  const raw=await request.text();if(raw.length>3000)return paymentJson({error:"Request too large"},413);
  const body=JSON.parse(raw);
  if(!env.PAYMENT_RATE_LIMITER||!(await env.PAYMENT_RATE_LIMITER.limit({key:`admin-pricing:${admin.id}`})).success)return paymentJson({error:"Too many pricing requests. Please wait a minute."},429);
  if(action==="pricing"){z.object({}).strict().parse(body);const store=pricingStore(env);return paymentJson({...await store.current(),history:await store.history()});}
  const input=z.object({version:z.string().uuid(),prices:packagePricesSchema}).strict().parse(body);
  return paymentJson(await pricingStore(env).save(admin.id,input.version,input.prices));
 }catch(error){
  if(error instanceof PricingConflict)return paymentJson({error:"Prices changed in another session. Reload pricing before saving."},409);
  if(error instanceof z.ZodError||error instanceof SyntaxError)return paymentJson({error:"Use valid package prices and advances in paise; an advance cannot exceed the starting price."},400);
  return paymentJson({error:"Package pricing unavailable. Prices were not confirmed saved; reload before retrying."},503);
 }
}
