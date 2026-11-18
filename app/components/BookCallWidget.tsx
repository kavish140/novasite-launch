import { Link, useLocation } from "react-router";
import { Phone, MessageCircle } from "lucide-react";
import { PHONE_TEL_LINK, WHATSAPP_URL } from "@/lib/constants";
import { trackWhatsAppClick, trackPhoneClick } from "@/lib/analytics";
import { suppressPromotions } from "@/lib/booking";
import "./site-shell.css";

export default function BookCallWidget() {
  const { pathname } = useLocation();
  if (suppressPromotions(pathname)) return null;
  return (
    <>
      <div className="studio-contact-spacer" aria-hidden="true" />
      <div
        className="studio-mobile-contact"
        aria-label="Contact SiteNova"
      >
        <Link
          to="/quote"
          className="studio-contact-quote"
        >
          Get Quote
        </Link>
        <a
          href={WHATSAPP_URL}
          onClick={() => trackWhatsAppClick()}
          target="_blank"
          rel="noopener noreferrer"
          className="studio-contact-whatsapp"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
      </div>
      <div className="studio-desktop-contact">
        <a
          href={WHATSAPP_URL}
          onClick={() => trackWhatsAppClick()}
          target="_blank"
          rel="noopener noreferrer"
          className="studio-contact-whatsapp"
        >
          <MessageCircle size={18} />
          WhatsApp
        </a>
        <a
          href={PHONE_TEL_LINK}
          onClick={() => trackPhoneClick()}
          className="studio-contact-phone"
        >
          <Phone size={18} />
          Call Now
        </a>
      </div>
    </>
  );
}
