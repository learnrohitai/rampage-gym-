"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";
import Marquee from "@/components/magicui/marquee";
import { AnimatedShinyText } from "@/components/magicui/shiny-text";
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
          <AnimatedShinyText className="text-sm font-semibold">
            Registrations Open — {SITE.registrationDeadline}
          </AnimatedShinyText>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-6xl font-black leading-[0.95] tracking-wide sm:text-7xl md:text-8xl lg:text-9xl"
        >
          <span className="text-gradient-gold">MR. INDIA</span>
          <br />
          <span className="text-foreground/90">2026</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg"
        >
          {SITE.gym.name} presents the ultimate bodybuilding championship —
          {" "}<span className="text-gold font-semibold">3 divisions</span>,
          {" "}<span className="text-gold font-semibold">7 weight classes</span>,
          one iron crown. Bring your best physique to the stage.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button asChild variant="gold" size="lg" className="group">
            <Link href="/register">
              Claim Your Spot
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/#categories">View Categories</Link>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
        >
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="size-4 text-gold" /> {SITE.eventDate}
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin className="size-4 text-gold" /> {SITE.venue}, {SITE.city}
          </span>
          <span className="inline-flex items-center gap-2">
            <Users className="size-4 text-gold" /> Limited entries per class
          </span>
        </motion.div>

        {/* Scrolling ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mask-fade-x mt-14 w-full max-w-4xl"
        >
          <Marquee pauseOnHover className="py-1 [--duration:22s]">
            {[
              "BODYBUILDING • 7 WEIGHT CLASSES",
              "MASTERS 35+ • SINGLE DIVISION",
              "MEN'S PHYSIQUE • 2 HEIGHT CLASSES",
              "₹1,00,000+ PRIZE POOL",
              "LIVE DJ • PRO STAGE LIGHTS",
              "CERTIFIED JUDGES",
            ].map((t) => (
              <span
                key={t}
                className="mx-4 font-display text-lg tracking-widest text-gold/80"
              >
                {t}
              </span>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}
