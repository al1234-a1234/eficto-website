"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "./icons";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-eficto-gold/25 bg-eficto-green-dark text-eficto-cream/90">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-3">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-7 text-eficto-cream/70">
            تجربة إيطالية أصيلة وسط أقواس خشبية وجلد أخضر غامق وإضاءة دافئة، في قلب بريدة.
          </p>
        </div>

        <div>
          <h3 className="font-serif text-lg text-eficto-gold">الأقسام</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-eficto-cream/75">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-eficto-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-serif text-lg text-eficto-gold">تواصل معنا</h3>
          <ul className="mt-4 space-y-3 text-sm text-eficto-cream/75">
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="h-4 w-4 shrink-0 text-eficto-gold" />
              <a href={`tel:${SITE.phone}`} dir="ltr" className="hover:text-eficto-gold">
                {SITE.phone}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <ClockIcon className="h-4 w-4 shrink-0 text-eficto-gold" />
              <span>يومياً {SITE.hoursAr}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <MapPinIcon className="h-4 w-4 shrink-0 text-eficto-gold" />
              <a href={SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-eficto-gold">
                {SITE.city}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <InstagramIcon className="h-4 w-4 shrink-0 text-eficto-gold" />
              <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-eficto-gold">
                {SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-eficto-gold/15 px-5 py-5 text-center text-xs text-eficto-cream/50 sm:px-8">
        © {new Date().getFullYear()} إفيكتو — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
