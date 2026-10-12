import { paymentAction } from "@/lib/razorpay.server";
export const action = ({request,context}: {request: Request;context: unknown}) => paymentAction(request,context,"retry");
