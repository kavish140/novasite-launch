import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

export default function AdminBlogEditor() {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  
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
        setExcerpt(data.excerpt);
        setContent(data.content);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({ title: "Error", description: "Could not load the blog post.", variant: "destructive" });
      navigate("/admin/dashboard");
    } finally {
      setInitialLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const postData = { title, slug, excerpt, content };

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
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/dashboard")} className="gap-2 -ml-3">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <span className="font-semibold text-muted-foreground">
            {isEditing ? "Edit Blog Post" : "New Blog Post"}
          </span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? "Edit Post" : "Create New Post"}
            </h1>
            <Button type="submit" disabled={loading} className="gap-2">
              <Save className="w-4 h-4" />
              {loading ? "Saving..." : "Save Post"}
            </Button>
          </div>

          <div className="bg-card border border-border/60 rounded-xl p-8 shadow-sm space-y-6">
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

            <div className="space-y-2">
              <Label htmlFor="excerpt">Short Excerpt (SEO Description)</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                placeholder="A brief 1-2 sentence summary of the post..."
                className="bg-background resize-none h-20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Post Content (HTML)</Label>
              <p className="text-xs text-muted-foreground mb-2">You can use standard HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, and &lt;a&gt; for formatting.</p>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="<h2>Introduction</h2><p>Write your post content here...</p>"
                className="bg-background min-h-[400px] font-mono text-sm"
              />
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
