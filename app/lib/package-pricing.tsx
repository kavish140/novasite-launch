import {createContext,useContext} from "react";
import {PAYMENT_PACKAGES} from "../../supabase/functions/_shared/catalog";
import {type PackageCatalog} from "./payments";
export type PublicPricing={packages:PackageCatalog;available:boolean;enabled?:boolean};
export const PackagePricingContext=createContext<PublicPricing>({packages:PAYMENT_PACKAGES,available:true});
export function usePackagePricing(){const {packages,available,enabled}=useContext(PackagePricingContext);const format=(amount:number)=>new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",minimumFractionDigits:0,maximumFractionDigits:2}).format(amount/100);return {packages,available,paymentsEnabled:available&&enabled===true,starterPrice:available?format(packages.starter.startingPrice):"a custom quote",businessPrice:available?format(packages.business.startingPrice):"a custom quote"};}
