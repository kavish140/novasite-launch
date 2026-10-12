import { z } from "zod";

// Browser code has display types only. Prices and authorization live in the Supabase Edge backend.
export type PaymentPackage = "starter" | "business";
export type PackageCatalog = Record<PaymentPackage, { name: string; startingPrice: number; advance: number; description: string }>;
export const paymentDetailsSchema = z.object({
  package: z.enum(["starter", "business"]),
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(254),
  phone: z.string().trim().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  business: z.string().trim().min(2, "Enter your business or project name").max(100),
  accepted: z.literal(true, { errorMap: () => ({ message: "Please accept the payment terms" }) }),
}).strict();
export type PaymentDetails = z.infer<typeof paymentDetailsSchema>;
export type PaymentSession = { token: string; orderId: string; package: PaymentPackage };
export type AuthorizedCheckout = PaymentSession & { keyId: string; amount: number; testMode: boolean };
export type CheckoutAuthorization = PaymentStatus & { checkout?: AuthorizedCheckout };
export type PaymentStatus = { status: "pending" | "paid" | "refunded"; paymentId?: string; refundedAmount?: number };
export const formatINR = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(paise / 100);
