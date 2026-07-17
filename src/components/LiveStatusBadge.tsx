"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Status = "available" | "busy" | "full" | null;

const STATUS_LABEL: Record<Exclude<Status, null>, string> = {
  available: "الطاولات متاحة الآن",
  busy: "مزدحم الآن",
  full: "الطاولات غير متاحة حالياً",
};

const STATUS_COLOR: Record<Exclude<Status, null>, string> = {
  available: "#7FB58E",
  busy: "#E0A94A",
  full: "#C4756B",
};

export function LiveStatusBadge() {
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/status", { cache: "no-store" });
        const data = await res.json();
        setStatus(data.status ?? "available");
      } catch {
        setStatus("available");
      }
    }

    loadStatus();
    const interval = setInterval(loadStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link
      href="/waitlist"
      className="group inline-flex items-center gap-2.5 rounded-full border border-eficto-gold/50 bg-eficto-green-dark/40 px-4 py-2 backdrop-blur transition-colors duration-300 ease-soft hover:border-eficto-gold"
    >
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: status ? STATUS_COLOR[status] : "#7FB58E" }}
      />
      <span className="font-arabic-body text-sm text-eficto-cream/90">
        {status === null ? "جاري التحقق من الحالة…" : STATUS_LABEL[status]}
      </span>
    </Link>
  );
}
