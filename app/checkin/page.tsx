"use client";

import { useState } from "react";
import { Copy, Download, CheckCircle2, Loader2, QrCode, ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Scanner } from "@/components/scanner";

interface CheckInData {
  id: string;
  regId: string;
  name: string;
  category: string;
  paymentRef: string;
  paymentStatus: "unverified" | "verified" | "rejected";
  status: "pending" | "confirmed" | "rejected";
  receiptFile?: string | null;
}

export default function CheckInPage() {
  const [data, setData] = useState<CheckInData | null>(null);
  const [loading, setLoading] = useState(false);
  const [regId, setRegId] = useState("");
  const [role, setRole] = useState<"admin" | "candidate">("candidate");
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);

  const lookup = async () => {
    const q = regId.trim();
    if (!q) {
      toast.error("Enter a registration number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/details/${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Not found");
      }
      const body = await res.json();
      setData(body.registration);
      setConfirmed(false);
      toast.success("Registration found");
    } catch {
      setData(null);
      toast.error("Invalid or not found");
    } finally {
      setLoading(false);
    }
  };

  const copyRef = async () => {
    if (!data) return;
    await navigator.clipboard.writeText(data.paymentRef);
    setCopied(true);
    toast.success("Payment reference copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAdminVerify = async () => {
    if (!data) return;
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.id, paymentStatus: "verified" }),
      });
      if (!res.ok) throw new Error("Failed");
      toast.success("Payment verified!");
      setConfirmed(true);
    } catch {
      toast.error("Could not verify");
    }
  };

  const handleDownload = async () => {
    if (!data?.receiptFile) return;
    const url = `/api/admin/qrcode?regId=${encodeURIComponent(data.regId)}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = `qr-pass-${data.regId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Pass downloaded!");
  };

  if (loading) {
    return (
      <div className="container py-24 text-center">
        <Loader2 className="size-8 animate-spin text-gold" />
        <p className="mt-4 text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const isAdmin = role === "admin";

  return (
    <div className="container py-10 max-w-3xl">
      <div className="text-center">
        <h1 className="font-display text-3xl font-black tracking-wide">
          CHECK-IN
        </h1>
        <p className="text-sm text-muted-foreground">
          {isAdmin
            ? "Verify candidate payment by scanning their QR code"
            : "Download your QR pass using the registrant number"}
        </p>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          variant={role === "admin" ? "default" : "outline"}
          onClick={() => setRole("admin")}
        >
          <ShieldCheck className="size-4" /> Organizer
        </Button>
        <Button
          variant={role === "candidate" ? "default" : "outline"}
          onClick={() => setRole("candidate")}
        >
          <Download className="size-4" /> Athlete
        </Button>
      </div>

      {isAdmin ? (
        <div className="mt-8 rounded-2xl border border-white/10 bg-card p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <Label>Registrant Number</Label>
              <Input
                value={regId}
                onChange={(e) => setRegId(e.target.value)}
                placeholder="e.g. MI26-1234"
                onKeyDown={(e) => e.key === "Enter" && lookup()}
              />
            </div>
            <Button onClick={lookup}>
              <ShieldCheck className="size-4" /> Search
            </Button>
          </div>

          {data && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/5 p-4 text-sm">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{data.regId}</p>
                <p className="font-semibold">{data.name}</p>
                <p className="text-xs text-muted-foreground">
                  {data.category} • {data.paymentRef}
                </p>
              </div>
              <Badge
                variant={
                  data.paymentStatus === "verified"
                    ? "success"
                    : data.paymentStatus === "rejected"
                    ? "destructive"
                    : "default"
                }
              >
                {data.paymentStatus === "verified"
                  ? "Verified"
                  : data.paymentStatus === "rejected"
                  ? "Rejected"
                  : "Unverified"}
              </Badge>
            </div>
          )}

          {!confirmed && data && (
            <div className="mt-6">
              <p className="text-sm font-semibold">Verify payment by camera</p>
              <p className="text-xs text-muted-foreground">
                Point the camera at the QR code on the candidate&apos;s payment receipt.
              </p>
              <div className="mt-4">
                <Scanner
                  regId={data.regId}
                  onVerified={handleAdminVerify}
                />
              </div>
              <Button
                variant="default"
                className="mt-4"
                onClick={handleAdminVerify}
                disabled={data.paymentStatus === "verified"}
              >
                <ShieldCheck className="size-4" /> Mark Verified
              </Button>
            </div>
          )}

          {confirmed && (
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
              <CheckCircle2 className="size-4" />
              Payment verified — candidate is cleared for check-in.
            </div>
          )}
        </div>
      ) : (        <div className="mt-8 rounded-2xl border border-white/10 bg-card p-6">
          {!data ? (
            <div>
              <div className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <Label>Enter your Registration ID</Label>
                  <Input
                    value={regId}
                    onChange={(e) => setRegId(e.target.value)}
                    placeholder="e.g. MI26-1234"
                    onKeyDown={(e) => e.key === "Enter" && lookup()}
                  />
                </div>
                <Button onClick={lookup}>
                  <QrCode className="size-4" /> Search
                </Button>
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Enter the registration ID from your confirmation to view and
                download your QR pass.
              </p>
            </div>
          ) : (
            <div>
              <div className="text-center">
                <QrCode className="size-12 text-gold mx-auto" />
                <h2 className="mt-4 font-display text-2xl font-black">
                  {data.regId}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {data.name} — {data.category}
                </p>
              </div>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                <p className="font-mono">{data.paymentRef}</p>
                <Button
                  size="sm"
                  variant="link"
                  className="mt-1"
                  onClick={copyRef}
                >
                  {copied ? <CheckCircle2 className="size-3" /> : <Copy className="size-3" />} {copied ? "Copied" : "Copy reference"}
                </Button>
              </div>

              <div className="mt-6 text-center">
                <Button
                  variant="gold"
                  className="text-base px-8"
                  onClick={handleDownload}
                >
                  <Download className="size-4" />
                  Download QR Pass
                </Button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Save this pass for check-in. Payment will be verified by the organizer.
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3"
                  onClick={() => {
                    setRegId("");
                    setData(null);
                    setConfirmed(false);
                  }}
                >
                  Search another ID
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
