"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Dumbbell, Shield, Sparkles } from "lucide-react";
import BorderBeam from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  shield: Shield,
  sparkles: Sparkles,
};

export default function Categories() {
  return (
    <section id="categories" className="relative py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            CHOOSE YOUR BATTLE
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide sm:text-5xl">
            COMPETITION <span className="text-gradient-gold">CATEGORIES</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three divisions. Every level of athlete. Pick the one that fits
            your physique — the form adapts to your choice.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {CATEGORIES.map((cat, i) => {
            const Icon = ICONS[cat.icon] ?? Dumbbell;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card p-8 transition-all duration-300 hover:-translate-y-2 hover:border-gold/40 hover:shadow-[0_20px_60px_-15px_rgba(245,185,66,0.25)]"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cat.color}`}
                />
                <div className="relative mb-6 grid size-14 place-items-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 ring-1 ring-white/10">
                  <Icon className="size-7 text-gold" />
                </div>
                <h3 className="font-display text-2xl font-bold tracking-wide">
                  {cat.name}
                </h3>
                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gold/80">
                  {cat.short}
                </p>
                <p className="mt-4 min-h-[72px] text-sm leading-relaxed text-muted-foreground">
                  {cat.desc}
                </p>
                <Button asChild variant="gold" className="mt-6 w-full group/btn">
                  <Link href={`/register?category=${cat.id}`}>
                    Register {cat.name}
                    <ArrowRight className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Weight class chips */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-2"
        >
          {[
            "Below 60", "60-65", "65-70", "70-75", "75-80", "80-85", "Above 85",
          ].map((w) => (
            <span
              key={w}
              className="rounded-full border border-gold/25 bg-gold/5 px-4 py-1.5 text-xs font-bold tracking-wider text-gold"
            >
              {w} KG
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
