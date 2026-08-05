import { createClient } from "@supabase/supabase-js";

// =============================================================================
// Client-side singleton (safe: one browser = one user)
// Used by admin pages, ExitIntentPopup, RelatedPosts, FreeAudit, etc.
// These components run only in the browser after hydration.
// =============================================================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (typeof window !== "undefined" && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn(
    "Supabase credentials not found. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);

// =============================================================================
// Server-side factory (per-request — no data leaking between users)
// Used in route loaders: const supabase = createServerClient(context);
// Reads SUPABASE_URL and SUPABASE_ANON_KEY from Cloudflare Worker secrets
// (set via `wrangler secret put`), NOT from VITE_ build-time env vars.
// =============================================================================
interface CloudflareLoadContext {
  cloudflare: {
    env: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      [key: string]: unknown;
    };
  };
}

export function createServerClient(context: CloudflareLoadContext) {
  return createClient(
    context.cloudflare.env.SUPABASE_URL,
    context.cloudflare.env.SUPABASE_ANON_KEY
  );
}
