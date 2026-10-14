import {z} from "zod";
export const LEGACY_PRICING_VERSION="00000000-0000-4000-8000-000000000000";
const amount=z.number().int().min(100).max(100000000);
const pair=z.object({startingPrice:amount,advance:amount}).strict().refine(p=>p.advance<=p.startingPrice,"Advance cannot exceed the starting price");
export const packagePricesSchema=z.object({starter:pair,business:pair}).strict();
export type PackagePrices=z.infer<typeof packagePricesSchema>;
export const publicCatalogSchema=z.object({starter:pair.innerType().extend({name:z.string(),description:z.string()}).refine(p=>p.advance<=p.startingPrice),business:pair.innerType().extend({name:z.string(),description:z.string()}).refine(p=>p.advance<=p.startingPrice)});
// Decimal strings are converted exactly; no binary floating point rupee rounding.
export function rupeesToPaise(value:string){
 if(!/^\d+(?:\.\d{1,2})?$/.test(value.trim()))throw new Error("Enter a positive rupee amount with at most two decimal places.");
 const [whole,fraction=""]=value.trim().split(".");const paise=Number(whole)*100+Number(fraction.padEnd(2,"0"));
 return amount.parse(paise);
}
