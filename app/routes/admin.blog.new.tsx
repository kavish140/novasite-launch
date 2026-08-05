import { buildMeta } from "@/lib/meta";

export { default } from "@/pages/admin/AdminBlogEditor";

export function meta() {
  return buildMeta({
    title: "New Blog Post | SiteNova Admin",
    description: "Create a new blog post.",
    noindex: true,
  });
}
