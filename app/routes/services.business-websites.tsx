import {buildMeta} from "@/lib/meta";
import {pricesFromMatches} from "@/lib/package-pricing-meta";
export {default} from "@/pages/services/BusinessWebsites";
export function meta({matches=[]}:{matches?:{id:string;data?:unknown}[]}={}){
 const {business}=pricesFromMatches(matches);
 return buildMeta({title:`Business Website Design in Mumbai | SiteNova${business?` — From ${business}`:""}`,description:`Custom business websites from SiteNova in Mulund, Mumbai. Mobile-friendly design, enquiry forms and technical SEO foundations.${business?` Projects from ${business}.`:" Request a tailored proposal."}`,canonicalPath:"/services/business-websites"});
}
