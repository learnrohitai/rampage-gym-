"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

type Remaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET = new Date(SITE.registrationOpensISO).getTime();

function diff(target: number): Remaining {
  const total = Math.max(0, target - Date.now());
  return {
    days: Math.floor(total / 86_400_000),
    hours: Math.floor((total / 3_600_000) % 24),
    minutes: Math.floor((total / 60_000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

export default function Countdown() {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const tick = () => setRemaining(diff(TARGET));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const units = remaining
    ? [
        { label: "DAYS", value: remaining.days },
        { label: "HOURS", value: remaining.hours },
        { label: "MINUTES", value: remaining.minutes },
        { label: "SECONDS", value: remaining.seconds },
      ]
    : [
        { label: "DAYS", value: null },
        { label: "HOURS", value: null },
        { label: "MINUTES", value: null },
        { label: "SECONDS", value: null },
      ];

  const done = remaining !== null && TARGET - Date.now() <= 0;

  return (
    <div className="w-full">
      <p className="flex items-center justify-center gap-2 font-display text-sm tracking-[0.4em] text-gold">
        <Flame className="size-4" />
        {done ? "REGISTRATIONS ARE OPEN" : "REGISTRATION OPENS IN"}
      </p>

      <div className="mx-auto mt-4 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
        {units.map((u) => (
          <div
            key={u.label}
            className="relative overflow-hidden rounded-2xl border border-gold/30 bg-card/80 px-2 py-5 text-center backdrop-blur"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="block font-display text-4xl font-black tabular-nums text-gradient-gold sm:text-5xl">
              {u.value === null ? "—" : String(u.value).padStart(2, "0")}
            </span>
            <span className="mt-1 block text-[10px] font-bold tracking-[0.3em] text-muted-foreground">
              {u.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {SITE.registrationOpens} • {SITE.eventName}
      </p>

      {done && (
        <div className="mt-6 flex justify-center">
          <Button asChild variant="gold" size="lg" className="animate-pulse-glow">
            <Link href="/register">
              Register Now <ArrowRight />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}