import { useEffect } from "react";
import { ArrowLeft, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { setPageSeo } from "@/lib/seo";

const emailComposeLink =
  "https://mail.google.com/mail/?view=cm&fs=1&to=kavish@sitenova.dev&su=Website%20Inquiry%20from%20SiteNova";

const Quote = () => {
  useEffect(() => {
    setPageSeo({
      title: "Get a Free Website Quote | SiteNova",
      description:
        "Get a free website quote from SiteNova. Contact Kavish Ganatra via call, WhatsApp, or email to discuss your custom web development project in Mumbai and Mulund.",
      canonicalPath: "/quote",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Get a Free Website Quote | SiteNova",
        url: "https://sitenova.dev/quote",
        description:
          "Contact SiteNova to get a free quote for custom web development and design services.",
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground px-4 py-10 sm:px-6 md:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>

        <div className="mt-8 glass-card p-5 sm:p-8 md:p-10 text-center">
          <h1 className="font-heading text-3xl md:text-5xl font-bold mb-4">
            Get a <span className="gradient-text">Free Quote</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-2xl mx-auto">
            Tell us about your project and we will help you build a fast, modern website for your business.
          </p>

          <div className="mx-auto mb-5 flex w-full max-w-md flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
            <a
              href="tel:+919326060621"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all glow-effect button-shimmer interactive-card hover:bg-primary/90 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              <Phone size={20} />
              Call 9326060621
            </a>
            <a
              href="https://wa.me/919326060621?text=Hi%2C%20I%27m%20interested%20in%20getting%20a%20website%20built."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground transition-all button-shimmer interactive-card hover:bg-primary/90 sm:w-auto sm:px-8 sm:py-4 sm:text-lg"
            >
              <MessageCircle size={20} />
              Chat on WhatsApp
            </a>
          </div>

          <a
            href={emailComposeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full max-w-md items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-3.5 text-base font-semibold text-foreground transition-all button-shimmer interactive-card hover:bg-secondary/80 sm:px-8 sm:py-4 sm:text-lg"
          >
            <Mail size={20} className="shrink-0" />
            <span className="break-all sm:break-normal">kavish@sitenova.dev</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Quote;
