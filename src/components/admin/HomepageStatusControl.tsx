"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "available" | "busy" | "full";

const OPTIONS: { value: Status; label: string }[] = [
  { value: "available", label: "متاحة الآن" },
  { value: "busy", label: "مزدحم الآن" },
  { value: "full", label: "غير متاحة الآن" },
];

export function HomepageStatusControl() {
  const [status, setStatus] = useState<Status | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();

    async function load() {
      const { data } = await supabase
        .from("eficto_settings")
        .select("value")
        .eq("key", "homepage_status")
        .maybeSingle();
      setStatus((data?.value as Status) ?? "available");
    }

    load();
    const interval = setInterval(load, 2500);
    return () => clearInterval(interval);
  }, []);

  async function update(value: Status) {
    setSaving(true);
    setStatus(value);
    try {
      const supabase = createClient();
      await supabase.from("eficto_settings").update({ value }).eq("key", "homepage_status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-soft">
      <h2 className="font-serif text-lg text-eficto-green-dark">حالة الموقع الرئيسي</h2>
      <p className="mt-1 text-xs text-eficto-green-dark/50">
        هذا اللي يشوفه الزوار بالصفحة الرئيسية — نفس التحكم الموجود بشاشة الاستقبال
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => update(opt.value)}
            disabled={saving}
            className={`rounded-full px-4 py-2 text-xs transition-colors disabled:opacity-50 ${
              status === opt.value
                ? "bg-eficto-green text-eficto-cream"
                : "border border-eficto-gold/30 text-eficto-green-dark/70 hover:border-eficto-gold"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
