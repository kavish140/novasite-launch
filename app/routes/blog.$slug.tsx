import { getBlogServerClient } from "@/lib/blog-client.server";
import type { Route } from "./+types/blog.$slug";
import { redirect } from "react-router";
import { buildMeta } from "@/lib/meta";
import { postCanonical, summarizePost, isOriginalPost, legacyLocalArticles } from "@/lib/blog-content";
import { rankPosts, editorialTopics } from "@/lib/relatedPosts";

/**
 * Lightweight edge-compatible HTML sanitizer.
 * Blog content comes from a trusted admin editor, so this focuses on stripping
 * the most dangerous XSS vectors.
 */
function edgeSanitize(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/\s+(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, "")
    .replace(/\s+(href|src|action)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi, "");
}

export async function loader({ params, context }: Route.LoaderArgs) {
  if (legacyLocalArticles[params.slug]) throw redirect(legacyLocalArticles[params.slug], 301);
  const supabase = getBlogServerClient(context);

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, content, published_at, updated_at, tags, canonical_url")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Response("Article temporarily unavailable", { status: 503 });
  }
  if (!post) {
    console.error("[blog loader] Post not found for slug:", params.slug, error);
    throw new Response("Not Found", { status: 404 });
  }

  // Fire-and-forget: record this page view without blocking the response
  supabase.from("blog_post_views").insert({ slug: params.slug }).then(() => {
    // intentionally not awaited
  });

  const { data: candidates, error: relatedError } = await supabase.from("blog_posts")
    .select("id, title, slug, excerpt, content, published_at, tags, canonical_url").eq("status", "published").neq("slug", params.slug);
  if (relatedError) console.error("Related articles unavailable", relatedError.code);
  const summaries = (candidates ?? []).filter(isOriginalPost).map((candidate) => {
    const summary = summarizePost(candidate);
    return { id: summary.id, slug: summary.slug, title: summary.title,
      excerpt: summary.excerpt, published_at: summary.published_at,
      tags: editorialTopics(summary), view_count: 0, reading_time_minutes: summary.reading_time_minutes };
  });
  const relatedPosts = rankPosts(summaries, editorialTopics(post), 3);
  return { post: { id: post.id, title: post.title, slug: post.slug, excerpt: summarizePost(post).excerpt,
    tags: post.tags ?? [], published_at: post.published_at, updated_at: post.updated_at,
    canonical_url: postCanonical(post), content: edgeSanitize(post.content) }, relatedPosts };
}

export function meta({ data }: Route.MetaArgs) {
  if (!data?.post) {
    return buildMeta({
      title: "Post Not Found | SiteNova",
      description: "The blog post you're looking for could not be found.",
      noindex: true,
    });
  }

  return buildMeta({
    title: `${data.post.title} | SiteNova Blog`,
    description: data.post.excerpt || data.post.title,
    canonicalUrl: postCanonical(data.post),
    type: "article",
    publishedTime: data.post.published_at,
    modifiedTime: data.post.updated_at || data.post.published_at,
    author: "Kavish Ganatra",
  });
}

export { default } from "@/pages/blog/BlogPost";
