import TermsAndConditions from "@/pages/legal/TermsAndConditions";
import { buildMeta } from "@/lib/meta";

export function meta() {
  return buildMeta({
    title: "Terms & Conditions | SiteNova",
    description: "Terms & Conditions for SiteNova Web Design Agency.",
    canonicalPath: "/terms-and-conditions",
  });
}

export default TermsAndConditions;
