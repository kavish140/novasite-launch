import {quoteSchema, type QuoteInput} from "./quote";
import type {PublicPricing} from "./package-pricing";

export type QuotePrefill = {
  projectType?: string;
  packageName?: string;
  budget?: string;
  estimateTotal?: number;
  estimateMin?: number;
};

export function budgetForAmount(amount: number): QuoteInput["budget"] | undefined {
  if (!Number.isFinite(amount) || amount <= 0) return undefined;
  if (amount < 10000) return "Flexible / Custom";
  if (amount < 15000) return "Rs. 10,000 - 15,000";
  if (amount < 30000) return "Rs. 15,000 - 30,000";
  return "Rs. 30,000+";
}

export function quoteBudgetPrefill(state: QuotePrefill, pricing: PublicPricing) {
  const explicit = quoteSchema.shape.budget.safeParse(state.budget);
  if (explicit.success) return explicit.data;
  const estimate = state.estimateTotal ?? state.estimateMin;
  if (estimate !== undefined) return budgetForAmount(estimate);
  if (state.packageName === "Premium") return "Flexible / Custom";
  switch (state.projectType) {
    case "Landing Page":
      return pricing.available ? budgetForAmount(pricing.packages.starter.startingPrice / 100) : undefined;
    case "Business Website":
    case "Large Website":
      return pricing.available ? budgetForAmount(pricing.packages.business.startingPrice / 100) : undefined;
    case "E-commerce Store":
    case "E-Commerce Store":
    case "Ecommerce":
      return budgetForAmount(18000);
    case "Custom Web App":
    case "Web Application":
    case "Web App":
      return budgetForAmount(30000);
    default:
      return undefined;
  }
}
