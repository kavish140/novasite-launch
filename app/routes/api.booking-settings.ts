import type { LoaderFunctionArgs } from "react-router";
import { createServerClient } from "@/lib/supabaseClient";
import { DEFAULT_BOOKING_SETTINGS, validBookingUrl } from "@/lib/booking";
import { serverEnv, json } from "@/lib/server-db.server";

export async function loader({ context }: LoaderFunctionArgs) {
  try {
    const { data, error } = await createServerClient({
      cloudflare: { env: serverEnv(context) },
    })
      .from("booking_settings")
      .select("enabled,booking_url")
      .eq("id", true)
      .single();
    return json(
      !error && data && validBookingUrl(data.booking_url)
        ? data
        : DEFAULT_BOOKING_SETTINGS,
    );
  } catch {
    return json(DEFAULT_BOOKING_SETTINGS);
  }
}
