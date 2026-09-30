import { quoteSchema, type QuoteInput } from "./quote";
import { trackQuoteSubmit, trackGoogleAdsConversion } from "./analytics";

const recorded = new Set<string>();
export function recordQuoteOnce(id: string, type: string) {
  if (recorded.has(id)) return;
  try {
    if (sessionStorage.getItem(`quote-conversion:${id}`)) return;
  } catch {
    /* storage can be unavailable */
  }
  recorded.add(id);
  try {
    sessionStorage.setItem(`quote-conversion:${id}`, "1");
  } catch {
    /* memory deduplication remains active */
  }
  trackQuoteSubmit(type);
  trackGoogleAdsConversion("FLS8CJvM3LscEJy2kd5D", id);
}
export async function submitQuote(input: QuoteInput) {
  const validated = quoteSchema.parse(input);
  const response = await fetch("/api/quotes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(validated),
  });
  const result = await response.json().catch(() => ({}));
  if (
    !response.ok ||
    !result.saved ||
    result.submissionId !== input.submissionId
  )
    throw new Error(
      result.error ||
        "We couldn't confirm your quote was saved. Please try again.",
    );
  recordQuoteOnce(result.submissionId, validated.projectType);
  return result.submissionId as string;
}

export function captureAttribution() {
  try {
    const params = new URLSearchParams(window.location.search);
    const saved = sessionStorage.getItem("sitenova-attribution");
    if (saved) return quoteSchema.shape.attribution.parse(JSON.parse(saved));
    const value: Record<string, string> = {
      landing_path: window.location.pathname.slice(0, 250),
    };
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "gclid",
      "fbclid",
    ]) {
      const v = params.get(key);
      if (v) value[key] = v.slice(0, key.endsWith("clid") ? 300 : 200);
    }
    sessionStorage.setItem("sitenova-attribution", JSON.stringify(value));
    return value;
  } catch {
    return {};
  }
}
