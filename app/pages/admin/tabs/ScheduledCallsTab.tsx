import { useState } from "react";
import { CalendarDays, RefreshCw, Video } from "lucide-react";
import type { useScheduledCalls } from "../hooks/useScheduledCalls";

export default function ScheduledCallsTab({
  calls,
  notifications,
  lastSync,
  error,
  loading,
  refresh,
}: ReturnType<typeof useScheduledCalls>) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("upcoming");
  const [page, setPage] = useState(0);
  const now = Date.now();
  const filtered = calls
    .filter((c) => {
      const matches = `${c.attendee_name} ${c.attendee_email}`
        .toLowerCase()
        .includes(query.toLowerCase());
      return (
        matches &&
        (filter === "cancelled"
          ? c.status === "cancelled"
          : c.status === "scheduled" &&
            (filter === "upcoming"
              ? Date.parse(c.ends_at) >= now
              : Date.parse(c.ends_at) < now))
      );
    })
    .sort((a, b) =>
      filter === "upcoming"
        ? Date.parse(a.starts_at) - Date.parse(b.starts_at)
        : Date.parse(b.starts_at) - Date.parse(a.starts_at),
    );
  const fmt = (s: string) =>
    new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Kolkata",
    }).format(new Date(s));
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold">Scheduled Calls</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Confirmed Google Calendar appointments · All times IST
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 border border-border rounded-lg px-4 py-2"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        {lastSync
          ? `Last successful sync: ${fmt(lastSync)}. Normally updates every 5 minutes.`
          : "No successful sync yet. Complete the Google Calendar setup to import appointments."}
      </p>
      {lastSync && Date.now() - Date.parse(lastSync) > 15 * 60000 && (
        <p role="status" className="text-amber-600 text-sm">
          Calendar sync is delayed. Check Apps Script executions and
          authorization.
        </p>
      )}
      {error && (
        <p role="alert" className="text-red-500 text-sm">
          {error}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        <input
          aria-label="Search scheduled calls"
          placeholder="Search name or email"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(0);
          }}
          className="rounded-lg border border-border bg-background px-4 py-2 flex-1 min-w-0"
        />
        <select
          aria-label="Filter scheduled calls"
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(0);
          }}
          className="rounded-lg border border-border bg-background px-4 py-2"
        >
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      {!loading && !filtered.length && (
        <div className="glass-card text-center p-10">
          <CalendarDays className="mx-auto mb-3 text-muted-foreground" />
          <p>
            No {filter} calls{query ? " matching your search" : ""}.
          </p>
        </div>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.slice(page * 20, (page + 1) * 20).map((c) => {
          const notice = notifications.find((n) => n.booking_id === c.id);
          return (
            <article
              key={c.id}
              className="glass-card p-5 space-y-3 break-words"
            >
              <div className="flex justify-between gap-3">
                <h3 className="font-semibold">
                  {c.attendee_name || c.attendee_email}
                </h3>
                <span className="text-xs capitalize text-muted-foreground">
                  {c.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {c.attendee_email}
              </p>
              <p className="font-medium">{fmt(c.starts_at)}</p>
              <p className="text-sm text-muted-foreground">
                {Math.round(
                  (Date.parse(c.ends_at) - Date.parse(c.starts_at)) / 60000,
                )}{" "}
                minutes · IST
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                {c.meet_url && c.status !== "cancelled" && (
                  <a
                    href={c.meet_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary inline-flex items-center gap-1"
                  >
                    <Video size={16} />
                    Join Google Meet
                  </a>
                )}
                {c.calendar_url && (
                  <a
                    href={c.calendar_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Open in Google Calendar
                  </a>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Email:{" "}
                {notice
                  ? notice.sent_at
                    ? `sent ${fmt(notice.sent_at)}`
                    : notice.last_error
                      ? "delivery failed — queued for retry"
                      : "queued"
                  : "no recent notification"}
              </p>
            </article>
          );
        })}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>{filtered.length} calls</span>
        <div className="flex gap-4">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="disabled:opacity-40"
          >
            Previous
          </button>
          <button
            disabled={(page + 1) * 20 >= filtered.length}
            onClick={() => setPage((p) => p + 1)}
            className="disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
