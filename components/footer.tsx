import Link from "next/link";
import { ArrowUp, Instagram, MapPin, Phone, Zap } from "lucide-react";
import { SITE } from "@/lib/site";

export default function Footer() {
  const instagramHandle =
    "@" + SITE.instagram.replace(/\/+$/, "").split("/").pop();

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
            <li><Link href="/#gallery" className="hover:text-primary">Gallery</Link></li>
            <li><Link href="/register" className="hover:text-primary">Register</Link></li>
            <li><Link href="/#rules" className="hover:text-primary">Rules</Link></li>
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
              <MapPin className="size-4 text-gold" /> {SITE.venue}, {SITE.city}
            </li>
            <li className="flex items-center gap-2">
              <a
                href="https://www.google.com/maps/search/MGM+Public+School+Dugri+Phase+Ludhiana"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                <MapPin className="size-4 text-gold" />
                Open in Google Maps
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="size-4 text-gold" />
              <a href={SITE.instagram} target="_blank" rel="noreferrer" className="hover:text-primary">
                {instagramHandle}
              </a>
            </li>
          </ul>

          {/* Google Maps embed */}
          <div className="mt-6 rounded-xl overflow-hidden border border-white/10 shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228435.8893849058!2d75.83768157730625!3d30.905962996499563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39044b3f63f758e9%3A0x5b93c66f8e1e4b4!2sMGM%20Public%20School%2C%20Dugri%20Phase%2C%20Ludhiana!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin"
              className="h-48 w-full rounded-t-xl"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MGM Public School Dugri Phase - Google Maps"
            />
          </div>
        </div>
      </div>
      <div className="container flex flex-col items-center justify-between gap-3 border-t border-white/5 py-5 text-xs text-muted-foreground sm:flex-row">
        <p>
          © 2026 {SITE.gym.name}. All rights reserved. • {SITE.eventName} •{" "}
          {SITE.eventDate}
        </p>
        <a
          href="#top"
          className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 font-semibold transition-colors hover:border-gold/40 hover:text-primary"
        >
          <ArrowUp className="size-3.5" /> Back to top
        </a>
      </div>
    </footer>
  );
}
