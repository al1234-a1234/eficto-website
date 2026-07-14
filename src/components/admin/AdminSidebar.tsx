"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoMark } from "@/components/Logo";

const LINKS = [
  { href: "/admin", label: "نظرة عامة", exact: true },
  { href: "/admin/reservations", label: "الحجوزات" },
  { href: "/admin/waitlist", label: "الانتظار" },
  { href: "/admin/customers", label: "العملاء" },
  { href: "/admin/reports", label: "التقارير" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-eficto-green-dark px-5 py-8">
      <div className="px-2">
        <LogoMark className="h-9" />
      </div>
      <nav className="mt-10 flex flex-col gap-1.5">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2.5 text-sm transition-colors duration-300 ease-soft ${
                active
                  ? "bg-eficto-gold/15 text-eficto-gold"
                  : "text-eficto-cream/70 hover:bg-eficto-gold/5 hover:text-eficto-cream"
              }`}
            >
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
  );
}
