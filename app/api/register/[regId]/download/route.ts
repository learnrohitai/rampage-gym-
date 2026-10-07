import { NextRequest, NextResponse } from "next/server";
import { findRegistrationById, downloadReceipt, getReceiptBucket } from "@/lib/db";
import { buildRegistrationPdf } from "@/lib/pdf";

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

  // Fetch the athlete photo for embedding (optional — PDF still builds without it)
  let photoBytes: Uint8Array | null = null;
  if (reg.photoFile) {
    try {
      photoBytes = await downloadReceipt(getReceiptBucket(), reg.photoFile);
    } catch {
      photoBytes = null;
    }
  }

  const siteUrl = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const pdf = await buildRegistrationPdf(reg, { photoBytes, siteUrl });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="my-registration-${reg.regId}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
