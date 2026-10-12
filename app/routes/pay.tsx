import type { LoaderFunctionArgs } from "react-router";
import { buildMeta } from "@/lib/meta";
import { paymentConfiguration, paymentJson } from "@/lib/razorpay.server";
export { default } from "@/pages/Pay";
export async function loader({ context }: LoaderFunctionArgs) {
  return paymentJson(await paymentConfiguration(context));
}
export function headers() { return { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" }; }
export function meta() { return buildMeta({ title: "Pay Your Project Advance | SiteNova", description: "Pay an advance for your SiteNova website project.", canonicalPath: "/pay", noindex: true }); }
