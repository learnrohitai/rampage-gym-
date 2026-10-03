import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readRegistrations } from "@/lib/db";
import type { Registration } from "@/lib/db";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

function sanitize(reg: Registration) {
  const { paymentStatus, status, ...rest } = reg;
  return {
    ...rest,
    paymentStatus,
    status,
  };
}

export async function GET(
  req: NextRequest,
  { params }: { params: { regId: string } }
) {
  const session = await getSession();
  if (!session) return unauthorized();

  const regId = params.regId;
  if (!regId) return NextResponse.json({ error: "Missing regId" }, { status: 400 });

  try {
    const raw = await readRegistrations();
    const reg = raw.find((r) => r.regId === regId || r.id === regId);
    if (!reg) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ registration: sanitize(reg) });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
