"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoyaltySettings({
  initialThreshold,
  initialReward,
}: {
  initialThreshold: string;
  initialReward: string;
}) {
  const [threshold, setThreshold] = useState(initialThreshold);
  const [reward, setReward] = useState(initialReward);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function save() {
    const trimmedThreshold = threshold.trim();
    const trimmedReward = reward.trim();
    if (!/^[1-9]\d*$/.test(trimmedThreshold) || !trimmedReward) return;
    setStatus("saving");
    const supabase = createClient();
    await Promise.all([
      supabase.from("eficto_settings").update({ value: trimmedThreshold }).eq("key", "loyalty_threshold"),
      supabase.from("eficto_settings").update({ value: trimmedReward }).eq("key", "loyalty_reward"),
    ]);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-premium">
      <h2 className="font-serif text-lg text-eficto-green-dark">برنامج الولاء</h2>
      <p className="mt-1 text-sm text-eficto-green-dark/60">
        يظهر تلقائياً للعميل بحسابه بعد كل زيارة — عدد الزيارات يحسب تلقائياً من نظام الاستقبال
      </p>

      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-1.5 block text-sm text-eficto-green-dark/70">عدد الزيارات لاستحقاق المكافأة</label>
          <input
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            inputMode="numeric"
            dir="ltr"
            className="w-32 rounded-xl border border-eficto-gold/40 bg-white px-4 py-2.5 text-center outline-none transition-colors focus:border-eficto-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-eficto-green-dark/70">وصف المكافأة</label>
          <input
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="w-full max-w-sm rounded-xl border border-eficto-gold/40 bg-white px-4 py-2.5 outline-none transition-colors focus:border-eficto-gold"
          />
        </div>
        <button
          onClick={save}
          disabled={status === "saving"}
          className="rounded-full bg-eficto-green px-6 py-2.5 text-sm text-eficto-cream transition-transform hover:scale-105 disabled:opacity-50"
        >
          {status === "saving" ? "جاري الحفظ…" : status === "saved" ? "تم الحفظ" : "حفظ"}
        </button>
      </div>
    </div>
  );
}
