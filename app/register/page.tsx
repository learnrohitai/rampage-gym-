"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Copy, Download, Home, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import { StepCategory, StepPayment } from "@/components/register/steps";
import RegistrationForm from "@/components/register/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SITE } from "@/lib/site";

function RegisterInner() {
  const params = useSearchParams();
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [regId, setRegId] = useState<string | null>(null);

  // Pre-select category/categories from ?category= query param
  useEffect(() => {
    const q = params.get("category");
    if (q) {
      const ids = q.split(",").map((s) => s.trim()).filter(Boolean);
      if (ids.length) setCategories(ids);
    }
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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline">
            <Link href="/"><Home /> Back Home</Link>
          </Button>
          <Button variant="gold" onClick={() => { setRegId(null); setStep(1); setCategories([]); }}>
            Register Another Category
          </Button>
          <Button asChild variant="outline">
            <Link href={`/?status=${regId}#faq`}>Check Status</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="#download-form"><Download /> Download My Form</a>
          </Button>
        </div>
        <div id="download-form" className="mt-8 w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-card p-6">
            <h3 className="mb-3 font-display text-lg font-bold tracking-widest text-gold">
              DOWNLOAD YOUR FILLED FORM
            </h3>
            <p className="mb-4 text-xs text-muted-foreground">
              Enter your Registration ID and mobile number to download a structured
              copy of your registration.
            </p>
            <DownloadForm regId={regId} />
          </div>
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
            selected={categories}
            onToggle={(id) => {
              setCategories((prev) => {
                const next = prev.includes(id)
                  ? prev.filter((c) => c !== id)
                  : prev.length < 3
                    ? [...prev, id]
                    : prev;
                return next;
              });
            }}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <StepPayment key="s2" categoryCount={categories.length} onNext={() => setStep(3)} />
        )}
        {step === 3 && (
          <RegistrationForm
            key="s3"
            categories={categories}
            onSuccess={(id) => setRegId(id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DownloadForm({ regId }: { regId: string }) {
  const [phone, setPhone] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!phone.trim()) {
      setError("Please enter your mobile number");
      return;
    }
    setError(null);
    setDownloading(true);
    try {
      const res = await fetch(`/api/register/${regId}/download?phone=${encodeURIComponent(phone)}`);
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Download failed");
      }
      // Trigger download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `my-registration-${regId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Registration ID</label>
          <Input value={regId} disabled className="mt-1 font-mono text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Mobile Number</label>
          <Input
            type="tel"
            inputMode="numeric"
            placeholder="10-digit mobile"
            className="mt-1"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
        </div>
      </div>
      {error && (
        <p className="text-xs font-medium text-red-400">{error}</p>
      )}
      <Button
        variant="gold"
        size="sm"
        className="w-full"
        onClick={handleDownload}
        disabled={downloading || phone.length < 10}
      >
        {downloading ? "Downloading…" : "⬇ Download My Filled Form"}
      </Button>
      <p className="text-[10px] text-muted-foreground">
        Downloads a PDF copy of your filled form with your photo.
      </p>
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
