"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatArabicDateTime } from "@/lib/format";
import { useCustomerIdentity } from "@/lib/useCustomerIdentity";
import { IdentityForm } from "./IdentityForm";
import { IdentityBadge } from "./IdentityBadge";

type Status = "idle" | "submitting" | "success" | "error" | "full";
type Location = "indoor" | "outdoor";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function ReservationForm() {
  const { identity, ready, save, clear } = useCustomerIdentity();
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [confirmedTime, setConfirmedTime] = useState<string | null>(null);
  const [dailyNumber, setDailyNumber] = useState<number | null>(null);
  const [location, setLocation] = useState<Location>("indoor");
  const [partySize, setPartySize] = useState(2);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!identity) return;
    setStatus("submitting");
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: identity.full_name,
      phone: identity.phone,
      date: String(form.get("date") ?? ""),
      time: String(form.get("time") ?? ""),
      party_size: partySize,
      location,
    };

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 201) {
        setStatus("success");
        setConfirmedTime(data.reservation.reservation_time);
        setDailyNumber(data.dailyNumber ?? null);
      } else if (res.status === 409) {
        setStatus("full");
        setMessage(data.error);
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

  if (status === "success" && confirmedTime) {
    return (
      <div className="rounded-2xl border border-eficto-gold/40 bg-white/70 p-8 text-center shadow-soft">
        <p className="font-arabic-display text-2xl text-eficto-green">تم تأكيد حجزك</p>
        {dailyNumber !== null && (
          <p className="mt-2 font-arabic-display text-4xl text-eficto-gold-deep">رقم {dailyNumber}</p>
        )}
        <p className="mt-3 text-eficto-green-dark/75">{formatArabicDateTime(confirmedTime)}</p>
        <p className="mt-1 text-sm text-eficto-green-dark/60">
          {location === "indoor" ? "جلسة داخلية" : "جلسة خارجية"}
        </p>
        <p className="mt-6 text-sm text-eficto-green-dark/60">نسعد باستقبالكم في افيكتو</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <IdentityBadge fullName={identity.full_name} onChange={clear} />

      <div>
        <label className="mb-1.5 block text-sm text-eficto-green-dark/80">مكان الجلسة</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLocation("indoor")}
            className={`rounded-xl border py-3 text-sm transition-colors ${
              location === "indoor"
                ? "border-eficto-green bg-eficto-green text-eficto-cream"
                : "border-eficto-gold/40 bg-white/70 text-eficto-green-dark/80"
            }`}
          >
            داخلي
          </button>
          <button
            type="button"
            onClick={() => setLocation("outdoor")}
            className={`rounded-xl border py-3 text-sm transition-colors ${
              location === "outdoor"
                ? "border-eficto-green bg-eficto-green text-eficto-cream"
                : "border-eficto-gold/40 bg-white/70 text-eficto-green-dark/80"
            }`}
          >
            خارجي
          </button>
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-eficto-green-dark/80">عدد الأشخاص</label>
        <div className="flex flex-wrap gap-2" dir="ltr">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPartySize(n)}
              className={`flex h-11 w-11 items-center justify-center rounded-full border text-sm transition-colors ${
                partySize === n
                  ? "border-eficto-green bg-eficto-green text-eficto-cream"
                  : "border-eficto-gold/40 bg-white/70 text-eficto-green-dark/80"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm text-eficto-green-dark/80">التاريخ</label>
          <input
            name="date"
            type="date"
            required
            min={todayISO()}
            className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm text-eficto-green-dark/80">الوقت</label>
          <input
            name="time"
            type="time"
            required
            className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
          />
        </div>
      </div>

      <p className="text-xs text-eficto-green-dark/50">ساعات العمل يومياً ٥:٠٠ م — ٢:٣٠ ص</p>

      {status === "error" && <p className="text-sm text-eficto-alert">{message}</p>}
      {status === "full" && (
        <div className="rounded-xl border border-eficto-alert/40 bg-eficto-alert/5 p-4 text-sm">
          <p className="text-eficto-alert">{message}</p>
          <Link href="/waitlist" className="mt-2 inline-block font-medium text-eficto-green underline">
            انضم لقائمة الانتظار بدلاً من ذلك
          </Link>
        </div>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full rounded-full bg-eficto-green py-3.5 text-sm font-medium text-eficto-cream transition-transform duration-300 ease-soft hover:scale-[1.01] disabled:opacity-60"
      >
        {status === "submitting" ? "جاري التأكيد…" : "تأكيد الحجز"}
      </button>
    </form>
  );
}
