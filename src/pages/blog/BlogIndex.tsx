import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import { setPageSeo } from "@/lib/seo";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
}

export default function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPageSeo({
      title: "Local Web Design Blog | SiteNova",
      description: "Read our latest articles on web design, SEO, and growing your local business in Mumbai.",
      canonicalPath: "/blog",
    });

    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at")
          .order("published_at", { ascending: false });
          
        if (error) {
          console.error("Error fetching posts:", error);
        } else {
          setPosts(data || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-16 sm:pb-24 max-w-7xl mx-auto px-6 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Our Blog
          </h1>
          <p className="text-lg text-muted-foreground">
            Insights on web design, SEO, and business growth.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl h-64 border border-border/60"></div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground border border-border/60 rounded-2xl bg-card/50">
            No posts found.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="group block h-full">
                <article className="flex flex-col h-full rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(post.published_at || Date.now()).toLocaleDateString("en-IN", {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <h2 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 flex items-center text-sm font-medium text-primary">
                    Read article <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
