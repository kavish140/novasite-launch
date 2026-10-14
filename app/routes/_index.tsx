import { buildMeta } from "@/lib/meta";
import {pricesFromMatches} from "@/lib/package-pricing-meta";
import dashboardPreview from "@/assets/Drdiptiganatra.webp";
export { default } from "@/pages/Index";

export function links() {
  return [
    // Preload the hero LCP image — Vite-hashed URL injected at SSR time so the
    // browser preload scanner discovers it before React hydrates.
    {
      rel: "preload",
      as: "image",
      href: dashboardPreview,
      fetchpriority: "high",
    } as const,
  ];
}


export function meta({matches=[]}:{matches?:{id:string;data?:unknown}[]}={}) {
  const prices=pricesFromMatches(matches);
  return buildMeta({
    title: `Website Designer in Mumbai${prices.starter?` | From ${prices.starter}`:""} | SiteNova`,
    description:
      `SiteNova builds fast, SEO-ready websites for Mumbai businesses — mobile-first, delivered in 7–14 days${prices.starter?`, from ${prices.starter}`:""}. Serving Mulund, Bhandup, Thane, Bandra & all of Mumbai.`,
    canonicalPath: "/",
    keywords: [
      "website designer in Mumbai",
      "web design company Mumbai",
      "business website design Mumbai",
      "affordable web design Mumbai",
      "website developer Mumbai",
      "local SEO Mumbai",
      "website designer near me",
      "web development company Mumbai",
    ],
  });
}
