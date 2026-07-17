"use client";

import { useCallback, useEffect, useState } from "react";
import { formatArabicTime, relativeMinutesSince } from "@/lib/format";

type Customer = { full_name: string; phone: string } | null;

type WaitlistRow = {
  id: string;
  party_size: number;
  location: "indoor" | "outdoor" | "any";
  joined_at: string;
  eficto_customers: Customer;
};

type ReservationRow = {
  id: string;
  party_size: number;
  reservation_time: string;
  dailyNumber: number;
  eficto_customers: Customer;
  eficto_tables: { table_number: string; location: "indoor" | "outdoor" } | null;
};

const LOCATION_LABELS: Record<string, string> = { indoor: "داخلي", outdoor: "خارجي", any: "أي مكان" };

const HOMEPAGE_STATUS_OPTIONS: { value: "available" | "busy" | "full"; label: string }[] = [
  { value: "available", label: "متاحة الآن" },
  { value: "busy", label: "مزدحم الآن" },
  { value: "full", label: "غير متاحة الآن" },
];

export function StaffQueueView() {
  const [waitlist, setWaitlist] = useState<WaitlistRow[]>([]);
  const [reservations, setReservations] = useState<ReservationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [homepageStatus, setHomepageStatus] = useState<"available" | "busy" | "full" | null>(null);
  const [statusSaving, setStatusSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/staff/queue", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setWaitlist(data.waitlist ?? []);
    setReservations(data.reservations ?? []);
    setLoading(false);
  }, []);

  const loadHomepageStatus = useCallback(async () => {
    const res = await fetch("/api/status", { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    setHomepageStatus(data.status ?? "available");
  }, []);

  useEffect(() => {
    load();
    loadHomepageStatus();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, [load, loadHomepageStatus]);

  async function updateHomepageStatus(value: "available" | "busy" | "full") {
    setStatusSaving(true);
    setHomepageStatus(value);
    try {
      await fetch("/api/staff/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
    } finally {
      setStatusSaving(false);
    }
  }

  async function setStatus(id: string, status: "seated" | "left") {
    setWaitlist((prev) => prev.filter((r) => r.id !== id));
    await fetch("/api/staff/waitlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  if (loading) {
    return <p className="mt-8 text-center text-sm text-eficto-green-dark/50">جاري التحميل…</p>;
  }

  return (
    <div className="mt-8 space-y-10">
      <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-soft">
        <h2 className="font-serif text-lg text-eficto-green-dark">حالة الموقع الرئيسي</h2>
        <p className="mt-1 text-xs text-eficto-green-dark/50">
          هذا اللي يشوفه الزوار بالصفحة الرئيسية — حدّثه حسب تقديرك الفعلي للازدحام
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {HOMEPAGE_STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateHomepageStatus(opt.value)}
              disabled={statusSaving}
              className={`rounded-full px-4 py-2 text-xs transition-colors disabled:opacity-50 ${
                homepageStatus === opt.value
                  ? "bg-eficto-green text-eficto-cream"
                  : "border border-eficto-gold/30 text-eficto-green-dark/70 hover:border-eficto-gold"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-lg text-eficto-green-dark">قائمة الانتظار ({waitlist.length})</h2>
        <div className="mt-3 space-y-3">
          {waitlist.length === 0 ? (
            <p className="rounded-2xl border border-eficto-gold/25 bg-white p-6 text-center text-sm text-eficto-green-dark/50 shadow-soft">
              لا يوجد أحد بالانتظار حالياً
            </p>
          ) : (
            waitlist.map((row, i) => (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-soft"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eficto-green/10 font-arabic-display text-eficto-green">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-serif text-eficto-green-dark">{row.eficto_customers?.full_name ?? "—"}</p>
                    <p dir="ltr" className="text-xs text-eficto-green-dark/50">
                      {row.eficto_customers?.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-left text-sm text-eficto-green-dark/60">
                    <p>
                      {row.party_size} أشخاص · {LOCATION_LABELS[row.location]}
                    </p>
                    <p className="text-xs">منذ {relativeMinutesSince(row.joined_at)} دقيقة</p>
                  </div>
                  <button
                    onClick={() => setStatus(row.id, "seated")}
                    className="rounded-full bg-eficto-green px-4 py-2 text-xs text-eficto-cream transition-transform hover:scale-105"
                  >
                    جالس
                  </button>
                  <button
                    onClick={() => setStatus(row.id, "left")}
                    className="rounded-full border border-eficto-alert/40 px-4 py-2 text-xs text-eficto-alert transition-colors hover:bg-eficto-alert/10"
                  >
                    غادر
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-lg text-eficto-green-dark">حجوزات اليوم ({reservations.length})</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-soft">
          {reservations.length === 0 ? (
            <p className="p-6 text-center text-sm text-eficto-green-dark/50">لا توجد حجوزات اليوم</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
                <tr>
                  <th className="px-5 py-3 text-right font-normal">رقم</th>
                  <th className="px-5 py-3 text-right font-normal">الوقت</th>
                  <th className="px-5 py-3 text-right font-normal">العميل</th>
                  <th className="px-5 py-3 text-right font-normal">الجوال</th>
                  <th className="px-5 py-3 text-right font-normal">الأشخاص</th>
                  <th className="px-5 py-3 text-right font-normal">الطاولة</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-t border-eficto-gold/10">
                    <td className="px-5 py-3 font-arabic-display text-eficto-green">{r.dailyNumber}</td>
                    <td className="px-5 py-3">{formatArabicTime(r.reservation_time)}</td>
                    <td className="px-5 py-3">{r.eficto_customers?.full_name ?? "—"}</td>
                    <td dir="ltr" className="px-5 py-3 text-left">
                      {r.eficto_customers?.phone ?? "—"}
                    </td>
                    <td className="px-5 py-3">{r.party_size}</td>
                    <td className="px-5 py-3">
                      {r.eficto_tables
                        ? `${r.eficto_tables.table_number} (${LOCATION_LABELS[r.eficto_tables.location]})`
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
