import { ArrowUpRight, Code2, Globe2, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { usePackagePricing } from "@/lib/package-pricing";
import "./studio-sections.css";

const services = [
  { number: "01", icon: Globe2, title: "Business websites", description: "A clear story, a distinctive design, and an easy next step for your customers. Built around your business.", href: "/services/business-websites", detail: "Brand-led design · Mobile-first · Lead forms" },
  { number: "02", icon: ShoppingBag, title: "E-commerce stores", description: "Make your products easy to discover and simple to buy, with a storefront that feels like your brand.", href: "/services/ecommerce", detail: "Product catalogs · Payments · Store management" },
  { number: "03", icon: Code2, title: "Custom web applications", description: "Turn a specific business workflow into a useful digital product, from booking systems to dashboards.", href: "/services/web-applications", detail: "Dashboards · Integrations · Custom workflows" },
  { number: "04", icon: Search, title: "SEO & website performance", description: "Find what’s slowing your current site down and improve the technical foundations that support discovery.", href: "/services/seo-optimization", detail: "Technical SEO · Speed audits · Core Web Vitals" },
];

export default function FeaturesSection() {
  const { businessPrice, available } = usePackagePricing();
  return <section id="features" className="sn-section sn-services" aria-labelledby="features-title"><div className="sn-container">
    <div className="sn-section-head"><div><p className="sn-kicker">What we can build together</p><h2 id="features-title">Your next chapter,<br />built for the web.</h2></div><p className="sn-section-intro">From a first business website to a more ambitious digital product. Design and development, with one person accountable from brief to launch.</p></div>
    <div className="sn-service-list">{services.map((service) => <Link to={service.href} key={service.number} className="sn-service-row"><span className="sn-service-number">{service.number}</span><div className="sn-service-name"><service.icon size={25} strokeWidth={1.4} aria-hidden="true" /><h3>{service.title}</h3></div><div className="sn-service-description"><p>{service.description}</p><span>{service.number === "01" && available ? `From ${businessPrice} · ` : ""}{service.detail}</span></div><span className="sn-service-arrow" aria-hidden="true"><ArrowUpRight size={24} /></span></Link>)}</div>
    <div className="sn-work-bottom"><p>Need help reaching the right audience, too?</p><div className="sn-inline-links"><Link className="sn-text-link" to="/services/google-ads">Google Ads<ArrowUpRight size={16} aria-hidden="true" /></Link><Link className="sn-text-link" to="/services/meta-ads">Meta Ads<ArrowUpRight size={16} aria-hidden="true" /></Link></div></div>
    <div className="sn-capabilities"><span>Included in the approach</span><p>Custom design</p><p>Responsive development</p><p>Technical SEO</p><p>Clear handover</p></div>
  </div></section>;
}
