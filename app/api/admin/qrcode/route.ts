import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { findRegistrationById, downloadReceipt, getReceiptBucket } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
};

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const regId = searchParams.get("regId");
  if (!regId) return NextResponse.json({ error: "Missing regId" }, { status: 400 });

  try {
    const reg = await findRegistrationById(regId);
    if (!reg || !reg.receiptFile) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    const bucket = getReceiptBucket();
    const buffer = await downloadReceipt(bucket, reg.receiptFile);
    const ext = reg.receiptFile.split("/").pop()?.split(".").pop()?.toLowerCase() ?? "png";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename=\"${reg.receiptOriginalName ?? regId}.${ext}\"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
  }
}
