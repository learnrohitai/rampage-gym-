import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findRegistrationById } from "@/lib/db";
import { getCategory } from "@/lib/categories";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { regId: string } }
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const regId = params.regId;
  if (!regId) return NextResponse.json({ error: "Missing regId" }, { status: 400 });

  const reg = await findRegistrationById(regId);
  if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const category = getCategory(reg.category);

  // Build a structured "filled form" view
  const filledForm = {
    registrationId: reg.regId,
    submittedAt: reg.createdAt,
    status: reg.status,
    paymentStatus: reg.paymentStatus,
    section1_personalDetails: {
      fullName: reg.name,
      mobileNumber: reg.phone,
      email: reg.email,
      dateOfBirth: reg.dob,
      gender: reg.gender,
      city: reg.city,
      gym: reg.gym,
    },
    section2_categoryDetails: category
      ? {
          category: category.name,
          fields: category.fields.map((f) => ({
            label: f.label,
            value: reg.categoryMeta?.[f.name] ?? "-",
          })),
        }
      : { category: reg.category, fields: [] },
    section3_paymentProof: {
      paymentReference: reg.paymentRef,
      receiptFilename: reg.receiptOriginalName ?? "Not uploaded",
      receiptStoragePath: reg.receiptFile ?? "Not uploaded",
      receiptUrl: reg.receiptFile
        ? `https://${process.env.NEXT_PUBLIC_SUPABASE_URL?.replace("https://", "")??""}/storage/v1/object/public/${process.env.SUPABASE_STORAGE_BUCKET ?? "receipts"}/${reg.receiptFile}`
        : null,
    },
    section4_notes: reg.notes ?? "None",
  };

  const filename = `registration-${reg.regId}.json`;

  return new NextResponse(JSON.stringify(filledForm, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
