// A rejected reservation is a conflict, not evidence of a provider outage.
// Never disclose the earlier booking, issue its token, or bypass deduplication.
export class PaymentConflictError extends Error {
  constructor(reason: "existing_booking" | "changed_request") {
    super(reason === "existing_booking"
      ? "A checkout already exists for these contact and project details. Return to the original checkout tab to check its status, or contact SiteNova before paying again."
      : "The details differ from your saved checkout. Return to the original checkout tab to check its status, or contact SiteNova before paying again.");
  }
}
