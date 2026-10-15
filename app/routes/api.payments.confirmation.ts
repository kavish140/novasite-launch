import type {ActionFunctionArgs} from "react-router";
import {grantPaymentConfirmation} from "@/lib/payment-confirmation.server";
import {paymentJson} from "@/lib/razorpay.server";
export function loader(){return paymentJson({error:"Method not allowed"},405);}
export async function action({request,context}:ActionFunctionArgs){return grantPaymentConfirmation(request,context);}
