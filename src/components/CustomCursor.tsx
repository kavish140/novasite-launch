import { useEffect, useState, useRef, useCallback } from "react";
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
  const [isHovering, setIsHovering] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastParticlePos = useRef({ x: 0, y: 0 });
  const dotRef = useRef<HTMLDivElement>(null);
  const timeoutIds = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());
  const isLargeScreen = useRef(false);

  // Smooth springs for cursor position
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentX = e.clientX;
    const currentY = e.clientY;

    // Update the tiny dot directly via ref (avoids 60fps re-renders)
    if (dotRef.current) {
      dotRef.current.style.transform = `translate(${currentX - 3}px, ${currentY - 3}px)`;
    }

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
      const timeoutId = setTimeout(() => {
        setParticles((prev) => prev.filter((p) => p.id !== newParticle.id));
        timeoutIds.current.delete(timeoutId);
      }, 1000);
      timeoutIds.current.add(timeoutId);
    }
  }, [cursorX, cursorY]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const screenQuery = window.matchMedia("(min-width: 1024px)");
    isLargeScreen.current = screenQuery.matches;

    const handleScreenChange = (e: MediaQueryListEvent) => {
      isLargeScreen.current = e.matches;
      document.body.style.cursor = e.matches ? "none" : "auto";
    };

    // Listen for screen size changes so cursor adapts on resize
    screenQuery.addEventListener("change", handleScreenChange);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
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
    if (screenQuery.matches) {
      document.body.style.cursor = "none";
    }

    // Capture the ref value for use in the cleanup closure
    const pendingTimeouts = timeoutIds.current;

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
      screenQuery.removeEventListener("change", handleScreenChange);
      document.body.style.cursor = "auto";

      // Clear all pending particle removal timeouts
      pendingTimeouts.forEach((id) => clearTimeout(id));
      pendingTimeouts.clear();
    };
  }, [handleMouseMove]);

  // Only show custom cursor on non-touch devices with enough screen space
  // Also respect prefers-reduced-motion
  if (typeof window !== "undefined") {
    if (
      window.matchMedia("(max-width: 1023px)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return null;
    }
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
      {/* Tiny dot in the center — positioned via ref to avoid re-renders */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[10000]"
        style={{
          transition: "opacity 0.1s ease",
          opacity: isHovering ? 0 : 1,
        }}
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
