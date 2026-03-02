import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import portfolio1 from "@/assets/portfolio-1.jpg";
import portfolio2 from "@/assets/portfolio-2.jpg";
import portfolio3 from "@/assets/portfolio-3.jpg";

const projects = [
  {
    title: "Noir Creative Studio",
    description: "A bold portfolio for a design agency featuring immersive animations and dark elegance.",
    image: portfolio1,
    link: "#",
  },
  {
    title: "Luxe Commerce",
    description: "A premium e-commerce experience built for a fashion brand with seamless checkout flow.",
    image: portfolio2,
    link: "#",
  },
  {
    title: "CloudStack SaaS",
    description: "A conversion-optimized SaaS landing page with integrated analytics and A/B testing.",
    image: portfolio3,
    link: "#",
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
              <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card">
                <div className="aspect-[5/4] overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width="500"
                    height="400"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-heading text-lg font-semibold">{project.title}</h3>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label={`Visit ${project.title}`}
                    >
                      <ExternalLink size={18} />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
