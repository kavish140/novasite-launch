import { buildMeta } from "@/lib/meta";
import {pricesFromMatches} from "@/lib/package-pricing-meta";
export { default } from "@/pages/Quote";

export function meta({matches=[]}:{matches?:{id:string;data?:unknown}[]}={}) {
  const prices=pricesFromMatches(matches);
  return buildMeta({
    title: `Website Quotes${prices.starter?` Starting from ${prices.starter}`:""} | SiteNova`,
    description:
      `Get a website quote${prices.starter?` starting from ${prices.starter}`:""}. Contact Kavish Ganatra via call, WhatsApp, or email to discuss your custom web development project in Mulund, Mumbai, and nearby areas.`,
    canonicalPath: "/quote",
    keywords: [
      "website quote Mulund",
      "website designer Mumbai",
      "web development quote",
      "website starting price",
    ],
  });
}
