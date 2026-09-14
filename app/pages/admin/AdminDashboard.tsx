import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "@/lib/supabaseClient";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";

// Shared components
import AdminSidebar, { AdminTab } from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";
import ConfirmDialog from "./components/ConfirmDialog";

// Tab components
import OverviewTab from "./tabs/OverviewTab";
import LeadsTab from "./tabs/LeadsTab";
import AdLeadsTab from "./tabs/AdLeadsTab";
import AdsInquiriesTab from "./tabs/AdsInquiriesTab";
import AnalyticsTab from "./tabs/AnalyticsTab";
import BlogsTab from "./tabs/BlogsTab";
import QuoteRequestsTab from "./tabs/QuoteRequestsTab";

// ─── Shared types (exported so tab files can import them) ────────────────────
export type AuditRequest = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  website_url: string;
  status: "pending" | "completed";
  source?: string | null;
  created_at: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  tags?: string[];
  created_at: string;
};

export type AdsInquiry = {
  id: string;
  name: string;
  phone: string;
  business_name: string;
  platform: string;
  monthly_budget: string;
  industry: string;
  goals: string;
  status: "new" | "contacted" | "closed";
  created_at: string;
};

export type PageView = {
  id: string;
  page: string;
  referrer: string | null;
  created_at: string;
};

