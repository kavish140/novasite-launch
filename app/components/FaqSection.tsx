import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faqs } from "@/lib/faq-data";
import "./studio-sections.css";

export default function FaqSection() {
  return <section id="faq" className="sn-section sn-faq" itemScope itemType="https://schema.org/FAQPage" aria-labelledby="sn-faq-title"><div className="sn-container sn-faq-layout"><div className="sn-faq-heading"><p className="sn-kicker">Before we get started</p><h2 id="sn-faq-title">Good questions.<br />Straight answers.</h2><p>Pricing, process, support, and the details that help you make a confident decision.</p><Link to="/contact-us" className="sn-text-link">Ask us something else<ArrowUpRight size={18} aria-hidden="true" /></Link></div><Accordion type="single" collapsible className="sn-faq-list">{faqs.map((faq, index) => <AccordionItem key={faq.question} value={`item-${index}`} className="sn-faq-item" itemScope itemType="https://schema.org/Question"><AccordionTrigger className="sn-faq-trigger" itemProp="name"><span className="sn-faq-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span>{faq.question}</span></AccordionTrigger><AccordionContent className="sn-faq-answer" itemScope itemType="https://schema.org/Answer" itemProp="acceptedAnswer"><span itemProp="text">{faq.answer}</span></AccordionContent></AccordionItem>)}</Accordion></div></section>;
}
