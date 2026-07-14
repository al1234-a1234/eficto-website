"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { InstagramIcon, MapPinIcon, MenuIcon, CloseIcon } from "./icons";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/staff")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-eficto-gold/30 bg-eficto-green/95 backdrop-blur supports-[backdrop-filter]:bg-eficto-green/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-arabic-body text-[15px] transition-colors duration-300 ease-soft ${
                  active ? "text-eficto-gold" : "text-eficto-cream/85 hover:text-eficto-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="إنستقرام افيكتو"
            className="text-eficto-cream/80 transition-colors hover:text-eficto-gold"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="موقع افيكتو بخرائط قوقل"
            className="text-eficto-cream/80 transition-colors hover:text-eficto-gold"
          >
            <MapPinIcon className="h-5 w-5" />
          </a>
          <Link
            href="/reserve"
            className="rounded-full border border-eficto-gold px-5 py-2 text-sm text-eficto-gold transition-colors duration-300 ease-soft hover:bg-eficto-gold hover:text-eficto-green-dark"
          >
            احجز الآن
          </Link>
        </div>

        <button
          className="text-eficto-cream lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-eficto-gold/20 bg-eficto-green px-5 pb-6 pt-2 lg:hidden">
          <nav className="flex flex-col gap-4 pt-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-arabic-body text-base ${
                  pathname === link.href ? "text-eficto-gold" : "text-eficto-cream/85"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-5 border-t border-eficto-gold/20 pt-4">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-eficto-cream/80">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-eficto-cream/80">
                <MapPinIcon className="h-5 w-5" />
              </a>
              <Link
                href="/reserve"
                onClick={() => setOpen(false)}
                className="mr-auto rounded-full border border-eficto-gold px-5 py-2 text-sm text-eficto-gold"
              >
                احجز الآن
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
