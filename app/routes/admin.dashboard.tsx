import { buildMeta } from "@/lib/meta";

export { default } from "@/pages/admin/AdminDashboard";

export function meta() {
  return buildMeta({
    title: "Admin Dashboard | SiteNova",
    description: "SiteNova admin dashboard.",
    noindex: true,
  });
}
