import type { ActionFunctionArgs } from "react-router";
import { adminTestPaymentAction, paymentJson } from "@/lib/razorpay.server";
export function action({ request, context, params }: ActionFunctionArgs) { return adminTestPaymentAction(request, context, params.action ?? ""); }
export function loader() { return paymentJson({ error: "Method not allowed" }, 405); }
