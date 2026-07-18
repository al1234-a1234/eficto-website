"use client";

import { useState } from "react";
import { SITE } from "@/lib/constants";
import { formatDistanceAr, haversineMeters } from "@/lib/distance";

type State = "idle" | "loading" | "found" | "denied";

/**
 * Location is requested only when the visitor explicitly asks — never on page load.
 * Opening the homepage should never trigger a location permission prompt.
 */
export function DistanceBadge() {
  const [state, setState] = useState<State>("idle");
  const [distance, setDistance] = useState<string | null>(null);

  function locate() {
    if (!navigator.geolocation) {
      setState("denied");
      return;
    }
    setState("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const meters = haversineMeters(pos.coords.latitude, pos.coords.longitude, SITE.lat, SITE.lng);
        setDistance(formatDistanceAr(meters));
        setState("found");
      },
      () => setState("denied"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
    );
  }

  if (state === "found") {
    return <span className="text-xs text-eficto-green">تبعد عنك تقريباً {distance}</span>;
  }

  if (state === "loading") {
    return <span className="text-xs text-eficto-green-dark/40">جاري تحديد المسافة…</span>;
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        locate();
      }}
      className="text-xs text-eficto-green underline decoration-eficto-green/30 underline-offset-2"
    >
      فعّل الموقع لمعرفة المسافة
    </button>
  );
}
