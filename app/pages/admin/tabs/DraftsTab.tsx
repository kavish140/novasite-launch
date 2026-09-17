import { useMemo, useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Pencil, Trash2, Bot, Clock, CheckCircle2,
  AlertCircle, ChevronRight, FileText, Search, X,
} from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import type { BlogPost, BlankMeta } from "../AdminDashboard";

interface DraftsTabProps {
  posts: BlogPost[];
  loading: boolean;
  onDeletePost: (id: string) => void;
  onUpdatePostStatus: (id: string, status: BlogPost["status"]) => Promise<void>;
}

const STATUS_STYLES: Record<BlogPost["status"], string> = {
  draft:     "bg-amber-500/15 text-amber-400 border-amber-500/30",
  review:    "bg-blue-500/15 text-blue-400 border-blue-500/30",
  published: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  archived:  "bg-secondary/40 text-muted-foreground border-border/40",
};

function BlankProgress({ blanks }: { blanks: BlankMeta[] }) {
  if (!blanks || blanks.length === 0) return null;
  const filled = blanks.filter((b) => b.filled).length;
  const total = blanks.length;
  const pct = Math.round((filled / total) * 100);
  const allDone = filled === total;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">
          {allDone ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> All blanks filled
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertCircle className="w-3 h-3" /> {total - filled} blank{total - filled !== 1 ? "s" : ""} remaining
            </span>
          )}
        </span>
        <span className={`font-medium ${allDone ? "text-emerald-400" : "text-muted-foreground"}`}>
          {filled}/{total}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${allDone ? "bg-emerald-500" : "bg-amber-500"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DraftsTab({ posts, loading, onDeletePost, onUpdatePostStatus }: DraftsTabProps) {
  const [query, setQuery] = useState("");

  // Only show AI-generated posts (all statuses except archived, so user can manage the pipeline)
  const aiPosts = useMemo(() => {
    const q = query.toLowerCase().trim();
    return posts
      .filter((p) => {
        if (p.source !== "ai") return false;
        if (!q) return true;
        return (
          p.title.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (Array.isArray(p.tags) && p.tags.some((t) => t.toLowerCase().includes(q)))
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [posts, query]);

  const drafts    = aiPosts.filter((p) => p.status === "draft");
  const inReview  = aiPosts.filter((p) => p.status === "review");
  const published = aiPosts.filter((p) => p.status === "published");
  const archived  = aiPosts.filter((p) => p.status === "archived");

  if (loading) return <TableSkeleton columns={4} rows={4} />;

  if (aiPosts.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="No AI drafts yet"
        description="Your daily blog generator will deposit drafts here automatically. Run the skill or Gemini Gem to generate the first post."
      />
    );
  }

  const renderPost = (post: BlogPost, i: number) => {
    const blanks: BlankMeta[] = Array.isArray(post.blanks_metadata) ? post.blanks_metadata : [];
    const allFilled = blanks.length > 0 && blanks.every((b) => b.filled);

    return (
      <motion.div
        key={post.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ delay: i * 0.04 }}
        className="rounded-xl border border-border/40 bg-card/40 p-5 space-y-4 hover:border-border/70 transition-colors"
      >
        {/* Top row */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Status select */}
              <Select
                value={post.status}
                onValueChange={(v) => onUpdatePostStatus(post.id, v as BlogPost["status"])}
              >
                <SelectTrigger className={`h-5 text-[10px] border px-2 w-24 rounded-full font-bold ${STATUS_STYLES[post.status]}`}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 font-bold">
                <Bot className="w-2.5 h-2.5" />AI
              </span>
              {post.ai_model && (
                <span className="text-[10px] text-muted-foreground/60 font-mono">{post.ai_model}</span>
              )}
            </div>
            <h3 className="font-semibold text-sm text-foreground leading-snug">{post.title}</h3>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
              </span>
              <span className="font-mono">/{post.slug}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button size="icon" variant="ghost" asChild className="h-8 w-8" title="Edit & fill blanks">
              <Link to={`/admin/blog/${post.id}`}>
                <Pencil className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="icon" variant="ghost"
              className="h-8 w-8 text-destructive hover:bg-destructive/10"
              title="Delete"
              onClick={() => onDeletePost(post.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Blank progress bar */}
        {blanks.length > 0 && <BlankProgress blanks={blanks} />}

        {/* Blank cards preview */}
        {blanks.length > 0 && !allFilled && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {blanks.filter((b) => !b.filled).slice(0, 4).map((blank) => (
              <div
                key={blank.id}
                className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 space-y-0.5"
              >
                <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">{blank.label}</p>
                <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">{blank.guideline}</p>
              </div>
            ))}
            {blanks.filter((b) => !b.filled).length > 4 && (
              <div className="rounded-lg border border-border/30 bg-secondary/20 px-3 py-2 flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground">+{blanks.filter((b) => !b.filled).length - 4} more</span>
              </div>
            )}
          </div>
        )}

        {/* All filled CTA */}
        {allFilled && (
          <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> All blanks filled — ready to publish!
            </span>
            <button
              onClick={() => onUpdatePostStatus(post.id, "published")}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors"
            >
              Publish <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* No blanks — complete post, ready to publish */}
        {blanks.length === 0 && (
          <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2">
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> Complete post — ready to publish!
            </span>
            <button
              onClick={() => onUpdatePostStatus(post.id, "published")}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5 transition-colors"
            >
              Publish <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </motion.div>
    );
  };

  const Section = ({ title, items, emptyMsg }: { title: string; items: BlogPost[]; emptyMsg: string }) => (
    <div className="space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 px-1">{title} ({items.length})</h4>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground/50 italic px-1">{emptyMsg}</p>
      ) : (
        <AnimatePresence mode="popLayout">
          {items.map((p, i) => renderPost(p, i))}
        </AnimatePresence>
      )}
    </div>
  );

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Search bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search AI drafts by title, slug, or tag…"
          className="pl-9 h-9 text-sm"
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

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Drafts", count: drafts.length, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "In Review", count: inReview.length, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Published", count: published.length, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
          { label: "Archived", count: archived.length, color: "text-muted-foreground", bg: "bg-secondary/20 border-border/30" },
        ].map(({ label, count, color, bg }) => (
          <div key={label} className={`rounded-xl border p-3 text-center ${bg}`}>
            <p className={`text-xl font-bold ${color}`}>{count}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <Section title="📝 Drafts — Needs your input" items={drafts} emptyMsg="No drafts waiting — you're all caught up!" />
      {inReview.length > 0 && <Section title="🔍 In Review" items={inReview} emptyMsg="" />}
      {published.length > 0 && <Section title="✅ Published AI Posts" items={published} emptyMsg="" />}
      {archived.length > 0 && <Section title="📦 Archived" items={archived} emptyMsg="" />}
    </motion.div>
  );
}
