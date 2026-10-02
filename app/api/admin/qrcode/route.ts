import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { readRegistrations } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function fileNotFound() {
  return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const regId = searchParams.get("regId");
  if (!regId) return NextResponse.json({ error: "Missing regId" }, { status: 400 });

  try {
    const regs = await readRegistrations();
    const reg = regs.find((r) => r.regId === regId || r.id === regId);
    if (!reg || !reg.receiptFile) return fileNotFound();

    const uploadDir = path.join(process.cwd(), "data", "uploads");
    const filePath = path.join(uploadDir, path.basename(reg.receiptFile));
    const buffer = await fs.readFile(filePath);

    const ext = reg.receiptFile.split(".").pop()?.toLowerCase() || "png";
    const types: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      pdf: "application/pdf",
    };

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": types[ext] ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename=\"${reg.receiptOriginalName ?? regId}.${ext}\"`,
      },
    });
  } catch {
    return fileNotFound();
  }
}
