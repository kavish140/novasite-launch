import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/components/SEO";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import { ArrowRight, Clock, BookOpen } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
}

function readingTime(excerpt: string): number {
  return Math.max(1, Math.ceil(excerpt.split(/\s+/).filter(Boolean).length / 40));
}

function formatDate(dateStr: string) {
  return new Date(dateStr || Date.now()).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatDateShort(dateStr: string) {
  return new Date(dateStr || Date.now()).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ── Featured hero card (most recent post) ────────────────────────────────────
function FeaturedCard({ post }: { post: BlogPost }) {
  const mins = readingTime(post.excerpt);
  return (
    <Link to={`/blog/${post.slug}`} className="group block mb-10">
      <article className="relative overflow-hidden rounded-3xl border border-border/60 bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.25)] interactive-card">
        {/* Subtle gradient accent */}
        <div className="absolute top-0 right-0 w-[400px] h-[300px] rounded-full bg-primary/5 blur-[80px] pointer-events-none" />

        <div className="relative z-10 p-8 md:p-12 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                Latest post
              </span>
              <span className="text-sm text-muted-foreground" suppressHydrationWarning>
                {formatDate(post.published_at)}
              </span>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                <Clock size={12} />
                {mins} min read
              </span>
            </div>

            {/* Title */}
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-[1.2] mb-4 group-hover:text-primary transition-colors">
              {post.title}
            </h2>

            {/* Excerpt */}
            <p className="text-muted-foreground leading-relaxed max-w-2xl line-clamp-3">
              {post.excerpt}
            </p>
          </div>

          {/* CTA */}
          <div className="shrink-0">
            <span className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground group-hover:bg-primary/90 transition-colors button-shimmer">
              Read article
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

// ── Regular grid card ─────────────────────────────────────────────────────────
function PostCard({ post }: { post: BlogPost }) {
  const mins = readingTime(post.excerpt);
  return (
    <Link to={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex flex-col h-full rounded-2xl border border-border/60 bg-card p-6 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)] interactive-card">
        {/* Meta */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs text-muted-foreground" suppressHydrationWarning>
            {formatDateShort(post.published_at)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} />
            {mins} min
          </span>
        </div>

        <div className="flex-1">
          <h2 className="font-heading text-lg font-semibold leading-snug mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {post.excerpt}
          </p>
        </div>

        <div className="mt-5 flex items-center text-sm font-medium text-primary">
          Read article
          <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-1" />
        </div>
      </article>
    </Link>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────
function SkeletonFeatured() {
  return (
    <div className="mb-10 animate-pulse rounded-3xl border border-border/60 bg-card p-8 md:p-12 h-52" />
  );
}
function SkeletonGrid() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse bg-card rounded-2xl h-52 border border-border/60" />
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BlogIndex() {
  const loaderData = useLoaderData<{ posts?: BlogPost[] }>();
  const initialPosts = loaderData?.posts ?? [];
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(initialPosts.length === 0);

  useEffect(() => {
    if (initialPosts.length > 0) return;
    async function fetchPosts() {
      try {
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at")
          .order("published_at", { ascending: false });
        if (error) console.error("Error fetching posts:", error);
        else setPosts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [initialPosts.length]);

  const [featured, ...rest] = posts;

  return (
    <PageTransition>
      <SEO
        title="Web Design & SEO Blog for Mumbai Businesses | SiteNova"
        description="Expert articles on web design, local SEO, and digital growth for small businesses in Mumbai, Mulund, Andheri, Thane, and nearby areas. Published by SiteNova."
        canonicalUrl="/blog"
        keywords={["web design blog Mumbai", "local SEO tips Mumbai", "website tips for small business", "Mumbai digital marketing blog"]}
      />
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "SiteNova Blog",
        "description": "Expert articles on web design, local SEO, and digital growth for Mumbai businesses.",
        "url": "https://sitenova.dev/blog",
        "publisher": {
          "@type": "Organization",
          "name": "SiteNova",
          "url": "https://sitenova.dev"
        }
      }} />

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <Navbar />

        <main className="flex-1 pt-32 pb-16 sm:pb-24 max-w-7xl mx-auto px-6 w-full">
          {/* Header */}
          <div className="mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl mb-3">
                Web Design & SEO Insights
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Practical guides on websites, local SEO, and digital growth for Mumbai businesses — written by SiteNova.
              </p>
            </div>
            {!loading && posts.length > 0 && (
              <span className="shrink-0 inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-4 py-2 text-sm font-medium text-muted-foreground">
                <BookOpen size={14} className="text-primary" />
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </span>
            )}
          </div>

          {/* Content */}
          {loading ? (
            <>
              <SkeletonFeatured />
              <SkeletonGrid />
            </>
          ) : posts.length === 0 ? (
            <div className="text-center py-20 rounded-3xl border border-border/60 bg-card/50">
              <BookOpen size={40} className="mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg font-semibold text-foreground mb-2">No articles yet</p>
              <p className="text-muted-foreground mb-6">Check back soon — we publish regularly.</p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Back to homepage
              </Link>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && <FeaturedCard post={featured} />}

              {/* Rest of posts */}
              {rest.length > 0 && (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <Footer />
      </div>
    </PageTransition>
  );
}
