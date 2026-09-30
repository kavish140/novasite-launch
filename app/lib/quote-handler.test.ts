// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ActionFunctionArgs } from "react-router";
const { rpc } = vi.hoisted(() => ({ rpc: vi.fn() }));
vi.mock("@/lib/server-db.server", () => ({
  serviceDb: () => ({ rpc }),
  serverEnv: () => ({}),
  json: (data, status = 200) => Response.json(data, { status }),
}));
import { action } from "../routes/api.quotes";
const quote = {
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
const request = (body = quote, origin = "https://sitenova.dev") =>
  ({
    request: new Request("https://sitenova.dev/api/quotes", {
      method: "POST",
      headers: { Origin: origin },
      body: JSON.stringify(body),
    }),
    context: {},
    params: {},
  }) as ActionFunctionArgs;
beforeEach(() => rpc.mockReset());
describe("quote endpoint", () => {
  it("returns confirmation only after durable storage", async () => {
    rpc.mockResolvedValue({ data: quote.submissionId, error: null });
    expect(await (await action(request())).json()).toEqual({
      saved: true,
      submissionId: quote.submissionId,
    });
  });
  it("does not report success on a database failure", async () => {
    rpc.mockResolvedValue({ error: { message: "DB unavailable" } });
    expect((await action(request())).status).toBe(503);
  });
  it("rejects invalid budgets and unrelated origins before storing anything", async () => {
    expect((await action(request({ ...quote, budget: "" }))).status).toBe(400);
    expect((await action(request(quote, "https://other.test"))).status).toBe(
      403,
    );
    expect(rpc).not.toHaveBeenCalled();
  });
});
