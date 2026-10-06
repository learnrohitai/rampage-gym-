import { jsPDF } from "jspdf";
import type { Registration } from "./db";
import { getCategory } from "./categories";
import { SITE } from "./site";

const GOLD: [number, number, number] = [245, 185, 66];
const INK: [number, number, number] = [30, 30, 30];
const MUTE: [number, number, number] = [120, 120, 120];
const LINE: [number, number, number] = [232, 232, 232];

function fmtDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Read image dimensions straight from JPEG/PNG headers (no native deps). */
function imageDims(
  bytes: Uint8Array
): { w: number; h: number; format: "JPEG" | "PNG" } | null {
  // JPEG: scan markers for SOF0-SOF15 (excluding DHT/DAC/JPG)
  if (bytes.length > 4 && bytes[0] === 0xff && bytes[1] === 0xd8) {
    let i = 2;
    while (i < bytes.length - 9) {
      if (bytes[i] !== 0xff) {
        i++;
        continue;
      }
      const marker = bytes[i + 1];
      if (
        marker >= 0xc0 &&
        marker <= 0xcf &&
        marker !== 0xc4 &&
        marker !== 0xc8 &&
        marker !== 0xcc
      ) {
        const h = (bytes[i + 5] << 8) | bytes[i + 6];
        const w = (bytes[i + 7] << 8) | bytes[i + 8];
        return { w, h, format: "JPEG" };
      }
      if (marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd9)) {
        i += 2;
        continue;
      }
      const len = (bytes[i + 2] << 8) | bytes[i + 3];
      i += 2 + Math.max(len, 0);
    }
    return null;
  }
  // PNG: IHDR is always at offset 16 (width) / 20 (height)
  if (bytes.length > 24 && bytes[0] === 0x89 && bytes[1] === 0x50) {
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const w = view.getUint32(16);
    const h = view.getUint32(20);
    if (w > 0 && h > 0) return { w, h, format: "PNG" };
  }
  return null;
}

export interface PdfOptions {
  photoBytes?: Uint8Array | null;
}

/**
 * Build a structured, printable PDF of a filled registration form.
 * Includes the athlete photo (when bytes are provided), all form sections,
 * payment proof details and submission status.
 */
export function buildRegistrationPdf(
  reg: Registration,
  opts: PdfOptions = {}
): Buffer {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 16;
  const contentW = W - 2 * M;
  let y = 0;

  const drawHeader = () => {
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, W, 26, "F");
    doc.setTextColor(25, 25, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(15);
    doc.text(SITE.eventName, M, 12);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(
      `OFFICIAL REGISTRATION FORM  •  ${SITE.gym.name}  •  ${SITE.eventDate}`,
      M,
      18.5
    );
  };

  drawHeader();
  y = 34;

  const ensure = (need: number) => {
    if (y + need > H - 20) {
      doc.addPage();
      drawHeader();
      y = 34;
    }
  };

  // --- Athlete photo (top right) ---
  const pw = 36;
  const ph = 46;
  const px = W - M - pw;
  let photoPlaced = false;
  const bytes = opts.photoBytes;
  if (bytes && bytes.length > 0) {
    const dims = imageDims(bytes);
    if (dims) {
      const scale = Math.min(pw / dims.w, ph / dims.h);
      const dw = dims.w * scale;
      const dh = dims.h * scale;
      try {
        doc.addImage(bytes, dims.format, px + (pw - dw) / 2, y, dw, dh);
        photoPlaced = true;
      } catch {
        photoPlaced = false; // unsupported encoding (e.g. webp) — fall through
      }
    }
  }
  if (!photoPlaced) {
    doc.setDrawColor(190, 190, 190);
    doc.setLineWidth(0.4);
    doc.rect(px, y, pw, ph);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTE);
    doc.text("ATHLETE", px + pw / 2, y + ph / 2 - 2, { align: "center" });
    doc.text("PHOTO", px + pw / 2, y + ph / 2 + 4, { align: "center" });
  }

  // --- Key facts (left of photo) ---
  const info: [string, string][] = [
    ["REGISTRATION ID", reg.regId],
    ["STATUS", `${reg.status.toUpperCase()} (payment: ${reg.paymentStatus})`],
    ["SUBMITTED ON", fmtDate(reg.createdAt)],
    [
      "CATEGORY",
      getCategory(reg.category)?.name ?? reg.category,
    ],
  ];
  let ry = y;
  for (const [k, v] of info) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTE);
    doc.text(k, M, ry);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...INK);
    doc.text(String(v), M, ry + 5);
    ry += 12;
  }
  y = Math.max(ry, y + ph + 8);

  // --- Section / row helpers ---
  const section = (title: string) => {
    ensure(20);
    doc.setFillColor(245, 245, 245);
    doc.rect(M, y, contentW, 8, "F");
    doc.setFillColor(...GOLD);
    doc.rect(M, y, 1.6, 8, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text(title, M + 5, y + 5.5);
    y += 13;
  };

  const row = (label: string, value: string) => {
    ensure(10);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTE);
    doc.text(label.toUpperCase(), M + 2, y);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    const wrapped: string[] = doc.splitTextToSize(value || "-", contentW - 52);
    doc.text(wrapped, M + 47, y);
    y += Math.max(wrapped.length * 4.4, 5) + 4.5;
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(M + 2, y - 3, W - M, y - 3);
  };

  // --- Section 1: personal details ---
  section("SECTION 1 — PERSONAL DETAILS");
  row("Full Name", reg.name);
  row("Mobile Number", reg.phone);
  row("Email", reg.email);
  row("Date of Birth", reg.dob);
  row("Gender", reg.gender);
  row("City", reg.city);
  row("Gym / Academy", reg.gym);
  if (reg.photoOriginalName) row("Athlete Photo File", reg.photoOriginalName);

  // --- Section 2: category details ---
  const cat = getCategory(reg.category);
  section("SECTION 2 — CATEGORY DETAILS");
  row("Category", cat?.name ?? reg.category);
  for (const f of cat?.fields ?? []) {
    row(f.label, reg.categoryMeta?.[f.name] ?? "-");
  }

  // --- Section 3: payment proof ---
  section("SECTION 3 — PAYMENT PROOF");
  row("UTR / Payment Reference", reg.paymentRef);
  row("Receipt File", reg.receiptOriginalName ?? "Not uploaded");
  row("Payment Status", reg.paymentStatus);

  // --- Section 4: notes ---
  section("SECTION 4 — NOTES");
  row("Athlete Notes", reg.notes?.trim() ? reg.notes : "None");

  // --- Footer ---
  ensure(14);
  y += 6;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTE);
  doc.text(
    `Weight / height / age are verified at check-in. Entry fee ₹${SITE.entryFee} per category is non-refundable.`,
    M,
    y
  );
  doc.text(
    `Generated from ${SITE.eventName} registration system on ${new Date().toLocaleString("en-IN")}.`,
    M,
    y + 4.5
  );

  return Buffer.from(doc.output("arraybuffer"));
}
