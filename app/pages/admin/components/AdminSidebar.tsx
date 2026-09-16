import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
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
} from "lucide-react";

export type AdminTab =
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



interface NavItem {
  id: AdminTab;
  label: string;
  icon: React.ElementType;
  badge?: number;
  group: "main" | "marketing";
}

interface AdminSidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  badges: {
    leads: number;
    quote_requests: number;
    ad_leads: number;
    ads_inquiries: number;
    drafts: number;
  };
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  onTabChange,
  badges,
  onLogout,
}: AdminSidebarProps) {
  const mainNav: NavItem[] = [
    { id: "overview",       label: "Overview",       icon: LayoutDashboard, group: "main" },
    { id: "leads",          label: "Audit Requests", icon: Users, badge: badges.leads, group: "main" },
    { id: "quote_requests", label: "Quote Requests", icon: FileSignature, badge: badges.quote_requests, group: "main" },
    { id: "drafts",         label: "AI Drafts",      icon: Bot, badge: badges.drafts, group: "main" },
    { id: "topics",         label: "Topic Queue",    icon: ListChecks, group: "main" },
    { id: "blogs",          label: "Blog Posts",     icon: FileText, group: "main" },
  ];

  const marketingNav: NavItem[] = [
    { id: "ad_leads",       label: "Ad Leads",     icon: Megaphone, badge: badges.ad_leads, group: "marketing" },
    { id: "ads_inquiries",  label: "Ad Inquiries", icon: Target, badge: badges.ads_inquiries, group: "marketing" },
    { id: "analytics",      label: "LP Analytics", icon: TrendingUp, group: "marketing" },
  ];


  const renderNavItem = (item: NavItem) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;
    return (
      <SidebarMenuItem key={item.id}>
        <SidebarMenuButton
          isActive={isActive}
          onClick={() => onTabChange(item.id)}
          className={`flex justify-between transition-all duration-150 ${
            isActive
              ? "bg-primary/10 text-primary font-medium border-l-2 border-primary -ml-px pl-[calc(0.5rem+1px)]"
              : "hover:bg-muted/50"
          }`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </div>
          {item.badge !== undefined && item.badge > 0 && (
            <SidebarMenuBadge className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              {item.badge}
            </SidebarMenuBadge>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar variant="inset" className="border-r border-border/40">
      {/* Brand */}
      <SidebarHeader className="border-b border-border/30">
        <div className="flex items-center gap-2.5 px-3 py-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_12px_hsl(var(--primary)/0.4)] flex-shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-base tracking-tight block leading-tight">SiteNova</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Panel</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-2 overflow-x-hidden overflow-y-auto">
        {/* Main */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
            General
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{mainNav.map(renderNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-3 my-2 bg-border/30" />

        {/* Marketing */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
            Marketing
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{marketingNav.map(renderNavItem)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="mx-3 my-2 bg-border/30" />

        {/* System */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-3 mb-1">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {[
                { id: "settings" as AdminTab,      label: "Settings",      icon: Settings,  group: "main" as const },
                { id: "activity_log" as AdminTab,  label: "Activity Log",  icon: History,   group: "main" as const },
              ].map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/30 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={onLogout}
              className="text-muted-foreground hover:text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
