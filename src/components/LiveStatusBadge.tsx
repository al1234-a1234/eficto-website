"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function LiveStatusBadge() {
  const [waitingCount, setWaitingCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadCount() {
      try {
        const { count } = await supabase
          .from("eficto_waitlist")
          .select("id", { count: "exact", head: true })
          .eq("status", "waiting");
        setWaitingCount(count ?? 0);
      } catch {
        setWaitingCount(0);
      }
    }

    loadCount();
    const interval = setInterval(loadCount, 8000);
    return () => clearInterval(interval);
  }, []);

  const isBusy = (waitingCount ?? 0) > 0;

  return (
    <Link
      href="/waitlist"
      className="group inline-flex items-center gap-2.5 rounded-full border border-eficto-gold/50 bg-eficto-green-dark/40 px-4 py-2 backdrop-blur transition-colors duration-300 ease-soft hover:border-eficto-gold"
    >
      <span
        className={`h-2 w-2 rounded-full ${isBusy ? "bg-eficto-alert" : "bg-eficto-light-status"}`}
        style={{ backgroundColor: isBusy ? "#C4756B" : "#7FB58E" }}
      />
      <span className="font-arabic-body text-sm text-eficto-cream/90">
        {waitingCount === null
          ? "جاري التحقق من الحالة…"
          : isBusy
          ? `مزدحم الآن — ${waitingCount} بالانتظار`
          : "الطاولات متاحة الآن"}
      </span>
    </Link>
  );
}
