"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/use-i18n";

const LINKS = [
  { href: "/#categories", label: "Categories" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300",
        scrolled
          ? "border-white/10 bg-background/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.85)]"
          : "border-white/5 bg-background/60"
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-red-600 text-black shadow-[0_0_18px_rgba(245,185,66,0.4)]">
            <Zap className="size-5" strokeWidth={2.5} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-black tracking-wide text-gradient-gold">
              RAMPAGE
            </span>
            <span className="block text-[10px] font-bold tracking-[0.3em] text-muted-foreground">
              RICELA MR. INDIA
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link href="/admin">Admin</Link>
          </Button>
          <Button asChild variant="gold" size="sm">
            <Link href="/register">Register Now</Link>
          </Button>
          <LanguageToggle />
        </div>

        <button
          className="grid size-10 place-items-center rounded-md border border-white/10 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/5 bg-background/95 backdrop-blur-xl md:hidden">
          <div className="container flex flex-col gap-1 py-4">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5 hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link href="/admin">Admin</Link>
              </Button>
              <Button asChild variant="gold" size="sm" className="flex-1">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

function LanguageToggle() {
  const { lang, setLang, allLangs } = useLang();
  return (
    <div className="flex items-center gap-1">
      {allLangs.map((l: { code: "en" | "hi" | "pa"; label: string }) => (
        <Button
          key={l.code}
          variant={lang === l.code ? "gold" : "outline"}
          size="sm"
          className="font-bold uppercase tracking-wider"
          onClick={() => setLang(l.code)}
          aria-label={`Language ${l.label}`}
        >
          {l.label}
        </Button>
      ))}
    </div>
  );
}
