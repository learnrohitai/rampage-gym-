import { NextRequest, NextResponse } from "next/server";
import { readRegistrations } from "@/lib/db";
import QRCode from "qrcode";

export const runtime = "nodejs";

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

    const baseUrl = req.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const qrUrl = `${baseUrl.replace(/\/+$/, "")}/checkin?regId=${encodeURIComponent(reg.regId)}`;

    const buffer = await QRCode.toBuffer(qrUrl, {
      width: 400,
      margin: 1,
      errorCorrectionLevel: "H",
      type: "png",
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });

    const isDownload = searchParams.get("download") === "1";

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "private, no-store",
        "Content-Disposition": isDownload
          ? `attachment; filename="qr-pass-${reg.regId}.png"`
          : `inline; filename="qr-pass-${reg.regId}.png"`,
      },
    });
  } catch (err) {
    console.error("Error generating public pass QR:", err);
    return NextResponse.json({ error: "Failed to generate QR pass" }, { status: 500 });
  }
}
