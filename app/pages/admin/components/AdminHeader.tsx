import { RefreshCw, Download, Copy, Plus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TAB_LABELS: Record<string, string> = {
  overview:        "Overview",
  leads:           "Audit Requests",
  quote_requests:  "Quote Requests",
  ad_leads:        "Ad Leads",
  ads_inquiries:   "Ad Inquiries",
  analytics:       "LP Analytics",
  blogs:           "Blog Posts",
};

interface AdminHeaderProps {
  activeTab: string;
  loading: boolean;
  onRefresh: () => void;
  onExportCSV: () => void;
  onCopyBlogs: () => void;
}

export default function AdminHeader({
  activeTab,
  loading,
  onRefresh,
  onExportCSV,
  onCopyBlogs,
}: AdminHeaderProps) {
  const isLeadTab = activeTab === "overview" || activeTab === "leads" || activeTab === "ad_leads";
  const isBlogsTab = activeTab === "blogs";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/40 px-6 lg:px-8 bg-background/80 backdrop-blur-xl z-10 sticky top-0">
      {/* Left: sidebar trigger + breadcrumb */}
      <div className="flex items-center gap-2 min-w-0">
        <SidebarTrigger className="-ml-2 flex-shrink-0" />
        <Separator orientation="vertical" className="mr-2 h-4 hidden md:block flex-shrink-0" />
        <div className="flex items-center gap-1.5 text-sm min-w-0">
          <span className="text-muted-foreground hidden sm:inline font-medium">Admin</span>
          <span className="text-muted-foreground hidden sm:inline">/</span>
          <h2 className="font-semibold text-foreground truncate">
            {TAB_LABELS[activeTab] ?? activeTab}
          </h2>
        </div>
      </div>

      {/* Right: contextual actions */}
      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={onRefresh}
          variant="ghost"
          size="icon"
          title="Refresh Data"
          className="flex-shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>

        {isLeadTab && (
          <Button onClick={onExportCSV} variant="outline" size="sm" className="gap-2 flex-shrink-0">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export CSV</span>
          </Button>
        )}

        {isBlogsTab && (
          <div className="flex items-center gap-2">
            <Button onClick={onCopyBlogs} variant="outline" size="sm" className="gap-2 flex-shrink-0">
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copy All</span>
            </Button>
            <Button asChild size="sm" className="gap-2 flex-shrink-0">
              <Link to="/admin/blog/new">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Post</span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
