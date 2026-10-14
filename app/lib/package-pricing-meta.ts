import {publicCatalogSchema} from "../../supabase/functions/_shared/pricing-schema";
export function pricesFromMatches(matches:{id:string;data?:unknown}[]=[]){
 const data=matches.find(match=>match.id==="root")?.data as {pricing?:{available?:boolean;packages?:unknown}}|undefined;
 if(!data?.pricing?.available)return {starter:null,business:null};
 const parsed=publicCatalogSchema.safeParse(data.pricing.packages);if(!parsed.success)return {starter:null,business:null};
 const format=(amount:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:0,maximumFractionDigits:2}).format(amount/100);
 return {starter:format(parsed.data.starter.startingPrice),business:format(parsed.data.business.startingPrice)};
}
