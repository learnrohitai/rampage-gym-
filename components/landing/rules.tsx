"use client";

import { motion } from "framer-motion";
import { Scroll } from "lucide-react";
import { RULES } from "@/lib/site";

export default function Rules() {
  return (
    <section id="rules" className="relative py-24">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            COMPETITION STANDARDS
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide sm:text-5xl">
            EVENT <span className="text-gradient-gold">RULES</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Read before you register. By submitting your entry, you agree to
            these rules.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mt-12 grid gap-6 md:grid-cols-2"
        >
          {RULES.map((rule, i) => (
            <div
              key={i}
              className="flex items-start gap-4 rounded-2xl border border-white/10 bg-card p-5"
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-gold/10 text-gold font-display text-sm font-bold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {rule}
              </p>
            </div>
          ))}
        </motion.div>

        <div className="mt-10 rounded-2xl border border-gold/20 bg-gold/5 p-6">
          <div className="flex items-start gap-3">
            <Scroll className="size-5 text-gold" />
            <p className="text-sm leading-relaxed text-muted-foreground">
              These rules are also included in the filled registration form PDF
              you can download after registering.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
