"use client";

import { Dumbbell } from "lucide-react";
import { SPONSORS } from "@/lib/site";

export default function Sponsors() {
  return (
    <section id="sponsors" className="relative overflow-hidden py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            POWERED BY THE BEST
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide sm:text-5xl">
            OUR <span className="text-gradient-gold">SPONSORS</span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {SPONSORS.map((s) => (
            <div
              key={s}
              className="flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-card px-4 py-4 text-center transition-colors hover:border-gold/40"
            >
              <Dumbbell className="size-5 shrink-0 text-gold" />
              <span className="font-display text-base font-bold tracking-widest text-foreground/85">
                {s.toUpperCase()}
              </span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Want to sponsor Ricela Mr. India?{" "}
          <a href="mailto:info@rampagegym.in" className="font-semibold text-gold hover:underline">
            Get in touch →
          </a>
        </p>
      </div>
    </section>
  );
}