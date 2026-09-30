import type { ActionFunctionArgs } from "react-router";
import { validSignature, syncSchema } from "@/lib/calendar-sync.server";
import { json, serviceDb, serverEnv } from "@/lib/server-db.server";

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405);
  try {
    const env = serverEnv(context);
    const body = await request.text();
    if (body.length > 200000) return json({ error: "Request too large" }, 413);
    const timestamp = request.headers.get("x-sync-timestamp") || "";
    const nonce = request.headers.get("x-sync-nonce") || "";
    if (
      !(await validSignature(
        body,
        timestamp,
        nonce,
        request.headers.get("x-sync-signature") || "",
        env.CALENDAR_SYNC_SECRET,
      ))
    )
      return json({ error: "Unauthorized" }, 401);
    const parsed = syncSchema.safeParse(JSON.parse(body));
    if (!parsed.success)
      return json({ error: "Invalid synchronization data" }, 400);
    const db = serviceDb(env);
    const replay = await db.rpc("consume_calendar_nonce", { p_nonce: nonce });
    if (replay.error) throw replay.error;
    if (!replay.data) return json({ error: "Request already used" }, 409);
    const p = parsed.data;
    if (p.action === "state") {
      const ids: string[] = [];
      for (let offset = 0; ; offset += 500) {
        const { data, error } = await db
          .from("call_bookings")
          .select("event_id")
          .eq("calendar_id", p.calendar_id)
          .order("id")
          .range(offset, offset + 499);
        if (error) throw error;
        ids.push(...data.map((r) => r.event_id));
        if (data.length < 500) break;
      }
      return json({ event_ids: ids });
    }
    if (p.action === "sync") {
      const { error } = await db.rpc("sync_call_bookings", {
        p_calendar_id: p.calendar_id,
        p_events: p.events,
      });
      if (error) throw error;
    } else if (p.action === "complete") {
      const { error } = await db
        .from("calendar_sync_state")
        .upsert({
          calendar_id: p.calendar_id,
          last_success_at: new Date().toISOString(),
        });
      if (error) throw error;
    } else if (p.action === "pending") {
      const { data, error } = await db
        .from("lead_notifications")
        .select("id,kind,payload,attempts")
        .is("sent_at", null)
        .order("attempts")
        .order("created_at")
        .limit(30);
      if (error) throw error;
      return json({ notifications: data });
    } else {
      const { error } = await db.rpc("ack_lead_notification", {
        p_id: p.id,
        p_delivered: p.delivered,
        p_error: p.error || null,
      });
      if (error) throw error;
    }
    return json({ ok: true });
  } catch (error) {
    if (error instanceof SyntaxError)
      return json({ error: "Invalid JSON" }, 400);
    console.error("Calendar synchronization failed");
    return json({ error: "Synchronization unavailable; retry later" }, 503);
  }
}
