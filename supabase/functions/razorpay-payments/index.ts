import { handlePaymentEdge } from "../_shared/edge-handler.ts";
Deno.serve((request: Request) => handlePaymentEdge(request,Deno.env.toObject()));
