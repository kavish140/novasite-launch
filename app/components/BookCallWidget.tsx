import { Link, useLocation } from "react-router";
import { Phone, MessageCircle } from "lucide-react";
import { PHONE_TEL_LINK, WHATSAPP_URL } from "@/lib/constants";
import { trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import { suppressPromotions } from "@/lib/booking";

export default function BookCallWidget() {
  const { pathname } = useLocation();
  if (suppressPromotions(pathname)) return null;
  return (
    <>
      <div className="h-24 lg:hidden" aria-hidden="true" />
      <div
        className="fixed inset-x-0 bottom-0 z-40 bg-background/95 border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden flex gap-3"
        aria-label="Contact SiteNova"
      >
        <Link
          to="/quote"
          className="flex-1 text-center rounded-xl py-3 bg-primary text-primary-foreground font-semibold"
        >
          Get Quote
        </Link>
        <a
          href={WHATSAPP_URL}
          onClick={() => trackWhatsAppClick()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl py-3 border border-border flex items-center justify-center gap-2 font-semibold"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
      <div className="hidden lg:flex fixed bottom-6 right-6 z-40 gap-3">
        <a
          href={WHATSAPP_URL}
          onClick={() => trackWhatsAppClick()}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-[#25D366] text-black px-5 py-3 inline-flex items-center gap-2 font-semibold"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
        <a
          href={PHONE_TEL_LINK}
          onClick={() => trackPhoneClick()}
          className="rounded-full bg-primary text-primary-foreground px-5 py-3 inline-flex items-center gap-2 font-semibold"
        >
          <Phone size={18} />
          Call Now
        </a>
      </div>
    </>
  );
}
