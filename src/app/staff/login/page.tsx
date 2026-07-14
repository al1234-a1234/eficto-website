"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";

export default function StaffLoginPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    const pin = String(form.get("pin") ?? "");

    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      if (res.ok) {
        router.replace("/staff/queue");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      setStatus("error");
      setError(data?.error ?? "تعذر تسجيل الدخول");
    } catch {
      setStatus("error");
      setError("تعذر الاتصال بالخادم");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-eficto-green-dark px-6">
      <div className="flex w-full max-w-sm flex-col items-center">
        <LogoMark className="h-14" />
        <h1 className="mt-6 font-arabic-display text-2xl text-eficto-cream">دخول الطاقم</h1>
        <p className="mt-1 text-sm text-eficto-cream/50">أدخل رمز الطاقم لعرض قائمة الحجوزات والانتظار</p>

        <form onSubmit={handleSubmit} className="mt-10 w-full space-y-5">
          <input
            name="pin"
            type="tel"
            inputMode="numeric"
            dir="ltr"
            placeholder="••••"
            required
            maxLength={8}
            autoFocus
            className="w-full rounded-xl border border-eficto-gold/40 bg-eficto-green-dark/40 px-4 py-3 text-center text-2xl tracking-[0.5em] text-eficto-cream outline-none transition-colors focus:border-eficto-gold"
          />

          {status === "error" && <p className="text-center text-sm text-red-300">{error}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-eficto-gold py-3.5 text-sm font-medium text-eficto-green-dark transition-transform duration-300 ease-soft hover:scale-[1.01] disabled:opacity-60"
          >
            {status === "submitting" ? "جاري الدخول…" : "دخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
