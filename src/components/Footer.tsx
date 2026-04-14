import { Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const emailComposeLink =
  "https://mail.google.com/mail/?view=cm&fs=1&to=kavish@sitenova.dev&su=Website%20Inquiry%20from%20SiteNova";

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="border-t border-border/40 bg-card/30">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <span className="font-heading text-xl font-bold tracking-tight">
              Site<span className="gradient-text">Nova</span>
            </span>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              We build stunning, high-performing websites for businesses in Mulund, Mumbai, and nearby areas like Bhandup, Thane, Ghatkopar, and Powai.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              <li><button type="button" onClick={() => scrollToSection("features")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</button></li>
              <li><button type="button" onClick={() => scrollToSection("portfolio")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Portfolio</button></li>
              <li><button type="button" onClick={() => scrollToSection("how-it-works")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</button></li>
              <li><button type="button" onClick={() => scrollToSection("testimonials")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">Testimonials</button></li>
              <li><Link to="/quote" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
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
                  <Mail size={14} /> kavish@sitenova.dev
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
