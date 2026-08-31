import { useEffect, useRef, useState } from "react";

const IframePreview = ({ src, title }: { src: string; title: string }) => {
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Defer iframe mounting until the wrapper scrolls into view
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Timeout: if iframe hasn't loaded after 8s of being in view, show error
  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      if (!loaded) setError(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [inView, loaded]);

  return (
    <div ref={wrapperRef} className="w-full h-full relative overflow-hidden rounded-xl bg-background/50">
      {/* Loading spinner — shown when in view but iframe hasn't loaded */}
      {inView && !loaded && !error && (
        <div className="absolute inset-0 bg-card/90 flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Connecting...
            </span>
          </div>
        </div>
      )}

      {/* Placeholder — shown before iframe scrolls into view */}
      {!inView && (
        <div className="absolute inset-0 bg-card/90 flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-xs font-bold">↗</span>
            </div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Live Preview
            </span>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loaded && (
        <div className="absolute inset-0 bg-card/90 flex items-center justify-center pointer-events-none z-20 px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-destructive">Oops, the site preview is currently not available.</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">You can still click 'Open Website' to visit directly.</span>
          </div>
        </div>
      )}

      {/* Only render iframe when in viewport */}
      {inView && (
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
      )}
    </div>
  );
};

export default IframePreview;
