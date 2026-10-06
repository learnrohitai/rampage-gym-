"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

const PHOTOS = [
  { src: "/images/athlete-1.jpeg", label: "STRENGTH" },
  { src: "/images/athlete-2.jpeg", label: "SYMMETRY" },
  { src: "/images/athlete-3.jpeg", label: "CONDITIONING" },
  { src: "/images/athlete-4.jpeg", label: "GLORY" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden py-24">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/5 blur-[100px]" />
      <div className="container relative">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            THE CONTENDERS
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide sm:text-5xl">
            GALLERY
          </h2>
          <p className="mt-4 text-muted-foreground">
            Year-round grind, one stage. This is what {SITE.eventName} looks
            like before the lights go on.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {PHOTOS.map((p, i) => (
            <motion.div
              key={p.src}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-white/10 bg-card transition-colors duration-300 hover:border-gold/40 hover:shadow-[0_20px_60px_-15px_rgba(245,185,66,0.25)]",
                i % 2 === 1 && "md:mt-10"
              )}
            >
              <div className="relative aspect-[3/4] w-full">
                <Image
                  src={p.src}
                  alt={`${SITE.eventName} — ${p.label.toLowerCase()}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-gold/40 transition-opacity duration-300 group-hover:opacity-100" />
                <span className="absolute bottom-3 left-3 font-display text-[11px] font-bold tracking-[0.3em] text-gold">
                  0{i + 1} — {p.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
