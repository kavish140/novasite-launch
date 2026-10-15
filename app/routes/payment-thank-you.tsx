import type {LoaderFunctionArgs} from "react-router";
import {buildMeta} from "@/lib/meta";
import {paymentConfiguration,paymentJson} from "@/lib/razorpay.server";
import {requirePaymentConfirmation} from "@/lib/payment-confirmation.server";
export {default} from "@/pages/PaymentThankYou";
export async function loader({request,context}:LoaderFunctionArgs){await requirePaymentConfirmation(request,context);const config=await paymentConfiguration(context);return paymentJson({testMode:config.testMode});}
export function headers(){return {"Cache-Control":"no-store","Referrer-Policy":"no-referrer","X-Robots-Tag":"noindex, nofollow"};}
export function meta(){return buildMeta({title:"Payment confirmation | SiteNova",description:"Check your SiteNova payment confirmation and next steps.",canonicalPath:"/payment-thank-you",noindex:true});}
