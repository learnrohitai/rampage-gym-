// Generates a simple placeholder QR-style PNG at public/payment-qr.png
// (Replace this file with your real UPI QR code image.)
const fs = require("fs");
const path = require("path");

// 600x600 PNG, white background with black finder-like squares (placeholder art)
const W = 600, H = 600;
const rows = [];
for (let y = 0; y < H; y++) {
  const row = Buffer.alloc(1 + W * 3);
  row[0] = 0; // filter none
  for (let x = 0; x < W; x++) {
    let r = 255, g = 255, b = 255;
    const inBox = (bx, by, bw, bh) => x >= bx && x < bx + bw && y >= by && y < by + bh;
    const inBoxBorder = (bx, by, bw) =>
      inBox(bx, by, bw, bw) &&
      (inBox(bx, by, bw, 28) || inBox(bx, by + bw - 28, bw, 28) ||
       inBox(bx, by, 28, bw) || inBox(bx + bw - 28, by, 28, bw));
    const inBoxCore = (bx, by) => inBox(bx + 56, by + 56, 56, 56);
    if (inBoxBorder(40, 40, 140) || inBoxBorder(W - 180, 40, 140) || inBoxBorder(40, H - 180, 140)) {
      r = g = b = 0;
    } else if (inBoxCore(40, 40) || inBoxCore(W - 180, 40) || inBoxCore(40, H - 180)) {
      r = g = b = 0;
    } else if (y > 240 && y < 360 && x > 150 && x < 450) {
      r = 0; g = 0; b = 0;
    }
    const o = 1 + x * 3;
    row[o] = r; row[o + 1] = g; row[o + 2] = b;
  }
  rows.push(row);
}
const raw = Buffer.concat(rows);

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcBuf) >>> 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

let crcTable;
function crc32(buf) {
  if (!crcTable) {
    crcTable = [];
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      crcTable[n] = c;
    }
  }
  let crc = 0xffffffff;
  for (const b of buf) crc = crcTable[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return crc ^ 0xffffffff;
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2; // 8-bit RGB

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", require("zlib").deflateSync(raw)),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = path.join(__dirname, "..", "public", "payment-qr.png");
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, png);
console.log("Wrote", out);
