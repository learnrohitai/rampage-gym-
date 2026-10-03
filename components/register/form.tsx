"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send, Upload } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategory } from "@/lib/categories";
import { SITE } from "@/lib/site";

const phoneRegex = /^[6-9]\d{9}$/;

export const registrationSchema = z.object({
  name: z.string().min(3, "Enter your full name"),
  phone: z
    .string()
    .regex(phoneRegex, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email"),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Select gender"),
  city: z.string().min(2, "Enter your city"),
  gym: z.string().min(2, "Enter your gym name"),
  category: z.string().min(1, "Choose a category"),
  categoryMeta: z.record(z.string()),
  paymentRef: z
    .string()
    .min(6, "Enter the UTR / reference number (min 6 chars)"),
  receipt: z
    .instanceof(File, { message: "Upload payment screenshot" })
    .refine((f) => f.size <= 5 * 1024 * 1024, "Max file size 5 MB")
    .refine(
      (f) => ["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(f.type),
      "PNG, JPG, WEBP or PDF only"
    ),
  notes: z.string().optional(),
})
.superRefine((val, ctx) => {
  const cat = getCategory(val.category);
  if (!cat) return;
  for (const f of cat.fields) {
    const v = val.categoryMeta?.[f.name];
    if (v === undefined || v === null || String(v).trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["categoryMeta", f.name],
        message: `${f.label} is required`,
      });
    }
  }
});

export type FormValues = z.infer<typeof registrationSchema>;

export default function RegistrationForm({
  category,
  onCategoryChange,
  onSuccess,
}: {
  category: string;
  onCategoryChange: (c: string) => void;
  onSuccess: (regId: string) => void;
}) {
  const [categoryFields, setCategoryFields] = useState(() =>
    getCategory(category)?.fields ?? []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: { category, categoryMeta: {}, gender: "", notes: "" },
  });

  useEffect(() => {
    setCategoryFields(getCategory(category)?.fields ?? []);
    setValue("category", category);
    setValue("categoryMeta", {});
  }, [category, setValue]);

  const gender = watch("gender");

  const onSubmit = async (values: FormValues) => {
    try {
      const fd = new FormData();
      Object.entries(values).forEach(([k, v]) => {
        if (k === "categoryMeta") {
          fd.append(k, JSON.stringify(v || {}));
        } else if (k === "receipt") {
          if (v instanceof File) fd.append(k, v);
        } else if (v !== undefined && v !== null) {
          fd.append(k, String(v));
        }
      });

      const res = await fetch("/api/register", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      toast.success(`Registered! Your ID: ${data.regId}`, { duration: 8000 });
      onSuccess(data.regId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const err = (m?: string) =>
    m ? <p className="mt-1 text-xs font-medium text-red-400">{m}</p> : null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.35 }}
    >
      <h2 className="font-display text-3xl font-black tracking-wide">
        STEP 3 — <span className="text-gradient-gold">ATHLETE DETAILS</span>
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Fill in your details for the{" "}
        <span className="font-semibold text-gold">
          {getCategory(category)?.name}
        </span>{" "}
        category. Submit only after payment.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <input type="hidden" {...register("category")} />

        {/* Personal details */}
        <fieldset className="rounded-2xl border border-white/10 bg-card p-6">
          <legend className="px-2 font-display text-lg font-bold tracking-widest text-gold">
            PERSONAL DETAILS
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Full Name *</Label>
              <Input placeholder="e.g. Rahul Sharma" className="mt-1.5" {...register("name")} />
              {err(errors.name?.message)}
            </div>
            <div>
              <Label>Mobile Number *</Label>
              <Input placeholder="10-digit mobile" className="mt-1.5" inputMode="numeric" {...register("phone")} />
              {err(errors.phone?.message)}
            </div>
            <div>
              <Label>Email *</Label>
              <Input type="email" placeholder="you@email.com" className="mt-1.5" {...register("email")} />
              {err(errors.email?.message)}
            </div>
            <div>
              <Label>Date of Birth *</Label>
              <Input type="date" className="mt-1.5" {...register("dob")} />
              {err(errors.dob?.message)}
            </div>
            <div>
              <Label>Gender *</Label>
              <Select value={gender} onValueChange={(v) => setValue("gender", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {err(errors.gender?.message)}
            </div>
            <div>
              <Label>City *</Label>
              <Input placeholder="e.g. Mumbai" className="mt-1.5" {...register("city")} />
              {err(errors.city?.message)}
            </div>
            <div className="sm:col-span-2">
              <Label>Gym / Academy *</Label>
              <Input placeholder="Your gym name" className="mt-1.5" {...register("gym")} />
              {err(errors.gym?.message)}
            </div>
          </div>
        </fieldset>

        {/* Category-specific fields */}
        <fieldset className="rounded-2xl border border-white/10 bg-card p-6">
          <legend className="px-2 font-display text-lg font-bold tracking-widest text-gold">
            {getCategory(category)?.name?.toUpperCase()} — CATEGORY DETAILS
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            {categoryFields.map((f) => (
              <div key={f.name}>
                <Label>{f.label} *</Label>
                {f.type === "select" ? (
                  <Select
                    value={watch(`categoryMeta.${f.name}`) || ""}
                    onValueChange={(v) =>
                      setValue(`categoryMeta.${f.name}`, v, { shouldValidate: true })
                    }
                  >
                    <SelectTrigger
                      className={`mt-1.5 ${
                        errors.categoryMeta?.[f.name]
                          ? "border-red-500/70 ring-1 ring-red-500/40"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder={`Select ${f.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {f.options?.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    step="any"
                    placeholder={f.placeholder}
                    className={`mt-1.5 ${
                      errors.categoryMeta?.[f.name] ? "border-red-500/70" : ""
                    }`}
                    {...register(`categoryMeta.${f.name}` as const)}
                  />
                )}
                {err(errors.categoryMeta?.[f.name]?.message as string | undefined)}
              </div>
            ))}
          </div>
          <p className="mt-4 rounded-lg bg-gold/5 px-4 py-2.5 text-xs text-muted-foreground">
            ⚠️ Weight / height / age will be verified at check-in. False details
            lead to disqualification.
          </p>
        </fieldset>

        {/* Payment proof */}
        <fieldset className="rounded-2xl border border-white/10 bg-card p-6">
          <legend className="px-2 font-display text-lg font-bold tracking-widest text-gold">
            PAYMENT PROOF
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>UTR / Payment Reference No. *</Label>
              <Input placeholder="e.g. 4235XXXXXX21" className="mt-1.5" {...register("paymentRef")} />
              {err(errors.paymentRef?.message)}
            </div>
            <div>
              <Label>Payment Screenshot *</Label>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                className="mt-1.5 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold"
                {...register("receipt")}
              />
              {err(errors.receipt?.message as string | undefined)}
            </div>
            <div className="sm:col-span-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Anything the organizers should know (e.g. paid for 2 categories)"
                className="mt-1.5"
                {...register("notes")}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            By submitting, you agree to the competition rules. Your entry gets
            confirmed after the organizers verify your payment (usually within 24h).
          </p>
        </fieldset>

        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <><Loader2 className="animate-spin" /> Submitting…</>
          ) : (
            <><Send /> Submit Registration</>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
