import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import "./studio-sections.css";

const steps = [
  { number: "01", title: "A conversation first.", description: "Tell us about your business, audience, and what you need your website to do. We agree the scope, price, and timeline before work begins.", deliverable: "A clear brief & proposal" },
  { number: "02", title: "Make it feel like you.", description: "We design and build around your brand, with room for feedback along the way. Your content, customer journey, and mobile experience shape the result.", deliverable: "Your custom website, reviewed together" },
  { number: "03", title: "Ready for the real world.", description: "We check the key pages and interactions, launch your website, and walk you through the handover. Ongoing support is available when you need it.", deliverable: "Launch, handover & next steps" },
];

export default function HowItWorksSection() {
  return <section id="how-it-works" className="sn-section sn-process" aria-labelledby="how-it-works-title"><div className="sn-container sn-process-layout"><div className="sn-process-heading"><p className="sn-kicker">A straightforward process</p><h2 id="how-it-works-title">From “what if”<br />to live.</h2><p>You run your business.<br />We’ll make the web part clear.</p><Link to="/our-process" className="sn-text-link">Explore our process<ArrowUpRight size={18} aria-hidden="true" /></Link></div><div className="sn-process-steps">{steps.map((step) => <article key={step.number} className="sn-process-step"><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p><small>{step.deliverable}</small></div></article>)}</div></div></section>;
}
