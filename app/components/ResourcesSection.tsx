import { ArrowUpRight, BookOpen, Wrench } from "lucide-react";
import "./studio-sections.css";

const articles = [
  { title: "Your AI Strategy Needs an Implementation Team, Not More Tools", href: "https://ai-insights.sitenova.dev/blog/ai-implementation-team-strategy" },
  { title: "OpenAI Dots: How to Set Approval Rules for an Always-On Agent", href: "https://ai-insights.sitenova.dev/blog/openai-dots-approval-rules-checklist" },
  { title: "Gemini Skills vs Gems: How to Migrate Before Gems Go Away", href: "https://ai-insights.sitenova.dev/blog/gemini-skills-vs-gems-migration-guide" },
];
const tools = [
  { title: "QR Code Generator", href: "https://tools.sitenova.dev/category/productivity/qr-code" },
  { title: "Merge PDF", href: "https://tools.sitenova.dev/category/pdf/merge-pdf" },
  { title: "Split PDF", href: "https://tools.sitenova.dev/category/pdf/split-pdf" },
];

export default function ResourcesSection() {
  return <section id="resources" aria-labelledby="resources-title" className="sn-section sn-resources"><div className="sn-container">
    <div className="sn-section-head"><div><p className="sn-kicker">Made by SiteNova</p><h2 id="resources-title">Useful beyond<br />the website.</h2></div><p className="sn-section-intro">Explore our independent resources for practical AI reading and everyday tools. Built with the same care we bring to client work.</p></div>
    <div className="sn-resource-grid">
      <article className="sn-resource" aria-labelledby="ai-insights-title"><div className="sn-resource-top"><h3 id="ai-insights-title">AI Insights</h3><BookOpen size={25} strokeWidth={1.4} aria-hidden="true" /></div><p>Ideas and practical reading on AI, automation, and thoughtful adoption at work.</p><ul>{articles.map((article) => <li key={article.href}><a href={article.href}>{article.title}<ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul><a href="https://ai-insights.sitenova.dev" className="sn-text-link">Explore AI Insights<ArrowUpRight size={17} aria-hidden="true" /></a></article>
      <article className="sn-resource" aria-labelledby="toolbox-title"><div className="sn-resource-top"><h3 id="toolbox-title">Toolbox by SiteNova</h3><Wrench size={25} strokeWidth={1.4} aria-hidden="true" /></div><p>Free calculators and browser tools that help you get the small things done.</p><ul>{tools.map((tool) => <li key={tool.href}><a href={tool.href}>{tool.title}<ArrowUpRight size={15} aria-hidden="true" /></a></li>)}</ul><a href="https://tools.sitenova.dev" className="sn-text-link">Browse free tools<ArrowUpRight size={17} aria-hidden="true" /></a></article>
    </div>
  </div></section>;
}
