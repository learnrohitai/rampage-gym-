import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getSession } from "@/lib/auth";
import { readRegistrations } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const file = new URL(req.url).searchParams.get("file");
  if (!file || file.includes("..") || file.includes("/") || file.includes("\\")) {
    return NextResponse.json({ error: "Invalid file" }, { status: 400 });
  }

  try {
    const uploadDir = path.join(process.cwd(), "data", "uploads");
    const filePath = path.join(uploadDir, path.basename(file));
    const buffer = await fs.readFile(filePath);
    const ext = file.split(".").pop()?.toLowerCase();
    const types: Record<string, string> = {
      png: "image/png",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      webp: "image/webp",
      pdf: "application/pdf",
    };
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": types[ext ?? ""] ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
