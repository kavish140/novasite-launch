import type { ActionFunctionArgs } from "react-router";
import { quoteSchema } from "@/lib/quote";
import { serviceDb, serverEnv, json } from "@/lib/server-db.server";

export async function action({ request, context }: ActionFunctionArgs) {
  if (request.method !== "POST")
    return json({ error: "Method not allowed" }, 405);
  if (request.headers.get("origin") !== new URL(request.url).origin)
    return json({ error: "Invalid origin" }, 403);
  try {
    const body = await request.text();
    if (body.length > 12000) return json({ error: "Request too large" }, 413);
    const result = quoteSchema.safeParse(JSON.parse(body));
    if (!result.success)
      return json({ error: result.error.issues[0].message }, 400);
    const q = result.data;
    const { data, error } = await serviceDb(serverEnv(context)).rpc(
      "accept_website_quote",
      { p_quote: q },
    );
    if (error) {
      if (error.message.includes("submission_conflict"))
        return json(
          {
            error:
              "This request changed after it was saved. Please start a new quote.",
          },
          409,
        );
      throw error;
    }
    return json({ submissionId: data, saved: true });
  } catch (error) {
    if (error instanceof SyntaxError)
      return json({ error: "Invalid request" }, 400);
    console.error("Quote storage failed");
    return json(
      {
        error:
          "We couldn't save your quote. Your details are still here; please try again or contact us on WhatsApp.",
      },
      503,
    );
  }
}
