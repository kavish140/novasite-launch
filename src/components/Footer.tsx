import { Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const emailComposeLink =
  "https://mail.google.com/mail/?view=cm&fs=1&to=kavishganatra5@gmail.com&su=Website%20Inquiry%20from%20SiteNova";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              <li><Link to="/location/vikhroli" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Vikhroli Web Design</Link></li>
              <li><Link to="/location/kurla" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Kurla Web Design</Link></li>
              <li><Link to="/location/dadar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dadar Web Design</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-3">
              <li>
                <a href="tel:+919326060621" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors interactive-card">
                  <Phone size={14} /> 9326060621
                </a>
              </li>
              <li>
                <a href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20interested%20in%20getting%20a%20website%20built." target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors interactive-card">
                  <MessageCircle size={14} /> WhatsApp
                </a>
              </li>
              <li>
                <a href={emailComposeLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors interactive-card">
                  <Mail size={14} /> kavishganatra5@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SiteNova. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href={emailComposeLink} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Email</a>
            <a href="tel:+919326060621" className="text-xs text-muted-foreground hover:text-foreground transition-colors">Call Us</a>
            <a href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20interested%20in%20getting%20a%20website%20built." target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-foreground transition-colors">WhatsApp</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
