import { useEffect, useState, useRef } from "react";
import { m as motion, useSpring, AnimatePresence } from "framer-motion";

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  size: number;
}

const CONFETTI_COLORS = ["bg-primary", "bg-accent", "bg-blue-400/60", "bg-purple-400/60", "bg-pink-400/60"];

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticlePos = useRef({ x: 0, y: 0 });

  // Smooth springs for cursor position
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;
      setMousePosition({ x: currentX, y: currentY });
      cursorX.set(currentX - 16); // Center the 32px cursor
      cursorY.set(currentY - 16);

      // Confetti Trail Logic
      const dist = Math.hypot(currentX - lastParticlePos.current.x, currentY - lastParticlePos.current.y);
      if (dist > 35) { // Spawn particle every 35px moved
        lastParticlePos.current = { x: currentX, y: currentY };
        const newParticle: Particle = {
          id: `${Date.now()}-${Math.random()}`,
          x: currentX,
          y: currentY,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          size: Math.random() * 4 + 3, // 3px to 7px
        };
        
        // Keep max 15 particles to maintain performance and subtlety
        setParticles((prev) => [...prev.slice(-14), newParticle]);
        
        // Remove particle automatically
        setTimeout(() => {
          setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        }, 1000);
      }
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if hovering over interactive elements
      if (
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.classList.contains("interactive")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    // Hide default cursor globally on large screens where custom cursor works well
    if (window.matchMedia("(min-width: 1024px)").matches) {
      document.body.style.cursor = "none";
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = "auto";
    };
  }, [cursorX, cursorY]);

  // Only show custom cursor on non-touch devices
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
    return null;
  }

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference bg-white"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 2 : 1,
          opacity: isHovering ? 0.8 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
      {/* Tiny dot in the center */}
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[10000]"
        animate={{
          x: mousePosition.x - 3,
          y: mousePosition.y - 3,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.1 }}
      />
      {/* Confetti Trail */}
      <AnimatePresence>
        {particles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0.5, scale: 1, x: p.x, y: p.y, rotate: 0 }}
            animate={{
              opacity: 0,
              scale: 0.2,
              x: p.x + (Math.random() - 0.5) * 40, // slight horizontal drift
              y: p.y + 30 + Math.random() * 30, // fall downwards
              rotate: Math.random() * 180 * (Math.random() > 0.5 ? 1 : -1),
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`fixed top-0 left-0 pointer-events-none z-[9998] rounded-[2px] ${p.color}`}
            style={{ width: p.size, height: p.size }}
          />
        ))}
      </AnimatePresence>
    </>
  );
}
