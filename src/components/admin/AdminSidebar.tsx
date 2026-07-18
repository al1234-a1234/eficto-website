"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ComponentType } from "react";
import { BadgeMark } from "@/components/Logo";
import {
  MenuIcon,
  CloseIcon,
  GridIcon,
  CalendarIcon,
  ClockIcon,
  UsersIcon,
  StarIcon,
  ChartIcon,
  GearIcon,
  BellIcon,
} from "@/components/icons";

const LINKS: { href: string; label: string; exact?: boolean; icon: ComponentType<{ className?: string }> }[] = [
  { href: "/admin", label: "نظرة عامة", exact: true, icon: GridIcon },
  { href: "/admin/reservations", label: "الحجوزات", icon: CalendarIcon },
  { href: "/admin/waitlist", label: "الانتظار", icon: ClockIcon },
  { href: "/admin/customers", label: "العملاء", icon: UsersIcon },
  { href: "/admin/recall", label: "استرجاع العملاء", icon: BellIcon },
  { href: "/admin/reviews", label: "التقييمات", icon: StarIcon },
  { href: "/admin/reports", label: "التقارير", icon: ChartIcon },
  { href: "/admin/settings", label: "الإعدادات", icon: GearIcon },
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
        <BadgeMark className="h-9 w-9" />
        <button className="text-eficto-cream" onClick={() => setOpen((v) => !v)} aria-label="القائمة">
          {open ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1.5 bg-eficto-green-dark px-5 pb-6 pt-1 lg:hidden">
          {LINKS.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors duration-300 ease-soft ${
                  isActive(link)
                    ? "bg-eficto-gold/15 text-eficto-gold"
                    : "text-eficto-cream/70 hover:bg-eficto-gold/5 hover:text-eficto-cream"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/"
            className="mt-2 rounded-xl px-4 py-2.5 text-xs text-eficto-cream/40 transition-colors hover:text-eficto-gold"
          >
            ← عودة للموقع
          </Link>
        </nav>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-gradient-to-b from-eficto-green-dark to-eficto-green-deep px-5 py-8 lg:flex">
        <div className="px-2">
          <BadgeMark className="h-11 w-11" />
        </div>
        <div className="mx-2 mt-6 h-px bg-gradient-to-r from-transparent via-eficto-gold/40 to-transparent" />
        <nav className="mt-6 flex flex-col gap-1.5">
          {LINKS.map((link) => {
            const Icon = link.icon;
            const active = isActive(link);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-300 ease-soft ${
                  active
                    ? "bg-eficto-gold/15 text-eficto-gold shadow-[inset_2px_0_0_0_rgba(215,183,144,0.9)]"
                    : "text-eficto-cream/70 hover:bg-eficto-gold/5 hover:text-eficto-cream"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-eficto-gold" : "text-eficto-cream/50"}`} />
                {link.label}
              </Link>
            );
          })}
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
