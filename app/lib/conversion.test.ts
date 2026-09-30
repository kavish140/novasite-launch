// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  bookingAvailable,
  validBookingUrl,
  suppressPromotions,
} from "./booking";
import { calendarEventSchema, validSignature } from "./calendar-sync.server";
import { quoteSchema } from "./quote";

describe("booking configuration", () => {
  it("only embeds real Google schedule URLs and requires enabled", () => {
    const url =
      "https://calendar.google.com/calendar/u/0/appointments/schedules/abc_123";
    expect(validBookingUrl(url)).toBe(true);
    for (const bad of [
      "https://calendar.google.com.evil.test/calendar/appointments/schedules/abc",
      "javascript:alert(1)",
      "https://calendar.app.google/abc",
      "https://calendar.google.com/calendar/embed",
      "https://user@calendar.google.com/calendar/appointments/schedules/abc",
    ])
      expect(validBookingUrl(bad)).toBe(false);
    expect(bookingAvailable({ booking_url: url, enabled: false })).toBe(false);
    expect(bookingAvailable({ booking_url: url, enabled: true })).toBe(true);
  });
  it("suppresses competing promotions throughout the conversion journey", () => {
    for (const path of [
      "/quote",
      "/book-a-call",
      "/thank-you",
      "/lp/web-design",
      "/lp/thank-you-quote",
      "/admin/dashboard",
      "/free-audit",
      "/contact-us",
    ])
      expect(suppressPromotions(path)).toBe(true);
    expect(suppressPromotions("/pricing")).toBe(false);
  });
});

describe("integration authentication", () => {
  it("accepts signed content and rejects tampering and expired requests", async () => {
    const body = '{"action":"pending"}';
    const timestamp = String(Date.now());
    const nonce = "12345678-1234-1234-1234-123456789012";
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode("test-secret"),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signed = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${timestamp}.${nonce}.${body}`),
    );
    const signature = Buffer.from(signed).toString("hex");
    expect(
      await validSignature(body, timestamp, nonce, signature, "test-secret"),
    ).toBe(true);
    expect(
      await validSignature(
        body + " ",
        timestamp,
        nonce,
        signature,
        "test-secret",
      ),
    ).toBe(false);
    expect(
      await validSignature(
        body,
        timestamp,
        nonce,
        signature,
        "test-secret",
        Number(timestamp) + 300001,
      ),
    ).toBe(false);
  });
  it("requires actual attendee details for bookings but accepts cancellation tombstones", () => {
    const event = {
      event_id: "123",
      version: "v1",
      google_updated_at: new Date().toISOString(),
      status: "cancelled",
    };
    expect(calendarEventSchema.safeParse(event).success).toBe(true);
    expect(
      calendarEventSchema.safeParse({ ...event, status: "scheduled" }).success,
    ).toBe(false);
  });
});

export const validQuote = {
  submissionId: "13fa6805-108f-4820-a7f1-cab879d545f5",
  name: "Test Buyer",
  email: "buyer@example.test",
  phone: "9999999999",
  businessName: "Test Company",
  projectType: "Business Website",
  requirements: "",
  budget: "Rs. 15,000 - 30,000",
  timeline: "Normal (2-4 weeks)",
  source: "website",
};
describe("quote qualification", () => {
  it("allows optional detail but requires an explicit budget and business", () => {
    expect(quoteSchema.safeParse(validQuote).success).toBe(true);
    expect(quoteSchema.safeParse({ ...validQuote, budget: "" }).success).toBe(
      false,
    );
    expect(
      quoteSchema.safeParse({ ...validQuote, businessName: "" }).success,
    ).toBe(false);
  });
});
