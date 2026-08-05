import { m as motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs } from "@/lib/faq-data";

const FaqSection = () => {
  return (
    /* FAQPage microdata — second signal path alongside JSON-LD for AI crawlers */
    <section
      id="faq"
      className="section-padding relative"
      itemScope
      itemType="https://schema.org/FAQPage"
    >
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
            Everything you need to know about our web design services, pricing, process, and how we compare to other agencies.
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
                /* Question microdata */
                itemScope
                itemType="https://schema.org/Question"
              >
                <AccordionTrigger
                  className="text-left font-heading text-lg hover:no-underline py-5"
                  itemProp="name"
                >
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent
                  className="text-muted-foreground text-base leading-relaxed pb-5"
                  /* Answer microdata */
                  itemScope
                  itemType="https://schema.org/Answer"
                  itemProp="acceptedAnswer"
                >
                  <span itemProp="text">{faq.answer}</span>
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
