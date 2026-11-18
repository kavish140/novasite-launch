import { ArrowUpRight, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router";
import { usePackagePricing } from "@/lib/package-pricing";
import { EMAIL_COMPOSE_LINK, PHONE_NUMBER, PHONE_TEL_LINK, WHATSAPP_URL } from "@/lib/constants";
import "./studio-sections.css";

export default function CtaSection() {
  const { starterPrice, available } = usePackagePricing();
  return <section id="cta" className="sn-section sn-cta" aria-labelledby="cta-title"><div className="sn-container sn-cta-inner"><div><p className="sn-kicker">Your business deserves a great website</p><h2 id="cta-title">Let’s build your<br />next big thing<span>.</span></h2><p>{available ? `Projects starting from ${starterPrice}. ` : ""}A clear scope. A considered design. A website you’re proud to share.</p></div><div className="sn-cta-actions"><Link to="/quote" className="sn-cta-primary">Tell us about your project<ArrowUpRight size={21} aria-hidden="true" /></Link><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="sn-cta-secondary"><MessageCircle size={19} aria-hidden="true" />Prefer WhatsApp?<ArrowUpRight size={17} aria-hidden="true" /></a><div className="sn-cta-contacts"><a href={PHONE_TEL_LINK}><Phone size={14} aria-hidden="true" />{PHONE_NUMBER}</a><a href={EMAIL_COMPOSE_LINK} target="_blank" rel="noopener noreferrer">Send an email<ArrowUpRight size={14} aria-hidden="true" /></a></div><small>Scope and pricing agreed before work begins.</small></div></div></section>;
}
