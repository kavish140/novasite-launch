import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  blurDataURL?: string;
}

export default function BlurImage({
  src,
  alt,
  className,
  blurDataURL,
  ...props
}: BlurImageProps) {
  const [isLoading, setLoading] = useState(true);
  const [currentSrc, setCurrentSrc] = useState(blurDataURL || src);

  useEffect(() => {
    let cancelled = false;

    if (blurDataURL) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        if (cancelled) return;
        setCurrentSrc(src);
        setLoading(false);
      };
      img.onerror = () => {
        if (cancelled) return;
        // On failure, remove the blur so the user sees whatever loaded (or nothing)
        setLoading(false);
      };
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [src, blurDataURL]);

  return (
    <div className={cn("overflow-hidden bg-muted/20 flex items-center justify-center", className)}>
      <img
        {...props}
        src={currentSrc}
        alt={alt}
        loading="lazy"
        className={cn(
          "w-full h-full object-cover transition-all duration-700 ease-in-out",
          isLoading ? "scale-105 blur-md" : "scale-100 blur-0"
        )}
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
