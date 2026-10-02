"use client";

import { motion } from "framer-motion";
import { ScrollText } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, RULES } from "@/lib/site";

export default function FaqRules() {
  return (
    <section id="faq" className="relative py-24">
      <div className="container grid gap-14 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            GOOD TO KNOW
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide">
            FREQUENTLY ASKED <span className="text-gradient-gold">QUESTIONS</span>
          </h2>

          <Accordion type="single" collapsible className="mt-8">
            {FAQS.map((f, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>

        <motion.div
          id="rules"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            STAGE DISCIPLINE
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide">
            COMPETITION <span className="text-gradient-gold">RULES</span>
          </h2>

          <ul className="mt-8 space-y-3">
            {RULES.map((r, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-lg border border-white/5 bg-card px-4 py-3 text-sm text-muted-foreground"
              >
                <ScrollText className="mt-0.5 size-4 shrink-0 text-gold" />
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
