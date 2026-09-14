import { Badge } from "@/components/ui/badge";

type StatusConfig = {
  label: string;
  className: string;
};

const STATUS_MAP: Record<string, StatusConfig> = {
  // audit_requests
  pending:   { label: "Pending",   className: "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" },
  completed: { label: "Resolved",  className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" },
  // ads_inquiries
  new:       { label: "New",       className: "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20" },
  contacted: { label: "Contacted", className: "bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20" },
  closed:    { label: "Closed",    className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20" },
  // ad leads
  paid_ad:   { label: "Ad Lead",   className: "bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20" },
  // quote_requests (prefixed to avoid collision with ads_inquiries "new"/"contacted")
  quote_new:       { label: "New",       className: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20" },
  quote_contacted: { label: "Contacted", className: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20" },
  quote_converted: { label: "Converted", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20" },
  quote_lost:      { label: "Lost",      className: "bg-secondary/50 text-muted-foreground border-border/40" },
};


export default function StatusBadge({ status }: { status: string }) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    className: "bg-secondary/50 text-secondary-foreground border-border/40",
  };

  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  );
}
