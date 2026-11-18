import { ArrowUpRight, Check, MoveUpRight } from "lucide-react";
import { Link } from "react-router";
import { usePackagePricing } from "@/lib/package-pricing";
import clientPreview from "@/assets/Drdiptiganatra.webp";
import financePreview from "@/assets/jupiterfastfinance.webp";
import BlurImage from "./BlurImage";
import BookingCTA from "./BookingCTA";

export default function HeroSection() {
  const { starterPrice, available } = usePackagePricing();
  return (
    <section className="studio-hero" aria-labelledby="hero-title">
      <div className="studio-container">
        <div className="studio-hero-topline">
          <span><span className="studio-status-dot" /> Independent web design & development</span>
          <span>Mulund, Mumbai · Working with businesses everywhere</span>
        </div>
        <div className="studio-hero-grid">
          <div className="studio-hero-copy">
            <p className="studio-eyebrow">Small studio. Big attention to detail.</p>
            <h1 id="hero-title">A website that<br />means <em>business.</em></h1>
            <p className="studio-hero-intro">Give your business a first impression worth remembering. Custom websites that look the part, work beautifully, and make the next step clear.</p>
            <div className="studio-hero-actions">
              <Link to="/quote" className="studio-button">Let’s build your website <ArrowUpRight size={20} aria-hidden="true" /></Link>
              <Link to="/portfolio" className="studio-text-link">Explore our work <ArrowUpRight size={17} aria-hidden="true" /></Link>
            </div>
            <div className="studio-hero-reassurance">
              <span><Check size={14} aria-hidden="true" /> {available ? `Projects from ${starterPrice}` : "A quote tailored to your project"}</span>
              <span><Check size={14} aria-hidden="true" /> Work directly with the developer</span>
            </div>
            <BookingCTA source="homepage-hero" className="studio-hero-booking" />
          </div>
          <div className="studio-hero-stage">
            <span className="studio-stage-caption">THOUGHTFULLY DESIGNED. PURPOSEFULLY BUILT.</span>
            <div className="studio-stage-orbit" aria-hidden="true" />
            <svg className="studio-stage-star" viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 0v100M0 50h100M15 15l70 70M15 85l70-70" stroke="currentColor" strokeWidth="15" /></svg>
            <Link to="/portfolio/dr-dipti-ganatra" className="studio-browser studio-browser-main" aria-label="Explore the Dr. Dipti Ganatra website case study">
              <div className="studio-browser-bar"><span className="studio-browser-dots"><i /><i /><i /></span><span>drdiptiganatra.com</span><MoveUpRight size={13} aria-hidden="true" /></div>
              <BlurImage src={clientPreview} alt="The real Dr. Dipti Ganatra clinic website, designed and built by SiteNova" width={1920} height={962} className="w-full h-auto" loading="eager" fetchPriority="high" />
              <div className="studio-browser-label"><span>Dr. Dipti Ganatra</span><span>Healthcare · Custom website</span></div>
            </Link>
            <Link to="/portfolio/jupiter-fast-finance" className="studio-browser studio-browser-secondary" aria-label="Explore the Jupiter Fast Finance case study">
              <div className="studio-browser-bar"><span className="studio-browser-dots"><i /><i /><i /></span><span>Jupiter Fast Finance</span><MoveUpRight size={12} aria-hidden="true" /></div>
              <BlurImage src={financePreview} alt="Jupiter Fast Finance website by SiteNova" width={1920} height={961} className="w-full h-auto" loading="lazy" />
            </Link>
            <span className="studio-stage-footnote">A selection of our actual client websites</span>
          </div>
        </div>
        <div className="studio-client-strip" aria-label="Selected clients">
          <p>Built for real people.<br /><strong>And their businesses.</strong></p>
          <span>Dr. Dipti Ganatra<small>Healthcare</small></span>
          <span>Jupiter Fast Finance<small>Financial services</small></span>
          <span>Corporatezone<small>Business essentials</small></span>
          <Link to="/portfolio" aria-label="View selected client projects">Meet the work <ArrowUpRight size={17} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
