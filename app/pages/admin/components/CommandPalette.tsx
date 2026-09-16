/**
 * CommandPalette — Cmd+K / Ctrl+K quick nav using shadcn Command dialog.
 * Supports: tab navigation, new blog post, search leads by name/email.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard, Users, FileText, Megaphone, TrendingUp,
  Target, Plus, Settings, History, FileSignature, Bot, ListChecks,
} from "lucide-react";
import type { AdminTab } from "./AdminSidebar";
import type { AuditRequest, QuoteRequest } from "../AdminDashboard";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTabChange: (tab: AdminTab) => void;
  requests: AuditRequest[];
  quoteRequests: QuoteRequest[];
}

const TAB_COMMANDS: { tab: AdminTab; label: string; icon: React.ElementType }[] = [
  { tab: "overview",       label: "Overview",        icon: LayoutDashboard },
  { tab: "leads",          label: "Audit Requests",  icon: Users },
  { tab: "quote_requests", label: "Quote Requests",  icon: FileSignature },
  { tab: "ad_leads",       label: "Ad Leads",        icon: Megaphone },
  { tab: "ads_inquiries",  label: "Ad Inquiries",    icon: Target },
  { tab: "analytics",      label: "LP Analytics",    icon: TrendingUp },
  { tab: "drafts",         label: "AI Drafts",       icon: Bot },
  { tab: "topics",         label: "Topic Queue",     icon: ListChecks },
  { tab: "blogs",          label: "Blog Posts",      icon: FileText },
  { tab: "settings",       label: "Settings",        icon: Settings },
  { tab: "activity_log",   label: "Activity Log",    icon: History },
];

export default function CommandPalette({
  open,
  onOpenChange,
  onTabChange,
  requests,
  quoteRequests,
}: CommandPaletteProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  // Filter leads by name/email matching query
  const matchedLeads = query.length > 1
    ? requests.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.email.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const matchedQuotes = query.length > 1
    ? quoteRequests.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.email.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 3)
    : [];

  const goTo = (tab: AdminTab) => {
    onTabChange(tab);
    onOpenChange(false);
    setQuery("");
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Type a command or search leads…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigate">
          {TAB_COMMANDS.map(({ tab, label, icon: Icon }) => (
            <CommandItem
              key={tab}
              value={label}
              onSelect={() => goTo(tab)}
              className="gap-2"
            >
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span>{label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Actions */}
        <CommandGroup heading="Actions">
          <CommandItem
            value="create new blog post"
            onSelect={() => { navigate("/admin/blog/new"); onOpenChange(false); }}
            className="gap-2"
          >
            <Plus className="w-4 h-4 text-muted-foreground" />
            <span>Create New Blog Post</span>
          </CommandItem>
        </CommandGroup>

        {/* Lead search results */}
        {matchedLeads.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Audit Requests">
              {matchedLeads.map((lead) => (
                <CommandItem
                  key={lead.id}
                  value={`${lead.name} ${lead.email}`}
                  onSelect={() => goTo("leads")}
                  className="gap-2"
                >
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{lead.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{lead.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {matchedQuotes.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Quote Requests">
              {matchedQuotes.map((q) => (
                <CommandItem
                  key={q.id}
                  value={`quote ${q.name} ${q.email}`}
                  onSelect={() => goTo("quote_requests")}
                  className="gap-2"
                >
                  <FileSignature className="w-4 h-4 text-muted-foreground" />
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">{q.name}</span>
                    <span className="text-xs text-muted-foreground truncate">{q.email}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
