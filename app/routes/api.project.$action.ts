import type {ActionFunctionArgs} from "react-router";
import {projectAction,paymentJson} from "@/lib/razorpay.server";
export function action({request,context,params}:ActionFunctionArgs){return projectAction(request,context,params.action??"");}
export function loader(){return paymentJson({error:"Method not allowed"},405);}
