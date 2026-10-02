"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, Home, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { StepCategory, StepPayment } from "@/components/register/steps";
import RegistrationForm from "@/components/register/form";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

function RegisterInner() {
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState("");
  const [regId, setRegId] = useState<string | null>(null);

  // Pre-select category from ?category= query param
  useEffect(() => {
    const c = params.get("category");
    if (c) setCategory(c);
  }, [params]);

  const [copied, setCopied] = useState(false);
  const copyId = async () => {
    if (!regId) return;
    await navigator.clipboard.writeText(regId);
    setCopied(true);
    toast.success("Registration ID copied");
    setTimeout(() => setCopied(false), 2000);
  };

  if (regId) {
    return (
      <div className="container flex min-h-[70vh] max-w-lg flex-col items-center justify-center py-20 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <PartyPopper className="size-16 text-gold" />
        </motion.div>
        <h1 className="mt-6 font-display text-4xl font-black tracking-wide">
          YOU&apos;RE <span className="text-gradient-gold">IN!</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Your registration is submitted. The Rampage Gym team will verify your
          payment and confirm your slot — usually within 24 hours.
        </p>

        <button
          onClick={copyId}
          className="group mt-6 flex items-center gap-3 rounded-xl border border-gold/40 bg-gold/10 px-6 py-4 transition-colors hover:bg-gold/15"
        >
          <span className="text-left">
            <span className="block text-xs text-muted-foreground">Your Registration ID</span>
            <span className="block font-display text-2xl font-black tracking-widest text-gold">
              {regId}
            </span>
          </span>
          <Copy className="size-4 text-muted-foreground group-hover:text-gold" />
        </button>

        <div className="mt-8 flex gap-3">
          <Button asChild variant="outline">
            <Link href="/"><Home /> Back Home</Link>
          </Button>
          <Button variant="gold" onClick={() => { setRegId(null); setStep(1); setCategory(""); }}>
            Register Another Category
          </Button>
          <Button asChild variant="outline">
            <Link href={`/?status=${regId}#faq`}>Check Status</Link>
          </Button>
        </div>
        <p className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <CheckCircle2 className="size-4 text-emerald-400" />
          Save your Registration ID — you&apos;ll need it at check-in.
        </p>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-14">
      {/* Stepper header */}
      <div className="mb-12">
        <h1 className="text-center font-display text-5xl font-black tracking-wide">
          ATHLETE <span className="text-gradient-gold">REGISTRATION</span>
        </h1>
        <div className="mx-auto mt-8 flex max-w-xl items-center">
          {[
            { n: 1, label: "Category" },
            { n: 2, label: "Payment" },
            { n: 3, label: "Details" },
          ].map((s, i) => (
            <div key={s.n} className={`flex items-center ${i < 2 ? "flex-1" : ""}`}>
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`grid size-10 place-items-center rounded-full border-2 font-display text-lg font-bold transition-all ${
                    step > s.n
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-400"
                      : step === s.n
                        ? "border-gold bg-gold/15 text-gold shadow-[0_0_18px_rgba(245,185,66,0.4)]"
                        : "border-white/15 text-muted-foreground"
                  }`}
                >
                  {step > s.n ? "✓" : s.n}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    step >= s.n ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`mx-2 mb-6 h-0.5 flex-1 rounded transition-all duration-500 sm:mx-4 ${
                    step > s.n ? "bg-emerald-400/70" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <StepCategory
            key="s1"
            value={category}
            onSelect={setCategory}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepPayment key="s2" onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <RegistrationForm
            key="s3"
            category={category}
            onCategoryChange={setCategory}
            onSuccess={(id) => setRegId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="container py-24 text-center text-muted-foreground">Loading…</div>}>
      <RegisterInner />
    </Suspense>
  );
}
