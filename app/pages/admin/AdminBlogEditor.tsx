import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye, EyeOff, Zap } from "lucide-react";
import TipTapEditor from "./components/TipTapEditor";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { BlogPost } from "./AdminDashboard";

type PostStatus = BlogPost["status"];

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState<PostStatus>("draft");
  const [blanksMetadata, setBlanksMetadata] = useState<BlogPost["blanks_metadata"]>([]);
  const [source, setSource] = useState<BlogPost["source"]>("manual");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [showPreview, setShowPreview] = useState(false);
  const [showBlanks, setShowBlanks] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing && id) {
      fetchPost(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchPost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", postId)
        .single();

      if (error) throw error;

      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt ?? "");
        setContent(data.content ?? "");
        setTags(Array.isArray(data.tags) ? data.tags.join(", ") : "");
        setStatus((data.status as PostStatus) ?? "draft");
        setBlanksMetadata(Array.isArray(data.blanks_metadata) ? data.blanks_metadata : []);
        setSource(data.source ?? "manual");
        // Auto-open blanks panel for AI drafts that have unfilled blanks
        if (data.source === "ai" && Array.isArray(data.blanks_metadata) && data.blanks_metadata.some((b: { filled: boolean }) => !b.filled)) {
          setShowBlanks(true);
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({ title: "Error", description: "Could not load the blog post.", variant: "destructive" });
      navigate("/admin/dashboard");
    } finally {
      setInitialLoading(false);
    }
  };

  const generateSlug = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) setSlug(generateSlug(newTitle));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    // Inject filled blank content into the HTML before saving
    let finalContent = content;
    blanksMetadata.forEach((blank) => {
      if (blank.filled && blank.filled_content) {
        finalContent = finalContent.replace(
          `<!-- BLANK:${blank.id} -->`,
          `<span class="filled-blank" data-blank-id="${blank.id}">${blank.filled_content}</span>`
        );
      }
    });

    const postData: Record<string, unknown> = {
      title, slug, excerpt,
      content: finalContent,
      tags: parsedTags,
      status,
      blanks_metadata: blanksMetadata,
      updated_at: new Date().toISOString(),
    };

    // Auto-set published_at the first time a post goes live
    if (status === "published" && !isEditing) {
      postData.published_at = new Date().toISOString();
    }

    try {
      if (isEditing) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", id);
        if (error) throw error;
        toast({ title: "Success", description: "Blog post updated successfully!" });
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
        toast({
          title: status === "draft" ? "Draft Saved" : "Post Published",
          description: status === "draft"
            ? "Your draft is saved. Fill in the blanks and publish when ready."
            : "Blog post published successfully!",
        });
      }
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      console.error("Error saving post:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save post.";
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          Loading post…
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur z-10 sticky top-0">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button
            variant="ghost" size="sm"
            onClick={() => navigate("/admin/dashboard")}
            className="gap-2 -ml-3 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 mr-2">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-primary" />
              </div>
              <span className="font-semibold text-foreground/80 text-sm">
                {isEditing ? "Edit Post" : "New Post"}
              </span>
              {/* Status badge */}
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
                status === "draft"     ? "bg-amber-500/15 text-amber-400 border-amber-500/30" :
                status === "review"    ? "bg-blue-500/15 text-blue-400 border-blue-500/30" :
                status === "published" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" :
                "bg-secondary/40 text-muted-foreground border-border/40"
              }`}>
                {status}
              </span>
            </div>

            <Button
              type="button"
              size="sm"
              variant="outline"
              className="gap-2 h-9 border-border/40"
              onClick={() => setShowPreview((v) => !v)}
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? "Editor" : "Preview"}
            </Button>

            {/* Fill Blanks toggle — only shown for AI posts with blanks */}
            {source === "ai" && blanksMetadata.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant={showBlanks ? "default" : "outline"}
                className="gap-2 h-9 border-border/40"
                onClick={() => setShowBlanks((v) => !v)}
              >
                <Zap className="w-4 h-4" />
                Blanks ({blanksMetadata.filter((b) => !b.filled).length} left)
              </Button>
            )}

            {/* Status selector */}
            <Select value={status} onValueChange={(v) => setStatus(v as PostStatus)}>
              <SelectTrigger className="h-9 w-32 border-border/40 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Button
              type="submit"
              form="blog-editor-form"
              disabled={loading}
              className="gap-2 h-9"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving…" : status === "draft" ? "Save Draft" : status === "published" ? "Publish" : "Save"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-6 py-8">
        {showPreview ? (
          /* ── Live Preview ────────────────────────────────────────────── */
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              Preview — this is how the post will render on the blog.
            </div>
            <div className="bg-card/40 border border-border/40 rounded-xl p-8 shadow-sm">
              {title && (
                <h1 className="text-3xl font-bold tracking-tight mb-4">{title}</h1>
              )}
              {excerpt && (
                <p className="text-muted-foreground text-base mb-6 pb-6 border-b border-border/30">
                  {excerpt}
                </p>
              )}
              {tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {content ? (
                <div
                  className="prose prose-sm prose-invert max-w-none text-foreground/90 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <p className="text-muted-foreground italic">No content yet. Switch back to editor to write.</p>
              )}
            </div>
          </div>
        ) : (
          /* ── Editor form ─────────────────────────────────────────────── */
          <form id="blog-editor-form" onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-card border border-border/60 rounded-xl p-8 shadow-sm space-y-6">
              {/* Title + Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    placeholder="e.g. Why Fast Websites Win"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="why-fast-websites-win"
                    className="bg-background font-mono text-sm"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div className="space-y-2">
                <Label htmlFor="excerpt">Short Excerpt (SEO Description)</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  required
                  placeholder="A brief 1-2 sentence summary of the post…"
                  className="bg-background resize-none h-20"
                />
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. SEO, Google Ads, E-Commerce, Web Design"
                  className="bg-background"
                />
                <p className="text-xs text-muted-foreground">
                  Tags surface related posts. Use consistent labels across posts.
                </p>
              </div>

              {/* WYSIWYG Content Editor */}
              <div className="space-y-2">
                <Label>Post Content</Label>
                <p className="text-xs text-muted-foreground">
                  Use the toolbar to format your content. Click <strong>Preview</strong> in the header to see how it will look.
                </p>
                <TipTapEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Start writing your post… Use the toolbar above to format headings, lists, links, images, and more."
                />
              </div>
            </div>
          </form>
        )}

        {/* ── Blanks Fill Panel ──────────────────────────────────────────── */}
        {showBlanks && blanksMetadata.length > 0 && (
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground">Fill in Blanks</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Add your personal experience, local examples, and client results below. These replace the AI placeholders.
                </p>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                {blanksMetadata.filter((b) => !b.filled).length} / {blanksMetadata.length} remaining
              </span>
            </div>

            <div className="space-y-4">
              {blanksMetadata.map((blank) => (
                <div
                  key={blank.id}
                  className={`rounded-xl border p-5 space-y-3 transition-all duration-200 ${
                    blank.filled
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-border/60 bg-card/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {blank.filled ? (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">✓ Filled</span>
                        ) : (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Needs input</span>
                        )}
                        <span className="text-xs text-muted-foreground font-mono">#{blank.id}</span>
                      </div>
                      <p className="font-medium text-sm text-foreground">{blank.label}</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">{blank.guideline}</p>
                      <p className="text-[10px] text-muted-foreground/60 italic">📍 {blank.location}</p>
                    </div>
                    {blank.filled && (
                      <button
                        type="button"
                        onClick={() =>
                          setBlanksMetadata((prev) =>
                            prev.map((b) =>
                              b.id === blank.id ? { ...b, filled: false, filled_content: null } : b
                            )
                          )
                        }
                        className="text-xs text-muted-foreground hover:text-foreground shrink-0 underline underline-offset-2"
                      >
                        Edit
                      </button>
                    )}
                  </div>

                  {!blank.filled && (
                    <div className="space-y-2">
                      <textarea
                        className="w-full min-h-[80px] rounded-lg border border-border/60 bg-background px-3 py-2 text-sm resize-y focus:outline-none focus:ring-1 focus:ring-primary/40"
                        placeholder={`Write your ${blank.label.toLowerCase()} here…`}
                        defaultValue={blank.filled_content ?? ""}
                        id={`blank-${blank.id}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const el = document.getElementById(`blank-${blank.id}`) as HTMLTextAreaElement;
                          const val = el?.value.trim();
                          if (!val) return;
                          setBlanksMetadata((prev) =>
                            prev.map((b) =>
                              b.id === blank.id
                                ? { ...b, filled: true, filled_content: val }
                                : b
                            )
                          );
                        }}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                      >
                        Mark as filled
                      </button>
                    </div>
                  )}

                  {blank.filled && blank.filled_content && (
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-sm text-foreground/80 leading-relaxed">
                      {blank.filled_content}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {blanksMetadata.every((b) => b.filled) && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center space-y-2">
                <p className="text-emerald-400 font-semibold text-sm">✓ All blanks filled!</p>
                <p className="text-xs text-muted-foreground">Change status to <strong>Published</strong> in the header and save to go live.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
