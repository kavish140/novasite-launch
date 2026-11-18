import {Link} from "react-router";
import {ArrowUpRight,Check,Smartphone,MessagesSquare,Search,PanelsTopLeft} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {JsonLd} from "@/components/JsonLd";
import {usePackagePricing} from "@/lib/package-pricing";
import clinicImage from "@/assets/Drdiptiganatra.webp";
import financeImage from "@/assets/jupiterfastfinance.webp";

const capabilities=[
  {icon:PanelsTopLeft,title:"A design that feels like you",text:"Your business, services and story translated into a clear, custom website."},
  {icon:Smartphone,title:"Made for the small screen",text:"Readable pages, comfortable buttons and useful navigation on phones and desktops."},
  {icon:MessagesSquare,title:"A clear way to enquire",text:"Contact forms, WhatsApp or booking links chosen around how your business works."},
  {icon:Search,title:"Solid technical foundations",text:"Page titles, search-friendly structure and performance-conscious development."},
];

export default function BusinessWebsites(){
 const {businessPrice,available}=usePackagePricing();
 const inquiry={projectType:"Business Website",packageName:"Business"};
 return <div className="studio-home business-service min-h-screen bg-background text-foreground">
  <JsonLd data={{"@context":"https://schema.org","@type":"Service",name:"Business website design and development",serviceType:"Custom business website design",url:"https://sitenova.dev/services/business-websites",provider:{"@type":"Organization",name:"SiteNova",url:"https://sitenova.dev"},description:"Custom business websites with responsive design, enquiry pathways and technical SEO foundations. Final scope, price and schedule are agreed in a proposal."}}/>
  <a href="#main-content" className="studio-skip-link sr-only focus:not-sr-only">Skip to main content</a><Navbar/>
  <main id="main-content">
   <section className="studio-container business-service-hero" aria-labelledby="business-service-title">
    <div><Link to="/services" className="studio-text-link text-sm">← All services</Link><p className="studio-eyebrow mt-8">Custom business websites</p>
     <h1 id="business-service-title">A proper home<br/>for your <em>business.</em></h1>
     <p className="business-service-intro">Help people understand what you do, trust your business and take the next step. A considered website, built around your customers.</p>
     <div className="business-service-actions"><Link to="/quote" state={inquiry} className="studio-button">Discuss your website <ArrowUpRight size={18} aria-hidden="true"/></Link><a href="#business-work" className="studio-text-link">See client work <ArrowUpRight size={16} aria-hidden="true"/></a></div>
     <p className="mt-6 text-sm text-muted-foreground">{available?`Business websites from ${businessPrice}. `:"Get a quote tailored to your business. "}Scope, final price and schedule agreed before work begins.</p>
     <div className="business-service-reassurance"><span><Check size={14} aria-hidden="true"/>Custom design</span><span><Check size={14} aria-hidden="true"/>Direct developer contact</span></div>
    </div>
    <Link to="/portfolio/dr-dipti-ganatra" className="business-service-preview" aria-label="View the Dr. Dipti Ganatra website case study"><div className="business-service-browser" aria-hidden="true"><span>● ● ●</span><span>drdiptiganatra.com</span><ArrowUpRight size={14}/></div><img src={clinicImage} width={1920} height={962} alt="Dr. Dipti Ganatra clinic website designed by SiteNova" fetchPriority="high"/><div className="business-service-caption"><div><strong>Dr. Dipti Ganatra</strong><p>Clinic information and consultation enquiries</p></div><ArrowUpRight size={20} aria-hidden="true"/></div></Link>
   </section>
   <section className="studio-container business-service-section" aria-labelledby="business-inclusions"><div className="business-service-section-head"><h2 id="business-inclusions">More than a good first impression.</h2><p>A focused website that makes your offer easy to understand and your business easy to contact.</p></div><div className="business-service-capabilities">{capabilities.map(item=><article key={item.title}><item.icon size={23} strokeWidth={1.5} aria-hidden="true"/><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
   <section id="business-work" className="studio-container business-service-section" aria-labelledby="business-work-title"><div className="business-service-section-head"><h2 id="business-work-title">Built for real businesses.</h2><Link to="/portfolio" className="studio-text-link">All projects <ArrowUpRight size={16} aria-hidden="true"/></Link></div><div className="business-service-work">
    <Link to="/portfolio/dr-dipti-ganatra"><img src={clinicImage} width={1920} height={962} loading="lazy" alt="Dr. Dipti Ganatra website preview"/><div><h3>Dr. Dipti Ganatra</h3><p>Healthcare · A clear path to consultation enquiries</p><span className="studio-text-link">Read case study <ArrowUpRight size={15}/></span></div></Link>
    <Link to="/portfolio/jupiter-fast-finance"><img src={financeImage} width={1920} height={961} loading="lazy" alt="Jupiter Fast Finance website preview"/><div><h3>Jupiter Fast Finance</h3><p>Finance · Service information and contact pathways</p><span className="studio-text-link">Read case study <ArrowUpRight size={15}/></span></div></Link>
   </div></section>
   <section className="studio-container business-service-section"><div className="business-service-next"><div><p className="studio-eyebrow">A clear starting point</p><h2>Your next website starts<br/>with a conversation.</h2><p>The Business package is a starting point for a multi-page site. We’ll discuss your pages, content, integrations and timeline, then send a proposal before requesting an advance.</p><Link to="/our-process" className="studio-text-link">How we work <ArrowUpRight size={16}/></Link></div><div className="business-service-start"><p className="text-sm text-muted-foreground">Business website</p><strong>{available?`From ${businessPrice}`:"Quote on request"}</strong><Link to="/quote" state={inquiry} className="studio-button">Discuss your website <ArrowUpRight size={18}/></Link><Link to="/pricing" className="studio-text-link">Compare scope & payment options <ArrowUpRight size={15}/></Link><p className="text-xs text-muted-foreground">Domain, hosting, content and third-party services depend on the agreed proposal.</p></div></div><p className="business-service-audit">Already have a website? <Link to="/free-audit">Start with a free website audit <ArrowUpRight size={14} aria-hidden="true"/></Link></p></section>
  </main><Footer/>
 </div>;
}
