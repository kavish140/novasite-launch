import type {ActionFunctionArgs} from "react-router";
import {receiptAction,paymentJson} from "@/lib/razorpay.server";
export const action=({request,context}:ActionFunctionArgs)=>receiptAction(request,context,"receipt");
export const loader=()=>paymentJson({error:"Method not allowed"},405);
