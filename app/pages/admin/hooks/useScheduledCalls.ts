import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { CallBooking } from "@/lib/booking";

export type NotificationStatus = {
  id: string;
  kind: string;
  booking_id: string | null;
  attempts: number;
  last_error: string | null;
  sent_at: string | null;
  created_at: string;
};
export function useScheduledCalls(active: boolean) {
  const [calls, setCalls] = useState<CallBooking[]>([]);
  const [notifications, setNotifications] = useState<NotificationStatus[]>([]);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const rows: CallBooking[] = [];
      for (let offset = 0; ; offset += 500) {
        const r = await supabase
          .from("call_bookings")
          .select("*")
          .order("starts_at", { ascending: false })
          .order("id")
          .range(offset, offset + 499);
        if (r.error) throw r.error;
        rows.push(...(r.data as CallBooking[]));
        if (r.data.length < 500) break;
      }
      const [sync, notices] = await Promise.all([
        supabase
          .from("calendar_sync_state")
          .select("last_success_at")
          .order("last_success_at", { ascending: false })
          .limit(1),
        supabase
          .from("lead_notifications")
          .select("id,kind,booking_id,attempts,last_error,sent_at,created_at")
          .order("created_at", { ascending: false })
          .limit(1000),
      ]);
      if (sync.error || notices.error) throw sync.error || notices.error;
      setCalls(rows);
      setLastSync(sync.data[0]?.last_success_at || null);
      setNotifications(notices.data);
      setError("");
    } catch {
      setError(
        "Couldn't refresh scheduled calls. Check the booking SQL migration and admin access.",
      );
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!active) return;
    refresh();
    const timer = setInterval(refresh, 60000);
    return () => clearInterval(timer);
  }, [active, refresh]);
  return { calls, notifications, lastSync, error, loading, refresh };
}
