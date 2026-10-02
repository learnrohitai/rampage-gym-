"use client";

import { motion } from "framer-motion";
import { Award, Medal, Trophy, type LucideIcon } from "lucide-react";
import { PRIZES } from "@/lib/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  trophy: Trophy,
  medal: Medal,
  award: Award,
};

export default function Prizes() {
  return (
    <section id="prizes" className="relative py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            GLORY AWAITS
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide sm:text-5xl">
            PRIZE <span className="text-gradient-gold">POOL</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Cash, trophies and supplement hampers for the top athletes of Mr.
            India 2026.
          </p>
        </div>

        <div className="mt-14 grid items-end gap-6 md:grid-cols-3">
          {PRIZES.map((p, i) => {
            const Icon = ICONS[p.icon] ?? Trophy;
            return (
              <motion.div
                key={p.place}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.15 }}
                className={cn(
                  "relative overflow-hidden rounded-2xl border bg-card p-8 text-center",
                  i === 0
                    ? "border-gold/50 shadow-[0_0_60px_-15px_rgba(245,185,66,0.4)] md:order-2 md:-translate-y-4"
                    : "border-white/10",
                  i === 1 && "md:order-1",
                  i === 2 && "md:order-3"
                )}
              >
                <div
                  className={cn(
                    "mx-auto mb-5 grid size-20 place-items-center rounded-full bg-gradient-to-br",
                    p.accent,
                    "text-black shadow-lg"
                  )}
                >
                  <Icon className="size-10" strokeWidth={2.2} />
                </div>
                <p className="font-display text-5xl font-black text-gradient-gold">
                  {p.place}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold tracking-widest">
                  {p.title.toUpperCase()}
                </h3>
                <p className="mt-3 text-sm font-medium text-gold/90">{p.reward}</p>
                {i === 0 && (
                  <span className="absolute right-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-black tracking-widest text-black">
                    GRAND PRIZE
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          + Special awards: <span className="text-gold">Best Posing</span>,{" "}
          <span className="text-gold">Most Improved</span>, and{" "}
          <span className="text-gold">People&apos;s Choice</span>.
        </p>
      </div>
    </section>
  );
}
