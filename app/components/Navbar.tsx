import { startTransition, useEffect, useState } from "react";
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router";
import { useTheme } from "next-themes";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import "./site-shell.css";

const services = [
  { label: "Business websites", to: "/services/business-websites", detail: "A considered home for your business" },
  { label: "E-commerce stores", to: "/services/ecommerce", detail: "From browsing to checkout" },
  { label: "Web applications", to: "/services/web-applications", detail: "Custom tools, dashboards & platforms" },
  { label: "SEO & speed audits", to: "/services/seo-optimization", detail: "A stronger technical foundation" },
];
const industries = [
  { label: "Doctors", to: "/websites-for-doctors" },
  { label: "Finance & CAs", to: "/websites-for-finance" },
  { label: "Real estate", to: "/websites-for-real-estate" },
  { label: "Lawyers", to: "/websites-for-lawyers" },
  { label: "Consultants", to: "/websites-for-consultants" },
  { label: "Startups", to: "/websites-for-startups" },
  { label: "Restaurants", to: "/websites-for-restaurants" },
];
const marketing = [
  { label: "Google Ads", to: "/services/google-ads" },
  { label: "Meta Ads", to: "/services/meta-ads" },
  { label: "Book a strategy call", to: "/ads-contact" },
];
const studio = [
  { label: "Payments", to: "/payments" },
  { label: "Resources", to: "/resources" },
  { label: "FAQs", to: "/faq" },
  { label: "About SiteNova", to: "/about" },
  { label: "Our process", to: "/our-process" },
  { label: "Why work with us", to: "/why-us" },
  { label: "Contact", to: "/contact-us" },
  { label: "Free website audit", to: "/free-audit" },
  { label: "Website cost calculator", to: "/website-cost-calculator" },
  { label: "Local guides", to: "/locations" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const dark = resolvedTheme === "dark";

  useEffect(() => { startTransition(() => setMounted(true)); }, []);
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
    setStudioOpen(false);
  }, [location.pathname]);

  const sectionRoutes: Record<string, string> = { portfolio: "/portfolio", features: "/services", testimonials: "/reviews", "how-it-works": "/our-process" };

  const themeControl = (
    <button type="button" className="studio-theme" onClick={() => setTheme(dark ? "light" : "dark")} aria-label="Toggle theme">
      {mounted && dark ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
    </button>
  );

  return (
    <nav className="studio-nav" aria-label="Main navigation">
      <div className="studio-nav-inner">
        <Link to="/" className="studio-wordmark" aria-label="SiteNova home">
          <img src="/logo-icon.png" alt="" width={32} height={32} />
          <span>SiteNova<span className="studio-wordmark-dot">.</span></span>
        </Link>
        <div className="studio-desktop-nav">
          <Link to="/portfolio" className="studio-nav-link">Work</Link>
          <DropdownMenu modal={false} open={servicesOpen} onOpenChange={setServicesOpen}>
            <DropdownMenuTrigger asChild>
              <button type="button" className="studio-nav-link">Services <ChevronDown size={13} aria-hidden="true" /></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={25} className="studio-mega-menu">
              <div className="studio-mega-column">
                <DropdownMenuLabel className="studio-menu-label">What we build</DropdownMenuLabel>
                {services.map(item => (
                  <DropdownMenuItem asChild key={item.to} className="studio-menu-item">
                    <Link to={item.to}><span>{item.label}<small>{item.detail}</small></span><ArrowUpRight size={15} aria-hidden="true" /></Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuLabel className="studio-menu-label studio-menu-label-lower">Reach your audience</DropdownMenuLabel>
                {marketing.map(item => <DropdownMenuItem asChild key={item.to} className="studio-menu-item"><Link to={item.to}>{item.label}<ArrowUpRight size={15} aria-hidden="true" /></Link></DropdownMenuItem>)}
              </div>
              <div className="studio-mega-column studio-mega-industries">
                <DropdownMenuLabel className="studio-menu-label">Made for your industry</DropdownMenuLabel>
                {industries.map(item => <DropdownMenuItem asChild key={item.to} className="studio-menu-item"><Link to={item.to}>{item.label}<ArrowUpRight size={15} aria-hidden="true" /></Link></DropdownMenuItem>)}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/pricing" className="studio-nav-link" aria-current={location.pathname === "/pricing" ? "page" : undefined}>Pricing</Link>
          <DropdownMenu modal={false} open={studioOpen} onOpenChange={setStudioOpen}>
            <DropdownMenuTrigger asChild><button type="button" className="studio-nav-link">Studio <ChevronDown size={13} aria-hidden="true" /></button></DropdownMenuTrigger>
            <DropdownMenuContent align="start" sideOffset={25} className="studio-small-menu">
              {studio.map(item => <DropdownMenuItem asChild key={item.to} className="studio-menu-item"><Link to={item.to}>{item.label}<ArrowUpRight size={15} aria-hidden="true" /></Link></DropdownMenuItem>)}
              <DropdownMenuItem asChild className="studio-menu-item"><Link to={sectionRoutes["features"]}>Our approach<ArrowUpRight size={15} aria-hidden="true" /></Link></DropdownMenuItem>
              <DropdownMenuItem asChild className="studio-menu-item"><Link to={sectionRoutes["testimonials"]}>Client reviews<ArrowUpRight size={15} aria-hidden="true" /></Link></DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/free-audit" className="studio-nav-link">Free audit</Link>
        </div>
        <div className="studio-nav-actions">
          {themeControl}
          <Link to="/quote" className="studio-nav-cta">Get a quote <ArrowUpRight size={17} aria-hidden="true" /></Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild><button type="button" className="studio-mobile-trigger" aria-label="Toggle mobile menu"><Menu size={22} /></button></SheetTrigger>
            <SheetContent side="right" className="studio-mobile-menu">
              <SheetTitle className="studio-wordmark">SiteNova<span className="studio-wordmark-dot">.</span></SheetTitle>
              <SheetDescription className="sr-only">Explore our work, services, studio and resources.</SheetDescription>
              <div className="studio-mobile-links">
                <Link to="/portfolio" onClick={() => setMobileOpen(false)}>Our work <ArrowUpRight size={22} /></Link>
                <Link to="/pricing" onClick={() => setMobileOpen(false)}>Pricing <ArrowUpRight size={22} /></Link>
                <Link to="/free-audit" onClick={() => setMobileOpen(false)}>Free website audit <ArrowUpRight size={22} /></Link>
                <details><summary>Services <ChevronDown size={18} /></summary>
                  <div className="studio-mobile-submenu">{services.map(item => <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
                    <p>By industry</p>{industries.map(item => <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
                    <p>Marketing</p>{marketing.map(item => <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}
                  </div>
                </details>
                <details><summary>Studio <ChevronDown size={18} /></summary><div className="studio-mobile-submenu">{studio.map(item => <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)}>{item.label}</Link>)}<Link to={sectionRoutes["features"]}>Our approach</Link><Link to={sectionRoutes["how-it-works"]}>How it works</Link><Link to={sectionRoutes["testimonials"]}>Client reviews</Link></div></details>
                <Link to="/blog" onClick={() => setMobileOpen(false)}>Blog <ArrowUpRight size={22} /></Link>
              </div>
              <Link to="/quote" className="studio-nav-cta studio-mobile-cta" onClick={() => setMobileOpen(false)}>Get a quote <ArrowUpRight size={20} /></Link>
              <p className="studio-mobile-note">Independent web design & development.<br />Based in Mulund, Mumbai.</p>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
