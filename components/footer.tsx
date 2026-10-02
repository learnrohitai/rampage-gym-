import Link from "next/link";
import { Instagram, Mail, MapPin, Phone, Zap } from "lucide-react";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-black/40">
      <div className="container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-red-600 text-black">
              <Zap className="size-5" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl font-black text-gradient-gold">
              {SITE.gym.name.toUpperCase()}
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {SITE.eventName} — {SITE.eventTagline}. Organized with passion by{" "}
            {SITE.organizedBy}.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold tracking-widest text-gold">
            QUICK LINKS
          </h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link href="/#categories" className="hover:text-primary">Categories</Link></li>
            <li><Link href="/register" className="hover:text-primary">Register</Link></li>
            <li><Link href="/#rules" className="hover:text-primary">Rules</Link></li>
            <li><Link href="/#faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/admin" className="hover:text-primary">Organizer Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-bold tracking-widest text-gold">
            CONTACT
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Phone className="size-4 text-gold" /> {SITE.contactPhone}
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 text-gold" /> {SITE.contactEmail}
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-gold" /> {SITE.venue}, {SITE.city}
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4 text-gold" />
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-primary">
                @rampagegym
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5 py-5 text-center text-xs text-muted-foreground">
        © 2026 {SITE.gym.name}. All rights reserved. • {SITE.eventName}
      </div>
    </footer>
  );
}
