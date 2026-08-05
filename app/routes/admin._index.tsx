import { buildMeta } from "@/lib/meta";

export { default } from "@/pages/admin/AdminLogin";

export function meta() {
  return buildMeta({
    title: "Admin Login | SiteNova",
    description: "SiteNova admin panel login.",
    noindex: true,
  });
}
