"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
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
import { compressImageToMax } from "@/lib/compress";
import { useT } from "@/lib/use-i18n";
import { fieldLabel, fieldPlaceholder, fieldSelectPlaceholder } from "@/lib/i18n-fields";

const MAX_UPLOAD_BYTES = 1024 * 1024; // 1 MB — enforced by the API too

const phoneRegex = /^[6-9]\d{9}$/;

const FEE_TIERS: Record<number, number> = {
  1: 3500,
  2: 6000,
  3: 8000,
};

function feeForCount(n: number) {
  return FEE_TIERS[Math.min(Math.max(n, 1), 3)] ?? 3500;
}

export const registrationSchema = z.object({
  name: z.string().min(3, "Enter your full name"),
  phone: z
    .string()
    .regex(phoneRegex, "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .refine(
      (v) => v.trim() === "" || z.string().email().safeParse(v.trim()).success,
      "Enter a valid email or leave it blank"
    ),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Select gender"),
  city: z.string().min(2, "Enter your city"),
  gym: z.string().min(2, "Enter your gym name"),
  categories: z.array(z.string()).min(1, "Choose at least one category"),
  categoryMeta: z.record(z.record(z.string())),
  paymentRef: z
    .string()
    .refine(
      (v) => v.trim() === "" || v.trim().length >= 6,
      "UTR / reference number must be at least 6 characters (or leave blank)"
    ),
  photo: z
    .instanceof(File, { message: "Upload your photo" })
    .refine(
      (f) => f.size <= 10 * 1024 * 1024,
      "Photo max 10 MB — it is auto-compressed to 1 MB on submit"
    )
    .refine(
      (f) => ["image/png", "image/jpeg", "image/webp"].includes(f.type),
      "PNG, JPG or WEBP only"
    ),
  receipt: z
    .instanceof(File, { message: "Upload payment screenshot" })
    .refine(
      (f) =>
        f.type === "application/pdf"
          ? f.size <= 1024 * 1024
          : f.size <= 10 * 1024 * 1024,
      "PDF must be under 1 MB (images are auto-compressed to 1 MB)"
    )
    .refine(
      (f) => ["image/png", "image/jpeg", "image/webp", "application/pdf"].includes(f.type),
      "PNG, JPG, WEBP or PDF only"
    ),
  notes: z.string().optional(),
})
.superRefine((val, ctx) => {
  const { categories, categoryMeta } = val;
  for (const catId of categories) {
    const cat = getCategory(catId);
    if (!cat) continue;
    const meta = categoryMeta[catId] ?? {};
    for (const f of cat.fields) {
      const v = meta[f.name];
      if (v === undefined || v === null || String(v).trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryMeta", catId, f.name],
          message: `${f.label} is required`,
        });
      }
    }
    if (catId === "masters") {
      const age = parseInt(meta.age ?? "", 10);
      if (isNaN(age) || age < 35) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["categoryMeta", catId, "age"],
          message: "Masters category requires age 35 or above",
        });
      }
    }
  }
});

export type FormValues = z.infer<typeof registrationSchema>;

