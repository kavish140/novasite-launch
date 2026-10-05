import { Link } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CalendarDays,
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Megaphone,
  TrendingUp,
  Target,
  Zap,
  FileSignature,
  Settings,
  History,
  Bot,
  ListChecks,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type AdminTab =
  | "scheduled_calls"
  | "overview"
  | "leads"
  | "quote_requests"
  | "ad_leads"
  | "ads_inquiries"
  | "analytics"
  | "blogs"
  | "drafts"
  | "topics"
  | "settings"
  | "activity_log";
interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  badges: {
    scheduled_calls: number;
    leads: number;
    quote_requests: number;
    ad_leads: number;
    ads_inquiries: number;
    drafts: number;
  };
  onLogout: () => void;
}
type NavItem = {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
};
export default function AdminSidebar({
  activeTab,
  onTabChange,
  badges,
  onLogout,
}: AdminSidebarProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  const groups: { label: string; items: NavItem[] }[] = [
    {
      label: "Workspace",
      items: [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        {
          id: "scheduled_calls",
          label: "Scheduled calls",
          icon: CalendarDays,
          badge: badges.scheduled_calls,
        },
        {
          id: "quote_requests",
          label: "Quote requests",
          icon: FileSignature,
          badge: badges.quote_requests,
        },
        {
          id: "leads",
          label: "Audit requests",
          icon: Users,
          badge: badges.leads,
        },
      ],
    },
    {
      label: "Marketing",
      items: [
        {
          id: "ad_leads",
          label: "Ad leads",
          icon: Megaphone,
          badge: badges.ad_leads,
        },
        {
          id: "ads_inquiries",
          label: "Ad inquiries",
          icon: Target,
          badge: badges.ads_inquiries,
        },
        { id: "analytics", label: "Landing page analytics", icon: TrendingUp },
      ],
    },
    {
      label: "Content",
      items: [
        { id: "blogs", label: "Blog posts", icon: FileText },
        { id: "drafts", label: "AI drafts", icon: Bot, badge: badges.drafts },
        { id: "topics", label: "Topic queue", icon: ListChecks },
      ],
    },
    {
      label: "Manage",
      items: [
        { id: "settings", label: "Settings", icon: Settings },
        { id: "activity_log", label: "Activity log", icon: History },
      ],
    },
  ];
  return (
    <Sidebar className="border-r-0">
      <div className="admin-nav flex h-full flex-col">
        <SidebarHeader className="px-6 pb-5 pt-7">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 text-white"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
              <Zap className="h-5 w-5" />
            </span>
            <span className="text-xl font-semibold tracking-tight">
              SiteNova
              <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[.2em] text-slate-400">
                Admin workspace
              </span>
            </span>
          </Link>
        </SidebarHeader>
        <SidebarContent className="gap-1 px-3 pb-4">
          {groups.map((group) => (
            <SidebarGroup key={group.label} className="py-2">
              <SidebarGroupLabel className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-[.16em] text-slate-500">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {group.items.map(({ id, label, icon: Icon, badge }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        isActive={activeTab === id}
                        aria-current={activeTab === id ? "page" : undefined}
                        onClick={() => {
                          onTabChange(id);
                          if (isMobile) setOpenMobile(false);
                        }}
                        className={cn(
                          "h-10 rounded-lg px-3 text-[13px] transition-colors",
                          activeTab === id
                            ? "bg-indigo-500/20 text-indigo-200 data-[active=true]:bg-indigo-500/20 data-[active=true]:text-indigo-200"
                            : "text-slate-400 hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{label}</span>
                        {!!badge && (
                          <span
                            className={cn(
                              "ml-auto rounded-md px-1.5 py-0.5 text-[10px] tabular-nums",
                              activeTab === id
                                ? "bg-indigo-400/20 text-indigo-200"
                                : "bg-slate-800 text-slate-300",
                            )}
                          >
                            {badge}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>
        <SidebarFooter className="gap-3 border-t border-white/5 p-5">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between rounded-lg border border-white/10 px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5"
          >
            View website
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
