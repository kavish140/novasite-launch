import { handleReconciliation } from "../_shared/reconciliation.ts";
Deno.serve((request: Request)=>handleReconciliation(request,Deno.env.toObject()));
