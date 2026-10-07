import { NextRequest, NextResponse } from "next/server";
import { readRegistrations } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const regId = searchParams.get("regId")?.trim() ?? "";
  const phone = searchParams.get("phone")?.trim() ?? "";

  if (!regId || !phone) {
    return NextResponse.json(
      { error: "Registration ID and mobile number are required" },
      { status: 400 }
    );
  }

  try {
    const regs = await readRegistrations();
    const reg = regs.find(
      (r) => (r.regId === regId || r.id === regId) && r.phone === phone
    );
    if (!reg) {
      return NextResponse.json(
        { error: "Invalid registration ID or mobile number" },
        { status: 404 }
      );
    }

    // Only the fields needed to render the athlete's pass.
    return NextResponse.json({
      registration: {
        id: reg.id,
        regId: reg.regId,
        name: reg.name,
        category: reg.category,
        paymentRef: reg.paymentRef,
        paymentStatus: reg.paymentStatus,
        receiptFile: reg.receiptFile,
        photoFile: reg.photoFile,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
