import { buildMeta } from "@/lib/meta";
import {pricesFromMatches} from "@/lib/package-pricing-meta";
import type { LoaderFunctionArgs } from "react-router";
import { paymentConfiguration, paymentJson } from "@/lib/razorpay.server";
export { default } from "@/pages/Pricing";

export async function loader({ context }: LoaderFunctionArgs) {
  const config = await paymentConfiguration(context);
  return paymentJson({ paymentsEnabled: config.enabled, packages: config.packages,pricingAvailable:config.pricingAvailable });
}
export function headers() { return { "Cache-Control": "no-store" }; }

export function meta({matches=[]}:{matches?:{id:string;data?:unknown}[]}={}) {
  const prices=pricesFromMatches(matches);
  return buildMeta({
    title:
      `Website Design Pricing in Mumbai | SiteNova${prices.starter?` — Plans Starting ${prices.starter} Onwards`:""}`,
    description:
      `Transparent website design pricing in Mumbai. ${prices.starter&&prices.business?`Landing pages from ${prices.starter} and business sites from ${prices.business}.`:"Request a current project quote."} Custom quotes for e-commerce and web apps.`,
    canonicalPath: "/pricing",
    keywords: [
      "website pricing Mumbai",
      "web design cost Mumbai",
      "affordable web design Mumbai",
      "website package India",
    ],
  });
}
