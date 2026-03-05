import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import drDiptiImage from "@/assets/Drdiptiganatra.png";
import jupiterFinanceImage from "@/assets/jupiterfastfinance.png";
import smartkitImage from "@/assets/Aismartkit.png";

const projects = [
  {
    title: "Dr. Dipti Ganatra",
    description: "A professional clinic website designed for Dr. Dipti Ganatra with elegant branding and easy appointment flow.",
    image: drDiptiImage,
    link: "https://drdiptiganatra.com",
  },
  {
    title: "Jupiter Finance",
    description: "A sleek finance landing page with modern UI, clear call-to-actions, and responsive design across all devices.",
    image: jupiterFinanceImage,
    link: "https://kavish140.github.io/jupiter-finance-launch/",
  },
  {
    title: "AI SmartKit",
    description: "A cutting-edge AI tools platform with a clean interface, intuitive navigation, and high-performance architecture.",
    image: smartkitImage,
    link: "https://aismartkit.tech",
  },
];

const PortfolioSection = () => {
  return (
    <section id="portfolio" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-widest">Portfolio</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5">
            Websites Built by <span className="gradient-text">Kavish</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">
            Real projects. Real results. Here's a showcase of sites crafted with SiteNova.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group"
            >
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block relative overflow-hidden rounded-2xl border border-border/50 bg-card h-full interactive-card hover-glow"
                aria-label={`Open ${project.title}`}
              >
                <div className="aspect-[5/4] overflow-hidden bg-background/40 p-2">
                  <img
                    src={project.image}
                    alt={`${project.title} website screenshot by SiteNova`}
                    className="w-full h-full object-contain object-top transition-transform duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
