import { ArrowUpRight, MapPin } from "lucide-react";
import { WHATSAPP_URL } from "@/lib/constants";
import "./studio-sections.css";

const pillars = [
  { title: "A direct line to your developer", description: "Work with Kavish, the person designing and building your website. Discuss decisions directly, from the first brief to handover." },
  { title: "Based in Mulund. Building for you.", description: "A Mumbai studio working with businesses across the city, and remotely with clients beyond it." },
  { title: "A conversation in your language", description: "English, Hindi, Marathi, Gujarati, or Kutchi. Discuss your business in the way you feel most comfortable." },
  { title: "Clarity before commitment", description: "Your scope, fixed project price, and schedule are agreed before work begins. Know what you’re getting and what happens next." },
];

export default function LocalAgencySection() {
  return <section className="sn-section sn-local" aria-labelledby="local-agency-title"><div className="sn-container sn-local-layout"><div className="sn-local-heading"><p className="sn-kicker"><MapPin size={14} aria-hidden="true" />Mulund, Mumbai</p><h2 id="local-agency-title">Small studio.<br />Personal attention.</h2><p>A good website starts with understanding the people behind the business. You’ll work directly with the person bringing yours to life.</p><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" id="local-agency-whatsapp-cta" className="sn-text-link">Say hello to Kavish<ArrowUpRight size={18} aria-hidden="true" /></a></div><div className="sn-local-pillars">{pillars.map((pillar, index) => <article key={pillar.title}><span aria-hidden="true">0{index + 1}</span><h3>{pillar.title}</h3><p>{pillar.description}</p></article>)}</div></div></section>;
}
