/**
 * ActivityLogTab — Scrollable audit trail of all admin actions.
 * Reads from the activity_log table, filters by type and date range.
 */

import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { History, RefreshCw, Loader2, Trash2, CheckCircle2, FileText, Settings, StickyNote, Edit2 } from "lucide-react";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import DateRangeFilter, { filterByDateRange, type DateRangePreset } from "../components/DateRangeFilter";
import type { DateRange } from "react-day-picker";

export type ActivityLog = {
  id: string;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  details?: Record<string, unknown> | null;
  created_at: string;
};

const PAGE_SIZE = 30;

const ACTION_ICONS: Record<string, React.ElementType> = {
  status_change: CheckCircle2,
  note_added:    StickyNote,
  lead_deleted:  Trash2,
  blog_created:  FileText,
  blog_updated:  Edit2,
  blog_deleted:  Trash2,
  setting_changed: Settings,
};

const ACTION_COLOURS: Record<string, string> = {
  status_change:   "text-emerald-400 bg-emerald-500/10",
  note_added:      "text-blue-400 bg-blue-500/10",
  lead_deleted:    "text-red-400 bg-red-500/10",
  blog_created:    "text-purple-400 bg-purple-500/10",
  blog_updated:    "text-amber-400 bg-amber-500/10",
  blog_deleted:    "text-red-400 bg-red-500/10",
  setting_changed: "text-primary bg-primary/10",
};

function describeLog(log: ActivityLog): string {
  const d = log.details as Record<string, string | undefined> | null;
  switch (log.action) {
    case "status_change":
      return `Changed ${log.entity_type.replace("_", " ")} status from "${d?.old_status ?? "?"}" → "${d?.new_status ?? "?"}"${d?.lead_name ? ` for ${d.lead_name}` : ""}`;
    case "note_added":
      return `Added note to ${log.entity_type.replace("_", " ")}${d?.lead_name ? ` — ${d.lead_name}` : ""}`;
    case "lead_deleted":
      return `Deleted ${log.entity_type.replace("_", " ")}${d?.lead_name ? ` — ${d.lead_name}` : ""}`;
    case "blog_created":
      return `Created blog post "${d?.title ?? log.entity_id}"`;
    case "blog_updated":
      return `Updated blog post "${d?.title ?? log.entity_id}"`;
    case "blog_deleted":
      return `Deleted blog post "${d?.title ?? log.entity_id}"`;
    case "setting_changed":
      return `Updated site setting: ${d?.key ?? log.entity_type}`;
    default:
      return `${log.action.replace(/_/g, " ")} on ${log.entity_type}`;
  }
}

export default function ActivityLogTab() {
  const { toast } = useToast();
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [datePreset, setDatePreset] = useState<DateRangePreset>("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [page, setPage] = useState(1);

  useEffect(() => { fetchLogs(); }, []);


  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      setLogs(data ?? []);
    } catch (err: unknown) {
      console.error("Failed to fetch activity log:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    let result = filterByDateRange(logs, datePreset, customRange);
    if (actionFilter !== "all") result = result.filter((l) => l.action === actionFilter);
    return result;
  }, [logs, datePreset, customRange, actionFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const uniqueActions = useMemo(() => [...new Set(logs.map((l) => l.action))], [logs]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v); setPage(1); }}>
          <SelectTrigger className="h-9 w-[160px] bg-card/50 text-sm border-border/40">
            <SelectValue placeholder="All actions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {uniqueActions.map((a) => (
              <SelectItem key={a} value={a}>{a.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangeFilter
          value={datePreset}
          onChange={(preset, range) => { setDatePreset(preset); if (range) setCustomRange(range); setPage(1); }}
          customRange={customRange}
        />

        <Button size="sm" variant="ghost" onClick={fetchLogs} disabled={loading} className="gap-1.5 ml-auto">
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Refresh
        </Button>
      </div>

      {/* Timeline */}
      <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden">
        {loading ? (
          <TableSkeleton columns={4} rows={8} />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={History}
            title="No activity yet"
            description={actionFilter !== "all" || datePreset !== "all"
              ? "No activity matches your current filters."
              : "Admin actions (status changes, blog posts, settings) will appear here."}
          />
        ) : (
          <div className="divide-y divide-border/20">
            {paginated.map((log) => {
              const ActionIcon = ACTION_ICONS[log.action] ?? History;
              const colours = ACTION_COLOURS[log.action] ?? "text-muted-foreground bg-muted/20";
              return (
                <div key={log.id} className="flex items-start gap-4 px-5 py-3.5 hover:bg-muted/10 transition-colors">
                  <div className={`mt-0.5 p-2 rounded-lg flex-shrink-0 ${colours}`}>
                    <ActionIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground/90 leading-snug">{describeLog(log)}</p>
                    {log.entity_id && (
                      <p className="text-[10px] text-muted-foreground/60 font-mono mt-0.5">id: {log.entity_id}</p>
                    )}
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground capitalize">
                      {log.action.replace(/_/g, " ")}
                    </Badge>
                    <p className="text-[11px] text-muted-foreground/60 mt-1 whitespace-nowrap">
                      {format(new Date(log.created_at), "MMM d, HH:mm")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {filtered.length} events · page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 px-3" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
            <Button variant="outline" size="sm" className="h-7 px-3" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
