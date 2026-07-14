"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export function ReviewForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [rating, setRating] = useState(5);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: String(form.get("full_name") ?? ""),
      phone: String(form.get("phone") ?? ""),
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

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-eficto-gold/40 bg-white/70 p-8 text-center shadow-soft">
        <p className="font-arabic-display text-2xl text-eficto-green">شكراً لتقييمك</p>
        <p className="mt-3 text-sm text-eficto-green-dark/60">نسعد بخدمتكم دائماً في افيكتو</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <label className="mb-1.5 block text-sm text-eficto-green-dark/80">تقييمك</label>
        <div className="flex items-center gap-1" dir="ltr">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              aria-label={`${n} نجوم`}
              className={`text-3xl leading-none transition-colors ${n <= rating ? "text-eficto-gold" : "text-eficto-gold/25"}`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-eficto-green-dark/80">تعليقك (اختياري)</label>
        <textarea
          name="comment"
          rows={4}
          className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
        />
      </div>

      {status === "error" && <p className="text-sm text-eficto-alert">{message}</p>}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-eficto-green py-3.5 text-sm font-medium text-eficto-cream transition-transform duration-300 ease-soft hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "submitting" ? "جاري الإرسال…" : "إرسال التقييم"}
      </button>
    </form>
  );
}
