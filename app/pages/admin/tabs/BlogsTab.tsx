import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Pencil, Trash2, Plus, FileText,
  ChevronUp, ChevronDown, ChevronsUpDown,
  ChevronLeft, ChevronRight, Bot, User, Search, X,
} from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import type { BlogPost } from "../AdminDashboard";

type SortField = "created_at" | "title";
type SortDir = "asc" | "desc";
const PAGE_SIZE = 20;

// Status badge colours
const STATUS_STYLES: Record<BlogPost["status"], string> = {
  draft:     "bg-amber-500/15 text-amber-400 border-amber-500/30",
  review:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  archived:  "bg-secondary/40 text-muted-foreground border-border/40",
};

interface BlogsTabProps {
  posts: BlogPost[];
  loading: boolean;
  onDeletePost: (id: string) => void;
  onUpdatePostStatus: (id: string, status: BlogPost["status"]) => Promise<void>;
}

export default function BlogsTab({ posts, loading, onDeletePost, onUpdatePostStatus }: BlogsTabProps) {
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

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

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return posts;
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [posts, query]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const aVal = (a[sortField] as string) ?? "";
      const bVal = (b[sortField] as string) ?? "";
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }, [filtered, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const p = Math.min(page, totalPages);
  const paginated = sorted.slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE);

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="bg-card/40 border border-border/40 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <TableSkeleton columns={6} rows={5} />
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
            {/* Search bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border/30 bg-background/30">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                  placeholder="Search by title, slug, or tag…"
                  className="pl-9 h-9 bg-background text-sm"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <span className="text-xs text-muted-foreground shrink-0">
                {query ? `${sorted.length} of ${posts.length}` : `${posts.length}`} posts
              </span>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-secondary/20">
                  <TableRow>
                    <SortHead field="created_at">Date</SortHead>
                    <SortHead field="title">Title</SortHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((post, i) => (
                    <TableRow key={post.id} className={i % 2 === 0 ? "bg-background/20" : ""}>
                      {/* Date */}
                      <TableCell className="whitespace-nowrap text-muted-foreground text-sm">
                        {format(new Date(post.created_at), "MMM d, yyyy")}
                      </TableCell>

                      {/* Title */}
                      <TableCell className="font-medium max-w-[220px] truncate">{post.title}</TableCell>

                      {/* Status — inline select to change it */}
                      <TableCell>
                        <Select
                          value={post.status ?? "published"}
                          onValueChange={(val) =>
                            onUpdatePostStatus(post.id, val as BlogPost["status"])
                          }
                        >
                          <SelectTrigger className={`h-6 text-xs border px-2 w-28 rounded-full font-medium ${STATUS_STYLES[post.status ?? "published"]}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="review">Review</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="archived">Archived</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>

                      {/* Source badge */}
                      <TableCell>
                        {post.source === "ai" ? (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-medium">
                            <Bot className="w-3 h-3" />AI
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-secondary/40 text-muted-foreground border border-border/40 font-medium">
                            <User className="w-3 h-3" />Manual
                          </span>
                        )}
                      </TableCell>

                      {/* Tags */}
                      <TableCell className="text-xs text-muted-foreground max-w-[140px] truncate">
                        {Array.isArray(post.tags) ? post.tags.join(", ") : "—"}
                      </TableCell>

                      {/* Actions */}
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
