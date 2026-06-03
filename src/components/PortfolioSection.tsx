import { m as motion } from "framer-motion";
import { ExternalLink, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { showcaseProjects, customerProjects } from "@/lib/portfolio-meta";

const allProjects = [...showcaseProjects, ...customerProjects];

const IframePreview = ({ src, title }: { src: string; title: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If not loaded within 8 seconds, show fallback message
    const timer = setTimeout(() => {
      if (!loaded) setError(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="w-full h-full relative overflow-hidden bg-background/50">
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
            <span className="text-sm font-medium text-destructive">
              Oops, the site preview is currently not available.
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
              You can still click 'Open Site' to visit directly.
            </span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProjects.map((project, i) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.15 }}
              className="group relative block overflow-hidden rounded-2xl border border-border/50 bg-card h-[400px] interactive-card hover-glow"
            >
              <div className="absolute inset-0 z-0 bg-background/40">
                {inView && (
                  <IframePreview src={project.liveUrl} title={project.title} />
                )}
              </div>
              
              {/* Default Title block (visible when not hovered) */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-background/90 backdrop-blur-md border-t border-border/50 group-hover:opacity-0 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-base font-semibold">{project.title}</h4>
                  <ExternalLink size={14} className="text-muted-foreground" />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 z-20 bg-gradient-to-t from-background/95 via-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h4 className="font-heading text-2xl font-bold mb-2">{project.title}</h4>
                <div className="flex items-center gap-1.5 mb-3">
                   <Tag size={12} className="text-primary" />
                   <span className="text-[11px] font-medium text-primary uppercase tracking-wider">{project.localFocus || "Web Design"}</span>
                </div>
                <p className="text-sm text-foreground/90 mb-5 leading-relaxed">
                  {project.description}
                </p>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors button-shimmer"
                >
                  Open Site
                  <ExternalLink size={16} />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
