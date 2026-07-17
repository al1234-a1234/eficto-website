"use client";

import { useState, type FormEvent } from "react";
import { useCustomerIdentity } from "@/lib/useCustomerIdentity";
import { IdentityForm } from "./IdentityForm";
import { IdentityBadge } from "./IdentityBadge";

type Status = "idle" | "submitting" | "success" | "error";

export function ReviewForm() {
  const { identity, ready, save, clear } = useCustomerIdentity();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(5);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!identity) return;
    setStatus("submitting");
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: identity.full_name,
      phone: identity.phone,
      rating,
      comment: String(form.get("comment") ?? ""),
    };

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 201) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(data.error ?? "حدث خطأ غير متوقع");
      }
    } catch {
      setStatus("error");
      setMessage("تعذر الاتصال بالخادم");
    }
  }

  if (!ready) return null;

  if (!identity) {
    return <IdentityForm onSubmit={save} />;
  }

  if (status === "success") {
    return (
      <div className="rounded-[28px] border border-eficto-gold/30 bg-white/70 p-9 text-center shadow-elegant">
        <p className="font-arabic-display text-3xl text-eficto-green">شكراً لتقييمك</p>
        <p className="mt-3 text-sm text-eficto-green-dark/60">نسعد بخدمتكم دائماً في افيكتو</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <IdentityBadge fullName={identity.full_name} onChange={clear} />

      <div className="rounded-[28px] border border-eficto-gold/25 bg-white/60 px-6 py-8 text-center shadow-premium">
        <label className="block text-sm text-eficto-green-dark/70">تقييمك</label>
        <div className="mt-4 flex items-center justify-center gap-2" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} نجوم`}
              className={`text-5xl leading-none transition-all duration-300 ease-soft hover:scale-110 active:scale-95 ${
                n <= rating ? "text-eficto-gold" : "text-eficto-gold/20"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm text-eficto-green-dark/80">تعليقك (اختياري)</label>
        <textarea
          name="comment"
          rows={4}
          className="w-full rounded-2xl border border-eficto-gold/30 bg-white/60 px-5 py-4 leading-7 shadow-premium outline-none transition-all duration-300 ease-soft focus:border-eficto-gold focus:shadow-elegant"
        />
      </div>

      {status === "error" && <p className="text-sm text-eficto-alert">{message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-eficto-green py-4 text-sm font-medium text-eficto-cream shadow-premium transition-all duration-300 ease-soft hover:scale-[1.01] hover:shadow-elegant active:scale-[0.98] disabled:opacity-60"
      >
        {status === "submitting" ? "جاري الإرسال…" : "إرسال التقييم"}
      </button>
    </form>
  );
}
