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
      
      <div className="flex whitespace-nowrap">
        {/* First copy — visible to screen readers */}
        <div
          className="flex items-center gap-12 px-6 animate-marquee motion-reduce:[animation-play-state:paused] will-change-transform"
        >
          {technologies.map((tech, i) => (
            <div key={`${tech}-${i}`} className="flex items-center gap-3">
              <span className="font-heading font-semibold text-lg text-muted-foreground/80 tracking-wide uppercase">
                {tech}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-accent/40" aria-hidden="true" />
            </div>
          ))}
        </div>

        {/* Duplicate for seamless loop — hidden from screen readers */}
        <div
          className="flex items-center gap-12 px-6 animate-marquee motion-reduce:[animation-play-state:paused] will-change-transform"
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
        </div>
      </div>
    </div>
  );
};

export default TechMarquee;
