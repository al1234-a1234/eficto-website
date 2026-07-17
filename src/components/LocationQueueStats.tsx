"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function LocationQueueStats() {
  const [indoor, setIndoor] = useState<number | null>(null);
  const [outdoor, setOutdoor] = useState<number | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      try {
        const [{ count: i }, { count: o }] = await Promise.all([
          supabase
            .from("eficto_waitlist")
            .select("id", { count: "exact", head: true })
            .eq("status", "waiting")
            .eq("location", "indoor"),
          supabase
            .from("eficto_waitlist")
            .select("id", { count: "exact", head: true })
            .eq("status", "waiting")
            .eq("location", "outdoor"),
        ]);
        setIndoor(i ?? 0);
        setOutdoor(o ?? 0);
      } catch {
        // network hiccup — leave state as-is, next poll retries
      }
    }

    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4">
      <Link
        href="/waitlist?location=indoor"
        className="rounded-2xl border border-eficto-cream/25 bg-eficto-cream/[0.04] px-6 py-5 text-center backdrop-blur-sm transition-all duration-300 ease-soft hover:border-eficto-gold active:scale-[0.97] sm:px-9"
      >
        <p className="font-arabic-display text-3xl tabular-nums text-eficto-gold">{indoor ?? "…"}</p>
        <p className="mt-1.5 text-xs text-eficto-cream/70">دور بالطاولة الداخلية</p>
      </Link>
      <Link
        href="/waitlist?location=outdoor"
        className="rounded-2xl border border-eficto-cream/25 bg-eficto-cream/[0.04] px-6 py-5 text-center backdrop-blur-sm transition-all duration-300 ease-soft hover:border-eficto-gold active:scale-[0.97] sm:px-9"
      >
        <p className="font-arabic-display text-3xl tabular-nums text-eficto-gold">{outdoor ?? "…"}</p>
        <p className="mt-1.5 text-xs text-eficto-cream/70">دور بالطاولة الخارجية</p>
      </Link>
    </div>
  );
}
