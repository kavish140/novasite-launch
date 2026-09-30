import { captureAttribution } from "@/lib/quote-client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_BOOKING_SETTINGS, type BookingSettings } from "@/lib/booking";

const BookingContext = createContext(DEFAULT_BOOKING_SETTINGS);
export function BookingProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BookingSettings>(
    DEFAULT_BOOKING_SETTINGS,
  );
  useEffect(() => {
    captureAttribution();
    let active = true;
    const refresh = () =>
      fetch("/api/booking-settings")
        .then((r) => (r.ok ? r.json() : DEFAULT_BOOKING_SETTINGS))
        .then((value) => {
          if (active) setSettings(value);
        })
        .catch(() => {
          if (active) setSettings(DEFAULT_BOOKING_SETTINGS);
        });
    refresh();
    window.addEventListener("booking-settings-changed", refresh);
    return () => {
      active = false;
      window.removeEventListener("booking-settings-changed", refresh);
    };
  }, []);
  return (
    <BookingContext.Provider value={settings}>
      {children}
    </BookingContext.Provider>
  );
}
export const useBookingSettings = () => useContext(BookingContext);
