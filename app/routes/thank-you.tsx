import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/ThankYou";

export function meta() {
  return buildMeta({
    title: "Request Received | SiteNova",
    description: "Thank you for your request. We will get back to you shortly.",
    canonicalPath: "/thank-you",
  });
}
