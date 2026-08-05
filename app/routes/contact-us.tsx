import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/Contact";

export function meta() {
  return buildMeta({
    title: "Contact Us | SiteNova Web Development",
    description:
      "Get in touch with SiteNova for custom web development. Call us directly, send a WhatsApp message, or request a quote for your next project.",
    canonicalPath: "/contact-us",
  });
}
