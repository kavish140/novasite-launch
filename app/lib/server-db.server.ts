import { createClient } from "@supabase/supabase-js";

export type ServerEnv = {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CALENDAR_SYNC_SECRET: string;
};
export function serverEnv(context: unknown): ServerEnv {
  return (context as { cloudflare: { env: ServerEnv } }).cloudflare.env;
}
export function serviceDb(env: ServerEnv) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY)
    throw new Error("Server database is not configured");
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}
