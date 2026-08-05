import { buildMeta } from "@/lib/meta";

export { default } from "@/pages/admin/AdminBlogEditor";

export function meta() {
  return buildMeta({
    title: "Edit Blog Post | SiteNova Admin",
    description: "Edit an existing blog post.",
    noindex: true,
  });
}
