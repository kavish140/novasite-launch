import { useEffect, useState } from "react";

const IframePreview = ({ src, title }: { src: string; title: string }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loaded) setError(true);
    }, 8000);
    return () => clearTimeout(timer);
  }, [loaded]);

  return (
    <div className="w-full h-full relative overflow-hidden rounded-xl bg-background/50">
      {!loaded && !error && (
        <div className="absolute inset-0 bg-card/90 flex items-center justify-center pointer-events-none z-20">
          <div className="flex flex-col items-center gap-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
              Connecting...
            </span>
          </div>
        </div>
      )}

      {error && !loaded && (
        <div className="absolute inset-0 bg-card/90 flex items-center justify-center pointer-events-none z-20 px-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium text-destructive">Oops, the site preview is currently not available.</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">You can still click 'Open Website' to visit directly.</span>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default IframePreview;
