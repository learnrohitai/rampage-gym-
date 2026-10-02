"use client";

import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";
import { SCHEDULE } from "@/lib/site";

export default function Schedule() {
  return (
    <section id="schedule" className="relative py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-[0.4em] text-gold">
            MARK YOUR CALENDAR
          </p>
          <h2 className="mt-3 font-display text-4xl font-black tracking-wide sm:text-5xl">
            EVENT <span className="text-gradient-gold">SCHEDULE</span>
          </h2>
        </div>

        <div className="relative mx-auto mt-16 max-w-2xl">
          <div className="absolute bottom-0 left-4 top-0 w-px bg-gradient-to-b from-gold/60 via-gold/20 to-transparent sm:left-1/2" />
          {SCHEDULE.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: 0.05 * i }}
              className={`relative mb-10 flex ${
                i % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
              }`}
            >
              <div
                className={`glass relative ml-12 w-full rounded-xl p-5 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                  i % 2 === 0 ? "sm:text-right" : ""
                }`}
              >
                <span
                  className={`absolute -left-[2.05rem] top-5 hidden size-3 rounded-full bg-gold shadow-[0_0_12px_rgba(245,185,66,0.8)] sm:block ${
                    i % 2 === 0 ? "sm:-right-[2.05rem] sm:left-auto" : "sm:-left-[2.05rem]"
                  }`}
                />
                <div className={`flex items-center gap-2 ${i % 2 === 0 ? "sm:justify-end" : ""}`}>
                  <CalendarDays className="size-4 text-gold" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gold">
                    {s.date}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-xl font-bold tracking-wide">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
