import { useState, useEffect, startTransition, type ReactNode } from "react";

export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);
  return mounted ? <>{children}</> : null;
}
