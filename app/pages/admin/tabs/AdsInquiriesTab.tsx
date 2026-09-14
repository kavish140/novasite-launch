import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Target, ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { AdsInquiry } from "../AdminDashboard";

type SortField = "created_at" | "name" | "status";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

interface AdsInquiriesTabProps {
  adsInquiries: AdsInquiry[];
  loading: boolean;
  onUpdateInquiryStatus: (id: string, status: AdsInquiry["status"]) => Promise<void>;
}

export default function AdsInquiriesTab({
  adsInquiries,
  loading,
  onUpdateInquiryStatus,
}: AdsInquiriesTabProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("desc"); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3.5 h-3.5 text-primary" />
      : <ChevronDown className="w-3.5 h-3.5 text-primary" />;
  };

  const SortHead = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead className="cursor-pointer select-none hover:text-foreground transition-colors" onClick={() => handleSort(field)}>
      <div className="flex items-center gap-1">{children}<SortIcon field={field} /></div>
    </TableHead>
  );

  const sorted = useMemo(() => {
    return [...adsInquiries].sort((a, b) => {
      const aVal = (a[sortField] as string) ?? "";
      const bVal = (b[sortField] as string) ?? "";
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [adsInquiries, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const p = Math.min(page, totalPages);
  const paginated = sorted.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      {/* Info banner */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-sm text-orange-500">
        <Target className="w-4 h-4 flex-shrink-0" />
        <span>
          Showing inquiries from <strong>/ads-contact</strong> — leads who want Google Ads or Meta Ads management.
        </span>
      </div>

      <div className="bg-card/40 border border-orange-500/10 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton columns={10} rows={5} headerClassName="bg-orange-500/5" />
        ) : adsInquiries.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No ad inquiries yet"
            description="Inquiries submitted via /ads-contact will appear here."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-orange-500/5">
                  <TableRow>
                    <SortHead field="created_at">Date</SortHead>
                    <SortHead field="status">Status</SortHead>
                    <SortHead field="name">Name</SortHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Business</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Goals</TableHead>
                    <TableHead className="text-right">Update Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((inq, i) => (
                    <TableRow key={inq.id} className={i % 2 === 0 ? "bg-background/20" : ""}>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-xs">
                        {format(new Date(inq.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell><StatusBadge status={inq.status} /></TableCell>
                      <TableCell className="font-medium">{inq.name}</TableCell>
                      <TableCell><PhoneCell mobile={inq.phone} /></TableCell>
                      <TableCell className="text-sm">{inq.business_name}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {inq.platform.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inq.monthly_budget}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{inq.industry}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate" title={inq.goals}>
                        {inq.goals}
                      </TableCell>
                      <TableCell className="text-right">
                        <Select
                          value={inq.status}
                          onValueChange={(value) => onUpdateInquiryStatus(inq.id, value as AdsInquiry["status"])}
                        >
                          <SelectTrigger className="h-8 w-[110px] text-xs bg-background border-border/60">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2 border-t border-border/30">
                <span className="text-muted-foreground text-xs">Page {p} of {totalPages} · {sorted.length} total</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={p === 1} onClick={() => setPage(p - 1)}>
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" disabled={p === totalPages} onClick={() => setPage(p + 1)}>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}
