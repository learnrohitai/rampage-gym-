import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findRegistrationById, downloadReceipt, getReceiptBucket } from "@/lib/db";
import { buildRegistrationPdf } from "@/lib/pdf";

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

  // Fetch the athlete photo for embedding (optional — PDF still builds without it)
  let photoBytes: Uint8Array | null = null;
  if (reg.photoFile) {
    try {
      photoBytes = await downloadReceipt(getReceiptBucket(), reg.photoFile);
    } catch {
      photoBytes = null;
    }
  }

  const pdf = buildRegistrationPdf(reg, { photoBytes });

  return new NextResponse(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="registration-${reg.regId}.pdf"`,
      "Cache-Control": "private, no-store",
    },
  });
}
