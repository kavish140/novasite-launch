export default function ScrollProgress() {
  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[100] origin-left bg-gradient-to-r from-primary to-accent"
      style={{
        transform: "scaleX(0)",
        animation: "scroll-progress linear both",
        animationTimeline: "scroll()",
      } as React.CSSProperties}
      aria-hidden="true"
    />
  );
}
