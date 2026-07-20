"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CustomerGender } from "@/lib/types";

const OPTIONS: { value: CustomerGender; label: string }[] = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

export function CustomerGenderControl({
  customerId,
  initialGender,
}: {
  customerId: string;
  initialGender: CustomerGender | null;
}) {
  const [gender, setGender] = useState(initialGender);
  const [saving, setSaving] = useState(false);

  async function update(value: CustomerGender) {
    const next = gender === value ? null : value;
    setSaving(true);
    setGender(next);
    try {
      const supabase = createClient();
      await supabase.from("eficto_customers").update({ gender: next }).eq("id", customerId);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() => update(opt.value)}
          disabled={saving}
          className={`rounded-full px-3 py-1 text-xs transition-colors disabled:opacity-50 ${
            gender === opt.value
              ? "bg-eficto-green/10 text-eficto-green"
              : "border border-eficto-gold/25 text-eficto-green-dark/40"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
