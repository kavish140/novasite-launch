import { buildMeta } from "@/lib/meta";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminDashboard from "@/pages/admin/AdminDashboard";

export default function AdminDashboardRoute() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  );
}

export function meta() {
  return buildMeta({
    title: "Admin Dashboard | SiteNova",
    description: "SiteNova admin dashboard.",
    noindex: true,
  });
}
