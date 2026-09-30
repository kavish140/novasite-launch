export type BookingSettings = { enabled: boolean; booking_url: string };
export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  enabled: false,
  booking_url: "",
};

/** Only full Google Calendar schedule URLs can be embedded. Short links must be expanded first. */
export function validBookingUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      url.hostname === "calendar.google.com" &&
      !url.username &&
      !url.password &&
      !url.port &&
      /^\/calendar\/(?:u\/\d+\/)?appointments\/schedules\/[A-Za-z0-9_-]+\/?$/.test(
        url.pathname,
      )
    );
  } catch {
    return false;
  }
}

export function bookingAvailable(settings: BookingSettings): boolean {
  return settings.enabled && validBookingUrl(settings.booking_url);
}

export function suppressPromotions(path: string): boolean {
  return /^\/(?:admin(?:\/|$)|lp(?:\/|$)|quote\/?$|free-audit\/?$|ads-contact\/?$|contact-us\/?$|book-a-call\/?$|thank-you\/?$)/.test(
    path,
  );
}

export type CallBooking = {
  id: string;
  calendar_id: string;
  event_id: string;
  attendee_name: string;
  attendee_email: string;
  starts_at: string;
  ends_at: string;
  status: "scheduled" | "cancelled";
  meet_url: string | null;
  calendar_url: string | null;
  updated_at: string;
};
