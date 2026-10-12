import type { PackageCatalog } from "./payments.ts";
export const PAYMENT_PACKAGES: PackageCatalog = {
  starter: { name: "Starter", startingPrice: 1000000, advance: 500000, description: "Single-page landing page or portfolio" },
  business: { name: "Business", startingPrice: 1500000, advance: 750000, description: "Multi-page business website" },
};

