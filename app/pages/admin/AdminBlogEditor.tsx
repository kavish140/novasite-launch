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

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [showPreview, setShowPreview] = useState(false);

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
    const postData = { title, slug, excerpt, content, tags: parsedTags };

    try {
      if (isEditing) {
        const { error } = await supabase.from("blog_posts").update(postData).eq("id", id);
        if (error) throw error;
        toast({ title: "Success", description: "Blog post updated successfully!" });
      } else {
        const { error } = await supabase.from("blog_posts").insert([postData]);
        if (error) throw error;
        toast({ title: "Success", description: "Blog post created successfully!" });
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

            <Button
              type="submit"
              form="blog-editor-form"
              disabled={loading}
              className="gap-2 h-9"
            >
              <Save className="w-4 h-4" />
              {loading ? "Saving…" : "Save Post"}
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
      </main>
    </div>
  );
}
