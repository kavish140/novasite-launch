import { m as motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    question: "What is SiteNova?",
    answer: "SiteNova is a professional web design and development agency based in Mulund, Mumbai. We specialize in building fast, SEO-ready, and mobile-first websites for local businesses in Mumbai and surrounding areas like Thane, Powai, and Ghatkopar.",
  },
  {
    question: "How much does it cost to build a website in Mumbai?",
    answer: "At SiteNova, professional website design services start from Rs. 5,000 for a standard business website. The total cost depends on the complexity, features, and specific business requirements, such as e-commerce capabilities or custom web applications.",
  },
  {
    question: "Why do I need a mobile-first website design?",
    answer: "Over 70% of local searches in Mumbai happen on mobile devices. A mobile-first website ensures that your site loads quickly and displays perfectly on smartphones, which significantly improves user experience and helps your business rank higher on Google Search and AI Overviews.",
  },
  {
    question: "Does SiteNova provide SEO services?",
    answer: "Yes, every website built by SiteNova includes core Search Engine Optimization (SEO). We optimize your site structure, meta tags, schema markup, and performance to help you rank for local keywords like 'best website designer in Mulund' and attract local customers.",
  },
  {
    question: "How long does it take to design a website?",
    answer: "A standard business website typically takes 7 to 14 days to design and launch. More complex projects with custom features or extensive pages may take a few weeks. We prioritize lightning-fast delivery without compromising on quality.",
  }
];

const FaqSection = () => {
  return (
    <section id="faq" className="section-padding relative">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Frequently Asked Questions
          </span>
          <h2 className="font-heading text-3xl md:text-5xl font-bold mt-3 mb-5">
            Common questions about <span className="gradient-text">SiteNova</span>
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground text-lg">
            Everything you need to know about our web design services, pricing, and process.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-card px-6 border-none rounded-xl"
              >
                <AccordionTrigger className="text-left font-heading text-lg hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FaqSection;
