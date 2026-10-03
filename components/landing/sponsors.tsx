"use client";

import { Dumbbell } from "lucide-react";
import Marquee from "@/components/magicui/marquee";
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
      </div>

      <div className="mask-fade-x mt-14 space-y-5">
        <Marquee pauseOnHover className="[--duration:65s]">
          {SPONSORS.map((s) => (
            <div
              key={s}
              className="mx-3 flex items-center gap-3 rounded-xl border border-white/10 bg-card px-7 py-4 transition-colors hover:border-gold/40"
            >
              <Dumbbell className="size-5 text-gold" />
              <span className="font-display text-xl font-bold tracking-widest text-foreground/85">
                {s.toUpperCase()}
              </span>
            </div>
          ))}
        </Marquee>
        <Marquee pauseOnHover reverse className="[--duration:75s]">
          {[...SPONSORS].reverse().map((s) => (
            <div
              key={s}
              className="mx-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-7 py-4 transition-colors hover:border-gold/40"
            >
              <span className="size-2 rounded-full bg-gold/60" />
              <span className="font-display text-lg tracking-widest text-muted-foreground">
                {s.toUpperCase()}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      <p className="mt-10 text-center text-sm text-muted-foreground">
        Want to sponsor Mr. India 2026?{" "}
        <a href="mailto:info@rampagegym.in" className="font-semibold text-gold hover:underline">
          Get in touch →
        </a>
      </p>
    </section>
  );
}
