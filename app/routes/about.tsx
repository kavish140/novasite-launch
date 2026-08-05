import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/About";

export function meta() {
  return buildMeta({
    title:
      "About SiteNova — Web Design Agency Founded by Kavish Ganatra | Mulund, Mumbai",
    description:
      "SiteNova (sitenova.dev) is a custom web design and development agency founded by Kavish Ganatra in Mulund, Mumbai. We build React and Next.js websites with 90+ PageSpeed scores for businesses across Mumbai. Not affiliated with sitenovaagency.com.",
    canonicalPath: "/about",
    keywords: [
      "about SiteNova",
      "SiteNova web design Mumbai",
      "Kavish Ganatra web developer",
      "web design agency Mulund",
      "sitenova.dev about",
      "custom web development Mumbai",
    ],
  });
}
