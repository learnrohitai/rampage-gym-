"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export default function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > 620;
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 160;
      setVisible(pastHero && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-background/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <div className="container flex items-center justify-between gap-3 py-3">
        <div className="leading-tight">
          <p className="font-display text-sm font-bold tracking-wide text-gold">
            {SITE.eventName}
          </p>
          <p className="text-[11px] font-semibold text-muted-foreground">
            ₹{SITE.entryFee.toLocaleString("en-IN")} • Closes{" "}
            {SITE.registrationDeadline}
          </p>
        </div>
        <Button
          asChild
          variant="gold"
          className="shrink-0 font-black uppercase tracking-wider"
        >
          <Link href="/register">
            Register <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}
