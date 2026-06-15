import { useState, useEffect, ReactNode } from "react";

interface DeferredWrapperProps {
  children: ReactNode;
  delay?: number;
}

export default function DeferredWrapper({ children, delay = 2000 }: DeferredWrapperProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // If requestIdleCallback is supported, use it for better scheduling,
    // otherwise fallback to setTimeout
    if ('requestIdleCallback' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const handle = (window as any).requestIdleCallback(() => {
        setTimeout(() => setShouldRender(true), delay);
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return () => (window as any).cancelIdleCallback(handle);
    } else {
      const timer = setTimeout(() => {
        setShouldRender(true);
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
}
