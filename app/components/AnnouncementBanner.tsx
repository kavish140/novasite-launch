/**
 * AnnouncementBanner — sitewide banner rendered in root.tsx above the Outlet.
 * Fetches site_settings.announcement_banner from Supabase (client-side, public anon key).
 * Conditionally renders with a dismiss button (dismissed state persisted in sessionStorage).
 * Suppressed on /admin routes.
 */

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { supabase } from "@/lib/supabaseClient";
import { X } from "lucide-react";

interface BannerSettings {
  enabled: boolean;
  text: string;
  link: string;
  bg_color: string;
  text_color: string;
  image_url?: string;
}

const DISMISS_KEY = "sitenova_banner_dismissed";

export default function AnnouncementBanner() {
  const location = useLocation();
  const [banner, setBanner] = useState<BannerSettings | null>(null);
  const [dismissed, setDismissed] = useState(false);

  // Suppress on admin pages
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem(DISMISS_KEY) === "true") {
      setDismissed(true);
      return;
    }
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "announcement_banner")
        .maybeSingle();
      if (error || !data) return;
      const settings = data.value as BannerSettings;
      if (settings?.enabled && settings?.text) {
        setBanner(settings);
      }
    } catch {
      // silent fail — banner is non-critical
    }
  };

  const dismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  };

  if (isAdmin || dismissed || !banner) return null;

  const content = (
    <div
      className="relative z-50 w-full px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium"
      style={{
        backgroundColor: banner.bg_color,
        color: banner.text_color,
        backgroundImage: banner.image_url ? `url(${banner.image_url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* overlay if image */}
      {banner.image_url && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: banner.bg_color, opacity: 0.65 }}
        />
      )}
      <span className="relative text-center leading-snug">{banner.text}</span>
      {banner.link && (
        <a
          href={banner.link}
          className="relative underline underline-offset-2 opacity-90 hover:opacity-100 whitespace-nowrap ml-1"
          style={{ color: banner.text_color }}
        >
          Learn more →
        </a>
      )}
      <button
        onClick={dismiss}
        className="relative ml-auto flex-shrink-0 p-1 rounded hover:opacity-70 transition-opacity"
        aria-label="Dismiss banner"
        style={{ color: banner.text_color }}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );

  return content;
}
