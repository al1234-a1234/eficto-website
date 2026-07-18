"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@/components/Logo";
import { MenuIcon, CloseIcon } from "@/components/icons";

const LINKS = [
  { href: "/admin", label: "نظرة عامة", exact: true },
  { href: "/admin/reservations", label: "الحجوزات" },
  { href: "/admin/waitlist", label: "الانتظار" },
  { href: "/admin/customers", label: "العملاء" },
  { href: "/admin/reviews", label: "التقييمات" },
  { href: "/admin/reports", label: "التقارير" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isActive(link: (typeof LINKS)[number]) {
    return link.exact ? pathname === link.href : pathname?.startsWith(link.href);
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-eficto-green-dark px-5 py-4 lg:hidden">
        <LogoMark className="h-8" />
        <button
          className="text-eficto-cream"
          onClick={() => setOpen((v) => !v)}
          aria-label="القائمة"
        >
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1.5 bg-eficto-green-dark px-5 pb-6 pt-1 lg:hidden">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`rounded-xl px-4 py-2.5 text-sm transition-colors duration-300 ease-soft ${
                isActive(link)
                  ? "bg-eficto-gold/15 text-eficto-gold"
                  : "text-eficto-cream/70 hover:bg-eficto-gold/5 hover:text-eficto-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/"
            className="mt-2 rounded-xl px-4 py-2.5 text-xs text-eficto-cream/40 transition-colors hover:text-eficto-gold"
          >
            ← عودة للموقع
          </Link>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-eficto-green-dark px-5 py-8 lg:flex">
        <div className="px-2">
          <LogoMark className="h-9" />
        </div>
        <div className="mx-2 mt-6 h-px bg-gradient-to-r from-transparent via-eficto-gold/40 to-transparent" />
        <nav className="mt-6 flex flex-col gap-1.5">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2.5 text-sm transition-colors duration-300 ease-soft ${
                isActive(link)
                  ? "bg-eficto-gold/15 text-eficto-gold"
                  : "text-eficto-cream/70 hover:bg-eficto-gold/5 hover:text-eficto-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/"
          className="mt-auto rounded-xl px-4 py-2.5 text-xs text-eficto-cream/40 transition-colors hover:text-eficto-gold"
        >
          ← عودة للموقع
        </Link>
      </aside>
    </>
  );
}
