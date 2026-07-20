"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LogoMark } from "@/components/Logo";
import type { StaffPermissions } from "@/lib/types";

const LINKS: { href: string; label: string; key: keyof StaffPermissions }[] = [
  { href: "/staff/queue", label: "القائمة اليومية", key: "queue" },
  { href: "/staff/customers", label: "العملاء", key: "customers" },
  { href: "/staff/reviews", label: "التقييمات", key: "reviews" },
  { href: "/staff/reports", label: "التقارير", key: "reports" },
];

export function StaffNav({ fullName, permissions }: { fullName: string; permissions: StaffPermissions }) {
  const router = useRouter();
  const pathname = usePathname();
  const links = LINKS.filter((l) => permissions[l.key]);

  async function signOut() {
    await fetch("/api/staff/logout", { method: "POST" });
    router.replace("/staff/login");
    router.refresh();
  }

  return (
    <header className="border-b border-eficto-gold/20 bg-eficto-green-dark">
      <div className="flex items-center justify-between px-5 py-3 sm:px-8">
        <div className="flex items-center gap-3">
          <LogoMark className="h-7" />
          <span className="hidden text-sm text-eficto-cream/60 sm:inline">{fullName}</span>
        </div>
        <button
          onClick={signOut}
          className="rounded-full border border-eficto-gold/30 px-4 py-1.5 text-xs text-eficto-cream/70 transition-colors hover:border-eficto-gold hover:text-eficto-gold"
        >
          تسجيل الخروج
        </button>
      </div>
      {links.length > 1 && (
        <nav className="flex gap-1.5 overflow-x-auto px-5 pb-3 sm:px-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs transition-colors ${
                pathname === link.href
                  ? "bg-eficto-gold/15 text-eficto-gold"
                  : "text-eficto-cream/60 hover:text-eficto-cream"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
