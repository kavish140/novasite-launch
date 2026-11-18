import {usePackagePricing} from "@/lib/package-pricing";
import { ArrowUpRight, Check, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import QuoteForm from "@/components/QuoteForm";
import BookingCTA from "@/components/BookingCTA";
import { WHATSAPP_URL, SITE_OWNER } from "@/lib/constants";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function Quote() {
  const {starterPrice,businessPrice,available}=usePackagePricing();

  return (
    <main className="studio-page studio-quote">
      <div className="studio-quote-top">
        <Link to="/" className="studio-quote-brand">SiteNova<span aria-hidden="true">✳</span></Link>
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft size={15} /> Back to the studio</Link>
      </div>
      <div className="studio-quote-layout">
        <div className="studio-quote-story">
          <p className="studio-page-kicker">Your next chapter starts here</p>
          <h1>A website built <br />for <span className="text-primary">your business.</span></h1>
          <p className="studio-quote-description">Tell us what you have in mind. Work directly with {SITE_OWNER} to turn it into a clear plan, a custom design, and a website you can be proud of.</p>
          {available ? <div className="studio-quote-prices">
            <div><span>Landing pages</span><strong>From {starterPrice}</strong></div>
            <div><span>Business websites</span><strong>From {businessPrice}</strong></div>
          </div> : <p className="mt-6 text-sm text-muted-foreground">Get a tailored estimate based on your project’s scope.</p>}
          <ul className="studio-quote-points">
            {["A clear scope and quote within 24 hours", "Custom design around your business", "No obligation to move forward"].map((point) => <li key={point}><Check size={16} aria-hidden="true" />{point}</li>)}
          </ul>
          <Link to="/portfolio" className="studio-quote-proof">See the work before you decide <ArrowUpRight size={17} /></Link>
        </div>
        <div className="studio-quote-form-wrap">
        <QuoteForm />
        <div className="studio-quote-alternatives">
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
      </div>
      <p className="studio-quote-bottom">Independent web design & development · Mulund, Mumbai</p>
    </main>
  );
}
