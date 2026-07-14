"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function StaffPinSettings({ initialPin }: { initialPin: string }) {
  const [pin, setPin] = useState(initialPin);
  const [draft, setDraft] = useState(initialPin);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function save() {
    const trimmed = draft.trim();
    if (!/^\d{4,8}$/.test(trimmed)) return;
    setStatus("saving");
    const supabase = createClient();
    await supabase.from("eficto_settings").update({ value: trimmed }).eq("key", "staff_pin");
    setPin(trimmed);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-soft">
      <h2 className="font-serif text-lg text-eficto-green-dark">رمز دخول الطاقم</h2>
      <p className="mt-1 text-sm text-eficto-green-dark/60">
        شارك هذا الرمز مع فريق العمل ليدخلوا على قائمة اليوم من{" "}
        <span dir="ltr" className="font-medium">/staff/login</span> بدون حساب إداري
      </p>

      <p className="mt-4 font-arabic-display text-3xl tracking-[0.3em] text-eficto-gold-deep" dir="ltr">
        {pin}
      </p>

      <div className="mt-5 flex items-center gap-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          inputMode="numeric"
          dir="ltr"
          maxLength={8}
          className="w-40 rounded-xl border border-eficto-gold/40 bg-white px-4 py-2.5 text-center tracking-[0.3em] outline-none transition-colors focus:border-eficto-gold"
        />
        <button
          onClick={save}
          disabled={status === "saving" || draft.trim() === pin}
          className="rounded-full bg-eficto-green px-6 py-2.5 text-sm text-eficto-cream transition-transform hover:scale-105 disabled:opacity-50"
        >
          {status === "saving" ? "جاري الحفظ…" : status === "saved" ? "تم الحفظ" : "تحديث الرمز"}
        </button>
      </div>
    </div>
  );
}
