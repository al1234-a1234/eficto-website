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
      <div className="rounded-[32px] bg-champagne p-12 text-center shadow-elegant">
        <p className="font-arabic-display text-3xl font-normal text-eficto-green">شكراً لتقييمك</p>
        <p className="mt-4 text-sm font-light leading-7 text-eficto-green-dark/55">نسعد بخدمتكم دائماً في افيكتو</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <IdentityBadge fullName={identity.full_name} onChange={clear} />

      <div className="rounded-[32px] bg-champagne px-8 py-10 text-center shadow-premium">
        <label className="text-xs tracking-[0.15em] text-eficto-green-dark/55">تقييمك</label>
        <div className="mt-6 flex items-center justify-center gap-3" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} نجوم`}
              className={`text-4xl leading-none transition-all duration-500 ease-soft hover:-translate-y-0.5 active:scale-90 ${
                n <= rating ? "text-eficto-gold" : "text-eficto-gold/15"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-3 block text-xs tracking-[0.1em] text-eficto-green-dark/60">تعليقك (اختياري)</label>
        <textarea
          name="comment"
          rows={4}
          placeholder="أخبرنا عن تجربتك..."
          className="w-full rounded-[24px] bg-white/70 px-6 py-5 leading-8 text-eficto-green-dark shadow-premium outline-none transition-all duration-500 ease-soft placeholder:text-eficto-green-dark/30 focus:shadow-elegant"
        />
      </div>

      {status === "error" && <p className="text-sm text-eficto-alert">{message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-2xl bg-eficto-green py-[18px] text-sm text-eficto-cream shadow-premium transition-all duration-500 ease-soft hover:-translate-y-0.5 hover:shadow-elegant active:translate-y-0 active:scale-[0.99] disabled:opacity-60"
      >
        {status === "submitting" ? "جاري الإرسال…" : "إرسال التقييم"}
      </button>
    </form>
  );
}
