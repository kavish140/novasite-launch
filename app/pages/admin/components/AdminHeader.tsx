import {
  RefreshCw,
  Download,
  Copy,
  Plus,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
export const TAB_LABELS: Record<string, string> = {
  scheduled_calls: "Scheduled calls",
  overview: "Overview",
  leads: "Audit requests",
  quote_requests: "Quote requests",
  ad_leads: "Ad leads",
  ads_inquiries: "Ad inquiries",
  analytics: "Landing page analytics",
  blogs: "Blog posts",
  drafts: "AI drafts",
  topics: "Topic queue",
  settings: "Settings",
  activity_log: "Activity log",
};
export const TAB_DESCRIPTIONS: Record<string, string> = {
  overview: "A clear view of your leads, calls, and content.",
  scheduled_calls: "Keep upcoming conversations and Calendar updates in view.",
  leads: "Review website audit requests and manage your follow-ups.",
  quote_requests:
    "Move new project inquiries from first contact to conversion.",
  ad_leads: "Follow up with leads from your paid campaigns.",
  ads_inquiries: "Manage inquiries for Google and Meta advertising.",
  analytics: "Understand how your landing page brings in leads.",
  blogs: "Manage your articles, drafts, and published content.",
  drafts: "Review generated content and add your own experience.",
  topics: "Plan what to write next and manage your content queue.",
  settings: "Manage your announcement, bookings, and account.",
  activity_log: "Review recent changes across your workspace.",
};
interface Props {
  activeTab: string;
  loading: boolean;
  onRefresh: () => void;
  onExportCSV: () => void;
  onCopyBlogs: () => void;
  onSearch: () => void;
}
export default function AdminHeader({
  activeTab,
  loading,
  onRefresh,
  onExportCSV,
  onCopyBlogs,
  onSearch,
}: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const isLeadTab = ["overview", "leads", "ad_leads"].includes(activeTab);
  const isBlogsTab = ["blogs", "drafts"].includes(activeTab);
  return (
    <header className="sticky top-0 z-10 flex min-h-16 flex-wrap items-center gap-2 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-xl sm:px-8">
      <SidebarTrigger className="shrink-0" />
      <div className="mr-auto hidden items-center gap-2 text-xs sm:flex">
        <span className="text-muted-foreground">Workspace</span>
        <span className="text-muted-foreground/50">/</span>
        <span className="font-medium">{TAB_LABELS[activeTab]}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onSearch}
        className="mr-auto gap-2 text-muted-foreground sm:mr-3"
        aria-label="Search workspace"
      >
        <Search className="h-4 w-4" />
        <span className="hidden md:inline">Search workspace</span>
        <kbd className="ml-5 hidden rounded border px-1.5 text-[10px] lg:inline">
          Ctrl K
        </kbd>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label="Toggle color theme"
      >
        <Sun className="hidden h-4 w-4 dark:block" />
        <Moon className="h-4 w-4 dark:hidden" />
      </Button>
      <Button
        onClick={onRefresh}
        disabled={loading}
        variant="ghost"
        size="icon"
        aria-label="Refresh data"
      >
        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
      </Button>
      {isLeadTab && (
        <Button
          onClick={onExportCSV}
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Export CSV"
        >
          <Download className="h-4 w-4" />
          <span className="hidden md:inline">Export CSV</span>
        </Button>
      )}
      {isBlogsTab && (
        <Button
          onClick={onCopyBlogs}
          variant="outline"
          size="sm"
          aria-label="Copy all blogs"
        >
          <Copy className="h-4 w-4" />
        </Button>
      )}
      <Button asChild size="sm" className="gap-2">
        <Link to="/admin/blog/new" aria-label="Create new post">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New post</span>
        </Link>
      </Button>
    </header>
  );
}
