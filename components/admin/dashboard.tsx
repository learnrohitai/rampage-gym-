"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileJson,
  FileSpreadsheet,
  Filter,
  LogOut,
  QrCode,
  RefreshCw,
  Search,
  User,
  UserX,
  Users,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import type { Registration } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCategory } from "@/lib/categories";
import { SITE } from "@/lib/site";
import { cn, formatDate } from "@/lib/utils";


const STATUS_META: Record<string, { label: string; variant: "success" | "destructive" | "default" }> = {
  confirmed: { label: "Confirmed", variant: "success" },
  pending: { label: "Pending", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

type StatusFilter = "all" | "pending" | "confirmed" | "rejected";

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();
  const [regs, setRegs] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [catFilter, setCatFilter] = useState("all");
  const [viewing, setViewing] = useState<{ reg: Registration; tab: "photo" | "receipt" | "qr" } | null>(null);


  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/registrations", { cache: "no-store" });
      if (res.status === 401) {
        onLogout();
        return;
      }
      const data = await res.json();
      setRegs(data.registrations ?? []);
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [onLogout]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return regs.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (catFilter !== "all" && r.category !== catFilter) return false;
      if (!q) return true;
      return [r.name, r.phone, r.email, r.regId, r.city, r.gym]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [regs, search, statusFilter, catFilter]);

  const stats = useMemo(() => {
    const total = regs.length;
    const confirmed = regs.filter((r) => r.status === "confirmed").length;
    const pending = regs.filter((r) => r.status === "pending").length;
    const rejected = regs.filter((r) => r.status === "rejected").length;
    return { total, confirmed, pending, rejected };
  }, [regs]);

  const setStatus = async (id: string, status: string) => {
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error("Update failed");
      setRegs((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: status as Registration["status"] } : r))
      );
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Could not update status");
    }
  };

  const setPaymentStatus = async (id: string, paymentStatus: Registration["paymentStatus"]) => {
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, paymentStatus }),
      });
      if (!res.ok) throw new Error("Update failed");
      setRegs((prev) =>
        prev.map((r) => (r.id === id ? { ...r, paymentStatus } : r))
      );
      toast.success(`Payment ${paymentStatus === "verified" ? "verified" : paymentStatus === "rejected" ? "rejected" : "unverified"}`);
    } catch {
      toast.error("Could not update payment status");
    }
  };

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    onLogout();
  };

  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-black tracking-wide">
            ORGANIZER <span className="text-gradient-gold">DASHBOARD</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {SITE.eventName} • {SITE.gym.name}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className={cn(loading && "animate-spin")} /> Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut /> Logout
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Registrations", value: stats.total, icon: Users, tint: "text-gold" },
          { label: "Confirmed", value: stats.confirmed, icon: BadgeCheck, tint: "text-emerald-400" },
          { label: "Pending Review", value: stats.pending, icon: Clock, tint: "text-amber-400" },
          { label: "Rejected", value: stats.rejected, icon: UserX, tint: "text-red-400" },
        ].map((s) => (
          <div
            key={s.label}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
                <p className={cn("mt-1 font-display text-4xl font-black", s.tint)}>
                  {s.value}
                </p>
              </div>
              <s.icon className="size-8 opacity-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, phone, reg ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
          <SelectTrigger className="w-[170px]">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Filter className="size-4" />
              <SelectValue />
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={catFilter} onValueChange={setCatFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {["bodybuilding", "masters", "physique"].map((c) => (
              <SelectItem key={c} value={c}>
                {getCategory(c)?.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/api/admin/registrations?format=csv" download>
              <FileSpreadsheet /> CSV
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href="/api/admin/registrations?format=json" download>
              <FileJson /> JSON
            </a>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs uppercase tracking-widest text-muted-foreground">
                <th className="px-4 py-4">Reg ID</th>
                <th className="px-4 py-4">Athlete</th>
                <th className="px-4 py-4">Category</th>
                <th className="px-4 py-4 hidden md:table-cell">Contact</th>
                <th className="px-4 py-4 hidden lg:table-cell">Payment</th>
                <th className="px-4 py-4">Status</th>                    <th className="px-4 py-4 text-right">Actions</th>
                    <th className="px-4 py-4 text-right">Download</th>
                  </tr>
                </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    <RefreshCw className="mx-auto size-6 animate-spin text-gold" />
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">
                    No registrations found.
                  </td>
                </tr>
              )}
              {!loading &&
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-4">
                      <span className="font-mono text-xs font-bold text-gold">{r.regId}</span>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {formatDate(r.createdAt)}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.city} • {r.gym}
                      </p>
                      {r.photoFile && (
                        <button
                          onClick={() => setViewing({ reg: r, tab: "photo" })}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
                        >
                          <User className="size-3" /> View photo
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <Badge variant="outline">{categoryLabel(r)}</Badge>
                    </td>
                    <td className="hidden px-4 py-4 md:table-cell">
                      <p>{r.phone}</p>
                      <p className="text-xs text-muted-foreground">{r.email}</p>
                    </td>
                    <td className="hidden px-4 py-4 lg:table-cell">
                      <p className="font-mono text-xs">{r.paymentRef}</p>
                      {r.receiptFile && (
                        <button
                          onClick={() => setViewing({ reg: r, tab: "receipt" })}
                          className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-gold hover:underline"
                        >
                          <ExternalLink className="size-3" /> View receipt
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {r.paymentStatus === "verified" ? "Payment Verified" : r.paymentStatus === "unverified" ? "Unverified" : "Rejected"}
                        </Badge>
                        <Button
                          size="sm"
                          variant={r.paymentStatus === "unverified" ? "default" : "outline"}
                          onClick={() => setPaymentStatus(r.id, "verified")}
                          disabled={r.paymentStatus === "verified"}
                        >
                          {r.paymentStatus === "verified" ? "Verified" : "Confirm Payment"}
                        </Button>
                        {r.paymentStatus !== "rejected" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/40 text-red-400 hover:bg-red-500/10"
                            onClick={() => setPaymentStatus(r.id, "rejected")}
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1.5">
                        {r.status !== "confirmed" && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10"
                            title="Confirm"
                            onClick={() => setStatus(r.id, "confirmed")}
                          >
                            <CheckCircle2 className="size-4" />
                          </Button>
                        )}
                        {r.status !== "rejected" && (
                          <Button
                            size="icon"
                            variant="outline"
                            className="size-8 border-red-500/40 text-red-400 hover:bg-red-500/10"
                            title="Reject"
                            onClick={() => setStatus(r.id, "rejected")}
                          >
                            <XCircle className="size-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={`/api/admin/registrations/${r.regId}/download`}
                          download
                          title="Download Official Form (includes Athlete Photo & QR)"
                          className="inline-flex items-center gap-1 rounded-md border border-gold/40 bg-gold/10 px-2 py-1 text-xs font-semibold text-gold hover:bg-gold/20"
                        >
                          <Download className="size-3.5" /> PDF
                        </a>
                        <a
                          href={`/api/admin/qrcode?regId=${r.regId}&download=1`}
                          download
                          title="Download Athlete QR Code PNG"
                          className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/5 px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-white/10 hover:text-foreground"
                        >
                          <QrCode className="size-3.5" /> QR
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <Download className="size-3.5" />
        Downloads include all registrations with category details. PDF files include original athlete photo and verification QR pass.
      </p>

      {/* Media modal */}
      {viewing && <AthleteMediaModal item={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function categoryLabel(r: Registration) {
  const cat = getCategory(r.category);
  if (!cat) return r.category;
  const m = r.categoryMeta || {};
  if (cat.id === "bodybuilding") return `${cat.name} — ${m.weightClass ?? "-"}`;
  if (cat.id === "masters") return `${cat.name} (${m.age ?? "-"} yrs)`;
  if (cat.id === "physique") return `${cat.name} — ${m.heightClass ?? "-"}`;
  return cat.name;
}

function AthleteMediaModal({
  item,
  onClose,
}: {
  item: { reg: Registration; tab: "photo" | "receipt" | "qr" };
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"photo" | "receipt" | "qr">(item.tab);
  const reg = item.reg;
  const isPdf = reg.receiptFile?.endsWith(".pdf");

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div>
            <h3 className="font-display text-xl font-bold tracking-widest text-gold">
              {reg.regId} — {reg.name.toUpperCase()}
            </h3>
            <p className="text-xs text-muted-foreground">
              {categoryLabel(reg)} • Status: {reg.status.toUpperCase()}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="size-5" />
          </Button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-white/10 bg-white/[0.02] px-6 pt-2">
          {reg.photoFile && (
            <button
              onClick={() => setTab("photo")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-colors",
                tab === "photo"
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <User className="size-3.5" /> Athlete Photo
            </button>
          )}
          {reg.receiptFile && (
            <button
              onClick={() => setTab("receipt")}
              className={cn(
                "flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-colors",
                tab === "receipt"
                  ? "border-gold text-gold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <ExternalLink className="size-3.5" /> Payment Receipt
            </button>
          )}
          <button
            onClick={() => setTab("qr")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-4 py-2 text-xs font-semibold transition-colors",
              tab === "qr"
                ? "border-gold text-gold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <QrCode className="size-3.5" /> Check-In QR Pass
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-h-[60vh] overflow-auto p-6">
          {tab === "photo" && reg.photoFile && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/admin/receipt?file=${encodeURIComponent(reg.photoFile)}`}
                alt={`Photo of ${reg.name}`}
                className="mx-auto max-h-[50vh] rounded-xl border border-white/10 object-contain shadow-2xl"
              />
              <p className="mt-3 text-xs text-muted-foreground font-mono">
                {reg.photoOriginalName || reg.photoFile}
              </p>
            </div>
          )}

          {tab === "receipt" && reg.receiptFile && (
            <div>
              {isPdf ? (
                <iframe
                  src={`/api/admin/receipt?file=${encodeURIComponent(reg.receiptFile)}`}
                  className="h-[50vh] w-full rounded-lg"
                  title="Receipt PDF"
                />
              ) : (
                <div className="text-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/api/admin/receipt?file=${encodeURIComponent(reg.receiptFile)}`}
                    alt="Payment receipt"
                    className="mx-auto max-h-[50vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                  />
                  <p className="mt-3 text-xs text-muted-foreground">
                    Ref / UTR: <span className="font-mono text-gold">{reg.paymentRef}</span>
                  </p>
                </div>
              )}
            </div>
          )}

          {tab === "qr" && (
            <div className="text-center">
              <div className="mx-auto my-2 inline-block rounded-2xl border-2 border-gold/40 bg-white p-3 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/api/admin/qrcode?regId=${encodeURIComponent(reg.regId)}`}
                  alt={`QR Pass for ${reg.regId}`}
                  className="size-48 object-contain"
                />
              </div>
              <p className="mt-2 font-display text-lg font-bold text-gold">{reg.regId}</p>
              <p className="text-xs text-muted-foreground">
                Official Check-In QR Pass for venue verification
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-white/[0.02] px-6 py-4">
          <a
            href={`/api/admin/registrations/${reg.regId}/download`}
            download
          >
            <Button variant="gold" size="sm">
              <Download className="size-3.5 mr-1.5" /> Download PDF Form (Photo + QR)
            </Button>
          </a>

          <div className="flex gap-2">
            {tab === "photo" && reg.photoFile && (
              <a href={`/api/admin/receipt?file=${encodeURIComponent(reg.photoFile)}&download=1`} download>
                <Button variant="outline" size="sm">
                  <Download className="size-3.5 mr-1" /> Save Photo
                </Button>
              </a>
            )}
            {tab === "receipt" && reg.receiptFile && (
              <a href={`/api/admin/receipt?file=${encodeURIComponent(reg.receiptFile)}`} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink className="size-3.5 mr-1" /> Open Original
                </Button>
              </a>
            )}
            {tab === "qr" && (
              <a href={`/api/admin/qrcode?regId=${encodeURIComponent(reg.regId)}&download=1`} download>
                <Button variant="outline" size="sm">
                  <Download className="size-3.5 mr-1" /> Save QR PNG
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
