/**
 * SettingsTab — Admin settings page.
 * Sections:
 *  1. Announcement banner — text, link, image URL (or Supabase Storage upload),
 *     bg_color, text_color, enabled toggle. Saves to site_settings table.
 *  2. Change Password — Supabase Auth updateUser.
 */

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone, KeyRound, Save, Upload, Loader2, Eye, Image as ImageIcon,
} from "lucide-react";

interface BannerSettings {
  enabled: boolean;
  text: string;
  link: string;
  bg_color: string;
  text_color: string;
  image_url: string;
}

const DEFAULT_BANNER: BannerSettings = {
  enabled: false,
  text: "",
  link: "",
  bg_color: "#3b82f6",
  text_color: "#ffffff",
  image_url: "",
};

const PRESETS = [
  { name: "Brand Blue", bg: "#3b82f6", text: "#ffffff" },
  { name: "Success Green", bg: "#10b981", text: "#ffffff" },
  { name: "Warning Amber", bg: "#f59e0b", text: "#ffffff" },
  { name: "Alert Red", bg: "#ef4444", text: "#ffffff" },
  { name: "Dark Slate", bg: "#1e293b", text: "#f8fafc" },
  { name: "Light Frost", bg: "#f8fafc", text: "#0f172a" },
];

export default function SettingsTab() {
  const { toast } = useToast();
  const [banner, setBanner] = useState<BannerSettings>(DEFAULT_BANNER);
  const [bannerLoading, setBannerLoading] = useState(true);
  const [bannerSaving, setBannerSaving] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    setBannerLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "announcement_banner")
        .maybeSingle();
      if (!error && data?.value) {
        setBanner({ ...DEFAULT_BANNER, ...(data.value as BannerSettings) });
      }
    } catch {
      // silent — use defaults
    } finally {
      setBannerLoading(false);
    }
  };

  const saveBanner = async () => {
    setBannerSaving(true);
    try {
      const { error } = await supabase
        .from("site_settings")
        .upsert({ key: "announcement_banner", value: banner, updated_at: new Date().toISOString() });
      if (error) throw error;
      toast({ title: "Banner saved", description: "Settings updated successfully." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save banner.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setBannerSaving(false);
    }
  };

  const handleBannerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const filename = `banner-${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("images")
        .upload(filename, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("images").getPublicUrl(filename);
      setBanner((b) => ({ ...b, image_url: data.publicUrl }));
      toast({ title: "Image uploaded", description: "Banner image uploaded to Supabase Storage." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Upload failed.";
      toast({ title: "Upload failed", description: msg, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    if (password.length < 8) {
      toast({ title: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setPwLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated", description: "Your admin password has been changed." });
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password.";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setPwLoading(false);
    }
  };

  // Live preview banner
  const BannerPreview = () => (
    <div
      className="w-full rounded-lg px-4 py-2.5 flex items-center gap-3 text-sm font-medium"
      style={{
        backgroundColor: banner.bg_color,
        color: banner.text_color,
        backgroundImage: banner.image_url ? `url(${banner.image_url})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {banner.image_url && (
        <div className="absolute inset-0 rounded-lg" style={{ backgroundColor: banner.bg_color, opacity: 0.7 }} />
      )}
      <span className="relative">{banner.text || "Your announcement text will appear here…"}</span>
      {banner.link && (
        <span className="relative ml-auto text-xs underline opacity-80">Learn more →</span>
      )}
    </div>
  );

  return (
    <motion.div
      className="space-y-8 max-w-2xl"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* ── Announcement Banner ──────────────────────────────────────────── */}
      <section className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-base">Announcement Banner</h2>
            <p className="text-xs text-muted-foreground">
              Displays a coloured bar at the very top of every public page.
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {banner.enabled ? "Live" : "Hidden"}
            </span>
            <Switch
              checked={banner.enabled}
              onCheckedChange={(v) => setBanner((b) => ({ ...b, enabled: v }))}
            />
          </div>
        </div>

        {bannerLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading saved settings…
          </div>
        ) : (
          <div className="space-y-5">
            {/* Preview */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> Live Preview
              </Label>
              <BannerPreview />
            </div>

            {/* Text */}
            <div className="space-y-1.5">
              <Label htmlFor="banner-text">Banner Text</Label>
              <Input
                id="banner-text"
                value={banner.text}
                onChange={(e) => setBanner((b) => ({ ...b, text: e.target.value }))}
                placeholder="🎉 We now offer Google Ads management from ₹8,000/month!"
                className="bg-background"
              />
            </div>

            {/* Link */}
            <div className="space-y-1.5">
              <Label htmlFor="banner-link">Link URL (optional)</Label>
              <Input
                id="banner-link"
                value={banner.link}
                onChange={(e) => setBanner((b) => ({ ...b, link: e.target.value }))}
                placeholder="https://sitenova.dev/services/google-ads"
                className="bg-background"
              />
            </div>

            {/* Templates */}
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Quick Templates</Label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setBanner((b) => ({ ...b, bg_color: preset.bg, text_color: preset.text, image_url: "" }))}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border/50 text-xs font-medium hover:scale-105 transition-transform"
                    style={{ backgroundColor: preset.bg, color: preset.text }}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="bg-color">Background Colour</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="bg-color"
                    value={banner.bg_color}
                    onChange={(e) => setBanner((b) => ({ ...b, bg_color: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0.5"
                  />
                  <Input
                    value={banner.bg_color}
                    onChange={(e) => setBanner((b) => ({ ...b, bg_color: e.target.value }))}
                    className="bg-background font-mono text-sm flex-1"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="text-color">Text Colour</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="text-color"
                    value={banner.text_color}
                    onChange={(e) => setBanner((b) => ({ ...b, text_color: e.target.value }))}
                    className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0.5"
                  />
                  <Input
                    value={banner.text_color}
                    onChange={(e) => setBanner((b) => ({ ...b, text_color: e.target.value }))}
                    className="bg-background font-mono text-sm flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Image upload */}
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5" /> Banner Background Image (optional)
              </Label>
              <div className="flex items-center gap-3">
                <Input
                  value={banner.image_url}
                  onChange={(e) => setBanner((b) => ({ ...b, image_url: e.target.value }))}
                  placeholder="https://… or upload below"
                  className="bg-background text-sm flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 whitespace-nowrap"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerImageUpload}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Uploads to the <code className="bg-muted px-1 rounded">images</code> Supabase Storage bucket (public).
              </p>
            </div>

            <Button onClick={saveBanner} disabled={bannerSaving} className="gap-2 w-full sm:w-auto">
              {bannerSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Banner Settings
            </Button>
          </div>
        )}
      </section>

      <Separator className="bg-border/30" />

      {/* ── Change Password ──────────────────────────────────────────────── */}
      <section className="bg-card/40 border border-border/40 rounded-xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <KeyRound className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h2 className="font-semibold text-base">Change Password</h2>
            <p className="text-xs text-muted-foreground">
              Update your admin login password. Must be at least 8 characters.
            </p>
          </div>
        </div>
        <form onSubmit={changePassword} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="bg-background"
            />
          </div>
          <Button type="submit" disabled={pwLoading} variant="outline" className="gap-2">
            {pwLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            Update Password
          </Button>
        </form>
      </section>
    </motion.div>
  );
}
