import { buildMeta } from "@/lib/meta";
import type { LoaderFunctionArgs } from "react-router";
import { paymentConfiguration, paymentJson } from "@/lib/razorpay.server";
export { default } from "@/pages/Pricing";

export async function loader({ context }: LoaderFunctionArgs) {
  const config = await paymentConfiguration(context);
  return paymentJson({ paymentsEnabled: config.enabled, packages: config.packages });
}
export function headers() { return { "Cache-Control": "no-store" }; }

export function meta() {
  return buildMeta({
    title:
      "Website Design Pricing in Mumbai | SiteNova — Plans Starting ₹10,000 Onwards",
    description:
      "Transparent website design pricing in Mumbai. SiteNova plans start from ₹10,000 onwards for landing pages, ₹15,000 onwards for business sites, and custom quotes for e-commerce and web apps.",
    canonicalPath: "/pricing",
    keywords: [
      "website pricing Mumbai",
      "web design cost Mumbai",
      "affordable web design Mumbai",
      "website package India",
      "web design 10000 onwards",
    ],
  });
}
