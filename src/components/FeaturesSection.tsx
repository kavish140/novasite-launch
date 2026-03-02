import { motion } from "framer-motion";
import { Zap, Layers, Globe, Shield, Palette, Code2 } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for speed with automatic performance tuning. Every site scores 90+ on Core Web Vitals.",
  },
  {
    icon: Layers,
    title: "Drag & Drop Editor",
    description: "An intuitive visual editor that feels natural. No learning curve — just build.",
  },
  {
    icon: Globe,
    title: "Global CDN",
    description: "Your sites are deployed on a worldwide edge network for instant load times, everywhere.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SSL, DDoS protection, and automatic backups included on every plan. Sleep easy.",
  },
  {
    icon: Palette,
    title: "Design System",
    description: "Start with professionally crafted templates or build your own design system from scratch.",
  },
  {
    icon: Code2,
    title: "Developer Friendly",
    description: "Export clean code, integrate APIs, and extend with custom components whenever you need.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding relative">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">Features</span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5">
            Everything you need to{" "}
            <span className="gradient-text">ship faster</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">
            A complete toolkit designed for creators who demand speed, quality, and control.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={item}
              className="glass-card p-8 group hover:border-primary/30 transition-colors duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                <feature.icon size={22} className="text-primary" />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
