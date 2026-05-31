import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { setPageSeo } from "@/lib/seo";
import { ChevronLeft } from "lucide-react";

interface BlogPostData {
  id: string;
  title: string;
  slug: string;
  content: string;
  published_at: string;
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!slug) return;
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("slug", slug)
          .single();
          
        if (error) {
          console.error("Error fetching post:", error);
        } else if (data) {
          setPost(data);
          setPageSeo({
            title: `${data.title} | SiteNova Blog`,
            description: data.excerpt || `Read our latest article on ${data.title}.`,
            canonicalPath: `/blog/${data.slug}`,
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 max-w-3xl mx-auto px-6 w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-4 w-24 bg-muted rounded"></div>
            <div className="h-10 w-3/4 bg-muted rounded"></div>
            <div className="h-6 w-1/4 bg-muted rounded mt-8"></div>
            <div className="space-y-2 mt-8">
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 pt-32 pb-24 max-w-3xl mx-auto px-6 w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Post Not Found</h1>
          <p className="text-muted-foreground mb-8">The article you're looking for doesn't exist or has been removed.</p>
          <Link to="/blog" className="text-primary hover:underline">
            ← Back to Blog
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 sm:pb-24 max-w-3xl mx-auto px-6 w-full">
        <Link 
          to="/blog" 
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to all posts
        </Link>
        
        <article>
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              {post.title}
            </h1>
            <p className="text-muted-foreground">
              Published on {new Date(post.published_at || Date.now()).toLocaleDateString("en-IN", {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </header>
          
          <div 
            className="prose prose-slate dark:prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
