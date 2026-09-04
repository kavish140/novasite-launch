import type { Route } from "./+types/blog.$slug";
import { buildMeta } from "@/lib/meta";
import { createServerClient } from "@/lib/supabaseClient";

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
  // Debug: log what's available in context to diagnose env access
  console.log("[blog loader] context keys:", Object.keys(context ?? {}));
  console.log("[blog loader] context.cloudflare keys:", Object.keys((context as any)?.cloudflare ?? {}));
  console.log("[blog loader] env keys:", Object.keys((context as any)?.cloudflare?.env ?? {}));

  let supabaseUrl: string | undefined;
  let supabaseAnonKey: string | undefined;

  // Try multiple ways to access env vars — different CF plugin versions structure context differently
  const cf = (context as any)?.cloudflare;
  if (cf?.env) {
    supabaseUrl = cf.env.SUPABASE_URL;
    supabaseAnonKey = cf.env.SUPABASE_ANON_KEY;
  }

  // Fallback: env might be directly on context (some @cloudflare/vite-plugin versions)
  if (!supabaseUrl) {
    supabaseUrl = (context as any)?.env?.SUPABASE_URL ?? (context as any)?.SUPABASE_URL;
    supabaseAnonKey = (context as any)?.env?.SUPABASE_ANON_KEY ?? (context as any)?.SUPABASE_ANON_KEY;
  }

  // Fallback: use VITE_ build-time vars (these are baked into the bundle)
  if (!supabaseUrl) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("[blog loader] Could not find Supabase credentials in any location");
    throw new Response("Server configuration error", { status: 500 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", params.slug)
    .single();

  if (error || !post) {
    console.error("[blog loader] Post not found for slug:", params.slug, error);
    throw new Response("Not Found", { status: 404 });
  }

  // Fire-and-forget: record this page view without blocking the response
  supabase.from("blog_post_views").insert({ slug: params.slug }).then(() => {
    // intentionally not awaited
  });

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
