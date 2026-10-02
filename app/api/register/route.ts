import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { promises as fs } from "fs";
import { addRegistration, buildRegistration, ensureDirs, getUploadDir } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";

export const runtime = "nodejs";

const phoneRegex = /^[6-9]\d{9}$/;

const schema = z.object({
  name: z.string().min(3),
  phone: z.string().regex(phoneRegex),
  email: z.string().email(),
  dob: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  city: z.string().min(2),
  gym: z.string().min(2),
  category: z.string(),
  categoryMeta: z.string(), // JSON string
  paymentRef: z.string().min(6),
  notes: z.string().optional().nullable(),
});

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
    const receipt = formData.get("receipt");

    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      return bad(`Invalid field: ${first.path.join(".") || "unknown"}`);
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

    await ensureDirs();
    const ext = receipt.name.split(".").pop()?.toLowerCase() || "png";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const buffer = Buffer.from(await receipt.arrayBuffer());
    await fs.writeFile(`${getUploadDir()}/${safeName}`, buffer);

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
      receiptFile: safeName,
      receiptOriginalName: receipt.name,
      notes: data.notes || "",
    });

    await addRegistration(reg);
    return NextResponse.json({ ok: true, regId: reg.regId });
  } catch (e) {
    console.error("register error", e);
    return bad("Server error, please try again", 500);
  }
}
