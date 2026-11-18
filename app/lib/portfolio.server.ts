import { createServerClient } from "./supabaseClient";
import { serverEnv } from "./server-db.server";
import { defaultPortfolio, parsePortfolio } from "./portfolio";

export async function readPortfolio(context: Parameters<typeof serverEnv>[0]) {
  try {
    const { data, error } = await createServerClient({cloudflare:{env:serverEnv(context)}})
      .from("portfolio_projects").select("*").eq("is_visible",true).order("position");
    if (error) {
      if (error.code === "PGRST205" || error.code === "42P01") return { projects: defaultPortfolio, available: true };
      return {projects: [], available: false};
    }
    return {projects: parsePortfolio(data), available: true};
  } catch { return {projects: [], available: false}; }
}
