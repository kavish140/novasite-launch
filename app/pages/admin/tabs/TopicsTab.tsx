import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  Plus,
  Trash2,
  CheckCircle2,
  SkipForward,
  Clock,
  BookOpen,
  Sparkles,
  Tag,
  Search,
  X,
  ArrowUpRight,
  ListOrdered,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { m as motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";
import ConfirmDialog from "../components/ConfirmDialog";
import { cn } from "@/lib/utils";

interface BlogTopic {
  id: string;
  title: string;
  description: string | null;
  target_keywords: string[];
  status: "pending" | "in_progress" | "used" | "skipped";
  priority: number;
  created_at: string;
  used_at: string | null;
}

const STATUS_CONFIG: Record<
  BlogTopic["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  used: {
    label: "Used",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  skipped: {
    label: "Skipped",
    className: "bg-secondary/40 text-muted-foreground border-border/40",
  },
};

export default function TopicsTab() {
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState<BlogTopic["status"] | "all">("pending");
  const [deleteTarget, setDeleteTarget] = useState<BlogTopic | null>(null);

  // New topic form fields
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newKeywords, setNewKeywords] = useState("");
  const [newPriority, setNewPriority] = useState("0");

  const { toast } = useToast();

  const fetchTopics = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_topics")
      .select("*")
      .order("priority", { ascending: false })
      .order("created_at", { ascending: true });
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTopics((data ?? []) as BlogTopic[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const updateStatus = async (id: string, status: BlogTopic["status"]) => {
    const patch: Record<string, unknown> = { status };
    if (status === "used") patch.used_at = new Date().toISOString();
    const { error } = await supabase
      .from("blog_topics")
      .update(patch)
      .eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTopics((prev) =>
        prev.map((t) => (t.id === id ? ({ ...t, ...patch } as BlogTopic) : t)),
      );
      toast({ title: "Updated", description: `Topic marked as ${status}.` });
    }
  };

  const deleteTopic = async (id: string) => {
    const { error } = await supabase.from("blog_topics").delete().eq("id", id);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTopics((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Deleted", description: "Topic removed." });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    const keywords = newKeywords
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);
    const { data, error } = await supabase
      .from("blog_topics")
      .insert([
        {
          title: newTitle.trim(),
          description: newDesc.trim() || null,
          target_keywords: keywords,
          status: "pending",
          priority: parseInt(newPriority) || 0,
        },
      ])
      .select("*")
      .single();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTopics((prev) => [data as BlogTopic, ...prev]);
      setStage("pending");
      setQuery("");
      setNewTitle("");
      setNewDesc("");
      setNewKeywords("");
      setNewPriority("0");
      setShowAddForm(false);
      toast({
        title: "Topic added",
        description: "It will be picked up in the next AI blog run.",
      });
    }
    setSaving(false);
  };

  const sortedTopics = useMemo(
    () =>
      [...topics].sort(
        (a, b) =>
          b.priority - a.priority ||
          Date.parse(a.created_at) - Date.parse(b.created_at),
      ),
    [topics],
  );
  const visible = sortedTopics.filter(
    (t) =>
      (stage === "all" || t.status === stage) &&
      (!query.trim() ||
        [t.title, t.description || "", ...(t.target_keywords || [])].some(
          (text) => text.toLowerCase().includes(query.trim().toLowerCase()),
        )),
  );
  const nextTopic = sortedTopics.find((t) => t.status === "pending");
  const categories = [
    {
      id: "pending",
      label: "Queued",
      description: "Ready for the next run",
      icon: ListOrdered,
      color: "text-primary",
    },
    {
      id: "in_progress",
      label: "In progress",
      description: "Currently being written",
      icon: Clock,
      color: "text-amber-500",
    },
    {
      id: "used",
      label: "Used",
      description: "Already covered",
      icon: CheckCircle2,
      color: "text-emerald-500",
    },
    {
      id: "skipped",
      label: "Skipped",
      description: "Ideas saved for later",
      icon: SkipForward,
      color: "text-muted-foreground",
    },
  ] as const;
  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-6 w-6" />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[.18em] text-primary">
                Next in your content plan
              </p>
              <h2 className="mt-2 max-w-2xl font-heading text-xl font-semibold leading-snug">
                {loading
                  ? "Loading your topic queue…"
                  : nextTopic?.title || "Make room for your next good idea"}
              </h2>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted-foreground">
                {nextTopic
                  ? "Highest priority first, then oldest added. Pending topics are available to the blog generator on its next run."
                  : "Add a topic, choose its angle, and give your next article a clear direction."}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowAddForm((v) => !v)}
            className="gap-2"
            aria-expanded={showAddForm}
            aria-controls="topic-add-form"
          >
            {showAddForm ? (
              <X className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {showAddForm ? "Close form" : "Add topic"}
          </Button>
        </div>
      </section>
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            id="topic-add-form"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            onSubmit={handleAdd}
            className="admin-panel overflow-hidden"
          >
            <div className="border-b border-border px-6 py-5">
              <h2 className="font-semibold">Plan a new article</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                A clear angle and specific keywords help shape a useful first
                draft.
              </p>
            </div>
            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_240px]">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="topic-title">
                    Topic title <span className="text-primary">*</span>
                  </Label>
                  <Input
                    id="topic-title"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. What makes a restaurant website bring in bookings?"
                    className="h-11 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-desc">Angle & direction</Label>
                  <Textarea
                    id="topic-desc"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Who is this for? What should they take away from the article?"
                    className="min-h-28 bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="topic-keywords">Target keywords</Label>
                  <Input
                    id="topic-keywords"
                    value={newKeywords}
                    onChange={(e) => setNewKeywords(e.target.value)}
                    placeholder="restaurant website, online bookings, Mumbai"
                    className="h-11 bg-background"
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Separate keywords with commas.
                  </p>
                </div>
              </div>
              <aside className="rounded-xl border border-border bg-muted/30 p-5">
                <ListOrdered className="mb-3 h-5 w-5 text-primary" />
                <Label htmlFor="topic-priority">Queue priority</Label>
                <Input
                  id="topic-priority"
                  type="number"
                  min="0"
                  max="100"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="mt-3 h-11 bg-card"
                />
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                  Higher numbers move a topic earlier in the queue. Topics with
                  the same priority are ordered by the date they were added.
                </p>
                <div className="mt-5 border-t border-border pt-4 text-[11px] text-muted-foreground">
                  Use 0 for the normal queue, or raise it for a timely article.
                </div>
              </aside>
            </div>
            <div className="flex justify-end gap-2 border-t border-border bg-muted/20 px-6 py-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {saving ? "Adding…" : "Add to queue"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
      <div
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
        aria-label="Filter topics by status"
      >
        {categories.map(({ id, label, description, icon: Icon, color }) => (
          <button
            key={id}
            aria-pressed={stage === id}
            onClick={() => setStage(id)}
            className={cn(
              "admin-panel flex min-w-0 items-start gap-3 p-4 text-left sm:p-5",
              stage === id &&
                "border-primary bg-primary/5 ring-1 ring-primary/20",
            )}
          >
            <Icon className={cn("mt-1 h-4 w-4 shrink-0", color)} />
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-medium">{label}</span>
                <span className="text-2xl font-semibold tabular-nums">
                  {loading ? "—" : topics.filter((t) => t.status === id).length}
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
            aria-label="Search topics"
            placeholder="Search topics, angles, or keywords…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-10 bg-card pl-10 pr-10"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear topic search"
              className="absolute right-2 top-2 rounded p-1 text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={stage === "all" ? "secondary" : "outline"}
          size="sm"
          onClick={() => setStage("all")}
          aria-pressed={stage === "all"}
        >
          All topics
        </Button>
        <span className="ml-auto text-xs text-muted-foreground">
          {visible.length} topic{visible.length === 1 ? "" : "s"} · priority
          order
        </span>
      </div>
      {loading ? (
        <TableSkeleton columns={1} rows={3} />
      ) : visible.length === 0 ? (
        <section className="admin-panel">
          <EmptyState
            icon={query ? Search : BookOpen}
            title={
              query
                ? "No matching topics"
                : topics.length
                  ? "This part of the queue is clear"
                  : "Start with an idea worth sharing"
            }
            description={
              query
                ? "Try another keyword or clear your search."
                : topics.length
                  ? "Choose another stage to browse your content plan."
                  : "Add your first topic to give the blog generator a direction."
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
              Show all topics
            </Button>
          </div>
        </section>
      ) : (
        <div className="space-y-3">
          {visible.map((topic, index) => {
            const cfg = STATUS_CONFIG[topic.status];
            return (
              <article key={topic.id} className="admin-panel overflow-hidden">
                <div className="flex gap-4 p-5 sm:p-6">
                  <span className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted/60 text-xs font-medium tabular-nums text-muted-foreground sm:flex">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-md border px-2 py-1 text-[10px] font-medium",
                          cfg.className,
                        )}
                      >
                        {cfg.label}
                      </span>
                      <span className="rounded-md bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                        Priority {topic.priority}
                      </span>
                      {topic.id === nextTopic?.id && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary">
                          <ArrowUpRight className="h-3 w-3" />
                          Next up
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-semibold leading-snug">
                      {topic.title}
                    </h3>
                    {topic.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted-foreground">
                        {topic.description}
                      </p>
                    )}
                    {topic.target_keywords?.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {topic.target_keywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1 text-[11px] text-muted-foreground"
                          >
                            <Tag className="h-3 w-3" />
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 px-5 py-3 sm:px-6">
                  <span className="text-[11px] text-muted-foreground">
                    Added {format(new Date(topic.created_at), "d MMM yyyy")}
                    {topic.used_at &&
                      ` · Used ${format(new Date(topic.used_at), "d MMM yyyy")}`}
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    {["pending", "in_progress"].includes(topic.status) && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateStatus(topic.id, "used")}
                          className="h-8 gap-1.5 text-xs"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Mark used
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateStatus(topic.id, "skipped")}
                          className="h-8 gap-1.5 text-xs"
                        >
                          <SkipForward className="h-3.5 w-3.5" />
                          Skip
                        </Button>
                      </>
                    )}
                    {["used", "skipped"].includes(topic.status) && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateStatus(topic.id, "pending")}
                        className="h-8 gap-1.5 text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Restore
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Delete ${topic.title}`}
                      onClick={() => setDeleteTarget(topic)}
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Delete topic?"
        description={`Remove “${deleteTarget?.title || "this topic"}” from your content plan? This cannot be undone.`}
        confirmLabel="Delete topic"
        onConfirm={async () => {
          if (deleteTarget) await deleteTopic(deleteTarget.id);
        }}
      />
    </div>
  );
}
