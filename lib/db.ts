import { supabase } from "./supabase";

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

// ---------- helpers ----------

function generateRegId(): string {
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

// ---------- storage path helpers ----------

/**
 * Upload a receipt file to Supabase Storage and return the public URL + storage path.
 */
export async function uploadReceipt(
  bucket: string,
  file: File,
  destinationPath: string
): Promise<{ url: string; path: string }> {
  const ArrayBuffer = globalThis.ArrayBuffer;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(destinationPath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;
  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(destinationPath);
  return { url: urlData.publicUrl, path: destinationPath };
}

/**
 * Download a receipt file from Supabase Storage as a buffer.
 */
export async function downloadReceipt(bucket: string, storagePath: string): Promise<Buffer> {
  const { data, error } = await supabase.storage.from(bucket).download(storagePath);
  if (error) throw error;
  if (!data) throw new Error("File not found in storage");
  const buf = Buffer.from(await data.arrayBuffer());
  return buf;
}

/**
 * Delete a receipt file from Supabase Storage.
 */
export async function deleteReceipt(bucket: string, storagePath: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([storagePath]);
  if (error) console.warn("Failed to delete storage object:", error);
}

// ---------- registration CRUD ----------

export async function readRegistrations(): Promise<Registration[]> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(snakeToCamel) as Registration[];
}

function toSnakeCase(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

function toSnakeCaseRecord(record: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(record)) {
    out[toSnakeCase(k)] = v;
  }
  return out;
}

export async function addRegistration(reg: Registration): Promise<Registration> {
  const snake = toSnakeCaseRecord({
    id: reg.id,
    reg_id: reg.regId,
    name: reg.name,
    phone: reg.phone,
    email: reg.email,
    dob: reg.dob,
    gender: reg.gender,
    city: reg.city,
    gym: reg.gym,
    category: reg.category,
    category_meta: reg.categoryMeta,
    payment_ref: reg.paymentRef,
    receipt_file: reg.receiptFile,
    receipt_original_name: reg.receiptOriginalName,
    payment_status: reg.paymentStatus,
    status: reg.status,
    created_at: reg.createdAt,
    notes: reg.notes,
  });
  const { data, error } = await supabase
    .from("registrations")
    .insert(snake)
    .select()
    .single();

  if (error) throw error;
  return snakeToCamel(data);
}

export async function updateRegistration(
  id: string,
  patch: Partial<Registration>
): Promise<Registration | null> {
  const snake = toSnakeCaseRecord({
    id: patch.id,
    reg_id: patch.regId,
    name: patch.name,
    phone: patch.phone,
    email: patch.email,
    dob: patch.dob,
    gender: patch.gender,
    city: patch.city,
    gym: patch.gym,
    category: patch.category,
    category_meta: patch.categoryMeta,
    payment_ref: patch.paymentRef,
    receipt_file: patch.receiptFile,
    receipt_original_name: patch.receiptOriginalName,
    payment_status: patch.paymentStatus,
    status: patch.status,
    created_at: patch.createdAt,
    notes: patch.notes,
  });
  const { data, error } = await supabase
    .from("registrations")
    .update(snake)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data ? snakeToCamel(data) : null;
}

export async function findRegistrationById(id: string): Promise<Registration | null> {
  const { data, error } = await supabase
    .from("registrations")
    .select("*")
    .eq("id", id)
    .or(`reg_id.eq.${id}`)
    .single();

  if (error) {
    if ((error as { code?: string }).code === "PGRST116") return null;
    throw error;
  }
  return data ? snakeToCamel(data) : null;
}

function snakeToCamel(data: Record<string, unknown>): Registration {
  return {
    id: String(data.id ?? ""),
    regId: String(data.reg_id ?? ""),
    name: String(data.name ?? ""),
    phone: String(data.phone ?? ""),
    email: String(data.email ?? ""),
    dob: String(data.dob ?? ""),
    gender: String(data.gender ?? ""),
    city: String(data.city ?? ""),
    gym: String(data.gym ?? ""),
    category: String(data.category ?? ""),
    categoryMeta: mapToStringRecord(data.category_meta ?? {}),
    paymentRef: String(data.payment_ref ?? ""),
    receiptFile: String(data.receipt_file ?? "") || null,
    receiptOriginalName: String(data.receipt_original_name ?? "") || null,
    paymentStatus: (data.payment_status as Registration["paymentStatus"] ?? "unverified"),
    status: (data.status as Registration["status"] ?? "pending"),
    createdAt: String(data.created_at ?? ""),
    notes: typeof data.notes === "string" ? data.notes : undefined,
  };
}

function mapToStringRecord(val: unknown): Record<string, string> {
  if (val === null || val === undefined) return {};
  if (typeof val === "object" && val instanceof Object) {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(val)) {
      out[k] = String(v);
    }
    return out;
  }
  return {};
}

export function getReceiptBucket(): string {
  return process.env.SUPABASE_STORAGE_BUCKET || "receipts";
}
