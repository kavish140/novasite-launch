import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/lp/LpThankYouAudit";

export function meta() {
  return buildMeta({
    title: "Audit Request Received | SiteNova",
    description: "Thank you for requesting your free website audit. We will get back to you within 24–48 hours.",
    canonicalPath: "/lp/thank-you-audit",
    noindex: true,
  });
}
