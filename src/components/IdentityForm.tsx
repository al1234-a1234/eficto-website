"use client";

import { type FormEvent } from "react";
import type { CustomerIdentity } from "@/lib/identity";

export function IdentityForm({ onSubmit }: { onSubmit: (identity: CustomerIdentity) => void }) {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit({
      full_name: String(form.get("full_name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <p className="font-serif text-lg text-eficto-green-dark">قبل ما نكمل، عرّفنا عليك</p>
        <p className="mt-1 text-sm text-eficto-green-dark/60">اسمك ورقم جوالك يُحفظان لحسابك ولا تحتاج تكتبهم مرة ثانية</p>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-eficto-green-dark/80">الاسم الكامل</label>
        <input
          name="full_name"
          required
          minLength={2}
          className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-eficto-green-dark/80">رقم الجوال</label>
        <input
          name="phone"
          type="tel"
          dir="ltr"
          placeholder="05XXXXXXXX"
          required
          pattern="^(?:\+966|0)5\d{8}$"
          className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 text-left outline-none transition-colors focus:border-eficto-gold"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-full bg-eficto-green py-3.5 text-sm font-medium text-eficto-cream transition-transform duration-300 ease-soft hover:scale-[1.01]"
      >
        متابعة
      </button>
    </form>
  );
}
