import { paymentWebhook, paymentJson } from "../lib/razorpay.server";
export const action = ({ request, context }: { request: Request; context: unknown }) => paymentWebhook(request, context);
export const loader = () => paymentJson({ error: "Method not allowed" },405);
