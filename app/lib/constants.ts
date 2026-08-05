/**
 * Centralized business constants.
 * Update contact info here — all components and pages import from this single source.
 */

export const PHONE_NUMBER = "9326060621";
export const PHONE_INTL = "+919326060621";
export const PHONE_TEL_LINK = `tel:${PHONE_INTL}`;

export const EMAIL = "kavishganatra5@gmail.com";
export const EMAIL_COMPOSE_LINK =
  `https://mail.google.com/mail/?view=cm&fs=1&to=${EMAIL}&su=Website%20Inquiry%20from%20SiteNova`;

export const WHATSAPP_DEFAULT_MESSAGE =
  "Hi%2C%20I%27m%20interested%20in%20getting%20a%20website%20built.";
export const WHATSAPP_URL = `https://wa.me/${PHONE_INTL.replace("+", "")}?text=${WHATSAPP_DEFAULT_MESSAGE}`;

/** Build a WhatsApp URL with a custom message */
export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${PHONE_INTL.replace("+", "")}?text=${encodeURIComponent(message)}`;

export const SITE_NAME = "SiteNova";
export const SITE_URL = "https://sitenova.dev";
export const SITE_OWNER = "Kavish Ganatra";
