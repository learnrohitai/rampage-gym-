"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Copy, Dumbbell, Landmark, Shield, Smartphone, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BorderBeam from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/categories";
import { SITE, upiPayUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dumbbell: Dumbbell,
  shield: Shield,
  sparkles: Sparkles,
};

/* ---------- STEP 1: CATEGORY ---------- */
export function StepCategory({
  value,
  onSelect,
  onNext,
}: {
  value: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="font-display text-4xl font-black tracking-wide sm:text-5xl">
        STEP 1 — <span className="text-gradient-gold">CHOOSE CATEGORY</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        The registration form adapts to the category you pick.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {CATEGORIES.map((cat) => {
          const Icon = ICONS[cat.icon] ?? Dumbbell;
          const active = value === cat.id;
          return (
            <button
              type="button"
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                "group relative overflow-hidden rounded-2xl border p-6 text-left transition-all duration-300",
                active
                  ? "border-gold/70 bg-gold/10 shadow-[0_0_40px_-10px_rgba(245,185,66,0.4)]"
                  : "border-white/10 bg-card hover:border-gold/30"
              )}
            >
              <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cat.color}`} />
              <Icon className={cn("size-8", active ? "text-gold" : "text-muted-foreground")} />
              <h3 className="mt-4 font-display text-xl font-bold tracking-wide">{cat.name}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gold/80">
                {cat.short}
              </p>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{cat.desc}</p>
              {active && (
                <span className="absolute right-4 top-4 grid size-6 place-items-center rounded-full bg-gold text-black">
                  <Check className="size-4" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button variant="gold" size="lg" disabled={!value} onClick={onNext}>
          Continue to Payment <ArrowRight />
        </Button>
      </div>
    </motion.div>
  );
}

/* ---------- STEP 2: PAYMENT (QR) ---------- */
export function StepPayment({ onNext }: { onNext: () => void }) {
  const [copied, setCopied] = useState(false);

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(SITE.upiId);
      setCopied(true);
      toast.success("UPI ID copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy — please note it down");
    }
  };

  const payNow = () => {
    window.location.href = upiPayUrl();
    toast.info("Opening your UPI app… If nothing opens, scan the QR instead.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="font-display text-4xl font-black tracking-wide sm:text-5xl">
        STEP 2 — <span className="text-gradient-gold">PAY ENTRY FEE</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Tap <span className="font-semibold text-gold">Pay Now</span> to open your
        UPI app directly, or scan the QR with GPay / PhonePe / Paytm — then
        continue to the form and submit your payment reference number.
      </p>

      <div className="mt-8 grid items-start gap-8 md:grid-cols-2">
        {/* QR card */}
        <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-gold/30 bg-card p-8 text-center">
          <BorderBeam size={70} duration={7} />
          <p className="font-display text-lg font-bold tracking-widest text-gold">
            ENTRY FEE
          </p>
          <p className="font-display text-5xl font-black text-gradient-gold">
            ₹{SITE.entryFee.toLocaleString("en-IN")}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            per category entry • non-refundable
          </p>

          <div className="relative mx-auto mt-6 size-52 overflow-hidden rounded-xl border border-white/10 bg-white p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={SITE.qrImage}
              alt="Payment QR code"
              className="size-full object-contain"
            />
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Scan with any UPI app
          </p>
        </div>

        {/* UPI details */}
        <div className="space-y-4">
          {/* One-tap pay button */}
          <Button
            variant="gold"
            size="lg"
            className="w-full"
            onClick={payNow}
          >
            <Smartphone /> Pay ₹{SITE.entryFee.toLocaleString("en-IN")} Now
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            Opens GPay / PhonePe / Paytm directly with amount pre-filled — no
            scanning needed on mobile.
          </p>

          <div className="rounded-xl border border-white/10 bg-card p-5">
            <div className="flex items-center gap-2 text-gold">
              <Landmark className="size-5" />
              <span className="font-display text-lg font-bold tracking-widest">
                UPI DETAILS
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">Payee</p>
                  <p className="font-semibold">{SITE.payeeName}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg bg-white/5 px-4 py-3">
                <div>
                  <p className="text-xs text-muted-foreground">UPI ID</p>
                  <p className="font-mono font-semibold">{SITE.upiId}</p>
                </div>
                <Button size="sm" variant="outline" onClick={copyUpi}>
                  {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy"}
                </Button>
              </div>
            </div>
          </div>

          <ol className="space-y-2 text-sm text-muted-foreground">
            {[
              "Tap Pay Now (opens your UPI app) or scan the QR",
              `Pay exactly ₹${SITE.entryFee} for this category`,
              "Take a screenshot of the payment success screen",
              "Continue to the form — upload screenshot (add UTR if you have it)",
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-gold/15 text-[11px] font-bold text-gold">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>

          <div className="flex justify-end pt-2">
            <Button variant="gold" size="lg" onClick={onNext}>
              I Have Paid — Continue <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
