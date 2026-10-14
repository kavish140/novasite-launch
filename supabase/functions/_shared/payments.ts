import { z } from "zod";

// Browser code has display types only. Prices and authorization live in the Supabase Edge backend.
export type PaymentPackage = "starter" | "business";
export type PackageCatalog = Record<PaymentPackage, { name: string; startingPrice: number; advance: number; description: string }>;
const projectBrief=z.string().trim().min(20,"Describe your project in at least 20 characters").max(2000,"Keep your project brief under 2,000 characters");
export const PAYMENT_TIMELINES=["Flexible","Within 2–4 weeks","As soon as possible"] as const;
const timeline=z.enum(PAYMENT_TIMELINES);
const website=z.string().trim().max(512).refine(value=>{if(!value)return true;try{const url=new URL(value);return ["http:","https:"].includes(url.protocol)&&!url.username&&!url.password;}catch{return false;}},"Use a complete http:// or https:// website address without login credentials");
export const paymentDetailsSchema = z.object({
  package: z.enum(["starter", "business"]),
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  business: z.string().trim().min(2, "Enter your business or project name").max(100),
  requirements: projectBrief.optional(),
  timeline: timeline.optional(),
  website_url: website.optional(),
  accepted: z.literal(true, { errorMap: () => ({ message: "Please accept the payment terms" }) }),
}).strict();
// New purchases require a brief; the base schema preserves older stored orders/retries.
export const paymentBookingSchema=paymentDetailsSchema.extend({requirements:projectBrief,timeline});
export type PaymentDetails = z.infer<typeof paymentBookingSchema>;
export type PaymentSession = { token: string; orderId: string; package: PaymentPackage };
export type AuthorizedCheckout = PaymentSession & { keyId: string; amount: number; testMode: boolean };
export type CheckoutAuthorization = PaymentStatus & { checkout?: AuthorizedCheckout };
export type PaymentStatus = { status: "pending" | "paid" | "refunded"; paymentId?: string; refundedAmount?: number };
export const formatINR = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(paise / 100);
