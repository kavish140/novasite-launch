// Index-only route: service detail pages remain independent siblings.
import { buildMeta } from "@/lib/meta";
export { default } from "@/pages/ServicesDirectory";
export function meta() { return buildMeta({ title: "Services | SiteNova", description: "Explore SiteNova services and plan your custom website project.", canonicalPath: "/services" }); }
