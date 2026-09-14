import { buildMeta } from "@/lib/meta";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminBlogEditor from "@/pages/admin/AdminBlogEditor";

export default function AdminBlogEditRoute() {
  return (
    <ProtectedRoute>
      <AdminBlogEditor />
    </ProtectedRoute>
  );
}

export function meta() {
  return buildMeta({
    title: "Edit Blog Post | SiteNova Admin",
    description: "Edit an existing blog post.",
    noindex: true,
  });
}
