import { afterEach, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ScheduledCallsTab from "../pages/admin/tabs/ScheduledCallsTab";
import type { CallBooking } from "./booking";

afterEach(cleanup);
it("filters scheduled calls, searches attendees and shows notification retries", () => {
  const now = Date.now();
  const call = (
    id: string,
    offset: number,
    status: CallBooking["status"],
  ): CallBooking => ({
    id,
    calendar_id: "calendar",
    event_id: id,
    attendee_name: id,
    attendee_email: `${id}@example.test`,
    starts_at: new Date(now + offset).toISOString(),
    ends_at: new Date(now + offset + 900000).toISOString(),
    status,
    meet_url: "https://meet.google.com/abc-defg-hij",
    calendar_url: "https://calendar.google.com/calendar/event",
    updated_at: new Date(now).toISOString(),
  });
  const refresh = vi.fn();
  render(
    <ScheduledCallsTab
      calls={[
        call("Future", 86400000, "scheduled"),
        call("Past", -86400000, "scheduled"),
        call("Cancelled", 86400000, "cancelled"),
      ]}
      notifications={[
        {
          id: "notice",
          kind: "booking_created",
          booking_id: "Future",
          attempts: 1,
          last_error: "failed",
          sent_at: null,
          created_at: new Date(now).toISOString(),
        },
      ]}
      lastSync={new Date(now).toISOString()}
      error=""
      loading={false}
      refresh={refresh}
    />,
  );
  expect(screen.getByRole("heading", { name: "Future" })).toBeTruthy();
  expect(screen.getByText(/queued for retry/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Search scheduled calls"), {
    target: { value: "absent" },
  });
  expect(screen.getByText(/No upcoming calls/)).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Search scheduled calls"), {
    target: { value: "" },
  });
  fireEvent.change(screen.getByLabelText("Filter scheduled calls"), {
    target: { value: "past" },
  });
  expect(screen.getByRole("heading", { name: "Past" })).toBeTruthy();
  fireEvent.change(screen.getByLabelText("Filter scheduled calls"), {
    target: { value: "cancelled" },
  });
  expect(screen.getByRole("heading", { name: "Cancelled" })).toBeTruthy();
  expect(screen.queryByRole("link", { name: "Join Google Meet" })).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Refresh" }));
  expect(refresh).toHaveBeenCalledOnce();
});
