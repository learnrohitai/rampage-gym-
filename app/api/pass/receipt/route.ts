import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { readRegistrations } from "@/lib/db";

const TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
};

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
    if (!reg || !reg.receiptFile) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const uploadDir = path.join(process.cwd(), "data", "uploads");
    const filePath = path.join(uploadDir, path.basename(reg.receiptFile));
    const buffer = await fs.readFile(filePath);

    const ext = reg.receiptFile.split(".").pop()?.toLowerCase() || "png";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": TYPES[ext] ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename="qr-pass-${reg.regId}.${ext}"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
