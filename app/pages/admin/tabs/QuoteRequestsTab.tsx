import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search, FileSignature, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PhoneCell from "../components/PhoneCell";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import QuickActions from "../components/QuickActions";
import BulkActionBar from "../components/BulkActionBar";
import LeadDetailDrawer, { type DrawerLead } from "../components/LeadDetailDrawer";
import DateRangeFilter, {
  filterByDateRange,
  type DateRangePreset,
} from "../components/DateRangeFilter";
import type { DateRange } from "react-day-picker";
import type { QuoteRequest } from "../AdminDashboard";

type SortField = "created_at" | "name" | "project_type" | "budget";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 20;

interface QuoteRequestsTabProps {
  quoteRequests: QuoteRequest[];
  loading: boolean;
  onUpdateStatus: (id: string, status: QuoteRequest["status"]) => Promise<void>;
  onBulkResolve: (ids: string[]) => Promise<void>;
}

export default function QuoteRequestsTab({
  quoteRequests,
  loading,
  onUpdateStatus,
  onBulkResolve,
}: QuoteRequestsTabProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerData, setDrawerData] = useState<DrawerLead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (lead: QuoteRequest) => {
    setDrawerData({ type: "quote_request", lead });
    setDrawerOpen(true);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (rows: QuoteRequest[]) => {
    const allSel = rows.every((r) => selectedIds.has(r.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rows.forEach((r) => allSel ? next.delete(r.id) : next.add(r.id));
      return next;
    });
  };

  const exportSelected = (rows: QuoteRequest[]) => {
    const sel = rows.filter((r) => selectedIds.has(r.id));
    if (!sel.length) return;
    const headers = ["Date", "Name", "Email", "Mobile", "Project", "Budget", "Status"];
    const csv = [
      headers.join(","),
      ...sel.map((r) => [
        format(new Date(r.created_at), "yyyy-MM-dd HH:mm"),
        `"${r.name}"`, `"${r.email}"`, `"${r.mobile || ""}"`,
        `"${r.project_type || ""}"`, `"${r.budget || ""}"`, r.status,
      ].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `quote-requests-selected-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    setSelectedIds(new Set());
  };

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [datePreset, setDatePreset] = useState<DateRangePreset>("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
    setPage(1);
  };

  const handleDateChange = (preset: DateRangePreset, range?: DateRange) => {
    setDatePreset(preset);
    if (range) setCustomRange(range);
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  const SortHead = ({
    field, children, className = "",
  }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead
      className={`cursor-pointer select-none hover:text-foreground transition-colors ${className}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        <SortIcon field={field} />
      </div>
    </TableHead>
  );

  const filtered = useMemo(() => {
    const afterDate = filterByDateRange(quoteRequests, datePreset, customRange);
    const q = search.toLowerCase();
    return afterDate.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.mobile && r.mobile.includes(q)) ||
        (r.project_type && r.project_type.toLowerCase().includes(q)) ||
        (r.budget && r.budget.toLowerCase().includes(q))
    );
  }, [quoteRequests, search, datePreset, customRange]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let aVal = (a[sortField] as string) ?? "";
      let bVal = (b[sortField] as string) ?? "";
      const cmp = aVal.localeCompare(bVal);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = useMemo(() => {
    const counts = { new: 0, contacted: 0, converted: 0, lost: 0 } as Record<string, number>;
    quoteRequests.forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });
    return counts;
  }, [quoteRequests]);

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Info banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">
        <FileSignature className="w-4 h-4 flex-shrink-0" />
        <span>
          Quote requests submitted via the{" "}
          <strong className="text-blue-300">QuoteWizard</strong> on{" "}
          <strong className="text-blue-300">/lp/web-design</strong>.
        </span>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "New", key: "new", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
          { label: "Contacted", key: "contacted", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
          { label: "Converted", key: "converted", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
          { label: "Lost", key: "lost", cls: "bg-muted/40 text-muted-foreground border-border/40" },
        ].map(({ label, key, cls }) => (
          <span
            key={key}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}
          >
            {label}
            <span className="font-bold">{statusCounts[key] ?? 0}</span>
          </span>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, project type…"
            className="pl-9 bg-card/50"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <DateRangeFilter value={datePreset} onChange={handleDateChange} customRange={customRange} />
      </div>

      {/* Table */}
      <div className="bg-card/40 border border-blue-500/10 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton columns={7} rows={5} />
        ) : paginated.length === 0 ? (
          <EmptyState
            icon={FileSignature}
            title="No quote requests yet"
            description={search || datePreset !== "all" ? "No results match your filters." : "Requests from the LP QuoteWizard will appear here."}
          />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-blue-500/5">
                <TableRow>
                  <TableHead className="w-10 pl-4">
                    <Checkbox
                      checked={paginated.length > 0 && paginated.every((r) => selectedIds.has(r.id))}
                      ref={(el) => {
                        if (el) {
                          const some = paginated.some((r) => selectedIds.has(r.id));
                          const all = paginated.every((r) => selectedIds.has(r.id));
                          (el as unknown as HTMLInputElement).indeterminate = some && !all;
                        }
                      }}
                      onCheckedChange={() => toggleSelectAll(paginated)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableHead>
                  <SortHead field="created_at">Date</SortHead>
                  <TableHead>Status</TableHead>
                  <SortHead field="name">Name</SortHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <SortHead field="project_type">Project</SortHead>
                  <SortHead field="budget">Budget</SortHead>
                  <TableHead>Actions</TableHead>
                  <TableHead className="text-right">Update Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginated.map((req, i) => (
                  <TableRow
                    key={req.id}
                    className={`cursor-pointer hover:bg-blue-500/5 transition-colors ${i % 2 === 0 ? "bg-background/20" : ""} ${selectedIds.has(req.id) ? "bg-blue-500/5" : ""}`}
                    onClick={() => openDrawer(req)}
                  >
                    <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox checked={selectedIds.has(req.id)} onCheckedChange={() => toggleSelect(req.id)} />
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                      {format(new Date(req.created_at), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={`quote_${req.status}`} />
                    </TableCell>
                    <TableCell className="font-medium">{req.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{req.email}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <PhoneCell mobile={req.mobile ?? ""} />
                    </TableCell>
                    <TableCell className="text-sm">{req.project_type ?? "—"}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{req.budget ?? "—"}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <QuickActions name={req.name} phone={req.mobile} email={req.email} />
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={req.status}
                        onValueChange={(v) => onUpdateStatus(req.id, v as QuoteRequest["status"])}
                      >
                        <SelectTrigger className="h-8 w-[110px] text-xs bg-background border-border/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {sorted.length} result{sorted.length !== 1 ? "s" : ""} · page {page} of {totalPages}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Lead detail drawer */}
      <LeadDetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} data={drawerData} />

      {/* Bulk action bar */}
      <BulkActionBar
        selectedCount={selectedIds.size}
        showResolve
        showDelete={false}
        onResolve={async () => { await onBulkResolve(Array.from(selectedIds)); setSelectedIds(new Set()); }}
        onExport={() => exportSelected(sorted)}
        onClear={() => setSelectedIds(new Set())}
      />
    </motion.div>
  );
}

