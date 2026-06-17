import { Phone, Mail, MessageCircle, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import { PHONE_NUMBER, PHONE_TEL_LINK, EMAIL, EMAIL_COMPOSE_LINK, WHATSAPP_URL } from "@/lib/constants";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <span className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight">
              <img src="/logo-icon.svg" className="h-6 w-6" alt="SiteNova Logo" width="24" height="24" />
              <span>Site<span className="gradient-text">Nova</span></span>
            </span>
            <p className="text-sm text-muted-foreground mt-3 mb-6 leading-relaxed">
              We build stunning, high-performing websites for businesses in Mumbai and surrounding commercial areas.
            </p>
            <a
              href="/downloads/sitenova-beta.apk"
              download="SiteNova-Beta.apk"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-accent/60 bg-accent/15 px-6 py-3 text-sm font-bold text-accent hover:bg-accent/25 transition-all glow-effect group interactive-card shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.3)]"
            >
              <span className="text-lg animate-bounce">🎉</span>
              Download Android App (Beta)
            </a>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2.5">
              <li><Link to="/services/ecommerce" className="text-sm text-muted-foreground hover:text-foreground transition-colors">E-commerce Stores</Link></li>
              <li><Link to="/services/web-applications" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Custom Web Apps</Link></li>
              <li><Link to="/services/seo-optimization" className="text-sm text-muted-foreground hover:text-foreground transition-colors">SEO & Speed Tuning</Link></li>
              <li><Link to="/websites-for-doctors" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Doctors</Link></li>
              <li><Link to="/websites-for-lawyers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Lawyers</Link></li>
              <li><Link to="/websites-for-consultants" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Consultants</Link></li>
              <li><Link to="/websites-for-finance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Finance Pros</Link></li>
              <li><Link to="/websites-for-real-estate" className="text-sm text-muted-foreground hover:text-foreground transition-colors">For Real Estate</Link></li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Service Areas</h4>
            <ul className="space-y-2.5">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mulund Web Design</Link></li>
              <li><Link to="/location/thane" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Thane Web Design</Link></li>
              <li><Link to="/location/powai" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Powai Web Developer</Link></li>
              <li><Link to="/location/andheri" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Andheri Web Designer</Link></li>
              <li><Link to="/location/bhandup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Bhandup Web Design</Link></li>
              <li><Link to="/location/nahur" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Nahur Web Design</Link></li>
              <li><Link to="/location/ghatkopar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Ghatkopar Web Design</Link></li>
              <li>
                <Link to="/location/vikhroli" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Vikhroli</Link>
              </li>
              <li>
                <Link to="/location/kurla" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kurla</Link>
              </li>
              <li>
                <Link to="/location/dadar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dadar</Link>
              </li>
              <li>
                <Link to="/location/lower-parel" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Lower Parel</Link>
              </li>
              <li>
                <Link to="/location/mahalakshmi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Mahalakshmi</Link>
              </li>
              <li>
                <Link to="/location/pedder-road" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pedder Road</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href={PHONE_TEL_LINK} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors interactive-card">
                  <Phone size={14} /> {PHONE_NUMBER}
                </a>
              </li>
              <li>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors interactive-card">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </li>
              <li>
                <a href={EMAIL_COMPOSE_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors interactive-card">
                  <Mail size={14} /> {EMAIL}
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/@SiteNova_Web_Design" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors interactive-card">
                  <Youtube size={14} /> YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SiteNova. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link to="/contact-us" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Contact Us</Link>
            <a href={EMAIL_COMPOSE_LINK} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Email</a>
            <a href={PHONE_TEL_LINK} className="text-xs text-muted-foreground hover:text-foreground transition-colors">Call Us</a>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a>
            <a href="https://www.youtube.com/@SiteNova_Web_Design" target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">YouTube</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
