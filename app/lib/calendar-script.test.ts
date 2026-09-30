// @vitest-environment node
import { readFileSync } from "node:fs";
import vm from "node:vm";
import { describe, expect, it, vi } from "vitest";

const source = readFileSync("scripts/google-calendar/Code.gs", "utf8");
const config = {
  calendar: "owner@example.test",
  owner: "owner@example.test",
  title: "SiteNova Website Consultation",
  endpoint: "https://sitenova.dev/api/integrations/google-calendar",
  recipient: "owner@example.test",
};
const event = {
  id: "appointment-1",
  etag: "v1",
  updated: "2026-09-29T08:00:00.000Z",
  summary: config.title,
  organizer: { email: config.owner },
  attendees: [{ email: "buyer@example.test", displayName: "Buyer" }],
  start: { dateTime: "2026-10-01T10:00:00+05:30" },
  end: { dateTime: "2026-10-01T10:15:00+05:30" },
  hangoutLink: "https://meet.google.com/abc-defg-hij",
};
function runtime() {
  const properties = new Map<string, string>();
  const context = vm.createContext({
    Date,
    console,
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: (k: string) => properties.get(k),
        setProperty: (k: string, v: string) => properties.set(k, v),
        deleteProperty: (k: string) => properties.delete(k),
      }),
    },
    Calendar: { Events: { list: vi.fn(), get: vi.fn() } },
    MailApp: { getRemainingDailyQuota: () => 10, sendEmail: vi.fn() },
    Utilities: { formatDate: () => "01 Oct 2026 10:00" },
  });
  vm.runInContext(source, context);
  context.api_ = vi.fn((_config, payload) =>
    payload.action === "state" ? { event_ids: [] } : { ok: true },
  );
  return { context, properties };
}
describe("Google Calendar script", () => {
  it("filters unrelated events, imports confirmed appointments and retains cancellation IDs", () => {
    const { context: c } = runtime();
    expect(
      c.normalizeEvent_(
        { ...event, summary: "Private dentist visit" },
        config,
        false,
      ),
    ).toBeNull();
    expect(c.normalizeEvent_(event, config, false).attendee_email).toBe(
      "buyer@example.test",
    );
    expect(
      c.normalizeEvent_({ id: event.id, status: "cancelled" }, config, true)
        .status,
    ).toBe("cancelled");
    expect(
      c.normalizeEvent_({ id: "unknown", status: "cancelled" }, config, false),
    ).toBeNull();
  });
  it("only advances the checkpoint after all pages are saved", () => {
    const { context: c, properties } = runtime();
    c.Calendar.Events.list
      .mockReturnValueOnce({ items: [event], nextPageToken: "page2" })
      .mockReturnValueOnce({ items: [], nextSyncToken: "checkpoint" });
    c.syncCalendar_(config);
    expect(properties.get(`SYNC_TOKEN:${config.calendar}`)).toBe("checkpoint");
    expect(c.Calendar.Events.list.mock.calls[1][1].pageToken).toBe("page2");
    c.Calendar.Events.list.mockReturnValue({
      items: [{ ...event, etag: "v2" }],
      nextSyncToken: "new",
    });
    c.api_ = vi.fn((_config, p) => {
      if (p.action === "sync") throw new Error("outage");
      return { event_ids: [event.id] };
    });
    expect(() => c.syncCalendar_(config)).toThrow("outage");
    expect(properties.get(`SYNC_TOKEN:${config.calendar}`)).toBe("checkpoint");
  });
  it("recovers expired tokens and reconciles deletions on the next full sync", () => {
    const { context: c, properties } = runtime();
    properties.set(`SYNC_TOKEN:${config.calendar}`, "expired");
    c.Calendar.Events.list.mockImplementationOnce(() => {
      throw new Error("410 sync token expired");
    });
    expect(() => c.syncCalendar_(config)).toThrow("expired");
    expect(properties.has(`SYNC_TOKEN:${config.calendar}`)).toBe(false);
    c.api_.mockImplementation((_config, p) =>
      p.action === "state" ? { event_ids: [event.id] } : { ok: true },
    );
    c.Calendar.Events.list.mockReturnValue({
      items: [],
      nextSyncToken: "fresh",
    });
    c.Calendar.Events.get.mockImplementation(() => {
      throw new Error("404 Not found");
    });
    c.syncCalendar_(config);
    expect(
      c.api_.mock.calls.some(
        ([, p]) => p.action === "sync" && p.events[0].status === "cancelled",
      ),
    ).toBe(true);
  });
  it("records send failures for retry instead of acknowledging delivery", () => {
    const { context: c } = runtime();
    c.api_.mockImplementation((_config, p) =>
      p.action === "pending"
        ? { notifications: [{ id: "notice", kind: "quote", payload: {} }] }
        : { ok: true },
    );
    c.MailApp.sendEmail.mockImplementation(() => {
      throw new Error("Mail unavailable");
    });
    c.deliverNotifications_(config);
    expect(c.api_.mock.calls.slice(-1)[0][1]).toMatchObject({
      action: "ack",
      id: "notice",
      delivered: false,
    });
  });
});
