import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/lp/LpThankYouQuote";

export function meta() {
  return buildMeta({
    title: "Quote Request Received | SiteNova",
    description: "Thank you for your quote request. We will get back to you shortly.",
    canonicalPath: "/lp/thank-you-quote",
    noindex: true,
  });
}
