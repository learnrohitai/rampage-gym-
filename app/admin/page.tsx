"use client";

import { useCallback, useEffect, useState } from "react";
import { Dumbbell, Loader2, Lock, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dashboard from "@/components/admin/dashboard";

export default function AdminPage() {
  const [checking, setChecking] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/registrations")
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false))
      .finally(() => setChecking(false));
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      setAuthed(true);
      toast.success("Welcome back, champion! 🏆");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="grid min-h-[70vh] place-items-center">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="container flex min-h-[80vh] max-w-md flex-col justify-center py-16">
        <div className="rounded-2xl border border-white/10 bg-card p-8 shadow-2xl">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-red-600 text-black shadow-[0_0_24px_rgba(245,185,66,0.35)]">
              <Dumbbell className="size-7" />
            </span>
            <h1 className="mt-4 font-display text-3xl font-black tracking-wide">
              ORGANIZER <span className="text-gradient-gold">LOGIN</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Rampage Gym — Ricela Mr. India control panel
            </p>
          </div>

          <form onSubmit={login} className="space-y-4">
            <div>
              <Label>Username</Label>
              <div className="relative mt-1.5">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-9" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>
            <div>
              <Label>Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            </div>
            <Button type="submit" variant="gold" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : null}
              {loading ? "Signing in…" : "Sign In"}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return <Dashboard onLogout={() => setAuthed(false)} />;
}
