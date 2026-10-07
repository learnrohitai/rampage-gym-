import { jsPDF } from "jspdf";
import sharp from "sharp";
import QRCode from "qrcode";
import type { Registration } from "./db";
import { getCategory } from "./categories";
import { SITE } from "./site";

const GOLD: [number, number, number] = [245, 185, 66];
const INK: [number, number, number] = [30, 30, 30];
const MUTE: [number, number, number] = [115, 115, 115];
const LINE: [number, number, number] = [225, 225, 225];

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

export interface PdfOptions {
  photoBytes?: Uint8Array | Buffer | null;
  qrBytes?: Uint8Array | Buffer | null;
  siteUrl?: string;
}

interface ProcessedImage {
  bytes: Buffer;
  format: "JPEG" | "PNG";
  width: number;
  height: number;
}

async function prepareImage(input: Uint8Array | Buffer | null | undefined): Promise<ProcessedImage | null> {
  if (!input || input.length === 0) return null;
  try {
    const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
    const processed = await sharp(buf)
      .rotate()
      .resize({ width: 800, height: 800, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();
    const meta = await sharp(processed).metadata();
    if (!meta.width || !meta.height) return null;
    return {
      bytes: processed,
      format: "JPEG",
      width: meta.width,
      height: meta.height,
    };
  } catch (err) {
    console.error("Error processing athlete image for PDF:", err);
    return null;
  }
}

async function generateQrCode(urlOrText: string): Promise<Buffer> {
  return await QRCode.toBuffer(urlOrText, {
    width: 360,
    margin: 1,
    errorCorrectionLevel: "M",
    type: "png",
    color: {
      dark: "#000000",
      light: "#ffffff",
    },
  });
}

/**
 * Build a structured, official printable PDF of a filled registration form.
 * Includes:
 * - High-resolution, auto-oriented official athlete photo
 * - High-resolution scannable check-in QR pass
 * - Form details, category breakdown, payment verification proof, and official rules
 */
export async function buildRegistrationPdf(
  reg: Registration,
  opts: PdfOptions = {}
): Promise<Buffer> {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 15;
  const contentW = W - 2 * M;
  let y = 0;

  // Process photo
  const processedPhoto = await prepareImage(opts.photoBytes);

  // Prepare QR code
  let qrBuffer: Buffer;
  if (opts.qrBytes && opts.qrBytes.length > 0) {
    qrBuffer = Buffer.isBuffer(opts.qrBytes) ? opts.qrBytes : Buffer.from(opts.qrBytes);
  } else {
    const baseUrl = opts.siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const qrUrl = `${baseUrl.replace(/\/+$/, "")}/checkin?regId=${encodeURIComponent(reg.regId)}`;
    qrBuffer = await generateQrCode(qrUrl);
  }

  const drawHeader = () => {
    // Gold Banner
    doc.setFillColor(...GOLD);
    doc.rect(0, 0, W, 25, "F");

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14.5);
    doc.text(SITE.eventName.toUpperCase(), M, 11);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      `OFFICIAL ATHLETE PASS & ENTRY FORM  •  ${SITE.gym.name.toUpperCase()}  •  ${SITE.eventDate}`,
      M,
      17.5
    );
  };

  drawHeader();
  y = 31;

  const ensure = (need: number) => {
    if (y + need > H - 18) {
      doc.addPage();
      drawHeader();
      y = 31;
    }
  };

  // --- Top Hero Card Area (Key facts on left, QR & Photo cards on right) ---
  const heroCardH = 48;

  // Box 1: QR Code Card
  const qw = 38;
  const qh = heroCardH;
  const qx = W - M - qw * 2 - 5; // 210 - 15 - 76 - 5 = 114mm

  doc.setFillColor(252, 252, 252);
  doc.setDrawColor(215, 215, 215);
  doc.setLineWidth(0.3);
  doc.roundedRect(qx, y, qw, qh, 2, 2, "FD");

  doc.setFillColor(...GOLD);
  doc.rect(qx, y, qw, 4.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(20, 20, 20);
  doc.text("OFFICIAL QR PASS", qx + qw / 2, y + 3.2, { align: "center" });

  try {
    doc.addImage(qrBuffer, "PNG", qx + 3.5, y + 6, 31, 31);
  } catch (err) {
    console.error("Failed to embed QR code into PDF:", err);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...INK);
  doc.text(reg.regId, qx + qw / 2, y + 40.5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(5.5);
  doc.setTextColor(...MUTE);
  doc.text("Scan for Check-In", qx + qw / 2, y + 44.5, { align: "center" });

  // Box 2: Athlete Photo Card
  const pw = 38;
  const ph = heroCardH;
  const px = W - M - pw; // 157mm

  doc.setFillColor(252, 252, 252);
  doc.setDrawColor(215, 215, 215);
  doc.setLineWidth(0.3);
  doc.roundedRect(px, y, pw, ph, 2, 2, "FD");

  doc.setFillColor(...GOLD);
  doc.rect(px, y, pw, 4.5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6);
  doc.setTextColor(20, 20, 20);
  doc.text("ATHLETE PHOTO", px + pw / 2, y + 3.2, { align: "center" });

  if (processedPhoto) {
    const maxPhotoW = 34;
    const maxPhotoH = 39;
    const scale = Math.min(maxPhotoW / processedPhoto.width, maxPhotoH / processedPhoto.height);
    const dw = processedPhoto.width * scale;
    const dh = processedPhoto.height * scale;
    const posX = px + (pw - dw) / 2;
    const posY = y + 6 + (maxPhotoH - dh) / 2;
    try {
      doc.addImage(processedPhoto.bytes, processedPhoto.format, posX, posY, dw, dh);
    } catch (err) {
      console.error("Failed to add photo image into PDF:", err);
    }
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTE);
    doc.text("PHOTO NOT", px + pw / 2, y + 23, { align: "center" });
    doc.text("PROVIDED", px + pw / 2, y + 27.5, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.text("(Verify ID at desk)", px + pw / 2, y + 33, { align: "center" });
  }

  // Left Column: Key Registration Facts
  const cat = getCategory(reg.category);
  const catName = cat?.name ?? reg.category;
  const isConfirmed = reg.status === "confirmed";
  const isPaid = reg.paymentStatus === "verified";

  let ry = y + 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...MUTE);
  doc.text("REGISTRATION ID", M, ry);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(215, 140, 20);
  doc.text(reg.regId, M, ry + 5.5);
  ry += 11.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...MUTE);
  doc.text("ATHLETE NAME", M, ry);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11.5);
  doc.setTextColor(...INK);
  doc.text(reg.name.toUpperCase(), M, ry + 5);
  ry += 10.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...MUTE);
  doc.text("COMPETITION CATEGORY", M, ry);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  const extraCat = reg.categoryMeta?.weightClass || reg.categoryMeta?.heightClass || (reg.categoryMeta?.age ? `${reg.categoryMeta.age} yrs` : "");
  doc.text(`${catName}${extraCat ? `  •  ${extraCat}` : ""}`, M, ry + 4.5);
  ry += 9.5;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...MUTE);
  doc.text("STATUS & VERIFICATION", M, ry);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  if (isConfirmed && isPaid) {
    doc.setTextColor(16, 149, 74);
    doc.text("CONFIRMED & PAYMENT VERIFIED", M, ry + 4.5);
  } else if (isConfirmed) {
    doc.setTextColor(16, 149, 74);
    doc.text("CONFIRMED (Payment Pending)", M, ry + 4.5);
  } else if (reg.status === "rejected") {
    doc.setTextColor(220, 38, 38);
    doc.text("REJECTED", M, ry + 4.5);
  } else {
    doc.setTextColor(217, 119, 6);
    doc.text(`PENDING REVIEW (Payment: ${reg.paymentStatus})`, M, ry + 4.5);
  }

  y = Math.max(ry + 10, y + heroCardH + 6);

  // --- Section Helpers ---
  const section = (title: string) => {
    ensure(18);
    doc.setFillColor(245, 245, 245);
    doc.rect(M, y, contentW, 7, "F");
    doc.setFillColor(...GOLD);
    doc.rect(M, y, 2, 7, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    doc.text(title, M + 5, y + 4.8);
    y += 11;
  };

  const row = (label: string, value: string) => {
    ensure(9);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...MUTE);
    doc.text(label.toUpperCase(), M + 2, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);

    const wrapped: string[] = doc.splitTextToSize(value || "-", contentW - 55);
    doc.text(wrapped, M + 50, y);
    y += Math.max(wrapped.length * 4.2, 4) + 3.5;

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(M + 2, y - 2, W - M, y - 2);
  };

  // --- Section 1: Personal Details ---
  section("SECTION 1 — ATHLETE PERSONAL INFORMATION");
  row("Full Name", reg.name);
  row("Mobile Number", reg.phone);
  row("Email Address", reg.email || "Not provided");
  row("Date of Birth", reg.dob);
  row("Gender", reg.gender ? reg.gender.toUpperCase() : "-");
  row("City / State", reg.city);
  row("Gym / Academy", reg.gym);
  if (reg.photoOriginalName) {
    row("Athlete Photo File", reg.photoOriginalName);
  }

  // --- Section 2: Category Details ---
  section("SECTION 2 — COMPETITION CATEGORY & DIVISION");
  row("Category", catName);
  for (const f of cat?.fields ?? []) {
    row(f.label, reg.categoryMeta?.[f.name] ?? "-");
  }

  // --- Section 3: Payment Proof ---
  section("SECTION 3 — PAYMENT & VERIFICATION PROOF");
  row("UTR / Payment Ref", reg.paymentRef || "Not provided");
  row("Receipt Filename", reg.receiptOriginalName ?? "Not uploaded");
  row("Payment Status", reg.paymentStatus.toUpperCase());

  // --- Section 4: Rules & Declaration ---
  section("SECTION 4 — VENUE CHECK-IN RULES & DECLARATION");
  row(
    "Check-In Rules",
    "Bring this printed or digital pass along with an original Government Photo ID (Aadhaar / Driving License / Passport). Physical weighing & measurement will be conducted at the venue check-in desk on competition day."
  );
  if (reg.notes?.trim()) {
    row("Athlete Notes", reg.notes.trim());
  }

  // --- Signatures & Verification Area ---
  ensure(24);
  y += 6;
  const signY = y + 10;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.3);

  // Athlete Signature Line
  doc.line(M + 10, signY, M + 65, signY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTE);
  doc.text("ATHLETE SIGNATURE", M + 37.5, signY + 4, { align: "center" });

  // Official Scrutineer Line
  doc.line(W - M - 65, signY, W - M - 10, signY);
  doc.text("OFFICIAL SCRUTINEER / DESK", W - M - 37.5, signY + 4, { align: "center" });

  // Footer Note
  y = signY + 10;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(6.5);
  doc.setTextColor(...MUTE);
  doc.text(
    `Official document generated by ${SITE.eventName} registration portal on ${new Date().toLocaleString("en-IN")}. Non-transferable.`,
    M,
    y
  );

  return Buffer.from(doc.output("arraybuffer"));
}
