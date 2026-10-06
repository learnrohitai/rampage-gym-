import { NextRequest, NextResponse } from "next/server";
import { findRegistrationById } from "@/lib/db";
import { getCategory } from "@/lib/categories";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { regId: string } }
) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get("phone")?.trim();

  const regId = params.regId;
  if (!regId) {
    return NextResponse.json({ error: "Missing registration ID" }, { status: 400 });
  }
  if (!phone) {
    return NextResponse.json(
      { error: "Phone number is required" },
      { status: 400 }
    );
  }

  const reg = await findRegistrationById(regId);
  if (!reg) {
    return NextResponse.json({ error: "Registration not found" }, { status: 404 });
  }
  if (reg.phone !== phone) {
    return NextResponse.json(
      { error: "Phone number does not match this registration" },
      { status: 403 }
    );
  }

  const category = getCategory(reg.category);

  // Build a structured "filled form" view — the same structure the candidate submitted
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
    },
    section4_notes: reg.notes ?? "None",
  };

  const filename = `my-registration-${reg.regId}.json`;

  return new NextResponse(JSON.stringify(filledForm, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
