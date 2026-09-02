import { buildMeta } from "@/lib/meta";
import dashboardPreview from "@/assets/dashboard-preview.webp";
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


export function meta() {
  return buildMeta({
    title: "Website Designer in Mumbai | From ₹10,000 | SiteNova",
    description:
      "SiteNova builds fast, SEO-ready websites for Mumbai businesses — mobile-first, delivered in 7–14 days, from ₹10,000. Serving Mulund, Bhandup, Thane, Bandra & all of Mumbai.",
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
