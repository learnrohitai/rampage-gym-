import { promises as fs } from "fs";
import path from "path";

export interface Registration {
  id: string;
  regId: string;
  name: string;
  phone: string;
  email: string;
  dob: string;
  gender: string;
  city: string;
  gym: string;
  category: string;
  categoryMeta: Record<string, string>;
  paymentRef: string;
  receiptFile: string | null;
  receiptOriginalName: string | null;
  paymentStatus: "unverified" | "verified" | "rejected";
  status: "pending" | "confirmed" | "rejected";
  createdAt: string;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "registrations.json");
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

export async function ensureDirs() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
}

export async function readRegistrations(): Promise<Registration[]> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(raw) as Registration[];
  } catch {
    return [];
  }
}

export async function writeRegistrations(regs: Registration[]) {
  await ensureDirs();
  await fs.writeFile(DB_FILE, JSON.stringify(regs, null, 2), "utf-8");
}

export async function addRegistration(reg: Registration) {
  const regs = await readRegistrations();
  regs.unshift(reg);
  await writeRegistrations(regs);
}

export async function updateRegistration(
  id: string,
  patch: Partial<Registration>
): Promise<Registration | null> {
  const regs = await readRegistrations();
  const idx = regs.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  regs[idx] = { ...regs[idx], ...patch };
  await writeRegistrations(regs);
  return regs[idx];
}

export function getUploadPath(filename: string) {
  return path.join(UPLOAD_DIR, path.basename(filename));
}

export function getUploadDir() {
  return UPLOAD_DIR;
}

function generateRegId() {
  const now = new Date();
  const y = now.getFullYear().toString().slice(-2);
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `MI${y}-${rand}`;
}

export function buildRegistration(input: Omit<Registration, "id" | "regId" | "status" | "createdAt">): Registration {
  return {
    ...input,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    regId: generateRegId(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
}
