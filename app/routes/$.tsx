import { buildMeta } from "@/lib/meta";
import { data } from "react-router";

export function loader() { return data(null, { status: 404 }); }

export { default } from "@/pages/NotFound";

export function meta() {
  return buildMeta({
    title: "Page Not Found | SiteNova",
    description: "The page you are looking for does not exist.",
    noindex: true,
  });
}
