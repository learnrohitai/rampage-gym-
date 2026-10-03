import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function inr(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function toCsv(regs: Record<string, unknown>[]) {
  if (regs.length === 0) return "";
  // Union of every key across all rows, so mixed-category records don't lose
  // columns (row 0 may be a physique entry while others are bodybuilding).
  const headers: string[] = [];
  const seen = new Set<string>();
  for (const r of regs) {
    for (const k of Object.keys(r)) {
      if (!seen.has(k)) {
        seen.add(k);
        headers.push(k);
      }
    }
  }
  const escape = (v: unknown) => {
    const s = v === null || v === undefined ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = regs.map((r) => headers.map((h) => escape(r[h])).join(","));
  return [headers.join(","), ...rows].join("\n");
}
