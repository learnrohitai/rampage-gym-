/**
 * Client-side image compression.
 *
 * Compresses candidate photos and payment screenshots down to a target size
 * (default 1 MB) before upload — keeps Supabase storage usage low and keeps
 * request bodies under Vercel's 4.5 MB serverless limit.
 *
 * Non-image files (e.g. PDF receipts) pass through untouched; the API
 * enforces a hard size limit on those.
 */

const COMPRESSIBLE_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/bmp",
];

export function isCompressibleImage(file: File): boolean {
  return COMPRESSIBLE_TYPES.includes(file.type);
}

async function decodeImage(
  file: File
): Promise<ImageBitmap | HTMLImageElement> {
  // createImageBitmap respects EXIF orientation when supported
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // fall through to <img> decoding
    }
  }
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not decode image"));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Shrink an image until it fits within `maxBytes`.
 * - Downscales quality first (0.9 → 0.4), then shrinks dimensions.
 * - Outputs JPEG (best size/quality trade-off for photos & screenshots).
 * - Returns the original file if it already fits, isn't an image, or can't
 *   be decoded (the API will then enforce the hard limit).
 */
export async function compressImageToMax(
  file: File,
  maxBytes: number = 1024 * 1024,
  maxDim: number = 1600
): Promise<File> {
  if (!isCompressibleImage(file) || file.size <= maxBytes) return file;

  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decodeImage(file);
  } catch {
    return file;
  }

  const sw = source.width;
  const sh = source.height;
  if (!sw || !sh) return file;

  // Longest side starts at maxDim (or original if smaller)
  let scale = Math.min(1, maxDim / Math.max(sw, sh));
  const type = "image/jpeg";
  let best: Blob | null = null;

  for (let attempt = 0; attempt < 8; attempt++) {
    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) break;

    // Flatten transparency — JPEG doesn't support alpha
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(source, 0, 0, w, h);

    const quality = Math.max(0.4, 0.9 - attempt * 0.1);
    const blob = await canvasToBlob(canvas, type, quality);
    canvas.width = 0; // release memory
    canvas.height = 0;

    if (blob) {
      if (!best || blob.size < best.size) best = blob;
      if (blob.size <= maxBytes) break;
    }
    scale *= 0.8; // next round: shrink dimensions too
  }

  if ("close" in source) source.close();

  // Give up only if we couldn't produce anything smaller than the original
  if (!best || best.size >= file.size) return file;

  const base = file.name.replace(/\.[^.]+$/, "") || "image";
  return new File([best], `${base}.jpg`, { type, lastModified: Date.now() });
}
