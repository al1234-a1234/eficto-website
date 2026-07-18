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
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-8 flex flex-row items-center gap-3 sm:gap-4">
      <Link
        href="/waitlist?location=indoor"
        className="flex flex-col items-center rounded-full bg-eficto-gold px-6 py-3 text-sm font-medium text-eficto-green-dark shadow-premium transition-all duration-300 ease-soft hover:scale-[1.03] hover:shadow-elegant active:scale-[0.97] sm:px-9"
      >
        <span>طاولة داخلية</span>
        <span className="mt-0.5 font-arabic-display text-lg tabular-nums leading-none text-eficto-green-dark/80">
          {indoor ?? "…"}
        </span>
      </Link>
      <Link
        href="/waitlist?location=outdoor"
        className="flex flex-col items-center rounded-full border border-eficto-cream/40 bg-eficto-cream/[0.04] px-6 py-3 text-sm text-eficto-cream backdrop-blur-sm transition-all duration-300 ease-soft hover:border-eficto-gold hover:text-eficto-gold active:scale-[0.97] sm:px-9"
      >
        <span>طاولة خارجية</span>
        <span className="mt-0.5 font-arabic-display text-lg tabular-nums leading-none text-eficto-cream/70">
          {outdoor ?? "…"}
        </span>
      </Link>
    </div>
  );
}
