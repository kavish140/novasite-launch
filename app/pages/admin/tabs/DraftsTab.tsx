import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Pencil,
  Trash2,
  Bot,
  Clock,
  CheckCircle2,
  FileText,
  Search,
  X,
  ArrowUpRight,
  Archive,
  ClipboardCheck,
} from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import EmptyState from "../components/EmptyState";
import { cn } from "@/lib/utils";
import type { BlogPost, BlankMeta } from "../AdminDashboard";
interface DraftsTabProps {
  posts: BlogPost[];
  loading: boolean;
  onDeletePost: (id: string) => void;
  onUpdatePostStatus: (id: string, status: BlogPost["status"]) => Promise<void>;
}
const stages = [
  {
    id: "draft",
    label: "Drafts",
    description: "Add your expertise",
    icon: Pencil,
    color: "text-amber-500",
  },
  {
    id: "review",
    label: "In review",
    description: "Give it a final read",
    icon: ClipboardCheck,
    color: "text-primary",
  },
  {
    id: "published",
    label: "Published",
    description: "Live on your blog",
    icon: CheckCircle2,
    color: "text-emerald-500",
  },
  {
    id: "archived",
    label: "Archived",
    description: "Saved for later",
    icon: Archive,
    color: "text-muted-foreground",
  },
] as const;
const statusStyles: Record<BlogPost["status"], string> = {
  draft: "bg-amber-500/10 text-amber-500",
  review: "bg-primary/10 text-primary",
  published: "bg-emerald-500/10 text-emerald-500",
  archived: "bg-muted text-muted-foreground",
};
export default function DraftsTab({
  posts,
  loading,
  onDeletePost,
  onUpdatePostStatus,
}: DraftsTabProps) {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<BlogPost["status"] | "all">("draft");
  const [busyIds, setBusyIds] = useState<Set<string>>(new Set());
  const aiPosts = useMemo(
    () =>
      posts
        .filter((p) => p.source === "ai")
        .sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)),
    [posts],
  );
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return aiPosts.filter(
      (p) =>
        (stage === "all" || p.status === stage) &&
        (!q ||
          [p.title, p.slug, ...(p.tags || [])].some((text) =>
            text.toLowerCase().includes(q),
          )),
    );
  }, [aiPosts, stage, query]);
  const ready = aiPosts.filter(
    (p) =>
      ["draft", "review"].includes(p.status) &&
      (!p.blanks_metadata?.length || p.blanks_metadata.every((b) => b.filled)),
  ).length;
  const changeStatus = async (post: BlogPost, status: BlogPost["status"]) => {
    setBusyIds((prev) => new Set(prev).add(post.id));
    try {
      await onUpdatePostStatus(post.id, status);
    } finally {
      setBusyIds((prev) => {
        const next = new Set(prev);
        next.delete(post.id);
        return next;
      });
    }
  };
  return (
    <div className="space-y-6">
      <div className="admin-panel flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="h-6 w-6" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold">
              From first draft to your next article
            </h2>
            <p className="mt-1 max-w-lg text-sm text-muted-foreground">
              Add your experience, review the details, and publish when you're
              ready.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-500">
          <CheckCircle2 className="h-4 w-4" />
          {loading ? "—" : ready} ready for a final review
        </span>
      </div>
      <div
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Filter drafts by status"
      >
        {stages.map(({ id, label, description, icon: Icon, color }) => (
          <button
            key={id}
            aria-pressed={stage === id}
            onClick={() => setStage(id)}
            className={cn(
              "admin-panel flex min-w-0 items-start gap-3 p-4 text-left transition-colors sm:p-5",
              stage === id &&
                "border-primary bg-primary/5 ring-1 ring-primary/20",
            )}
          >
            <Icon className={cn("mt-1 h-4 w-4 shrink-0", color)} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium">{label}</span>
                <span className="text-2xl font-semibold tabular-nums">
                  {loading
                    ? "—"
                    : aiPosts.filter((p) => p.status === id).length}
                </span>
              </span>
              <span className="mt-1 block text-[11px] text-muted-foreground">
                {description}
              </span>
            </span>
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-md">
          <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            aria-label="Search AI drafts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, slug, or tag…"
            className="h-10 bg-card pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear draft search"
              className="absolute right-2 top-2 rounded p-1 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={stage === "all" ? "secondary" : "outline"}
          onClick={() => setStage("all")}
          size="sm"
          aria-pressed={stage === "all"}
        >
          All articles
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          {loading
            ? "Loading…"
            : `${filtered.length} article${filtered.length === 1 ? "" : "s"}`}
        </span>
      </div>
      {loading ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="admin-panel h-72 animate-pulse p-6">
              <div className="mb-5 h-5 w-24 rounded bg-muted" />
              <div className="mb-3 h-6 w-3/4 rounded bg-muted" />
              <div className="h-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="admin-panel">
          <EmptyState
            icon={query ? Search : FileText}
            title={
              query
                ? "No matching articles"
                : aiPosts.length
                  ? "Nothing in this stage"
                  : "Your content studio is ready"
            }
            description={
              query
                ? "Try another title or tag, or clear the search to see your articles."
                : aiPosts.length
                  ? "Choose another stage to view the rest of your articles."
                  : "AI-generated articles will appear here, ready for your experience and final review."
            }
          />
          <div className="flex justify-center pb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setQuery("");
                setStage("all");
              }}
            >
              Show all articles
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid items-stretch gap-5 lg:grid-cols-2">
          {filtered.map((post) => {
            const blanks: BlankMeta[] = Array.isArray(post.blanks_metadata)
              ? post.blanks_metadata
              : [];
            const filled = blanks.filter((b) => b.filled).length;
            const remaining = blanks.length - filled;
            const canPublish =
              remaining === 0 && ["draft", "review"].includes(post.status);
            const busy = busyIds.has(post.id);
            return (
              <article
                key={post.id}
                className="admin-panel flex min-w-0 flex-col overflow-hidden"
              >
                <div className="flex-1 space-y-4 p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Select
                      value={post.status}
                      disabled={busy}
                      onValueChange={(v) =>
                        changeStatus(post, v as BlogPost["status"])
                      }
                    >
                      <SelectTrigger
                        aria-label={`Status for ${post.title}`}
                        className={cn(
                          "h-8 w-32 rounded-lg border-0 text-xs font-medium",
                          statusStyles[post.status],
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="review">In review</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <div>
                    <Link
                      to={`/admin/blog/${post.id}`}
                      className="font-heading text-xl font-semibold leading-snug tracking-tight hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt ||
                        "Open this article to review the content and add your perspective."}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {(post.tags || []).slice(0, 4).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-md bg-muted/70 px-2 py-1 text-[10px] text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="rounded-xl border border-border bg-muted/25 p-4">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-medium">
                        {blanks.length ? "Your contributions" : "Final review"}
                      </span>
                      <span
                        className={
                          remaining ? "text-amber-500" : "text-emerald-500"
                        }
                      >
                        {blanks.length
                          ? `${filled} of ${blanks.length} complete`
                          : "No placeholders to fill"}
                      </span>
                    </div>
                    {blanks.length > 0 && (
                      <div
                        role="progressbar"
                        aria-label={`Contributions for ${post.title}`}
                        aria-valuemin={0}
                        aria-valuemax={blanks.length}
                        aria-valuenow={filled}
                        className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"
                      >
                        <div
                          className={cn(
                            "h-full rounded-full",
                            remaining ? "bg-primary" : "bg-emerald-500",
                          )}
                          style={{
                            width: `${(filled / blanks.length) * 100}%`,
                          }}
                        />
                      </div>
                    )}
                    {remaining > 0 ? (
                      <details className="mt-3 text-xs">
                        <summary className="cursor-pointer text-muted-foreground">
                          {remaining} contribution{remaining === 1 ? "" : "s"}{" "}
                          to add
                        </summary>
                        <div className="mt-3 space-y-3">
                          {blanks
                            .filter((b) => !b.filled)
                            .map((blank) => (
                              <div key={blank.id}>
                                <p className="font-medium">{blank.label}</p>
                                <p className="mt-1 leading-relaxed text-muted-foreground">
                                  {blank.guideline}
                                </p>
                              </div>
                            ))}
                        </div>
                      </details>
                    ) : (
                      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                        {post.status === "published"
                          ? "Published. You can return to the editor for updates."
                          : post.status === "archived"
                            ? "Archived. Change the status to bring it back into your workflow."
                            : "Give the article a final read before publishing."}
                      </p>
                    )}
                  </div>
                  {post.ai_model && (
                    <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <Bot className="h-3 w-3" />
                      Created with {post.ai_model}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/20 px-5 py-4 sm:px-6">
                  <Button asChild size="sm" className="gap-2">
                    <Link to={`/admin/blog/${post.id}`}>
                      <Pencil className="h-3.5 w-3.5" />
                      {remaining ? "Edit & contribute" : "Review article"}
                    </Link>
                  </Button>
                  {canPublish && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={busy}
                      onClick={() => changeStatus(post, "published")}
                      className="gap-2"
                    >
                      {busy ? "Updating…" : "Publish"}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    disabled={busy}
                    aria-label={`Delete ${post.title}`}
                    onClick={() => onDeletePost(post.id)}
                    className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
