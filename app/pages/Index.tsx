import { useEffect } from "react";
import { useLocation, Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { buildLocalBusinessJsonLd, buildOrganizationJsonLd, buildAboutPageJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import PageTransition from "@/components/PageTransition";
import { usePackagePricing } from "@/lib/package-pricing";
// Keep public sections statically imported so their content is present in SSR.
import Footer from "@/components/Footer";

export default function Index() {
  const location = useLocation();
  const { starterPrice, available } = usePackagePricing();
  const jsonLd = [buildLocalBusinessJsonLd(), buildOrganizationJsonLd(), buildAboutPageJsonLd()];

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo || location.hash.slice(1);
    if (!target) return;
    const timer = window.setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }), 200);
    return () => window.clearTimeout(timer);
  }, [location]);

  return (
    <PageTransition>
      <JsonLd data={jsonLd} />
      <div className="studio-home studio-home-compact min-h-screen bg-background text-foreground">
        <a href="#main-content" className="studio-skip-link sr-only focus:not-sr-only">Skip to main content</a>
        <Navbar />
        <main id="main-content">
          <HeroSection />
          <section className="studio-container studio-discover" aria-label="Explore SiteNova">
            {[["See the work", "Client websites, case studies and design demos.", "/portfolio"], ["Find your solution", "Websites, stores and custom applications.", "/services"], ["Hear from clients", "Real experiences of working with SiteNova.", "/reviews"]].map(([title, description, to]) => <Link key={to} to={to} className="studio-discover-card"><h2>{title}<ArrowUpRight size={22} /></h2><p>{description}</p></Link>)}
          </section>
          <section id="packages" className="studio-home-pricing" aria-labelledby="pricing-title">
            <div className="studio-container">
              <div className="studio-home-pricing-head">
                <div><p className="studio-eyebrow">A clear starting point</p><h2 id="pricing-title">Good design.<br />A sensible investment.</h2></div>
                <p>{available ? `Start with a landing page from ${starterPrice}, or give your business a complete online home.` : "Start with a focused landing page, or give your business a complete online home."} Your final scope, price, and schedule are agreed before work begins.</p>
              </div>
              <div className="studio-discover studio-home-next-steps"><Link to="/pricing" className="studio-discover-card"><p className="studio-eyebrow">Building something new?</p><h2>Find your website package <ArrowUpRight size={22} /></h2><p>Compare the scope and starting prices. Discuss your project, or pay an advance when you’re ready.</p></Link><Link to="/free-audit" className="studio-discover-card studio-audit-offer"><p className="studio-eyebrow">Already have a website?</p><h2>Get my free website audit <ArrowUpRight size={22} /></h2><p>Find what could improve your speed, search visibility and mobile experience. Practical next steps, with no obligation.</p></Link></div>
              <div className="studio-home-pricing-foot"><span>Need e-commerce or something more custom? Let’s talk through it.</span><Link to="/payments">Payment options <ArrowUpRight size={16} aria-hidden="true" /></Link></div>
            </div>
          </section>
          <section className="geo-entity-block studio-home-entity" id="about-sitenova" aria-label="About SiteNova Web Design Agency"><div className="studio-container"><div><h3>SiteNova — an independent Mumbai web studio.</h3><p>Founded by Kavish Ganatra in 2024, SiteNova builds custom websites and web applications from Mulund, Mumbai, India. Work directly with the developer on business websites, online stores, and useful digital experiences. Find SiteNova on <a href="https://www.clutch.co/profile/sitenova" target="_blank" rel="noopener noreferrer">Clutch</a>, <a href="https://techbehemoths.com/company/sitenova" target="_blank" rel="noopener noreferrer">TechBehemoths</a>, and <a href="https://www.crunchbase.com/organization/sitenova-web-design" target="_blank" rel="noopener noreferrer">Crunchbase</a>.</p></div><div><h3>Built around the business behind the website.</h3><p>From doctors and finance firms to retailers, restaurants, consultants, and startups, each project starts with what your customers need to understand and do. SiteNova (sitenova.dev) is not affiliated with sitenovaagency.com, a separate, unrelated business.</p></div></div></section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
}
