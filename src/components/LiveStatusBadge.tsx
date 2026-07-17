"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function LiveStatusBadge() {
  const [waitingCount, setWaitingCount] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadCount() {
      const { count } = await supabase
        .from("eficto_waitlist")
        .select("id", { count: "exact", head: true })
        .eq("status", "waiting");
      setWaitingCount(count ?? 0);
    }

    loadCount();

    const channel = supabase
      .channel("public-waitlist-status")
      .on("postgres_changes", { event: "*", schema: "public", table: "eficto_waitlist" }, loadCount)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const isBusy = (waitingCount ?? 0) > 0;

  return (
    <Link href="/waitlist" className="group inline-flex items-center gap-3">
      <span
        className="h-[7px] w-[7px] shrink-0 rounded-full transition-transform duration-300 ease-soft group-hover:scale-125"
        style={{ backgroundColor: isBusy ? "#C4756B" : "#7FB58E" }}
      />
      <span className="font-arabic-body text-sm text-eficto-cream/75 underline decoration-eficto-cream/0 decoration-1 underline-offset-[6px] transition-all duration-300 ease-soft group-hover:text-eficto-cream group-hover:decoration-eficto-gold/60">
        {waitingCount === null
          ? "جاري التحقق من الحالة…"
          : isBusy
          ? `مزدحم الآن — ${waitingCount} بالانتظار`
          : "الطاولات متاحة الآن"}
      </span>
    </Link>
  );
}
