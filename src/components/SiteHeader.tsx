"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "./Logo";
import { InstagramIcon, MapPinIcon, MenuIcon, CloseIcon } from "./icons";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (pathname?.startsWith("/admin") || pathname?.startsWith("/staff")) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-eficto-gold/15 bg-eficto-green-dark">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ease-soft hover:opacity-80"
        >
          <LogoMark className="h-8" />
        </Link>

        <div aria-hidden="true" />

        <nav className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`font-arabic-body text-[15px] font-light transition-colors duration-300 ease-soft ${
                  active ? "text-eficto-gold" : "text-eficto-cream/70 hover:text-eficto-gold"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-6 lg:flex">
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="إنستقرام افيكتو"
            className="text-eficto-cream/60 transition-colors duration-300 ease-soft hover:text-eficto-gold"
          >
            <InstagramIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="موقع افيكتو بخرائط قوقل"
            className="text-eficto-cream/60 transition-colors duration-300 ease-soft hover:text-eficto-gold"
          >
            <MapPinIcon className="h-[18px] w-[18px]" />
          </a>
          <Link
            href="/waitlist"
            className="rounded-xl border border-eficto-gold/50 px-6 py-2.5 text-sm text-eficto-gold transition-all duration-300 ease-soft hover:bg-eficto-gold hover:text-eficto-green-dark active:scale-[0.97]"
          >
            احجز الآن
          </Link>
        </div>

        <button
          className="text-eficto-cream/80 transition-colors duration-300 ease-soft hover:text-eficto-gold lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-eficto-gold/15 bg-eficto-green-dark px-6 pb-8 pt-3 lg:hidden">
          <nav className="flex flex-col gap-5 pt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`font-arabic-body text-base font-light ${
                  pathname === link.href ? "text-eficto-gold" : "text-eficto-cream/75"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-6 border-t border-eficto-gold/15 pt-5">
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="text-eficto-cream/60">
                <InstagramIcon className="h-[18px] w-[18px]" />
              </a>
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="text-eficto-cream/60">
                <MapPinIcon className="h-[18px] w-[18px]" />
              </a>
              <Link
                href="/waitlist"
                onClick={() => setOpen(false)}
                className="mr-auto rounded-xl border border-eficto-gold/50 px-6 py-2.5 text-sm text-eficto-gold"
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
