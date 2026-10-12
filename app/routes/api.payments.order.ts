import type { ActionFunctionArgs } from "react-router";
import { paymentAction, paymentJson } from "@/lib/razorpay.server";
export function action({ request, context }: ActionFunctionArgs) { return paymentAction(request, context, "order"); }
export function loader() { return paymentJson({ error: "Method not allowed" }, 405); }
