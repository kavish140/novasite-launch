import { Link } from "react-router";
import { CalendarDays } from "lucide-react";
import { useBookingSettings } from "./BookingProvider";
import { bookingAvailable } from "@/lib/booking";
import { trackBookCallClick } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export default function BookingCTA({
  className,
  source,
}: {
  className?: string;
  source: string;
}) {
  const settings = useBookingSettings();
  if (!bookingAvailable(settings)) return null;
  return (
    <Link
      to="/book-a-call"
      onClick={() => trackBookCallClick(source)}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl border border-primary/40 bg-primary/5 px-6 py-3.5 text-sm font-semibold hover:bg-primary/10 transition-colors",
        className,
      )}
    >
      <CalendarDays size={18} />
      Book a 15-minute Call
    </Link>
  );
}
