"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "./icons";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/staff")) return null;

  return (
    <footer className="bg-eficto-green-dark text-eficto-cream/90">
      <div className="divider-hairline mx-auto max-w-6xl" />
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-24 sm:px-8 md:grid-cols-3 md:gap-10">
        <div>
          <Logo />
          <p className="mt-7 max-w-xs text-sm font-light leading-8 text-eficto-cream/55">
            تجربة إيطالية أصيلة وسط أقواس خشبية وجلد أخضر غامق وإضاءة دافئة، في قلب بريدة.
          </p>
        </div>

        <div>
          <h3 className="font-arabic-body text-xs tracking-[0.25em] text-eficto-gold/80">الأقسام</h3>
          <ul className="mt-6 space-y-3.5 text-sm font-light text-eficto-cream/70">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="underline decoration-eficto-gold/0 decoration-1 underline-offset-4 transition-all duration-300 ease-soft hover:text-eficto-gold hover:decoration-eficto-gold/50"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-arabic-body text-xs tracking-[0.25em] text-eficto-gold/80">تواصل معنا</h3>
          <ul className="mt-6 space-y-4 text-sm font-light text-eficto-cream/70">
            <li className="flex items-center gap-3">
              <PhoneIcon className="h-4 w-4 shrink-0 text-eficto-gold/70" />
              <a href={SITE.whatsapp} target="_blank" rel="noopener noreferrer" dir="ltr" className="transition-colors duration-300 ease-soft hover:text-eficto-gold">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <ClockIcon className="h-4 w-4 shrink-0 text-eficto-gold/70" />
              <span>يومياً {SITE.hoursAr}</span>
            </li>
            <li className="flex items-center gap-3">
              <MapPinIcon className="h-4 w-4 shrink-0 text-eficto-gold/70" />
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 ease-soft hover:text-eficto-gold">
                {SITE.city}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <InstagramIcon className="h-4 w-4 shrink-0 text-eficto-gold/70" />
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors duration-300 ease-soft hover:text-eficto-gold">
                {SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="divider-hairline mx-auto max-w-6xl" />
      <div className="px-6 py-7 text-center text-xs font-light tracking-wide text-eficto-cream/35 sm:px-8">
        © {new Date().getFullYear()} افيكتو — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
