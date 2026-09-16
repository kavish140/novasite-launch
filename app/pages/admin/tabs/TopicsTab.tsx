import { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import {
  Plus, Trash2, CheckCircle2, SkipForward, Clock,
  BookOpen, Sparkles, Tag, ChevronDown, ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import EmptyState from "../components/EmptyState";
import TableSkeleton from "../components/TableSkeleton";

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

const STATUS_CONFIG: Record<BlogTopic["status"], { label: string; className: string }> = {
  pending:     { label: "Pending",     className: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  in_progress: { label: "In Progress", className: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  used:        { label: "Used",        className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  skipped:     { label: "Skipped",     className: "bg-secondary/40 text-muted-foreground border-border/40" },
};

export default function TopicsTab() {
  const [topics, setTopics] = useState<BlogTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [saving, setSaving] = useState(false);

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
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTopics((data ?? []) as BlogTopic[]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTopics(); }, []);

  const pending   = useMemo(() => topics.filter((t) => t.status === "pending"), [topics]);
  const used      = useMemo(() => topics.filter((t) => t.status === "used"), [topics]);
  const skipped   = useMemo(() => topics.filter((t) => t.status === "skipped"), [topics]);

  const updateStatus = async (id: string, status: BlogTopic["status"]) => {
    const patch: Record<string, unknown> = { status };
    if (status === "used") patch.used_at = new Date().toISOString();
    const { error } = await supabase.from("blog_topics").update(patch).eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTopics((prev) => prev.map((t) => t.id === id ? { ...t, ...patch } as BlogTopic : t));
      toast({ title: "Updated", description: `Topic marked as ${status}.` });
    }
  };

  const deleteTopic = async (id: string) => {
    const { error } = await supabase.from("blog_topics").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTopics((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Deleted", description: "Topic removed." });
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    const keywords = newKeywords.split(",").map((k) => k.trim()).filter(Boolean);
    const { data, error } = await supabase
      .from("blog_topics")
      .insert([{
        title: newTitle.trim(),
        description: newDesc.trim() || null,
        target_keywords: keywords,
        status: "pending",
        priority: parseInt(newPriority) || 0,
      }])
      .select("*")
      .single();
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setTopics((prev) => [data as BlogTopic, ...prev]);
      setNewTitle(""); setNewDesc(""); setNewKeywords(""); setNewPriority("0");
      setShowAddForm(false);
      toast({ title: "Topic added", description: "It will be picked up in the next AI blog run." });
    }
    setSaving(false);
  };

  const TopicCard = ({ topic }: { topic: BlogTopic }) => {
    const cfg = STATUS_CONFIG[topic.status];
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        className="rounded-xl border border-border/40 bg-card/40 p-4 space-y-2.5 hover:border-border/70 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cfg.className}`}>
                {cfg.label}
              </span>
              {topic.priority > 0 && (
                <span className="text-[10px] text-muted-foreground font-mono">
                  priority {topic.priority}
                </span>
              )}
            </div>
            <p className="font-semibold text-sm text-foreground">{topic.title}</p>
            {topic.description && (
              <p className="text-xs text-muted-foreground leading-relaxed">{topic.description}</p>
            )}
            {topic.target_keywords?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {topic.target_keywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary/80 border border-primary/20">
                    <Tag className="w-2.5 h-2.5" />{kw}
                  </span>
                ))}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground/50">
              Added {format(new Date(topic.created_at), "d MMM yyyy")}
              {topic.used_at && ` · Used ${format(new Date(topic.used_at), "d MMM yyyy")}`}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {topic.status === "pending" && (
              <>
                <button
                  title="Mark as used"
                  onClick={() => updateStatus(topic.id, "used")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </button>
                <button
                  title="Skip this topic"
                  onClick={() => updateStatus(topic.id, "skipped")}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-amber-400 hover:bg-amber-500/10 transition-colors"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
              </>
            )}
            {(topic.status === "skipped" || topic.status === "used") && (
              <button
                title="Restore to pending"
                onClick={() => updateStatus(topic.id, "pending")}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 transition-colors text-[10px] font-medium underline underline-offset-2"
              >
                Restore
              </button>
            )}
            <button
              title="Delete topic"
              onClick={() => deleteTopic(topic.id)}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-foreground">Blog Topic Queue</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pending topics are picked up automatically by the AI blog generator on each run.
          </p>
        </div>
        <Button
          size="sm"
          className="gap-2 shrink-0"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showAddForm ? "Cancel" : "Add Topic"}
        </Button>
      </div>

      {/* Add topic form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.form
            key="add-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleAdd}
            className="rounded-xl border border-primary/30 bg-primary/5 p-5 space-y-4 overflow-hidden"
          >
            <p className="text-xs font-semibold text-primary uppercase tracking-wider">New Topic</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="topic-title" className="text-xs">Topic Title *</Label>
                <Input
                  id="topic-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Why Mumbai Restaurants Need a Mobile-First Website"
                  required
                  className="h-9 text-sm bg-background"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="topic-priority" className="text-xs">Priority (higher = first)</Label>
                <Input
                  id="topic-priority"
                  type="number"
                  min="0"
                  max="100"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  placeholder="0"
                  className="h-9 text-sm bg-background"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topic-desc" className="text-xs">Angle / Description (optional)</Label>
              <Textarea
                id="topic-desc"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Describe the specific angle or focus for this topic…"
                className="h-16 text-sm resize-none bg-background"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="topic-keywords" className="text-xs">Target Keywords (comma-separated)</Label>
              <Input
                id="topic-keywords"
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                placeholder="e.g. mobile website, restaurant website, Mumbai"
                className="h-9 text-sm bg-background"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" size="sm" disabled={saving} className="gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                {saving ? "Adding…" : "Add to Queue"}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Pending", count: pending.length, color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
          { label: "Used", count: used.length, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
          { label: "Skipped", count: skipped.length, color: "bg-secondary/30 text-muted-foreground border-border/30" },
        ].map(({ label, count, color }) => (
          <span key={label} className={`text-xs font-medium px-3 py-1 rounded-full border ${color}`}>
            {count} {label}
          </span>
        ))}
      </div>

      {/* Topic lists */}
      {loading ? (
        <TableSkeleton columns={1} rows={3} />
      ) : topics.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No topics yet"
          description="Add topics to the queue and the AI blog generator will pick them up automatically."
        />
      ) : (
        <div className="space-y-6">
          {/* Pending */}
          {pending.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-400/80 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Pending Queue ({pending.length})
              </h4>
              <AnimatePresence mode="popLayout">
                {pending.map((t) => <TopicCard key={t.id} topic={t} />)}
              </AnimatePresence>
            </div>
          )}

          {/* Used */}
          {used.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400/80 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Used ({used.length})
              </h4>
              <AnimatePresence mode="popLayout">
                {used.slice(0, 5).map((t) => <TopicCard key={t.id} topic={t} />)}
              </AnimatePresence>
              {used.length > 5 && (
                <p className="text-xs text-muted-foreground/60 italic pl-1">+ {used.length - 5} more used topics</p>
              )}
            </div>
          )}

          {/* Skipped */}
          {skipped.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2">
                <SkipForward className="w-3.5 h-3.5" />
                Skipped ({skipped.length})
              </h4>
              <AnimatePresence mode="popLayout">
                {skipped.map((t) => <TopicCard key={t.id} topic={t} />)}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
