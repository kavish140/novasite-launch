import { useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface PhoneCellProps {
  mobile: string;
  className?: string;
}

export default function PhoneCell({ mobile, className }: PhoneCellProps) {
  const { toast } = useToast();
  const [isLongPress, setIsLongPress] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!mobile)
    return <span className={className || "text-muted-foreground"}>N/A</span>;

  const startPress = () => {
    setIsLongPress(false);
    timerRef.current = setTimeout(() => {
      setIsLongPress(true);
      navigator.clipboard.writeText(mobile);
      toast({ title: "Copied!", description: "Phone number copied to clipboard." });
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isLongPress) {
      e.preventDefault();
      setIsLongPress(false);
    }
  };

  return (
    <a
      href={`tel:${mobile}`}
      className={`text-primary hover:underline select-none ${className || ""}`}
      onPointerDown={startPress}
      onPointerUp={cancelPress}
      onPointerLeave={cancelPress}
      onPointerCancel={cancelPress}
      onClick={handleClick}
    >
      {mobile}
    </a>
  );
}
