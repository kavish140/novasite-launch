import { m as motion } from "framer-motion";
import { MapPin, Phone, Languages, BadgeIndianRupee } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";

const pillars = [
  {
    icon: MapPin,
    title: "We're in Mumbai — just like you",
    description:
      "Based in Mulund. We know your neighbourhoods, your customers, and the local search landscape — Andheri to Thane, Dadar to Powai.",
  },
  {
    icon: Phone,
    title: "Talk directly to the developer",
    description:
      "No account managers. No middlemen. Kavish — who writes your code — is on WhatsApp. You get fast answers and real accountability.",
  },
  {
    icon: Languages,
    title: "Hindi, Marathi, Gujarati & Kutchi too",
    description:
      "Hindi, Marathi, Gujarati, Kutchi, or English — discuss your project however you're most comfortable. Most offshore agencies can't say the same.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Fixed price, agreed upfront",
    description:
      "No hourly billing surprises. You get a clear, fixed-price quote within 24 hours — before any work begins.",
  },
];

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const LocalAgencySection = () => {
  return (
    <section
      aria-labelledby="local-agency-title"
      className="relative py-20 sm:py-28 overflow-hidden border-t border-border/40"
    >
      {/* Subtle background orb */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-primary/5 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">

          {/* Left — headline + copy + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary mb-4">
              Why local matters
            </p>
            <h2
              id="local-agency-title"
              className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] mb-5"
            >
              A Mumbai agency that{" "}
              <span className="gradient-text">actually gets you</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed max-w-lg mb-8">
              Remote freelancers and large agencies don't understand Mumbai's market, your
              customers, or your timelines. SiteNova is local, lean, and fully accountable
              — so your project never falls through the cracks.
            </p>

            {/* WhatsApp CTA */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              id="local-agency-whatsapp-cta"
              className="inline-flex items-center gap-3 rounded-xl px-7 py-3.5 text-sm font-semibold text-white transition-all interactive-card button-shimmer"
              style={{
                background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                boxShadow: "0 4px 24px rgba(37,211,102,0.25)",
              }}
              aria-label="Chat with SiteNova on WhatsApp"
            >
              {/* WhatsApp SVG icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat on WhatsApp
            </a>
          </motion.div>

          {/* Right — 2×2 pillar cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {pillars.map((pillar) => (
              <motion.div
                key={pillar.title}
                variants={staggerChild}
                className="glass-card rounded-2xl p-5 sm:p-6 hover:border-primary/30 transition-all duration-300 hover-glow"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <pillar.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-base font-semibold mb-1.5 leading-snug">
                  {pillar.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default LocalAgencySection;
