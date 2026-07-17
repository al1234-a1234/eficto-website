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
    <form onSubmit={handleSubmit} className="space-y-7 rounded-[32px] bg-champagne p-9 shadow-premium">
      <div>
        <p className="font-serif text-xl font-normal text-eficto-green-dark">قبل ما نكمل، عرّفنا عليك</p>
        <p className="mt-3 text-sm font-light leading-7 text-eficto-green-dark/55">اسمك ورقم جوالك يُحفظان لحسابك ولا تحتاج تكتبهم مرة ثانية</p>
      </div>

      <div>
        <label className="mb-3 block text-xs tracking-[0.1em] text-eficto-green-dark/60">الاسم الكامل</label>
        <input
          name="full_name"
          required
          minLength={2}
          className="w-full rounded-2xl bg-white/70 px-6 py-4 text-eficto-green-dark shadow-premium outline-none transition-all duration-500 ease-soft focus:shadow-elegant"
        />
      </div>

      <div>
        <label className="mb-3 block text-xs tracking-[0.1em] text-eficto-green-dark/60">رقم الجوال</label>
        <input
          name="phone"
          type="tel"
          dir="ltr"
          placeholder="05XXXXXXXX"
          required
          pattern="^(?:\+966|0)5\d{8}$"
          className="w-full rounded-2xl bg-white/70 px-6 py-4 text-left text-eficto-green-dark shadow-premium outline-none transition-all duration-500 ease-soft focus:shadow-elegant"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-2xl bg-eficto-green py-[18px] text-sm text-eficto-cream shadow-premium transition-all duration-500 ease-soft hover:-translate-y-0.5 hover:shadow-elegant active:translate-y-0 active:scale-[0.98]"
      >
        متابعة
      </button>
    </form>
  );
}
