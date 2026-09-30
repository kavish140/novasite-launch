import { z } from "zod";

export const quoteSchema = z.object({
  submissionId: z.string().uuid(),
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email.")
    .max(254)
    .transform((v) => v.toLowerCase()),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (v) =>
        /^\+?[\d\s()-]+$/.test(v) &&
        v.replace(/\D/g, "").length >= 10 &&
        v.replace(/\D/g, "").length <= 15,
      "Please enter a valid phone number.",
    ),
  businessName: z
    .string()
    .trim()
    .min(2, "Please enter your business name.")
    .max(200),
  projectType: z.enum([
    "Landing Page",
    "Business Website",
    "E-commerce Store",
    "Custom Web App",
    "Website Redesign",
  ]),
  requirements: z.string().trim().max(5000).default(""),
  budget: z.enum(
    [
      "Rs. 10,000 - 15,000",
      "Rs. 15,000 - 30,000",
      "Rs. 30,000+",
      "Flexible / Custom",
    ],
    { errorMap: () => ({ message: "Please select your budget." }) },
  ),
  timeline: z.enum([
    "Urgent (< 2 weeks)",
    "Normal (2-4 weeks)",
    "Flexible (1+ months)",
  ]),
  source: z.enum(["website", "paid_ad"]),
  packageName: z.string().max(60).optional(),
  attribution: z
    .object({
      landing_path: z.string().max(250).optional(),
      utm_source: z.string().max(200).optional(),
      utm_medium: z.string().max(200).optional(),
      utm_campaign: z.string().max(200).optional(),
      gclid: z.string().max(300).optional(),
      fbclid: z.string().max(300).optional(),
    })
    .default({}),
});
export type QuoteInput = z.input<typeof quoteSchema>;
