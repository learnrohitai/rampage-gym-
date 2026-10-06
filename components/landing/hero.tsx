"use client";

import Link from "next/link";
import Image from "next/image";
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
        className="pointer-events-none absolute inset-x-0 top-[42%] select-none text-center font-display text-[26vw] font-black leading-none text-stroke-gold opacity-[0.06] md:text-[18vw]"
      >
        RICELA
        <br />
        MR. INDIA
      </div>

      <div className="container relative z-10 flex flex-col items-center py-20 text-center">
        {/* Flashy hero image banner */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-12 w-full max-w-5xl"
        >
          {/* Spinning fire ring behind the frame */}
          <div className="pointer-events-none absolute -inset-8 -z-10 animate-spin-slow rounded-[4rem] bg-[conic-gradient(from_0deg,transparent_0%,rgba(245,185,66,0.5)_22%,transparent_45%,rgba(220,38,38,0.45)_70%,transparent_100%)] blur-[70px]" />

          {/* Animated gradient border */}
          <div className="relative rounded-[2rem] bg-gradient-to-r from-amber-300 via-red-600 to-amber-300 p-[2px] shadow-[0_30px_90px_-25px_rgba(245,185,66,0.6)]">
            <div className="relative overflow-hidden rounded-[calc(2rem-2px)] border border-white/10 bg-black">
              <Image
                src="/images/athlete-1.jpeg"
                alt={`${SITE.eventName} athlete on stage`}
                width={1600}
                height={900}
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="h-[36vh] w-full object-cover object-center sm:h-[44vh] lg:h-[52vh]"
              />

              {/* Cinematic washes */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-transparent to-red-600/20" />
              <div className="pointer-events-none absolute inset-0 opacity-0 ring-1 ring-inset ring-gold/40 transition-opacity duration-500 hover:opacity-100" />

              {/* Gold shine sweeping across */}
              <motion.div
                aria-hidden
                animate={{ x: ["-150%", "320%"] }}
                transition={{ duration: 3.6, ease: "easeInOut", repeat: Infinity, repeatDelay: 1.6 }}
                className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              />

              {/* Floating caption */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-2 p-5 text-left sm:p-8">
                <span className="animate-pulse-glow font-display text-[11px] font-bold tracking-[0.4em] text-gold sm:text-sm">
                  THE IRON CROWN AWAITS
                </span>
                <span className="font-display text-2xl font-black uppercase leading-none tracking-wide text-white sm:text-4xl lg:text-5xl">
                  Step Under The Lights
                </span>
                <span className="glass rounded-full px-3 py-1 text-xs font-semibold tracking-widest text-foreground/85">
                  {SITE.eventDate} • {SITE.city}
                </span>
              </div>

              {/* Floating badge */}
              <div className="absolute right-4 top-4 animate-float rounded-2xl border border-gold/40 bg-black/60 px-4 py-2 text-center backdrop-blur-md sm:right-6 sm:top-6">
                <span className="block font-display text-2xl font-black leading-none text-gradient-gold sm:text-3xl">
                  2026
                </span>
                <span className="mt-1 block text-[9px] font-bold tracking-[0.3em] text-muted-foreground">
                  EDITION
                </span>
              </div>
            </div>
          </div>
        </motion.div>

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
            <MapPin className="size-4 text-gold" /> MGM Public School, Dugri Phase
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