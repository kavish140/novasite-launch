import { buildMeta } from "@/lib/meta";

export { default } from "@/pages/blog/BlogIndex";

export function meta() {
  return buildMeta({
    title: "Web Design & SEO Blog for Mumbai Businesses | SiteNova",
    description:
      "Expert tips on web design, local SEO, Core Web Vitals, and growing your online presence in Mumbai. From the SiteNova blog.",
    canonicalPath: "/blog",
    keywords: [
      "web design blog Mumbai",
      "local SEO tips Mumbai",
      "website tips for small business",
      "Mumbai digital marketing blog",
    ],
  });
}
