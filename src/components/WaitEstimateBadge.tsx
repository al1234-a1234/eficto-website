"use client";

import { useEffect, useState } from "react";

export function WaitEstimateBadge() {
  const [minutes, setMinutes] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/wait-estimate", { cache: "no-store" });
        const data = await res.json();
        setMinutes(typeof data.minutes === "number" ? data.minutes : null);
      } catch {
        // network hiccup — keep last known value, next poll retries
      }
    }

    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  if (minutes === null) return null;

  return (
    <p className="mt-3 font-arabic-body text-xs text-eficto-cream/60">
      الانتظار التقريبي الآن: <span className="text-eficto-gold">~{minutes} دقيقة</span>
    </p>
  );
}
