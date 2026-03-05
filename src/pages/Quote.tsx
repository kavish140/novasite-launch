import { useEffect } from "react";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { setPageSeo } from "@/lib/seo";

const emailComposeLink =
  "https://mail.google.com/mail/?view=cm&fs=1&to=kavishganatra5@gmail.com&su=Website%20Inquiry%20from%20SiteNova";

const Quote = () => {
  useEffect(() => {
    setPageSeo({
      title: "Get a Free Website Quote | SiteNova",
      description:
        "Get a free website quote from SiteNova. Contact Kavish Ganatra via call, WhatsApp, or email to discuss your custom web development project.",
      canonicalPath: "/quote",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Get a Free Website Quote | SiteNova",
        url: "https://kavish140.github.io/novasite-launch/quote",
        description:
          "Contact SiteNova to get a free quote for custom web development and design services.",
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground px-6 py-10 md:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mt-8 glass-card p-8 md:p-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Get a <span className="gradient-text">Free Quote</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Tell us about your project and we will help you build a fast, modern website for your business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-5">
            <a
              href="tel:+919326060621"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all glow-effect button-shimmer interactive-card"
            >
              <Phone size={20} />
              Call 9326060621
            </a>
            <a
              href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20interested%20in%20getting%20a%20website%20built."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground hover:bg-primary/90 transition-all button-shimmer interactive-card"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>

          <a
            href={emailComposeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-8 py-4 text-lg font-semibold text-foreground hover:bg-secondary/80 transition-all button-shimmer interactive-card"
          >
            <Mail size={20} />
            kavishganatra5@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default Quote;
