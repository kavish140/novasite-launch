import { buildMeta } from "@/lib/meta";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminBlogEditor from "@/pages/admin/AdminBlogEditor";

export default function AdminBlogNewRoute() {
  return (
    <ProtectedRoute>
      <AdminBlogEditor />
    </ProtectedRoute>
  );
}

export function meta() {
  return buildMeta({
    title: "New Blog Post | SiteNova Admin",
    description: "Create a new blog post.",
    noindex: true,
  });
}
