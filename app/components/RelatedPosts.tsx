import { useEffect, useState } from "react";
import { Link } from "react-router";
import { supabase } from "@/lib/supabaseClient";
import { rankPosts, type PostSummary } from "@/lib/relatedPosts";
import { ArrowRight, TrendingUp } from "lucide-react";

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

// Location cross-links — displayed below service links to boost location page authority
const LOCATION_LINKS = [
  { name: "Web Design in Mulund", href: "/location/mulund" },
  { name: "Web Design in Bhandup", href: "/location/bhandup" },
  { name: "Web Design in Thane", href: "/location/thane" },
  { name: "Web Design in Andheri", href: "/location/andheri" },
  { name: "Web Design in Powai", href: "/location/powai" },
  { name: "Web Design in Bandra", href: "/location/bandra" },
];

/** Format view count for display: 1234 → "1,234 views" */
function formatViews(n: number): string {
  return n.toLocaleString("en-IN") + " views";
}

export default function RelatedPosts({
  currentSlug,
  currentTags = [],
}: RelatedPostsProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        // 1. Fetch all posts except the current one (including tags)
        const { data: allPosts } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at, tags")
          .neq("slug", currentSlug);

        if (!allPosts?.length) return;

        // 2. Fetch aggregated view counts for all slugs in one query
        const slugs = allPosts.map((p) => p.slug);
        const { data: viewRows } = await supabase
          .from("blog_post_views")
          .select("slug")
          .in("slug", slugs);

        // Build a slug → count map
        const viewMap: Record<string, number> = {};
        for (const row of viewRows ?? []) {
          viewMap[row.slug] = (viewMap[row.slug] ?? 0) + 1;
        }

        // 3. Merge view counts into posts
        const candidates: PostSummary[] = allPosts.map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt ?? null,
          published_at: p.published_at,
          tags: Array.isArray(p.tags) ? p.tags : [],
          view_count: viewMap[p.slug] ?? 0,
        }));

        // 4. Rank: tag overlap → view count → recency
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
          <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Continue Reading</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all"
              >
                <p className="text-xs text-muted-foreground mb-2" suppressHydrationWarning>
                  {new Date(post.published_at || Date.now()).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3 flex-1">
                  {post.title}
                </h3>
                {/* View count badge — only shown when ≥ 100 views */}
                {post.view_count >= 100 && (
                  <p className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-primary" aria-hidden="true" />
                    {formatViews(post.view_count)}
                  </p>
                )}
                <span className="mt-3 inline-flex items-center text-xs font-medium text-primary">
                  Read <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Service / Money Page Cross-links */}
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-6">Explore SiteNova Services</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {SERVICE_LINKS.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="group flex flex-col rounded-2xl border border-border/60 bg-card/50 p-5 hover:border-primary/30 hover:bg-card transition-all"
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

      {/* Location cross-links — internal linking from blog to location pages */}
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
