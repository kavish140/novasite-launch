import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Search, CheckCircle2, RotateCcw, Users,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import PhoneCell from "../components/PhoneCell";
import StatusBadge from "../components/StatusBadge";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import DateRangeFilter, {
  filterByDateRange,
  type DateRangePreset,
} from "../components/DateRangeFilter";
import type { DateRange } from "react-day-picker";
import type { AuditRequest } from "../AdminDashboard";

type SortField = "created_at" | "name" | "email";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

interface LeadsTabProps {
  requests: AuditRequest[];
  loading: boolean;
  onUpdateStatus: (id: string, status: "pending" | "completed") => Promise<void>;
}

export default function LeadsTab({ requests, loading, onUpdateStatus }: LeadsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const [datePreset, setDatePreset] = useState<DateRangePreset>("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
    setPendingPage(1);
    setCompletedPage(1);
  };

  const handleDateChange = (preset: DateRangePreset, range?: DateRange) => {
    setDatePreset(preset);
    if (range) setCustomRange(range);
    setPendingPage(1);
    setCompletedPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  const SortHead = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead
      className="cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">{children}<SortIcon field={field} /></div>
    </TableHead>
  );

  const filtered = useMemo(() => {
    const organic = requests.filter((r) => r.source !== "paid_ad");
    const afterDate = filterByDateRange(organic, datePreset, customRange);
    const q = searchQuery.toLowerCase();
    return afterDate.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.mobile && r.mobile.includes(q)) ||
        r.website_url.toLowerCase().includes(q)
    );
  }, [requests, searchQuery, datePreset, customRange]);

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
  const pendingPage_ = Math.min(pendingPage, pendingTotalPages);
  const completedPage_ = Math.min(completedPage, completedTotalPages);

  const paginatedPending = pending.slice((pendingPage_ - 1) * PAGE_SIZE, pendingPage_ * PAGE_SIZE);
  const paginatedCompleted = completed.slice((completedPage_ - 1) * PAGE_SIZE, completedPage_ * PAGE_SIZE);

  const renderPagination = (page: number, totalPages: number, setPage: (p: number) => void) =>
    totalPages > 1 ? (
      <div className="flex items-center justify-between px-4 py-2 border-t border-border/30 text-sm">
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

  const renderTable = (rows: AuditRequest[], isPending: boolean) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className={isPending ? "bg-secondary/20" : "bg-secondary/10"}>
          <TableRow>
            <SortHead field="created_at">Date</SortHead>
            <TableHead>Status</TableHead>
            <SortHead field="name">Name</SortHead>
            <SortHead field="email">Email</SortHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Website</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((request, i) => (
            <TableRow key={request.id} className={i % 2 === 0 ? "bg-background/20" : ""}>
              <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                {format(new Date(request.created_at), "MMM d, yyyy")}
              </TableCell>
              <TableCell><StatusBadge status={request.status} /></TableCell>
              <TableCell className={`font-medium ${!isPending ? "text-muted-foreground" : ""}`}>{request.name}</TableCell>
              <TableCell className={!isPending ? "text-muted-foreground" : ""}>{request.email}</TableCell>
              <TableCell>
                <PhoneCell mobile={request.mobile} className={!isPending ? "text-muted-foreground hover:text-primary" : undefined} />
              </TableCell>
              <TableCell>
                {isPending && (
                  <a
                    href={request.website_url.startsWith("http") ? request.website_url : `https://${request.website_url}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {request.website_url}
                  </a>
                )}
              </TableCell>
              <TableCell className="text-right">
                {isPending ? (
                  <Button size="sm" onClick={() => onUpdateStatus(request.id, "completed")} className="gap-2">
                    <CheckCircle2 className="w-4 h-4" />Resolve
                  </Button>
                ) : (
                  <Button size="sm" variant="ghost" onClick={() => onUpdateStatus(request.id, "pending")} className="gap-2 h-8 text-muted-foreground">
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

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, mobile, or website…"
            className="pl-9 bg-card/50"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPendingPage(1); setCompletedPage(1); }}
          />
        </div>
        <DateRangeFilter value={datePreset} onChange={handleDateChange} customRange={customRange} />
      </div>

      {/* Pending */}
      <div className="space-y-3">
        <h3 className="text-base font-semibold flex items-center gap-2">
          Pending Actions <Badge variant="secondary">{pending.length}</Badge>
        </h3>
        <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden shadow-sm">
          {loading ? (
            <TableSkeleton columns={7} rows={5} />
          ) : pending.length === 0 ? (
            <EmptyState icon={Users} title="You're all caught up!" description="No pending audit requests." />
          ) : (
            <>
              {renderTable(paginatedPending, true)}
              {renderPagination(pendingPage_, pendingTotalPages, setPendingPage)}
            </>
          )}
        </div>
      </div>

      {/* Completed */}
      {!loading && completed.length > 0 && (
        <div className="space-y-3 pt-4">
          <h3 className="text-base font-semibold flex items-center gap-2 text-muted-foreground">
            Resolved Leads <Badge variant="outline">{completed.length}</Badge>
          </h3>
          <div className="bg-card/20 border border-border/30 rounded-xl overflow-hidden shadow-sm opacity-90">
            {renderTable(paginatedCompleted, false)}
            {renderPagination(completedPage_, completedTotalPages, setCompletedPage)}
          </div>
        </div>
      )}
    </motion.div>
  );
}
