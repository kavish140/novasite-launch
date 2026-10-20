import { createClient } from "@supabase/supabase-js";

type BlogEnv = { SUPABASE_URL?: string; SUPABASE_ANON_KEY?: string };
type BlogContext = BlogEnv & { cloudflare?: { env?: BlogEnv }; env?: BlogEnv };

/** Per-request client retaining the blog's Cloudflare/plugin/build-time fallbacks. */
export function getBlogServerClient(context: unknown) {
  const ctx = (context ?? {}) as BlogContext;
  const candidates: (BlogEnv | undefined)[] = [ctx.cloudflare?.env, ctx.env, ctx, {
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }];
  for (const env of candidates) {
    if (env?.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    }
  }
  throw new Response("Article service temporarily unavailable", { status: 503 });
}
