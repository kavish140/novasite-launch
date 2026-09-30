import { Link } from "react-router";
import QuoteForm from "@/components/QuoteForm";
import BookingCTA from "@/components/BookingCTA";
import { WHATSAPP_URL } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function Quote() {
  return (
    <main className="min-h-screen bg-background text-foreground px-5 py-10 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to SiteNova
        </Link>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold mt-8 mb-4">
          A website built for your business
        </h1>
        <p className="text-muted-foreground mb-7">
          Landing pages from ₹10,000 · Business websites from ₹15,000. Share
          your plans and Kavish will reply with a clear scope and quote.
        </p>
        <QuoteForm />
        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <BookingCTA source="quote" />
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("/quote")}
            className="px-6 py-3.5 text-sm underline"
          >
            Discuss on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}
