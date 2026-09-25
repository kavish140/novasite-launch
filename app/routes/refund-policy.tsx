import RefundPolicy from "@/pages/legal/RefundPolicy";
import { buildMeta } from "@/lib/seo";

export function meta() {
  return buildMeta({
    title: "Refund & Cancellation Policy | SiteNova",
    description: "Refund and Cancellation Policy for SiteNova Web Design Agency.",
    canonicalPath: "/refund-policy",
  });
}

export default RefundPolicy;
