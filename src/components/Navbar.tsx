import { useEffect, useRef, useState } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { Menu, Moon, Sun, X, ChevronDown, Stethoscope, TrendingUp, Building2, Scale, Briefcase, Rocket, UtensilsCrossed } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";

const navLinks = [
  { label: "Features", id: "features" },
  { label: "Portfolio", id: "portfolio" },
  { label: "How It Works", id: "how-it-works" },
  { label: "Testimonials", id: "testimonials" },
];

const nicheLinks = [
  {
    label: "Websites for Doctors",
    to: "/websites-for-doctors",
    icon: Stethoscope,
    description: "Clinics, dentists & healthcare",
  },
  {
    label: "Websites for Finance",
    to: "/websites-for-finance",
    icon: TrendingUp,
    description: "CAs, advisors & insurance",
  },
  {
    label: "Websites for Real Estate",
    to: "/websites-for-real-estate",
    icon: Building2,
    description: "Agents, builders & dealers",
  },
  {
    label: "Websites for Lawyers",
    to: "/websites-for-lawyers",
    icon: Scale,
    description: "Advocates, firms & legal pros",
  },
  {
    label: "Websites for Consultants",
    to: "/websites-for-consultants",
    icon: Briefcase,
    description: "Coaches, advisors & consultants",
  },
  {
    label: "Websites for Startups",
    to: "/websites-for-startups",
    icon: Rocket,
    description: "SaaS, founders & tech",
  },
  {
    label: "Websites for Restaurants",
    to: "/websites-for-restaurants",
    icon: UtensilsCrossed,
    description: "Cafes, diners & kitchens",
  },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const isDarkMode = resolvedTheme !== "light";
  const location = useLocation();
  const navigate = useNavigate();
  const servicesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close services dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!servicesOpen) return;
      if (servicesRef.current && !servicesRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [servicesOpen]);

  // Close dropdown on route change
  useEffect(() => {
    setServicesOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } });
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight">
          <img src="/logo-icon.png" className="h-8 w-8 object-contain" alt="SiteNova Logo" width="32" height="32" />
          <span>Site<span className="gradient-text">Nova</span></span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              type="button"
              key={link.label}
              onClick={() => scrollToSection(link.id)}
              aria-label={`Scroll to ${link.label} section`}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              {link.label}
            </button>
          ))}

          {/* Services Dropdown */}
          <div ref={servicesRef} className="relative">
            <button
              type="button"
              onClick={() => setServicesOpen(!servicesOpen)}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
              aria-expanded={servicesOpen}
              aria-haspopup="true"
            >
              Services
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {servicesOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-border/60 bg-background/95 backdrop-blur-xl shadow-xl p-2"
                >
                  {nicheLinks.map((niche) => {
                    const Icon = niche.icon;
                    return (
                      <Link
                        key={niche.to}
                        to={niche.to}
                        className="flex items-start gap-3 rounded-lg px-3 py-3 text-sm hover:bg-secondary/60 transition-colors group"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                          <Icon size={18} />
                        </div>
                        <div>
                          <span className="font-medium text-foreground">{niche.label}</span>
                          <p className="text-xs text-muted-foreground mt-0.5">{niche.description}</p>
                        </div>
                      </Link>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Blog
          </Link>
          <Link to="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Pricing
          </Link>
          <Link to="/free-audit" className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200">
            Free Audit
          </Link>
          <button
            type="button"
            onClick={() => setTheme(isDarkMode ? "light" : "dark")}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Toggle theme"
          >
            {!mounted ? null : isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            to="/quote"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors glow-effect-sm btn-quote-pulse"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              {navLinks.map((link) => (
                <button
                  type="button"
                  key={link.label}
                  onClick={() => {
                    scrollToSection(link.id);
                    setMobileOpen(false);
                  }}
                  aria-label={`Scroll to ${link.label} section`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile services section */}
              <div className="border-t border-border/30 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/60 mb-3">
                  Services
                </p>
                {nicheLinks.map((niche) => {
                  const Icon = niche.icon;
                  return (
                    <Link
                      key={niche.to}
                      to={niche.to}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Icon size={16} className="text-primary shrink-0" />
                      {niche.label}
                    </Link>
                  );
                })}
              </div>

              <Link
                to="/blog"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Blog
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/free-audit"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Free Audit
              </Link>
              <button
                type="button"
                onClick={() => setTheme(isDarkMode ? "light" : "dark")}
                className="inline-flex items-center justify-center rounded-lg border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground"
                aria-label="Toggle theme"
              >
                {!mounted ? null : isDarkMode ? (
                  <span className="inline-flex items-center gap-2"><Sun size={16} /> Light Mode</span>
                ) : (
                  <span className="inline-flex items-center gap-2"><Moon size={16} /> Dark Mode</span>
                )}
              </button>
              <Link
                to="/quote"
                onClick={() => setMobileOpen(false)}
                className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground btn-quote-pulse"
              >
                Get a Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
