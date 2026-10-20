import { getBlogServerClient } from "@/lib/blog-client.server";
import type { Route } from "./+types/blog._index";
import { buildMeta } from "@/lib/meta";
import { summarizePost, isOriginalPost } from "@/lib/blog-content";

export async function loader({ context }: Route.LoaderArgs) {
  try {
    const supabase = getBlogServerClient(context);
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, published_at, content, canonical_url")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) throw error;
    return { posts: (posts || []).filter(isOriginalPost).map((post) => {
      const summary = summarizePost(post);
      return { id: summary.id, title: summary.title, slug: summary.slug,
        excerpt: summary.excerpt, published_at: summary.published_at,
        reading_time_minutes: summary.reading_time_minutes };
    }) };
  } catch (err) {
    console.error("Blog index loader error:", err);
    throw new Response("Article archive temporarily unavailable", { status: 503 });
  }
}

export function meta() {
  return buildMeta({
    title: "Web Design & SEO Blog for Mumbai Businesses | SiteNova",
    description:
      "Expert tips on web design, local SEO, Core Web Vitals, and growing your online presence in Mumbai. From the SiteNova blog.",
    canonicalPath: "/blog",
    keywords: [
      "web design blog Mumbai",
      "local SEO tips Mumbai",
      "website tips for small business",
      "Mumbai digital marketing blog",
    ],
  });
}

export { default } from "@/pages/blog/BlogIndex";
