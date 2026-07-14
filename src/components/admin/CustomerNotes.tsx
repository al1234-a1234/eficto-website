"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CustomerNotes({ customerId, initialNotes }: { customerId: string; initialNotes: string | null }) {
  const [notes, setNotes] = useState(initialNotes ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  async function save() {
    setStatus("saving");
    const supabase = createClient();
    await supabase.from("eficto_customers").update({ notes }).eq("id", customerId);
    setStatus("saved");
    setTimeout(() => setStatus("idle"), 1500);
  }

  return (
    <div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
        placeholder="طاولة مفضلة، حساسية أكل، مناسبات…"
        className="w-full rounded-xl border border-eficto-gold/30 bg-white px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
      />
      <button
        onClick={save}
        disabled={status === "saving"}
        className="mt-3 rounded-full bg-eficto-green px-6 py-2 text-sm text-eficto-cream transition-transform hover:scale-105 disabled:opacity-60"
      >
        {status === "saving" ? "جاري الحفظ…" : status === "saved" ? "تم الحفظ" : "حفظ الملاحظات"}
      </button>
    </div>
  );
}
