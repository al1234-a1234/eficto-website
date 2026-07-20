"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";

interface RosterMember {
  id: string;
  full_name: string;
}

export default function StaffLoginPage() {
  const router = useRouter();
  const [roster, setRoster] = useState<RosterMember[] | null>(null);
  const [selected, setSelected] = useState<RosterMember | null>(null);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/staff/roster")
      .then((res) => res.json())
      .then((data) => setRoster(data.members ?? []))
      .catch(() => setRoster([]));
  }, []);

  async function submitPin(value: string) {
    if (!selected || value.length < 4) return;
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffId: selected.id, pin: value }),
      });
      if (res.ok) {
        router.replace("/staff/queue");
        router.refresh();
        return;
      }
      const data = await res.json().catch(() => null);
      setStatus("error");
      setError(data?.error ?? "تعذر تسجيل الدخول");
      setPin("");
    } catch {
      setStatus("error");
      setError("تعذر الاتصال بالخادم");
      setPin("");
    }
  }

  function handlePinChange(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    setPin(digits);
    if (digits.length >= 4) submitPin(digits);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-eficto-green-dark px-6">
      <div className="flex w-full max-w-sm flex-col items-center">
        <LogoMark className="h-14" />
        <h1 className="mt-6 font-arabic-display text-2xl text-eficto-cream">دخول الطاقم</h1>

        {!selected ? (
          <>
            <p className="mt-1 text-sm text-eficto-cream/50">اختر اسمك من القائمة</p>
            <div className="mt-8 w-full space-y-2.5">
              {roster === null ? (
                <p className="text-center text-sm text-eficto-cream/40">جاري التحميل…</p>
              ) : roster.length === 0 ? (
                <p className="text-center text-sm text-eficto-cream/40">
                  ما فيه أعضاء طاقم مسجلين بعد — تواصل مع الإدارة
                </p>
              ) : (
                roster.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelected(member);
                      setError(null);
                    }}
                    className="w-full rounded-xl border border-eficto-gold/30 bg-eficto-green-dark/40 px-4 py-3 text-center text-eficto-cream transition-colors hover:border-eficto-gold"
                  >
                    {member.full_name}
                  </button>
                ))
              )}
            </div>
          </>
        ) : (
          <>
            <p className="mt-1 text-sm text-eficto-cream/50">أهلاً {selected.full_name} — أدخل رمزك الشخصي</p>
            <div className="mt-10 w-full space-y-5">
              <input
                type="tel"
                inputMode="numeric"
                dir="ltr"
                placeholder="••••"
                value={pin}
                onChange={(e) => handlePinChange(e.target.value)}
                maxLength={8}
                autoFocus
                disabled={status === "submitting"}
                className="w-full rounded-xl border border-eficto-gold/40 bg-eficto-green-dark/40 px-4 py-3 text-center text-2xl tracking-[0.5em] text-eficto-cream outline-none transition-colors focus:border-eficto-gold disabled:opacity-60"
              />

              {status === "error" && <p className="text-center text-sm text-red-300">{error}</p>}

              <button
                onClick={() => {
                  setSelected(null);
                  setPin("");
                  setStatus("idle");
                  setError(null);
                }}
                className="w-full text-center text-xs text-eficto-cream/40 hover:text-eficto-gold"
              >
                ← تغيير الاسم
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
