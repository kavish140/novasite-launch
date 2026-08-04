import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { ArrowRight } from "lucide-react";

interface PostSummary {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published_at: string;
}

interface RelatedPostsProps {
  currentSlug: string;
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

export default function RelatedPosts({ currentSlug }: RelatedPostsProps) {
  const [posts, setPosts] = useState<PostSummary[]>([]);

  useEffect(() => {
    async function fetchRelated() {
      try {
        const { data } = await supabase
          .from("blog_posts")
          .select("id, title, slug, excerpt, published_at")
          .neq("slug", currentSlug)
          .order("published_at", { ascending: false })
          .limit(3);
        if (data) setPosts(data);
      } catch (err) {
        console.error("RelatedPosts fetch error:", err);
      }
    }
    fetchRelated();
  }, [currentSlug]);

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
                <p className="text-xs text-muted-foreground mb-2">
                  {new Date(post.published_at || Date.now()).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-3 flex-1">
                  {post.title}
                </h3>
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
    </aside>
  );
}
