import { ArrowDownToLine, ArrowUpRight, Mail, MessageCircle, Phone, Youtube } from "lucide-react";
import { Link } from "react-router";
import { PHONE_NUMBER, PHONE_TEL_LINK, EMAIL, EMAIL_COMPOSE_LINK, WHATSAPP_URL } from "@/lib/constants";
import "./site-shell.css";

const serviceLinks = [
  ["Business websites", "/services/business-websites"], ["E-commerce stores", "/services/ecommerce"], ["Web applications", "/services/web-applications"], ["SEO & speed audits", "/services/seo-optimization"], ["Google Ads", "/services/google-ads"], ["Meta Ads", "/services/meta-ads"], ["Book a strategy call", "/ads-contact"],
];
const industryLinks = [
  ["Doctors", "/websites-for-doctors"], ["Finance & CAs", "/websites-for-finance"], ["Lawyers", "/websites-for-lawyers"], ["Real estate", "/websites-for-real-estate"], ["Consultants", "/websites-for-consultants"], ["Startups", "/websites-for-startups"], ["Restaurants", "/websites-for-restaurants"],
];
const studioLinks = [
  ["Portfolio", "/portfolio"], ["Payments", "/payments"], ["Reviews", "/reviews"], ["Resources", "/resources"], ["FAQs", "/faq"],
  ["About SiteNova", "/about"], ["Our process", "/our-process"], ["Why work with us", "/why-us"], ["Pricing", "/pricing"], ["Blog", "/blog"], ["Website cost calculator", "/website-cost-calculator"], ["Free website audit", "/free-audit"], ["Contact us", "/contact-us"],
];
const areas = [
  ["Mulund", "mulund"], ["Thane", "thane"], ["Bandra", "bandra"], ["Powai", "powai"], ["Andheri", "andheri"], ["Bhandup", "bhandup"], ["Nahur", "nahur"], ["Ghatkopar", "ghatkopar"], ["Vikhroli", "vikhroli"], ["Kurla", "kurla"], ["Dadar", "dadar"], ["Lower Parel", "lower-parel"], ["Mahalakshmi", "mahalakshmi"], ["Pedder Road", "pedder-road"],
];

export default function Footer() {
  return (
    <footer className="studio-footer">
      <div className="studio-footer-inner">
        <div className="studio-footer-intro">
          <div><p className="studio-footer-eyebrow">Independent design & development.</p><h2>Based in Mumbai.<br /><span>Built around your business.</span></h2></div>
          <Link to="/quote" className="studio-footer-project" aria-label="Get a quote from SiteNova"><ArrowUpRight size={42} strokeWidth={1.3} /><span>Get a quote</span></Link>
        </div>
        <div className="studio-footer-grid">
          <div className="studio-footer-brand">
            <Link to="/" className="studio-wordmark" aria-label="SiteNova home"><img src="/logo-icon.png" width={32} height={32} alt="" /><span>SiteNova<span className="studio-wordmark-dot">.</span></span></Link>
            <p>Thoughtful websites.<br />Made for real businesses.</p>
            <span className="studio-footer-location">Mulund, Mumbai, India<br />Mon–Sat · 10:00–19:00 IST</span>
            <div className="studio-footer-contact">
              <a href={PHONE_TEL_LINK}><Phone size={15} aria-hidden="true" />{PHONE_NUMBER}</a>
              <a href={EMAIL_COMPOSE_LINK} target="_blank" rel="noopener noreferrer"><Mail size={15} aria-hidden="true" />{EMAIL}</a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} aria-hidden="true" />WhatsApp <ArrowUpRight size={12} aria-hidden="true" /></a>
              <a href="https://www.youtube.com/@SiteNova_Web_Design" target="_blank" rel="noopener noreferrer"><Youtube size={15} aria-hidden="true" />YouTube <ArrowUpRight size={12} aria-hidden="true" /></a>
            </div>
          </div>
          <div><h3>Services</h3><ul>{serviceLinks.map(([label,to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul></div>
          <div><h3>Industries</h3><ul>{industryLinks.map(([label,to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul></div>
          <div><h3>Studio & resources</h3><ul>{studioLinks.map(([label,to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul><a className="studio-app-download" href="/downloads/sitenova-beta.apk" download="SiteNova-Beta.apk"><ArrowDownToLine size={15} aria-hidden="true" />Android app <span>Beta</span></a></div>
        </div>
        <div className="studio-footer-areas"><Link to="/locations">Around Mumbai <ArrowUpRight size={14} aria-hidden="true" /></Link><div>{areas.map(([label,slug]) => <Link key={slug} to={`/location/${slug}`}>{label}</Link>)}</div></div>
        <div className="studio-footer-bottom"><p>© {new Date().getFullYear()} SiteNova. Built with care in Mumbai.</p><div><Link to="/privacy-policy">Privacy</Link><Link to="/terms-and-conditions">Terms</Link><Link to="/refund-policy">Refunds</Link><Link to="/delivery-policy">Digital delivery</Link></div></div>
        <p className="studio-footer-large" aria-hidden="true">SiteNova<span>.</span></p>
      </div>
    </footer>
  );
}
