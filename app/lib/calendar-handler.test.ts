// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router";
const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/server-db.server", () => ({
  serviceDb: () => ({ rpc }),
  serverEnv: () => ({ CALENDAR_SYNC_SECRET: "test-secret" }),
  json: (data, status = 200) => Response.json(data, { status }),
}));
import { action } from "../routes/api.integrations.google-calendar";

async function request(signed = true) {
  const body = JSON.stringify({
    action: "sync",
    calendar_id: "owner@example.test",
    events: [],
  });
  const timestamp = String(Date.now());
  const nonce = crypto.randomUUID();
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode("test-secret"),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = Buffer.from(
    await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(`${timestamp}.${nonce}.${body}`),
    ),
  ).toString("hex");
  return {
    request: new Request(
      "https://sitenova.dev/api/integrations/google-calendar",
      {
        method: "POST",
        body,
        headers: signed
          ? {
              "x-sync-timestamp": timestamp,
              "x-sync-nonce": nonce,
              "x-sync-signature": signature,
            }
          : {},
      },
    ),
    context: {},
    params: {},
  } as ActionFunctionArgs;
}
beforeEach(() => rpc.mockReset());
describe("Calendar integration endpoint", () => {
  it("rejects unsigned requests before accessing the database", async () => {
    expect((await action(await request(false))).status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });
  it("rejects replayed signed requests without processing changes", async () => {
    rpc.mockResolvedValue({ data: false, error: null });
    expect((await action(await request())).status).toBe(409);
    expect(rpc).toHaveBeenCalledTimes(1);
  });
  it("only acknowledges a signed batch after it is saved", async () => {
    rpc
      .mockResolvedValueOnce({ data: true, error: null })
      .mockResolvedValueOnce({ error: null });
    expect((await action(await request())).status).toBe(200);
    expect(rpc).toHaveBeenLastCalledWith("sync_call_bookings", {
      p_calendar_id: "owner@example.test",
      p_events: [],
    });
    rpc
      .mockResolvedValueOnce({ data: true, error: null })
      .mockResolvedValueOnce({ error: { message: "Database outage" } });
    expect((await action(await request())).status).toBe(503);
  });
});
