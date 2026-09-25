import PrivacyPolicy from "@/pages/legal/PrivacyPolicy";
import { buildMeta } from "@/lib/meta";

export function meta() {
  return buildMeta({
    title: "Privacy Policy | SiteNova",
    description: "Privacy Policy for SiteNova Web Design Agency.",
    canonicalPath: "/privacy-policy",
  });
}

export default PrivacyPolicy;
