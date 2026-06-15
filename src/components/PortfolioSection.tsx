import { m as motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { showcaseProjects, customerProjects } from "@/lib/portfolio-meta";
import drDiptiImage from "@/assets/Drdiptiganatra.webp";
import jupiterFinanceImage from "@/assets/jupiterfastfinance.webp";
import smartkitImage from "@/assets/Aismartkit.webp";
import businessShowcaseImage from "@/assets/business-showcase.webp";
import designShowcaseImage from "@/assets/design-showcase.webp";
import ecommerceShowcaseImage from "@/assets/ecommerce-showcase.webp";
import BlurImage from "./BlurImage";

const imageBySlug = {
  "dr-dipti-ganatra": drDiptiImage,
  "jupiter-finance": jupiterFinanceImage,
  "ai-smartkit": smartkitImage,
  "business-showcase": businessShowcaseImage,
  "design-showcase": designShowcaseImage,
  "ecommerce-showcase": ecommerceShowcaseImage,
} as const;

const IframePreview = ({ src, title }: { src: string; title: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Timeout to show error message if iframe doesn't load in 8 seconds
    const timer = setTimeout(() => {
      if (!loaded) setError(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl bg-background/50">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-card/90 flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Connecting...
            </span>
          </div>
        </div>
      )}

      {error && !loaded && (
        <div className="absolute inset-0 bg-card/90 flex items-center justify-center pointer-events-none z-20 px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-destructive">Oops, the site preview is currently not available.</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">You can still click 'Open Website' to visit directly.</span>
          </div>
        </div>
      )}

      <iframe
        src={src}
        title={`${title} live preview`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-[200%] h-[200%] border-0 scale-[0.5] origin-top-left pointer-events-none transition-all duration-700 relative z-10 ${
          loaded ? "opacity-100 scale-[0.5] blur-0" : "opacity-0 scale-[0.55] blur-[2px]"
        }`}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

const PortfolioSection = () => {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const current = sectionRef.current;
    if (!current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );

    observer.observe(current);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="portfolio" ref={sectionRef} className="section-padding relative" aria-labelledby="portfolio-title">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Portfolio</span>
          <h2 id="portfolio-title" className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5">
            Websites Built by <span className="gradient-text">Kavish</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">
            Real projects. Real results. Here's a showcase of sites crafted with SiteNova.
          </p>
        </motion.div>

        {/* Showcase Websites Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 border-b border-border/50 pb-4"
          >
            <h3 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-accent" />
              Showcase Websites (Live Previews)
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Internal products, demo templates, and modern SaaS platforms.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {showcaseProjects.map((project, i) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative overflow-hidden rounded-2xl border border-border/50 bg-card h-full interactive-card hover-glow"
                  aria-label={`Open ${project.title}`}
                >
                  <div className="aspect-[5/4] overflow-hidden bg-background/40 p-2 relative">
                    {project.useIframePreview && inView ? (
                      <IframePreview src={project.liveUrl} title={project.title} />
                    ) : (
                      <BlurImage
                        src={imageBySlug[project.slug as keyof typeof imageBySlug]}
                        alt={`${project.title} website screenshot by SiteNova`}
                        className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.02] !bg-transparent"
                        width={500}
                        height={400}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading text-lg font-semibold">{project.title}</h4>
                      <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{project.description}</p>
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors button-shimmer">
                      Open Website
                      <ExternalLink size={16} />
                    </span>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        </div>

        {/* Customer Websites Section */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 border-b border-border/50 pb-4"
          >
            <h3 className="font-heading text-2xl md:text-3xl font-bold flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-primary" />
              Customer Websites
            </h3>
            <p className="text-muted-foreground text-sm mt-1">
              Custom websites built for local businesses and independent professionals.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customerProjects.map((project, i) => (
              <motion.article
                key={project.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="group"
              >
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative overflow-hidden rounded-2xl border border-border/50 bg-card h-full interactive-card hover-glow"
                  aria-label={`Open ${project.title}`}
                >
                  <div className="aspect-[5/4] overflow-hidden bg-background/40 p-2 relative">
                    {project.useIframePreview && inView ? (
                      <IframePreview src={project.liveUrl} title={project.title} />
                    ) : (
                      <img
                        src={imageBySlug[project.slug as keyof typeof imageBySlug]}
                        alt={`${project.title} website screenshot by SiteNova`}
                        className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]"
                        loading="lazy"
                        decoding="async"
                        width="500"
                        height="400"
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-heading text-lg font-semibold">{project.title}</h4>
                      <ExternalLink size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{project.description}</p>
                    <span className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors button-shimmer">
                      Open Website
                      <ExternalLink size={16} />
                    </span>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
