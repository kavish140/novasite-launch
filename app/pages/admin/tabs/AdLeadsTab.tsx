import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search, CheckCircle2, RotateCcw, Megaphone,
  ChevronUp, ChevronDown, ChevronsUpDown,
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
import PhoneCell from "../components/PhoneCell";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import QuickActions from "../components/QuickActions";
import BulkActionBar from "../components/BulkActionBar";
import LeadCard from "../components/LeadCard";
import LeadDetailDrawer, { type DrawerLead } from "../components/LeadDetailDrawer";
import DateRangeFilter, {
  filterByDateRange, type DateRangePreset,
} from "../components/DateRangeFilter";
import type { DateRange } from "react-day-picker";
import type { AuditRequest } from "../AdminDashboard";

type SortField = "created_at" | "name" | "email";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

interface AdLeadsTabProps {
  allAdLeads: AuditRequest[];
  loading: boolean;
  onUpdateStatus: (id: string, status: "pending" | "completed") => Promise<void>;
  onBulkResolve: (ids: string[]) => Promise<void>;
  onBulkDelete: (ids: string[]) => void;
}

export default function AdLeadsTab({
  allAdLeads, loading, onUpdateStatus, onBulkResolve, onBulkDelete,
}: AdLeadsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [datePreset, setDatePreset] = useState<DateRangePreset>("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [drawerData, setDrawerData] = useState<DrawerLead | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (lead: AuditRequest) => {
    setDrawerData({ type: "audit_request", lead });
    setDrawerOpen(true);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
    setPendingPage(1); setCompletedPage(1);
  };

  const handleDateChange = (preset: DateRangePreset, range?: DateRange) => {
    setDatePreset(preset);
    if (range) setCustomRange(range);
    setPendingPage(1); setCompletedPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (rows: AuditRequest[]) => {
    const allSelected = rows.every((r) => selectedIds.has(r.id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      rows.forEach((r) => allSelected ? next.delete(r.id) : next.add(r.id));
      return next;
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === "asc" ? <ChevronUp className="w-3.5 h-3.5 text-primary" /> : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  const SortHead = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">{children}<SortIcon field={field} /></div>
    </TableHead>
  );

  const filtered = useMemo(() => {
    const afterDate = filterByDateRange(allAdLeads, datePreset, customRange);
    const q = searchQuery.toLowerCase();
    return afterDate.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.mobile && r.mobile.includes(q)) ||
        r.website_url.toLowerCase().includes(q)
    );
  }, [allAdLeads, searchQuery, datePreset, customRange]);

  const sortRows = (rows: AuditRequest[]) =>
    [...rows].sort((a, b) => {
      const aVal = (a[sortField] as string) ?? "";
      const bVal = (b[sortField] as string) ?? "";
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

  const pending = sortRows(filtered.filter((r) => r.status !== "completed"));
  const completed = sortRows(filtered.filter((r) => r.status === "completed"));

  const pendingTotalPages = Math.max(1, Math.ceil(pending.length / PAGE_SIZE));
  const completedTotalPages = Math.max(1, Math.ceil(completed.length / PAGE_SIZE));
  const pp = Math.min(pendingPage, pendingTotalPages);
  const cp = Math.min(completedPage, completedTotalPages);
  const paginatedPending = pending.slice((pp - 1) * PAGE_SIZE, pp * PAGE_SIZE);
  const paginatedCompleted = completed.slice((cp - 1) * PAGE_SIZE, cp * PAGE_SIZE);

  const exportSelected = () => {
    const rows = filtered.filter((r) => selectedIds.has(r.id));
    if (!rows.length) return;
    const headers = ["Date", "Name", "Email", "Mobile", "Website", "Status"];
    const csv = [
      headers.join(","),
      ...rows.map((r) => [
        format(new Date(r.created_at), "yyyy-MM-dd HH:mm"),
        `"${r.name}"`, `"${r.email}"`, `"${r.mobile || ""}"`,
        `"${r.website_url}"`, r.status,
      ].join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `ad-leads-selected-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    setSelectedIds(new Set());
  };

  const renderPagination = (page: number, totalPages: number, setPage: (p: number) => void) =>
    totalPages > 1 ? (
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/30">
        <span className="text-muted-foreground text-xs">Page {page} of {totalPages}</span>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    ) : null;

  const renderTable = (rows: AuditRequest[], isPending: boolean) => {
    const allSelected = rows.length > 0 && rows.every((r) => selectedIds.has(r.id));
    const someSelected = rows.some((r) => selectedIds.has(r.id));
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className={isPending ? "bg-purple-500/5" : "bg-secondary/10"}>
            <TableRow>
              <TableHead className="w-10 pl-4">
                <Checkbox
                  checked={allSelected}
                  ref={(el) => { if (el) (el as unknown as HTMLInputElement).indeterminate = someSelected && !allSelected; }}
                  onCheckedChange={() => toggleSelectAll(rows)}
                  onClick={(e) => e.stopPropagation()}
                />
              </TableHead>
              <SortHead field="created_at">Date</SortHead>
              <TableHead>Status</TableHead>
              <SortHead field="name">Name</SortHead>
              <SortHead field="email">Email</SortHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead className="text-right">Resolve</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((request, i) => (
              <TableRow
                key={request.id}
                className={`cursor-pointer hover:bg-purple-500/5 transition-colors ${i % 2 === 0 ? "bg-background/20" : ""} ${selectedIds.has(request.id) ? "bg-purple-500/5" : ""}`}
                onClick={() => openDrawer(request)}
              >
                <TableCell className="pl-4" onClick={(e) => e.stopPropagation()}>
                  <Checkbox checked={selectedIds.has(request.id)} onCheckedChange={() => toggleSelect(request.id)} />
                </TableCell>
                <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                  {format(new Date(request.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell><StatusBadge status={isPending ? "paid_ad" : "completed"} /></TableCell>
                <TableCell className={`font-medium ${!isPending ? "text-muted-foreground" : ""}`}>{request.name}</TableCell>
                <TableCell className={!isPending ? "text-muted-foreground" : ""}>{request.email}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <PhoneCell mobile={request.mobile} className={!isPending ? "text-muted-foreground hover:text-primary" : undefined} />
                </TableCell>
                <TableCell>
                  {isPending && (
                    <a
                      href={request.website_url?.startsWith("http") ? request.website_url : `https://${request.website_url}`}
                      target="_blank" rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {request.website_url}
                    </a>
                  )}
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <QuickActions name={request.name} phone={request.mobile} email={request.email} />
                </TableCell>
                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                  {isPending ? (
                    <Button size="sm" onClick={() => onUpdateStatus(request.id, "completed")} className="gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />Resolve
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(request.id, "pending")} className="gap-1.5 h-8 text-muted-foreground">
                      <RotateCcw className="w-3.5 h-3.5" />Reopen
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  const selectedArr = Array.from(selectedIds);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center gap-3 p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 text-sm text-purple-400">
        <Megaphone className="w-4 h-4 flex-shrink-0" />
        <span>Leads from paid campaigns via <strong className="text-purple-300">/lp/web-design</strong>.</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search name, email, mobile…" className="pl-9 bg-card/50" value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPendingPage(1); setCompletedPage(1); }} />
        </div>
        <DateRangeFilter value={datePreset} onChange={handleDateChange} customRange={customRange} />
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold flex items-center gap-2">
          Pending Follow-up <Badge variant="secondary">{pending.length}</Badge>
        </h3>
        <div className="bg-card/40 border border-purple-500/10 rounded-xl overflow-hidden shadow-sm">
          {loading ? <TableSkeleton columns={9} rows={5} />
            : pending.length === 0 ? <EmptyState icon={Megaphone} title="No pending ad leads!" description="You're all caught up." />
            : (
              <>
                {/* Mobile */}
                <div className="md:hidden p-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {paginatedPending.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      isAdLead
                      onResolve={() => onUpdateStatus(lead.id, "completed")}
                      onReopen={() => onUpdateStatus(lead.id, "pending")}
                      onOpenDrawer={(data) => { setDrawerData(data); setDrawerOpen(true); }}
                    />
                  ))}
                </div>
                {/* Desktop */}
                <div className="hidden md:block">
                  {renderTable(paginatedPending, true)}
                </div>
                {renderPagination(pp, pendingTotalPages, setPendingPage)}
              </>
            )}
        </div>
      </div>

      {!loading && completed.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
            Resolved Ad Leads <Badge variant="outline">{completed.length}</Badge>
          </h3>
          <div className="bg-card/20 border border-border/30 rounded-xl overflow-hidden shadow-sm opacity-90">
            {renderTable(paginatedCompleted, false)}
            {renderPagination(cp, completedTotalPages, setCompletedPage)}
          </div>
        </div>
      )}

      <LeadDetailDrawer open={drawerOpen} onOpenChange={setDrawerOpen} data={drawerData} />

      <BulkActionBar
        selectedCount={selectedArr.length}
        showResolve showDelete
        onResolve={async () => { await onBulkResolve(selectedArr); setSelectedIds(new Set()); }}
        onExport={exportSelected}
        onDelete={() => { onBulkDelete(selectedArr); setSelectedIds(new Set()); }}
        onClear={() => setSelectedIds(new Set())}
      />
    </motion.div>
  );
}
