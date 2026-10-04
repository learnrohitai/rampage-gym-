"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { ShineBorder } from "@/components/magicui/shiny-text";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export default function Cta() {
  return (
    <section className="relative py-24">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="noise relative mx-auto max-w-4xl overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-b from-card to-black p-12 text-center"
        >
          <Image
            src="/images/athlete-1.jpeg"
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/75 to-black/90" />
          <ShineBorder />
          <div className="pointer-events-none absolute -top-24 left-1/2 size-[400px] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[90px]" />

          <h2 className="relative font-display text-4xl font-black tracking-wide sm:text-6xl">
            THE STAGE IS <span className="text-gradient-fire">WAITING</span>
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">
            {SITE.entryFee > 0 &&
              `Entry fee ₹${SITE.entryFee.toLocaleString("en-IN")} per category. `}
            Limited slots per weight class — once full, registration closes.
          </p>
          <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild variant="gold" size="lg" className="animate-pulse-glow">
              <Link href="/register">
                Register Now <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/#rules">Read The Rules</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
