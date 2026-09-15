/**
 * AnnouncementBanner — sitewide banner rendered in root.tsx above the Outlet.
 * Fixed at top-0 with z-[60] (above Navbar's z-50).
 * Injects --banner-height CSS variable on <html> so Navbar can offset itself.
 * Fetches site_settings.announcement_banner from Supabase (public anon key).
 * Dismiss button persists to sessionStorage.
 * Suppressed on /admin routes.
 */

import { useEffect, useState, useRef } from "react";
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
  const bannerRef = useRef<HTMLDivElement>(null);

  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (sessionStorage.getItem(DISMISS_KEY) === "true") {
      setDismissed(true);
      return;
    }
    fetchBanner();
  }, []);

  // Whenever banner mounts/unmounts, update --banner-height on <html>
  // so the fixed Navbar can add padding-top equal to the banner height.
  useEffect(() => {
    const root = document.documentElement;
    if (!dismissed && banner && bannerRef.current) {
      const h = bannerRef.current.getBoundingClientRect().height;
      root.style.setProperty("--banner-height", `${h}px`);
    } else {
      root.style.setProperty("--banner-height", "0px");
    }
    return () => {
      root.style.setProperty("--banner-height", "0px");
    };
  }, [banner, dismissed]);

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

  return (
    <div
      ref={bannerRef}
      className="fixed top-0 left-0 right-0 z-[60] px-4 py-2.5 flex items-center justify-center gap-3 text-sm font-medium"
      style={{
        backgroundColor: banner.bg_color,
        color: banner.text_color,
        backgroundImage: banner.image_url ? `url(${banner.image_url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Colour overlay when background image is set */}
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
}