export default function RegistrationForm({
  categories: initialCategories,
  onSuccess,
}: {
  categories: string[];
  onSuccess: (regId: string) => void;
}) {
  const t = useT();
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      categories: initialCategories,
      categoryMeta: {} as Record<string, Record<string, string>>,
      gender: "",
      notes: "",
    },
  });

  // Keep default values in sync when categories change (e.g. returning user)
  useEffect(() => {
    setValue("categories", categories);
  }, [categories, setValue]);

  const gender = watch("gender");

  const onSubmit = async (values: FormValues) => {
    try {
      const fd = new FormData();

      // Append all scalar fields
      fd.append("name", values.name);
      fd.append("phone", values.phone);
      fd.append("email", values.email);
      fd.append("dob", values.dob);
      fd.append("gender", values.gender);
      fd.append("city", values.city);
      fd.append("gym", values.gym);
      fd.append("categories", JSON.stringify(values.categories));
      fd.append("categoryMeta", JSON.stringify(values.categoryMeta || {}));
      fd.append("paymentRef", values.paymentRef);
      if (values.notes) fd.append("notes", values.notes);

      // Append receipt file — try values.first, then fall back to the DOM input
      let receipt: File | null = null;
      if (values.receipt instanceof File) {
        receipt = values.receipt;
      } else if (fileInputRef.current?.files?.[0]) {
        receipt = fileInputRef.current.files[0];
      }
      if (!receipt || receipt.size === 0) {
        toast.error(t("form.receiptRequired"));
        return;
      }

      // Athlete photo — same fallback pattern as the receipt
      let photo: File | null = null;
      if (values.photo instanceof File) {
        photo = values.photo;
      } else if (photoInputRef.current?.files?.[0]) {
        photo = photoInputRef.current.files[0];
      }
      if (!photo || photo.size === 0) {
        toast.error(t("form.photoRequired"));
        return;
      }

      // Compress images down to 1 MB before uploading (saves storage,
      // keeps the request body under Vercel's 4.5 MB limit)
      receipt = await compressImageToMax(receipt, MAX_UPLOAD_BYTES, 1600);
      photo = await compressImageToMax(photo, MAX_UPLOAD_BYTES, 1280);

      if (receipt.size > MAX_UPLOAD_BYTES) {
        toast.error(
          receipt.type === "application/pdf"
            ? t("form.pdfReceiptError")
            : t("form.compressErrorReceipt")
        );
        return;
      }
      if (photo.size > MAX_UPLOAD_BYTES) {
        toast.error(t("form.compressErrorPhoto"));
        return;
      }

      fd.append("receipt", receipt);
      fd.append("photo", photo);

      const res = await fetch("/api/register", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        console.error("register API error:", data);
        throw new Error(data.error || "Submission failed");
      }
      toast.success(t("form.success", { id: data.regId }), { duration: 8000 });
      onSuccess(data.regId);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const err = (m?: string) =>
    m ? <p className="mt-1 text-xs font-medium text-red-400">{m}</p> : null;

  const fee = feeForCount(categories.length);

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
        {categories.length === 1
          ? t("form.descSingle", { name: getCategory(categories[0])?.name ?? "" })
          : t("form.descMulti")}
      </p>

      <div className="mt-4 rounded-2xl border border-gold/30 bg-gold/5 p-4 text-center">
        <p className="font-display text-sm font-bold tracking-widest text-gold">
          {t("form.totalFeeLabel", {
            one: "₹3,500 (1 cat)",
            two: "₹6,000 (2 cats)",
            three: "₹8,000 (3 cats)",
            count: String(categories.length),
            fee: fee.toLocaleString("en-IN"),
          })}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {categories.length === 1
            ? t("form.totalFeeSingle", { fee: fee.toLocaleString("en-IN") })
            : t("form.totalFeeMulti", {
                one: "₹3,500",
                two: "₹6,000",
                three: "₹8,000",
                count: String(categories.length),
                fee: fee.toLocaleString("en-IN"),
              })}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-8">
        <input type="hidden" {...register("categories")} />

        {/* Personal details */}
        <fieldset className="rounded-2xl border border-white/10 bg-card p-6">
          <legend className="px-2 font-display text-lg font-bold tracking-widest text-gold">
            {t("form.personalLegend")}
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>{t("form.name")} *</Label>
              <Input placeholder={t("form.namePlaceholder")} className="mt-1.5" {...register("name")} />
              {err(errors.name?.message)}
            </div>
            <div>
              <Label>{t("form.phone")} *</Label>
              <Input placeholder={t("form.phonePlaceholder")} className="mt-1.5" inputMode="numeric" {...register("phone")} />
              {err(errors.phone?.message)}
            </div>
            <div>
              <Label>{t("form.email")}</Label>
              <Input type="email" placeholder={t("form.emailPlaceholder")} className="mt-1.5" {...register("email")} />
              {err(errors.email?.message)}
            </div>
            <div>
              <Label>{t("form.dob")} *</Label>
              <Input type="date" className="mt-1.5" {...register("dob")} />
              {err(errors.dob?.message)}
            </div>
            <div>
              <Label>{t("form.gender")} *</Label>
              <Select value={gender} onValueChange={(v) => setValue("gender", v)}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder={t("form.genderPlaceholder")} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">{t("form.genderMale")}</SelectItem>
                  <SelectItem value="female">{t("form.genderFemale")}</SelectItem>
                  <SelectItem value="other">{t("form.genderOther")}</SelectItem>
                </SelectContent>
              </Select>
              {err(errors.gender?.message)}
            </div>
            <div>
              <Label>{t("form.city")} *</Label>
              <Input placeholder={t("form.cityPlaceholder")} className="mt-1.5" {...register("city")} />
              {err(errors.city?.message)}
            </div>
            <div className="sm:col-span-2">
              <Label>{t("form.gym")} *</Label>
              <Input placeholder={t("form.gymPlaceholder")} className="mt-1.5" {...register("gym")} />
              {err(errors.gym?.message)}
            </div>
            <div className="sm:col-span-2">
              <Label>{t("form.photo")} *</Label>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="mt-1.5 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold"
                ref={photoInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue("photo", file, { shouldValidate: true });
                }}
              />
              {err(errors.photo?.message as string | undefined)}
            </div>
          </div>
        </fieldset>

        {/* Category-specific fields — one stacked section per selected category */}
        {categories.map((catId, idx) => {
          const cat = getCategory(catId);
          if (!cat) return null;
          const meta = watch(`categoryMeta.${catId}`) ?? {};
          const catErrors = errors.categoryMeta?.[catId] ?? {};

          return (
            <fieldset key={catId} className="rounded-2xl border border-white/10 bg-card p-6">
              <legend className="px-2 font-display text-lg font-bold tracking-widest text-gold">
                {idx === 0
                  ? t("form.categorySection", { name: cat.name.toUpperCase() })
                  : t("form.categorySectionMulti", { index: String(idx + 1), name: cat.name.toUpperCase() })}
              </legend>
              <div className="mt-1 text-xs font-bold text-gold/80">
                {t("form.categorySectionSub", { name: cat.name })}
              </div>
              <div className="mt-4 grid gap-5 sm:grid-cols-2">
                {cat.fields.map((f) => {
                  const fieldName = f.name;
                  const label = fieldLabel(fieldName, "en");
                  const val = watch(`categoryMeta.${catId}.${fieldName}`) ?? "";
                  const errMsg = catErrors[fieldName]?.message as string | undefined;

                  return (
                    <div key={fieldName}>
                      <Label>{label} *</Label>
                      {f.type === "select" ? (
                        <Select
                          value={val || ""}
                          onValueChange={(v) =>
                            setValue(`categoryMeta.${catId}.${fieldName}`, v, { shouldValidate: true })
                          }
                        >
                          <SelectTrigger
                            className={`mt-1.5 ${
                              errMsg ? "border-red-500/70 ring-1 ring-red-500/40" : ""
                            }`}
                          >
                            <SelectValue placeholder={fieldSelectPlaceholder(label, "en")} />
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
                          placeholder={fieldPlaceholder(fieldName, "en") || f.placeholder}
                          className={`mt-1.5 ${
                            errMsg ? "border-red-500/70" : ""
                          }`}
                          {...register(`categoryMeta.${catId}.${fieldName}` as const)}
                        />
                      )}
                      {err(errMsg)}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 rounded-lg bg-gold/5 px-4 py-2.5 text-xs text-muted-foreground">
                {t("form.categoryWarning")}
              </p>
            </fieldset>
          );
        })}

        {/* Payment proof */}
        <fieldset className="rounded-2xl border border-white/10 bg-card p-6">
          <legend className="px-2 font-display text-lg font-bold tracking-widest text-gold">
            {t("form.paymentLegend")}
          </legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>{t("form.utr")}</Label>
              <Input placeholder={t("form.utrPlaceholder")} className="mt-1.5" {...register("paymentRef")} />
              {err(errors.paymentRef?.message)}
            </div>
            <div>
              <Label>{t("form.receipt")} *</Label>
              <Input
                type="file"
                accept="image/png,image/jpeg,image/webp,application/pdf"
                className="mt-1.5 cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-gold/15 file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-gold"
                ref={fileInputRef}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setValue("receipt", file, { shouldValidate: true });
                }}
              />
              {err(errors.receipt?.message as string | undefined)}
            </div>
            <div className="sm:col-span-2">
              <Label>{t("form.notes")}</Label>
              <Textarea
                placeholder={t("form.notesPlaceholder")}
                className="mt-1.5"
                {...register("notes")}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            {t("form.submissionNote")}
          </p>
        </fieldset>

        <Button type="submit" variant="gold" size="lg" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <><Loader2 className="animate-spin" /> {t("form.submitting")}</>
          ) : (
            <><Send /> {t("form.submit")}</>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
