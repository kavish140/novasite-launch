import type { Route } from "./+types/blog._index";
import { buildMeta } from "@/lib/meta";

export async function loader({ context }: Route.LoaderArgs) {
  let supabaseUrl: string | undefined;
  let supabaseAnonKey: string | undefined;

  const cf = (context as any)?.cloudflare;
  if (cf?.env) {
    supabaseUrl = cf.env.SUPABASE_URL;
    supabaseAnonKey = cf.env.SUPABASE_ANON_KEY;
  }
  if (!supabaseUrl) {
    supabaseUrl = (context as any)?.env?.SUPABASE_URL ?? (context as any)?.SUPABASE_URL;
    supabaseAnonKey = (context as any)?.env?.SUPABASE_ANON_KEY ?? (context as any)?.SUPABASE_ANON_KEY;
  }
  if (!supabaseUrl) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return { posts: [] };
  }

  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: posts } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, published_at")
      .order("published_at", { ascending: false });

    return { posts: posts || [] };
  } catch (err) {
    console.error("Blog index loader error:", err);
    return { posts: [] };
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
