/**
 * GA4 Analytics Utility
 *
 * Provides typed event tracking for all SiteNova conversion actions.
 *
 * Setup:
 *   1. Go to https://analytics.google.com → Create a new GA4 property
 *   2. Get your Measurement ID (starts with G-)
 *   3. Replace GA_MEASUREMENT_ID below with your ID
 *   4. The gtag.js snippet is already in index.html (also needs the ID updated)
 */

// ── Replace with your GA4 Measurement ID ─────────────────────────────────────
export const GA_MEASUREMENT_ID = "G-EBZGS65QQH";

// ── Types ────────────────────────────────────────────────────────────────────

type ConversionEvent =
  | "click_whatsapp_cta"
  | "click_phone_cta"
  | "click_book_call"
  | "submit_quote_form"
  | "submit_audit_form"
  | "click_exit_popup_cta"
  | "view_niche_page";

type EventParams = Record<string, string | number | boolean | undefined>;

// ── Helpers ──────────────────────────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const isGtagReady = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.gtag === "function" &&
  GA_MEASUREMENT_ID !== "G-XXXXXXXXXX";

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Fire a GA4 custom event.
 *
 * @example
 *   trackEvent("click_whatsapp_cta", { page: "/websites-for-doctors" });
 */
export const trackEvent = (event: ConversionEvent, params?: EventParams): void => {
  if (!isGtagReady()) {
    if (import.meta.env.DEV) {
      console.log(`[Analytics DEV] ${event}`, params ?? "");
    }
    return;
  }
  window.gtag!("event", event, params);
};

/**
 * Track a page view manually (useful for SPA route transitions).
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isGtagReady()) return;
  window.gtag!("config", GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

// ── Convenience wrappers (import directly in click handlers) ─────────────────

export const trackWhatsAppClick = (page?: string) =>
  trackEvent("click_whatsapp_cta", { page: page ?? window.location.pathname });

export const trackPhoneClick = (page?: string) =>
  trackEvent("click_phone_cta", { page: page ?? window.location.pathname });

export const trackBookCallClick = (page?: string) =>
  trackEvent("click_book_call", { page: page ?? window.location.pathname });

export const trackQuoteSubmit = (projectType?: string) =>
  trackEvent("submit_quote_form", { project_type: projectType });

export const trackAuditSubmit = () =>
  trackEvent("submit_audit_form");

export const trackExitPopupSubmit = () =>
  trackEvent("click_exit_popup_cta");

export const trackNichePageView = (niche: string) =>
  trackEvent("view_niche_page", { niche });
