import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { readRegistrations, updateRegistration, type Registration } from "@/lib/db";
import { toCsv } from "@/lib/utils";

export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  const { searchParams } = new URL(req.url);
  const format = searchParams.get("format");

  const regs = await readRegistrations();

  if (format === "csv" || format === "json") {
    const flat = regs.map((r) => ({
      regId: r.regId,
      name: r.name,
      phone: r.phone,
      email: r.email,
      dob: r.dob,
      gender: r.gender,
      city: r.city,
      gym: r.gym,
      category: r.category,
      ...r.categoryMeta,
      paymentRef: r.paymentRef,
      receiptFile: r.receiptOriginalName ?? "",
      status: r.status,
      paymentStatus: r.paymentStatus,
      registeredAt: r.createdAt,
      notes: r.notes ?? "",
    }));
    if (format === "json") {
      return new NextResponse(JSON.stringify(flat, null, 2), {
        headers: {
          "Content-Type": "application/json",
          "Content-Disposition": `attachment; filename="mr-india-registrations.json"`,
        },
      });
    }
    return new NextResponse(toCsv(flat), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="mr-india-registrations.csv"`,
      },
    });
  }

  return NextResponse.json({ registrations: regs });
}

export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    const { id, status, notes, paymentStatus } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const allowedStatus = ["pending", "confirmed", "rejected"];
    if (status && !allowedStatus.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    const allowedPayment = ["unverified", "verified", "rejected"];
    if (paymentStatus && !allowedPayment.includes(paymentStatus)) {
      return NextResponse.json({ error: "Invalid payment status" }, { status: 400 });
    }

    // The dashboard only exposes payment controls, so mirror the decision onto
    // registration status — otherwise "Confirmed" stays 0 forever.
    let nextStatus = status;
    if (!status && paymentStatus) {
      nextStatus =
        paymentStatus === "verified"
          ? "confirmed"
          : paymentStatus === "rejected"
            ? "rejected"
            : "pending";
    }

    const updated = await updateRegistration(id, {
      ...(nextStatus ? { status: nextStatus as Registration["status"] } : {}),
      ...(paymentStatus
        ? { paymentStatus: paymentStatus as Registration["paymentStatus"] }
        : {}),
      ...(notes !== undefined ? { notes } : {}),
    });
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ ok: true, registration: updated });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
