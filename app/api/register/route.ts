import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addRegistration, buildRegistration, uploadReceipt, getReceiptBucket } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

interface FormBody {
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  city: string;
  gym: string;
  category: string;
  categoryMeta: string;
  paymentRef: string;
  notes: string | undefined;
}

export const runtime = "nodejs";

const phoneRegex = /^[6-9]\d{9}$/;

const schema = z.object({
  name: z.string().min(3),
  phone: z.string().regex(phoneRegex),
  // Email and UTR are optional — validate format only when provided
  email: z.string().refine(
    (v) => v.trim() === "" || z.string().email().safeParse(v.trim()).success,
    "Invalid email"
  ),
  dob: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  city: z.string().min(2),
  gym: z.string().min(2),
  category: z.string(),
  categoryMeta: z.string(), // JSON string
  paymentRef: z.string().refine(
    (v) => v.trim() === "" || v.trim().length >= 6,
    "UTR must be at least 6 characters"
  ),
  notes: z.string().optional().nullable(),
});

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const receipt = formData.get("receipt");
    const photo = formData.get("photo");
    const raw: FormBody = {
      name: (formData.get("name") as string) || "",
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      dob: (formData.get("dob") as string) || "",
      gender: (formData.get("gender") as string) || "",
      city: (formData.get("city") as string) || "",
      gym: (formData.get("gym") as string) || "",
      category: (formData.get("category") as string) || "",
      categoryMeta: (formData.get("categoryMeta") as string) || "{}",
      paymentRef: (formData.get("paymentRef") as string) || "",
      notes: formData.get("notes") as string | undefined,
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const issues = parsed.error.issues as { path: string[] }[];
      const first = issues[0];
      const path = first?.path.reduce((acc, x) => acc + "." + String(x), "").slice(1) || "unknown";
      return bad(`Invalid field: ${path}`);
    }
    const data = parsed.data;

    // Validate category
    const category = CATEGORIES.find((c) => c.id === data.category);
    if (!category) return bad("Unknown category selected");

    // Validate dynamic category fields are present
    let meta: Record<string, string> = {};
    try {
      meta = JSON.parse(data.categoryMeta || "{}");
    } catch {
      return bad("Invalid category data");
    }
    for (const f of category.fields) {
      if (!meta[f.name] || String(meta[f.name]).trim() === "") {
        return bad(`Missing required field: ${f.label}`);
      }
    }
    // Masters must be 35+
    if (category.id === "masters") {
      const age = parseInt(meta.age, 10);
      if (isNaN(age) || age < 35) return bad("Masters category requires age 35 or above");
    }

    // Validate receipt file
    if (!(receipt instanceof File) || receipt.size === 0) {
      return bad("Payment screenshot is required");
    }
    if (receipt.size > 5 * 1024 * 1024) return bad("File too large (max 5 MB)");
    const okTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!okTypes.includes(receipt.type)) return bad("File must be PNG, JPG, WEBP or PDF");

    // Validate athlete photo
    if (!(photo instanceof File) || photo.size === 0) {
      return bad("Athlete photo is required");
    }
    if (photo.size > 5 * 1024 * 1024) return bad("Photo too large (max 5 MB)");
    const okPhotoTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okPhotoTypes.includes(photo.type)) return bad("Photo must be PNG, JPG or WEBP");

    // Upload receipt to Supabase Storage
    const ext = receipt.name.split(".").pop()?.toLowerCase() || "png";
    const storagePath = `receipts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { path: storedPath } = await uploadReceipt(getReceiptBucket(), receipt, storagePath);

    // Upload athlete photo to Supabase Storage (same bucket, photos/ prefix)
    const photoExt = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    const photoPath = `photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${photoExt}`;
    const { path: storedPhotoPath } = await uploadReceipt(getReceiptBucket(), photo, photoPath);

    const reg = buildRegistration({
      name: data.name.trim(),
      phone: data.phone,
      email: data.email.toLowerCase(),
      dob: data.dob,
      gender: data.gender,
      city: data.city.trim(),
      gym: data.gym.trim(),
      category: category.id,
      categoryMeta: meta,
      paymentRef: data.paymentRef.trim(),
      paymentStatus: "unverified",
      receiptFile: storedPath,
      receiptOriginalName: receipt.name,
      photoFile: storedPhotoPath,
      photoOriginalName: photo.name,
      notes: data.notes || "",
    });

    const saved = await addRegistration(reg);
    return NextResponse.json({ ok: true, regId: saved.regId });
  } catch (e: unknown) {
    console.error("register error", e);
    let msg = "Server error, please try again";
    if (typeof e === "object" && e !== null) {
      const err = e as { message?: string; error?: { message?: string }; statusText?: string };
      msg = err.message ?? err.error?.message ?? err.statusText ?? msg;
    } else if (typeof e === "string") {
      msg = e;
    }
    return bad(msg, 500);
  }
}
