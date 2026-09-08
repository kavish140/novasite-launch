import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "@/lib/supabaseClient";
import { rankPosts, type PostSummary } from "@/lib/relatedPosts";
import { ArrowRight, Clock, TrendingUp } from "lucide-react";

interface RelatedPostsProps {
  currentSlug: string;
  currentTags?: string[];
}

const SERVICE_LINKS = [
  {
    label: "Web Design Services",
    description: "See our full range of custom website packages for Mumbai businesses.",
    href: "/services/seo-optimization",
    tag: "Popular",
  },
  {
    label: "Website Cost in Mumbai",
    description: "Transparent pricing from ₹10,000. Get an instant quote tailored to your scope.",
    href: "/pricing",
    tag: "Pricing",
  },
  {
    label: "Free Website Audit",
    description: "Not sure where to start? We'll audit your existing site for SEO & speed — free.",
    href: "/free-audit",
    tag: "Free",
  },
];

const LOCATION_LINKS = [
  { name: "Web Design in Mulund", href: "/location/mulund" },
  { name: "Web Design in Bhandup", href: "/location/bhandup" },
  { name: "Web Design in Thane", href: "/location/thane" },
  { name: "Web Design in Andheri", href: "/location/andheri" },
  { name: "Web Design in Powai", href: "/location/powai" },
  { name: "Web Design in Bandra", href: "/location/bandra" },
];

function formatViews(n: number): string {
  return n.toLocaleString("en-IN") + " views";
}

function readingTime(excerpt: string | null): number {
  if (!excerpt) return 1;
  return Math.max(1, Math.ceil(excerpt.split(/\s+/).filter(Boolean).length / 40));
}

export default function RelatedPosts({ currentSlug, currentTags = [] }: RelatedPostsProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const { data: allPosts } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at, tags")
          .neq("slug", currentSlug);

        if (!allPosts?.length) return;

        const slugs = allPosts.map((p) => p.slug);
        const { data: viewRows } = await supabase
          .from("blog_post_views")
          .select("slug")
          .in("slug", slugs);

        const viewMap: Record<string, number> = {};
        for (const row of viewRows ?? []) {
          viewMap[row.slug] = (viewMap[row.slug] ?? 0) + 1;
        }

        const candidates: PostSummary[] = allPosts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? null,
          published_at: p.published_at,
          tags: Array.isArray(p.tags) ? p.tags : [],
          view_count: viewMap[p.slug] ?? 0,
        }));

        const ranked = rankPosts(candidates, currentTags, 3);
        setPosts(ranked);
      } catch (err) {
        console.error("RelatedPosts fetch error:", err);
      }
    }
    fetchRelated();
  }, [currentSlug, currentTags]);

  return (
    <aside className="mt-16 border-t border-border/40 pt-12" aria-label="Continue reading and explore SiteNova services">

      {/* Related Articles */}
      {posts.length > 0 && (
        <div className="mb-12">
          <h2 className="font-heading text-xl font-bold tracking-tight text-foreground mb-6">Continue Reading</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {posts.map((post) => {
              const mins = readingTime(post.excerpt);
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-border/60 bg-card p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.2)] interactive-card"
                >
                  {/* Meta row */}
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                      {new Date(post.published_at || Date.now()).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock size={11} />
                      {mins} min
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3 flex-1 leading-snug">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <span className="inline-flex items-center text-xs font-medium text-primary">
                      Read <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                    {post.view_count >= 100 && (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <TrendingUp className="h-3 w-3 text-primary" aria-hidden="true" />
                        {formatViews(post.view_count)}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Service cross-links */}
      <div>
        <h2 className="font-heading text-xl font-bold tracking-tight text-foreground mb-6">Explore SiteNova Services</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {SERVICE_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group flex flex-col rounded-2xl border border-border/60 bg-card/50 p-5 hover:border-primary/30 hover:bg-card transition-all interactive-card"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {item.tag}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {item.label}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{item.description}</p>
              <span className="mt-3 inline-flex items-center text-xs font-medium text-primary">
                Learn more <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Location cross-links */}
      <div className="mt-10">
        <h2 className="text-base font-semibold tracking-tight text-foreground mb-4">Areas We Serve in Mumbai</h2>
        <div className="flex flex-wrap gap-2">
          {LOCATION_LINKS.map((loc) => (
            <Link
              key={loc.href}
              to={loc.href}
              className="rounded-lg border border-border/60 bg-secondary/20 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary hover:border-primary/30 transition-all"
            >
              {loc.name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
