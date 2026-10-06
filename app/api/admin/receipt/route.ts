import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { downloadReceipt, getReceiptBucket, findRegistrationById } from "@/lib/db";

export const runtime = "nodejs";

const MIME_BY_EXT: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
};

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Two usage patterns:
  //   ?file=<storage-path>         — direct storage path (legacy/internal)
  //   ?regId=<registration-id>    — look up the reg and serve its receipt
  const storagePath = new URL(req.url).searchParams.get("file");
  const regId = new URL(req.url).searchParams.get("regId");

  let pathToServe = storagePath;
  let originalName = "receipt";

  if (regId && !pathToServe) {
    const reg = await findRegistrationById(regId);
    if (!reg || !reg.receiptFile) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }
    pathToServe = reg.receiptFile;
    originalName = reg.receiptOriginalName ?? regId;
  }

  if (!pathToServe || pathToServe.includes("..")) {
    return NextResponse.json({ error: "Invalid file reference" }, { status: 400 });
  }

  try {
    const bucket = getReceiptBucket();
    const buffer = await downloadReceipt(bucket, pathToServe);
    const ext = pathToServe.split("/").pop()?.split(".").pop()?.toLowerCase() ?? "";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": MIME_BY_EXT[ext] ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
        "Content-Disposition": `attachment; filename=\"${originalName}.${ext}\"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
