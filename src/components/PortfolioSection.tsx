import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { portfolioProjects } from "@/lib/portfolio-meta";
import drDiptiImage from "@/assets/Drdiptiganatra.png";
import jupiterFinanceImage from "@/assets/jupiterfastfinance.png";
import smartkitImage from "@/assets/Aismartkit.png";

const imageBySlug = {
  "dr-dipti-ganatra": drDiptiImage,
  "jupiter-finance": jupiterFinanceImage,
  "ai-smartkit": smartkitImage,
} as const;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project, i) => (
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
                <div className="aspect-[5/4] overflow-hidden bg-background/40 p-2">
                  <img
                    src={imageBySlug[project.slug as keyof typeof imageBySlug]}
                    alt={`${project.title} website screenshot by SiteNova`}
                    className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading={inView ? "lazy" : "eager"}
                    decoding="async"
                    width="500"
                    height="400"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-lg font-semibold">{project.title}</h3>
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
    </section>
  );
};

export default PortfolioSection;
