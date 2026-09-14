import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Pencil, Trash2, Plus, FileText,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import type { BlogPost } from "../AdminDashboard";

type SortField = "created_at" | "title";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

interface BlogsTabProps {
  posts: BlogPost[];
  loading: boolean;
  onDeletePost: (id: string) => void;
}

export default function BlogsTab({ posts, loading, onDeletePost }: BlogsTabProps) {
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
    return [...posts].sort((a, b) => {
      const aVal = (a[sortField] as string) ?? "";
      const bVal = (b[sortField] as string) ?? "";
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [posts, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const p = Math.min(page, totalPages);
  const paginated = sorted.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton columns={5} rows={5} />
        ) : posts.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No blog posts yet"
            description="Start writing your first post to attract organic traffic."
            action={
              <Button asChild variant="outline" className="gap-2">
                <Link to="/admin/blog/new">
                  <Plus className="w-4 h-4" />Create First Post
                </Link>
              </Button>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <SortHead field="created_at">Published</SortHead>
                    <SortHead field="title">Title</SortHead>
                    <TableHead>URL Slug</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((post, i) => (
                    <TableRow key={post.id} className={i % 2 === 0 ? "bg-background/20" : ""}>
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="font-medium max-w-[240px] truncate">{post.title}</TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono">/{post.slug}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">
                        {Array.isArray(post.tags) ? post.tags.join(", ") : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="icon" variant="ghost" asChild className="h-8 w-8" title="Edit post">
                            <Link to={`/admin/blog/${post.id}`}>
                              <Pencil className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            size="icon" variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            title="Delete post"
                            onClick={() => onDeletePost(post.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-2 border-t border-border/30">
                <span className="text-muted-foreground text-xs">Page {p} of {totalPages} · {sorted.length} posts</span>
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
