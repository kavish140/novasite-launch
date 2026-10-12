import { handleWebhookEdge } from "../_shared/edge-handler.ts";
Deno.serve((request: Request) => handleWebhookEdge(request,Deno.env.toObject()));
