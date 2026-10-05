import "./admin.css";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import {
  Eye,
  EyeOff,
  Zap,
  ArrowRight,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  CalendarDays,
  Users,
  FileText,
} from "lucide-react";
import { m as motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shakeKey, setShakeKey] = useState(0); // increment to re-trigger shake anim

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Invalid credentials.";
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      // Trigger shake animation
      setShakeKey((k) => k + 1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-workspace grid min-h-svh lg:grid-cols-2">
      <aside className="admin-login-art relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex xl:p-16">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500">
            <Zap className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">SiteNova</span>
        </div>
        <div className="relative z-10 max-w-md py-14">
          <span className="mb-6 block text-[10px] font-semibold uppercase tracking-[.24em] text-indigo-300">
            Your business, in focus
          </span>
          <h2 className="font-heading text-5xl font-medium leading-[1.15] tracking-tight">
            Great work starts
            <br />
            with a clear view.
          </h2>
          <p className="mt-6 max-w-sm text-base leading-relaxed text-slate-400">
            One workspace for your next client, your next conversation, and your
            next big idea.
          </p>
          <div className="mt-10 space-y-3">
            {[
              { icon: Users, label: "Turn inquiries into opportunities" },
              {
                icon: CalendarDays,
                label: "Stay ready for every conversation",
              },
              { icon: FileText, label: "Create content that connects" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.03] px-4 py-3 text-sm text-slate-300"
              >
                <Icon className="h-4 w-4 text-indigo-300" />
                {label}
              </div>
            ))}
          </div>
        </div>
        <span className="text-xs text-slate-500">
          SiteNova · Admin workspace
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full border-[60px] border-white/[.03]"
        />
      </aside>
      <main className="flex min-h-svh flex-col px-6 py-8 sm:px-12">
        <Link
          to="/"
          className="inline-flex w-fit items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to website
        </Link>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-14">
          <div className="mb-8">
            <span className="mb-6 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[.2em] text-primary">
              SiteNova admin
            </p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Welcome back.
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Sign in to your workspace to pick up where you left off.
            </p>
          </div>
          <motion.div
            key={shakeKey}
            animate={shakeKey > 0 ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-12 bg-card"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 bg-card pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-1 top-1 flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full gap-2 font-medium"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to workspace
                    <ArrowRight className="ml-auto h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </motion.div>
          <p className="mt-6 flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Restricted to authorized SiteNova administrators
          </p>
        </div>
        <p className="text-center text-[10px] uppercase tracking-[.15em] text-muted-foreground/60">
          Built for the work ahead
        </p>
      </main>
    </div>
  );
}
