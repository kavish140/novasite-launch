import type { Route } from "./+types/blog.$slug";
import { buildMeta } from "@/lib/meta";
import { createServerClient } from "@/lib/supabaseClient";

/**
 * Lightweight edge-compatible HTML sanitizer.
 * Replaces sanitize-html (which uses Node.js stream APIs incompatible with CF Workers).
 * Blog content comes from a trusted admin editor, so this focuses on stripping
 * the most dangerous XSS vectors: <script>, <style>, inline event handlers,
 * and javascript:/data: URLs.
 */
function edgeSanitize(html: string): string {
  return html
    // Remove <script>...</script> blocks (including contents)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    // Remove <style>...</style> blocks
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    // Remove inline event handler attributes (onclick, onerror, onload, etc.)
    .replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    // Remove javascript: and data: hrefs/srcs
    .replace(/\s+(href|src|action)\s*=\s*(?:"javascript:[^"]*"|'javascript:[^']*')/gi, "")
    .replace(/\s+(href|src|action)\s*=\s*(?:"data:[^"]*"|'data:[^']*')/gi, "");
}

export async function loader({ params, context }: Route.LoaderArgs) {
  const { SUPABASE_URL, SUPABASE_ANON_KEY } = context.cloudflare.env;

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Response(
      "Server configuration error: Supabase secrets not set in Cloudflare Worker.",
      { status: 500 }
    );
  }

  const supabase = createServerClient(context);
  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .eq("status", "published")
    .single();

  if (error || !post) {
    throw new Response("Not Found", { status: 404 });
  }

  return { post: { ...post, content: edgeSanitize(post.content) } };
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
    canonicalPath: `/blog/${data.post.slug}`,
    type: "article",
    publishedTime: data.post.published_at,
    author: "Kavish Ganatra",
    image: data.post.cover_image,
  });
}

export { default } from "@/pages/blog/BlogPost";
