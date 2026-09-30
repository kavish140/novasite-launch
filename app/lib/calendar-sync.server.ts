import { z } from "zod";

const safeUrl = (host: string) =>
  z
    .string()
    .url()
    .max(2000)
    .refine((value) => {
      const u = new URL(value);
      return (
        u.protocol === "https:" &&
        u.hostname === host &&
        !u.username &&
        !u.password
      );
    });
export const calendarEventSchema = z
  .object({
    event_id: z.string().min(1).max(1024),
    version: z.string().min(1).max(1024),
    google_updated_at: z.string().datetime(),
    status: z.enum(["scheduled", "cancelled"]),
    attendee_name: z.string().max(200).optional(),
    attendee_email: z.string().email().max(254).optional(),
    starts_at: z.string().datetime({ offset: true }).optional(),
    ends_at: z.string().datetime({ offset: true }).optional(),
    meet_url: safeUrl("meet.google.com").nullable().optional(),
    calendar_url: safeUrl("www.google.com")
      .or(safeUrl("calendar.google.com"))
      .nullable()
      .optional(),
  })
  .superRefine((e, ctx) => {
    if (
      e.status === "scheduled" &&
      (!e.attendee_email ||
        !e.starts_at ||
        !e.ends_at ||
        Date.parse(e.ends_at) <= Date.parse(e.starts_at))
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Scheduled appointments need an attendee and valid times",
      });
    }
  });
export const syncSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("state"),
    calendar_id: z.string().min(1).max(254),
  }),
  z.object({
    action: z.literal("sync"),
    calendar_id: z.string().min(1).max(254),
    events: z.array(calendarEventSchema).max(100),
  }),
  z.object({
    action: z.literal("complete"),
    calendar_id: z.string().min(1).max(254),
  }),
  z.object({ action: z.literal("pending") }),
  z.object({
    action: z.literal("ack"),
    id: z.string().uuid(),
    delivered: z.boolean(),
    error: z.string().max(500).optional(),
  }),
]);

export async function validSignature(
  body: string,
  timestamp: string,
  nonce: string,
  signature: string,
  secret: string,
  now = Date.now(),
) {
  if (
    !secret ||
    !/^\d{13}$/.test(timestamp) ||
    Math.abs(now - Number(timestamp)) > 300000 ||
    !/^[\w-]{16,100}$/.test(nonce) ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return false;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const bytes = Uint8Array.from(signature.match(/../g)!, (h) =>
    parseInt(h, 16),
  );
  return crypto.subtle.verify(
    "HMAC",
    key,
    bytes,
    new TextEncoder().encode(`${timestamp}.${nonce}.${body}`),
  );
}
