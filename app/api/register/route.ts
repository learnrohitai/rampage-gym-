import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addRegistration, buildRegistration, uploadReceipt, getReceiptBucket } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

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
  categories: z.string(), // JSON array
  categoryMeta: z.string(), // JSON object keyed by category id
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
    const raw = {
      name: (formData.get("name") as string) || "",
      phone: (formData.get("phone") as string) || "",
      email: (formData.get("email") as string) || "",
      dob: (formData.get("dob") as string) || "",
      gender: (formData.get("gender") as string) || "",
      city: (formData.get("city") as string) || "",
      gym: (formData.get("gym") as string) || "",
      categories: (formData.get("categories") as string) || "[]",
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

    // Parse categories (JSON array)
    let catIds: string[] = [];
    try {
      catIds = JSON.parse(data.categories || "[]");
    } catch {
      return bad("Invalid category list");
    }
    if (!catIds.length) return bad("Select at least one category");

    // Parse categoryMeta (JSON object keyed by category ID)
    let rawMetaObj: Record<string, unknown> = {};
    try {
      rawMetaObj = JSON.parse(data.categoryMeta || "{}");
    } catch {
      rawMetaObj = {};
    }

    // Validate each category + its meta
    const metas: Record<string, Record<string, string>> = {};
    for (const catId of catIds) {
      const cat = CATEGORIES.find((c) => c.id === catId);
      if (!cat) return bad(`Unknown category: ${catId}`);
      let meta: Record<string, string> = {};
      const catMetaRaw = rawMetaObj[catId];
      if (typeof catMetaRaw === "object" && catMetaRaw !== null) {
        meta = Object.fromEntries(
          Object.entries(catMetaRaw as Record<string, unknown>).map(([k, v]) => [k, String(v ?? "")])
        );
      } else if (typeof catMetaRaw === "string") {
        try {
          meta = JSON.parse(catMetaRaw);
        } catch {
          meta = {};
        }
      }
      for (const f of cat.fields) {
        if (!meta[f.name] || String(meta[f.name]).trim() === "") {
          return bad(`Missing required field: ${f.label} (${cat.name})`);
        }
      }
      if (catId === "masters") {
        const age = parseInt(meta.age, 10);
        if (isNaN(age) || age < 35) return bad("Masters category requires age 35 or above");
      }
      metas[catId] = meta;
    }

    // Validate receipt file — hard 1 MB cap to protect storage
    if (!(receipt instanceof File) || receipt.size === 0) {
      return bad("Payment screenshot is required");
    }
    if (receipt.size > 1024 * 1024) {
      return bad("Payment screenshot must be 1 MB or smaller (images are compressed automatically)");
    }
    const okTypes = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!okTypes.includes(receipt.type)) return bad("File must be PNG, JPG, WEBP or PDF");

    // Validate athlete photo — hard 1 MB cap to protect storage
    if (!(photo instanceof File) || photo.size === 0) {
      return bad("Athlete photo is required");
    }
    if (photo.size > 1024 * 1024) {
      return bad("Photo must be 1 MB or smaller (images are compressed automatically)");
    }
    const okPhotoTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okPhotoTypes.includes(photo.type)) return bad("Photo must be PNG, JPG or WEBP");

    // Upload receipt to Supabase Storage (shared across all selected categories)
    const ext = receipt.name.split(".").pop()?.toLowerCase() || "png";
    const storagePath = `receipts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { path: storedPath } = await uploadReceipt(getReceiptBucket(), receipt, storagePath);

    // Upload athlete photo to Supabase Storage (shared across all selected categories)
    const photoExt = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    const photoPath = `photos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${photoExt}`;
    const { path: storedPhotoPath } = await uploadReceipt(getReceiptBucket(), photo, photoPath);

    // Create one registration row per selected category, sharing one regId
    const firstName = data.name.trim();
    const phone = data.phone;
    const email = data.email.toLowerCase();
    const dob = data.dob;
    const gender = data.gender;
    const city = data.city.trim();
    const gym = data.gym.trim();
    const paymentRef = data.paymentRef.trim();
    const notes = data.notes || "";

    let created: Awaited<ReturnType<typeof addRegistration>> | null = null;
    for (const catId of catIds) {
      const cat = CATEGORIES.find((c) => c.id === catId)!;
      const reg = buildRegistration({
        name: firstName,
        phone,
        email,
        dob,
        gender,
        city,
        gym,
        category: catId,
        categoryMeta: metas[catId],
        paymentRef,
        paymentStatus: "unverified",
        receiptFile: storedPath,
        receiptOriginalName: receipt.name,
        photoFile: storedPhotoPath,
        photoOriginalName: photo.name,
        notes,
      });
      created = await addRegistration(reg);
    }

    if (!created) return bad("Could not create registration", 500);
    return NextResponse.json({ ok: true, regId: created.regId });
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
