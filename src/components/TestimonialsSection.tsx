import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Founder, DesignLab",
    content: "SiteNova completely changed how I deliver client projects. What used to take weeks now takes hours. The quality is unmatched.",
    rating: 5,
  },
  {
    name: "Alex Chen",
    role: "CTO, Stackline",
    content: "We migrated our entire marketing site to SiteNova. The performance gains were immediate — 40% faster load times out of the box.",
    rating: 5,
  },
  {
    name: "Sarah Mitchell",
    role: "Freelance Developer",
    content: "The developer experience is incredible. Clean code export, API integrations, and the design system tools are next level.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="section-padding">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Testimonials</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5">
            Loved by <span className="gradient-text">builders</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card p-8 flex flex-col"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <Star key={idx} size={16} className="fill-accent text-accent" />
                ))}
              </div>
              <p className="text-foreground/90 leading-relaxed mb-6 flex-1">"{t.content}"</p>
              <div>
                <p className="font-heading font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
