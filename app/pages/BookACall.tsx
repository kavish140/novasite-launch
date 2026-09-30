import { Link } from "react-router";
import { Video, Clock, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useBookingSettings } from "@/components/BookingProvider";
import { bookingAvailable } from "@/lib/booking";
import { WHATSAPP_URL, SITE_OWNER } from "@/lib/constants";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";

export default function BookACall() {
  const settings = useBookingSettings();
  const available = bookingAvailable(settings);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="mx-auto max-w-5xl px-5 pt-32 pb-16">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <p className="text-accent font-semibold mb-3">
            Talk directly with {SITE_OWNER}
          </p>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold mb-5">
            Book a 15-minute Website Consultation
          </h1>
          <p className="text-muted-foreground text-lg">
            Let's discuss your business goals, website requirements, budget, and
            the next steps for your project.
          </p>
          <p className="mt-4 font-semibold">
            Landing pages from ₹10,000 · Business websites from ₹15,000
          </p>
          <div className="flex flex-wrap justify-center gap-5 mt-5 text-sm text-muted-foreground">
            <span className="inline-flex gap-2">
              <Clock size={18} />
              15 minutes
            </span>
            <span className="inline-flex gap-2">
              <Video size={18} />
              Google Meet
            </span>
          </div>
        </div>
        {available ? (
          <section
            className="glass-card overflow-hidden p-2 sm:p-5"
            aria-label="Select a consultation time"
          >
            <p className="p-3 text-sm text-muted-foreground">
              Choose an available time below. Google Calendar will show the time
              zone and send your invitation with the Google Meet link after you
              confirm.
            </p>
            <iframe
              src={settings.booking_url}
              title="Book a SiteNova Google Meet consultation"
              className="w-full min-h-[760px] rounded-lg bg-white"
              style={{ border: 0 }}
              referrerPolicy="strict-origin-when-cross-origin"
            />
            <a
              href={settings.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackEvent("open_booking_calendar", { page: "/book-a-call" })
              }
              className="block p-4 text-center text-primary underline underline-offset-4"
            >
              Open booking calendar in a new tab
            </a>
          </section>
        ) : (
          <section className="glass-card p-8 text-center">
            <h2 className="font-heading text-xl font-semibold">
              Arrange a time with Kavish
            </h2>
            <p className="mt-3 text-muted-foreground">
              Online scheduling is currently unavailable. Send your preferred
              time on WhatsApp or request a website quote.
            </p>
          </section>
        )}
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("/book-a-call")}
            className="inline-flex gap-2 items-center rounded-xl border border-border px-6 py-3"
          >
            <MessageCircle size={18} />
            Chat on WhatsApp
          </a>
          <Link
            to="/quote"
            className="rounded-xl bg-primary text-primary-foreground px-6 py-3 font-semibold"
          >
            Get My Website Quote
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