export type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  mobile?: string | null;
  project_type?: string | null;
  budget?: string | null;
  timeline?: string | null;
  requirements?: string | null;
  status: "new" | "contacted" | "converted" | "lost";
  created_at: string;
};
// ────────────────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [requests, setRequests] = useState<AuditRequest[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [adsInquiries, setAdsInquiries] = useState<AdsInquiry[]>([]);
  const [quoteRequests, setQuoteRequests] = useState<QuoteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  // ConfirmDialog state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Data fetching ──────────────────────────────────────────────────────────
  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, postsRes, pvRes, adsRes, quoteRes] = await Promise.all([
        supabase.from("audit_requests").select("*").order("created_at", { ascending: false }),
        supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
        supabase.from("page_views").select("*").eq("page", "/lp/web-design").order("created_at", { ascending: false }),
        supabase.from("ads_inquiries").select("*").order("created_at", { ascending: false }),
        supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
      ]);

      if (reqRes.error) throw reqRes.error;
      if (postsRes.error) throw postsRes.error;
      if (!pvRes.error) setPageViews(pvRes.data ?? []);
      if (!adsRes.error) setAdsInquiries(adsRes.data ?? []);
      if (!quoteRes.error) setQuoteRequests(quoteRes.data ?? []);

      setRequests(reqRes.data ?? []);
      setPosts(postsRes.data ?? []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      toast({ title: "Error", description: "Failed to load dashboard data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ── Mutations ──────────────────────────────────────────────────────────────
  const updateRequestStatus = async (id: string, newStatus: "pending" | "completed") => {
    try {
      const { data, error } = await supabase
        .from("audit_requests")
        .update({ status: newStatus })
        .eq("id", id)
        .select();
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Update failed — check Supabase RLS policies for 'audit_requests'.");
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      toast({ title: "Success", description: `Request marked as ${newStatus}.` });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update request.";
      toast({ title: "Update Failed", description: msg, variant: "destructive" });
    }
  };

  const updateInquiryStatus = async (id: string, newStatus: AdsInquiry["status"]) => {
    try {
      const { error } = await supabase
        .from("ads_inquiries")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setAdsInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
      toast({ title: "Updated", description: `Inquiry status set to "${newStatus}".` });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update inquiry.";
      toast({ title: "Update Failed", description: msg, variant: "destructive" });
    }
  };

  const updateQuoteStatus = async (id: string, newStatus: QuoteRequest["status"]) => {
    try {
      const { error } = await supabase
        .from("quote_requests")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      setQuoteRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r)));
      toast({ title: "Updated", description: `Quote status set to "${newStatus}".` });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to update quote request.";
      toast({ title: "Update Failed", description: msg, variant: "destructive" });
    }
  };

  // ── Delete blog post (now uses ConfirmDialog instead of window.confirm) ────
  const handleDeleteClick = (id: string) => {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  };

  const executeDeletePost = async () => {
    if (!pendingDeleteId) return;
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .delete()
        .eq("id", pendingDeleteId)
        .select();
      if (error) throw error;
      if (!data || data.length === 0)
        throw new Error("Delete failed — check Supabase RLS policies for 'blog_posts'.");
      setPosts((prev) => prev.filter((p) => p.id !== pendingDeleteId));
      toast({ title: "Deleted", description: "Blog post deleted." });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Failed to delete post.";
      toast({ title: "Delete Failed", description: msg, variant: "destructive" });
    } finally {
      setPendingDeleteId(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin");
  };

  // ── Export helpers ─────────────────────────────────────────────────────────
  const handleExportCSV = () => {
    if (requests.length === 0) {
      toast({ title: "No Data", description: "There are no requests to export." });
      return;
    }
    const headers = ["Date", "Name", "Email", "Mobile", "Website", "Status", "Source"];
    const csvRows = [headers.join(",")];
    requests.forEach((req) => {
      const row = [
        format(new Date(req.created_at), "yyyy-MM-dd HH:mm:ss"),
        `"${req.name.replace(/"/g, '""')}"`,
        `"${req.email.replace(/"/g, '""')}"`,
        `"${(req.mobile || "").replace(/"/g, '""')}"`,
        `"${req.website_url.replace(/"/g, '""')}"`,
        req.status,
        req.source ?? "organic",
      ];
      csvRows.push(row.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `sitenova-leads-${format(new Date(), "yyyy-MM-dd")}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({ title: "Export started" });
  };

  const handleCopyBlogs = () => {
    if (posts.length === 0) {
      toast({ title: "No Data", description: "No blog posts to copy." });
      return;
    }
    navigator.clipboard
      .writeText(JSON.stringify(posts, null, 2))
      .then(() => toast({ title: "Copied!", description: "All blog data copied as JSON." }))
      .catch(() => toast({ title: "Error", description: "Failed to copy.", variant: "destructive" }));
  };

  // ── Derived ────────────────────────────────────────────────────────────────
  const allAdLeads = requests.filter((r) => r.source === "paid_ad");

  const badges = {
    leads:          requests.filter((r) => r.status !== "completed" && r.source !== "paid_ad").length,
    quote_requests: quoteRequests.filter((r) => r.status === "new").length,
    ad_leads:       allAdLeads.filter((r) => r.status !== "completed").length,
    ads_inquiries:  adsInquiries.filter((i) => i.status === "new").length,
  };

  // ── Tab content map ────────────────────────────────────────────────────────
  const tabContent: Record<AdminTab, React.ReactNode> = {
    overview: (
      <OverviewTab requests={requests} posts={posts} allAdLeads={allAdLeads} />
    ),
    leads: (
      <LeadsTab
        requests={requests}
        loading={loading}
        onUpdateStatus={updateRequestStatus}
      />
    ),
    quote_requests: (
      <QuoteRequestsTab
        quoteRequests={quoteRequests}
        loading={loading}
        onUpdateStatus={updateQuoteStatus}
      />
    ),
    ad_leads: (
      <AdLeadsTab
        allAdLeads={allAdLeads}
        loading={loading}
        onUpdateStatus={updateRequestStatus}
      />
    ),
    ads_inquiries: (
      <AdsInquiriesTab
        adsInquiries={adsInquiries}
        loading={loading}
        onUpdateInquiryStatus={updateInquiryStatus}
      />
    ),
    analytics: (
      <AnalyticsTab
        pageViews={pageViews}
        allAdLeads={allAdLeads}
        loading={loading}
      />
    ),
    blogs: (
      <BlogsTab
        posts={posts}
        loading={loading}
        onDeletePost={handleDeleteClick}
      />
    ),
  };

  return (
    <SidebarProvider>
      <AdminSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        badges={badges}
        onLogout={handleLogout}
      />

      <SidebarInset>
        <AdminHeader
          activeTab={activeTab}
          loading={loading}
          onRefresh={fetchData}
          onExportCSV={handleExportCSV}
          onCopyBlogs={handleCopyBlogs}
        />

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
            >
              {tabContent[activeTab]}
            </motion.div>
          </AnimatePresence>
        </div>
      </SidebarInset>

      {/* Delete confirmation dialog (managed here so BlogsTab stays pure) */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Blog Post?"
        description="This will permanently delete the post and cannot be undone."
        confirmLabel="Delete"
        onConfirm={executeDeletePost}
      />
    </SidebarProvider>
  );
}
