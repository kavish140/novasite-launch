import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import "./studio-sections.css";

const guides = [
  ["2026-mumbai-website-performance-report", "Mumbai business website performance report", "Read the published audit methodology, findings and performance recommendations."],
  ["zero-click-searches-mumbai-local-businesses", "Zero-click searches and local discovery", "How business profiles and useful website pages support different customer decisions."],
  ["mumbai-b2b-manufacturers-website-indiamart", "A manufacturer's website beyond IndiaMART", "Product specifications, buyer qualification and catalog decisions for B2B teams."],
  ["website-redesign-seo-checklist-mumbai", "Search checks for a website redesign", "Plan URL mapping, redirects and post-launch monitoring before changing your site."],
];

export default function LatestGuidesSection() {
  return <section className="sn-section sn-guides" aria-labelledby="latest-guides"><div className="sn-container">
    <div className="sn-section-head"><div><p className="sn-kicker">Notes from the studio</p><h2 id="latest-guides">A little insight.<br />A better decision.</h2></div><Link to="/blog" className="sn-text-link">All research &amp; guides<ArrowUpRight size={17} aria-hidden="true" /></Link></div>
    <div className="sn-guide-list">{guides.map(([slug, title, description], index) => <Link key={slug} to={`/blog/${slug}`} className="sn-guide"><span aria-hidden="true">0{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div><ArrowUpRight size={20} aria-hidden="true" /></Link>)}</div>
  </div></section>;
}
