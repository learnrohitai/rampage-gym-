"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Trophy, Users } from "lucide-react";
import Countdown from "@/components/landing/countdown";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export default function Hero() {
  return (
    <section className="noise relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden">
      {/* Glowing background orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-0 size-[400px] rounded-full bg-red-600/10 blur-[100px]" />

      {/* Giant background text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 select-none text-center font-display text-[26vw] font-black leading-none text-stroke-gold opacity-[0.06] md:text-[18vw]"
      >
        RICELA
        <br />
        MR.INDIA
      </div>

      <div className="container relative z-10 flex flex-col items-center py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-gold" />
          </span>
          <span className="text-sm font-semibold text-gold">
            Registration Opens {SITE.registrationOpens} — Closes {SITE.registrationDeadline}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-7xl font-black leading-[0.92] tracking-wide drop-shadow-[0_4px_30px_rgba(245,185,66,0.25)] sm:text-8xl md:text-9xl lg:text-[8rem]"
        >
          <span className="text-gradient-gold drop-shadow-[0_0_40px_rgba(245,185,66,0.35)]">
            RICELA
            <br />
            MR. INDIA
          </span>
          <br />
          <span className="text-foreground">2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 max-w-2xl text-base font-medium text-muted-foreground sm:text-lg"
        >
          {SITE.gym.name} presents the ultimate bodybuilding championship —
          {" "}<span className="font-bold text-gold">3 divisions</span>,
          {" "}<span className="font-bold text-gold">7 weight classes</span>,
          one iron crown. Bring your best physique to the stage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild variant="gold" size="lg" className="group h-14 px-10 text-lg font-black uppercase tracking-widest">
            <Link href="/register">
              Claim Your Spot
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-14 px-8 font-bold uppercase tracking-widest">
            <Link href="/#categories">View Categories</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2 font-semibold">
            <CalendarDays className="size-4 text-gold" /> {SITE.eventDate}
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <MapPin className="size-4 text-gold" /> {SITE.venue}, {SITE.city}
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <Users className="size-4" /> Limited entries per class
          </span>
          <span className="inline-flex items-center gap-2 font-semibold">
            <Trophy className="size-4 text-gold" /> ₹1,00,000+ prize pool
          </span>
        </motion.div>

        {/* Registration countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-14 w-full max-w-4xl"
        >
          <Countdown />
        </motion.div>
      </div>
    </section>
  );
}