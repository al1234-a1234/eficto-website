"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Location = "indoor" | "outdoor";
type LocationRow = { location: Location; is_full: boolean };

const LABELS: Record<Location, string> = { indoor: "الجلسة الداخلية", outdoor: "الجلسة الخارجية" };

export function LocationStatusToggle({ initialStatus }: { initialStatus: LocationRow[] }) {
  const [status, setStatus] = useState(initialStatus);

  async function toggle(location: Location) {
    const current = status.find((s) => s.location === location);
    const next = !current?.is_full;
    setStatus((prev) => prev.map((s) => (s.location === location ? { ...s, is_full: next } : s)));
    const supabase = createClient();
    await supabase
      .from("eficto_location_status")
      .update({ is_full: next, updated_at: new Date().toISOString() })
      .eq("location", location);
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {status.map((s) => (
        <div
          key={s.location}
          className="flex items-center justify-between rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-soft"
        >
          <div>
            <p className="font-serif text-eficto-green-dark">{LABELS[s.location]}</p>
            <p className="mt-1 text-xs text-eficto-green-dark/50">
              {s.is_full ? "ممتلئة — الحجوزات الجديدة موقوفة" : "متاحة للحجز"}
            </p>
          </div>
          <button
            onClick={() => toggle(s.location)}
            className={`shrink-0 rounded-full px-5 py-2 text-xs font-medium transition-colors ${
              s.is_full ? "bg-eficto-alert text-white" : "border border-eficto-green/40 text-eficto-green"
            }`}
          >
            {s.is_full ? "إلغاء الامتلاء" : "وضع ممتلئة"}
          </button>
        </div>
      ))}
    </div>
  );
}
