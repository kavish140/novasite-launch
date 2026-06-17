import { m as motion } from "framer-motion";

const technologies = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Framer Motion",
  "Figma",
  "Node.js",
  "Supabase",
];

const TechMarquee = () => {
  return (
    <div
      className="w-full bg-background/50 border-y border-border/50 py-6 overflow-hidden relative"
      aria-label="Technologies we use"
    >
      {/* Gradient Fades for edges */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="flex whitespace-nowrap motion-safe:animate-none">
        {/* First copy — visible to screen readers */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-12 px-6 motion-reduce:animate-none motion-reduce:[animation:none]"
          style={{ animationPlayState: "var(--marquee-play-state, running)" }}
        >
          {technologies.map((tech, i) => (
            <div key={`${tech}-${i}`} className="flex items-center gap-3">
              <span className="font-heading font-semibold text-lg text-muted-foreground/80 tracking-wide uppercase">
                {tech}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent/40" aria-hidden="true" />
            </div>
          ))}
        </motion.div>

        {/* Duplicate for seamless loop — hidden from screen readers */}
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex items-center gap-12 px-6 motion-reduce:animate-none motion-reduce:[animation:none]"
          style={{ animationPlayState: "var(--marquee-play-state, running)" }}
          aria-hidden="true"
        >
          {technologies.map((tech, i) => (
            <div key={`${tech}-${i}-clone`} className="flex items-center gap-3">
              <span className="font-heading font-semibold text-lg text-muted-foreground/80 tracking-wide uppercase">
                {tech}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent/40" />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TechMarquee;
