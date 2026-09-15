import { format } from "date-fns";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StatusBadge from "./StatusBadge";
import QuickActions from "./QuickActions";
import type { AuditRequest } from "../AdminDashboard";
import type { DrawerLead } from "./LeadDetailDrawer";

interface LeadCardProps {
  lead: AuditRequest;
  onResolve: () => void;
  onReopen: () => void;
  onOpenDrawer: (data: DrawerLead) => void;
  isAdLead?: boolean;
}

export default function LeadCard({
  lead,
  onResolve,
  onReopen,
  onOpenDrawer,
  isAdLead = false,
}: LeadCardProps) {
  const isPending = lead.status !== "completed";

  return (
    <div
      className={`relative bg-card/60 border rounded-xl p-4 space-y-3 cursor-pointer hover:border-primary/30 transition-colors ${
        isPending ? "border-border/60" : "border-border/30 opacity-75"
      }`}
      onClick={() =>
        onOpenDrawer({ type: "audit_request", lead })
      }
    >
      {/* Top row: status badge + date */}
      <div className="flex items-center justify-between">
        <StatusBadge status={isAdLead && isPending ? "paid_ad" : lead.status} />
        <span className="text-[11px] text-muted-foreground">
          {format(new Date(lead.created_at), "MMM d, yyyy")}
        </span>
      </div>

      {/* Name + email */}
      <div>
        <p className={`font-semibold text-sm leading-tight ${!isPending ? "text-muted-foreground" : ""}`}>
          {lead.name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">{lead.email}</p>
      </div>

      {/* Website */}
      {lead.website_url && isPending && (
        <a
          href={
            lead.website_url.startsWith("http")
              ? lead.website_url
              : `https://${lead.website_url}`
          }
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-3 h-3" />
          {lead.website_url}
        </a>
      )}

      {/* Footer: quick actions + resolve button */}
      <div
        className="flex items-center justify-between pt-1 border-t border-border/20"
        onClick={(e) => e.stopPropagation()}
      >
        <QuickActions name={lead.name} phone={lead.mobile} email={lead.email} />
        {isPending ? (
          <Button size="sm" className="h-7 text-xs px-3" onClick={onResolve}>
            Resolve
          </Button>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-xs px-3 text-muted-foreground"
            onClick={onReopen}
          >
            Reopen
          </Button>
        )}
      </div>
    </div>
  );
}
