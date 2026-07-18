"use client";

import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatArabicDateTime } from "@/lib/format";
import type { ReservationStatus, ReservationWithRelations, RestaurantTable } from "@/lib/types";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  confirmed: "مؤكد",
  cancelled: "ملغي",
  completed: "مكتمل",
  no_show: "لم يحضر",
};

const TABS: { key: "all" | ReservationStatus; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "confirmed", label: "مؤكد" },
  { key: "completed", label: "مكتمل" },
  { key: "cancelled", label: "ملغي" },
  { key: "no_show", label: "لم يحضر" },
];

export function ReservationsManager({
  initialReservations,
  tables,
}: {
  initialReservations: ReservationWithRelations[];
  tables: RestaurantTable[];
}) {
  const [reservations, setReservations] = useState(initialReservations);
  const [tab, setTab] = useState<"all" | ReservationStatus>("all");

  const filtered = useMemo(
    () => (tab === "all" ? reservations : reservations.filter((r) => r.status === tab)),
    [reservations, tab]
  );

  async function updateStatus(id: string, status: ReservationStatus) {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const supabase = createClient();
    await supabase.from("eficto_reservations").update({ status }).eq("id", id);
  }

  async function updateTable(id: string, tableId: string) {
    const table = tables.find((t) => t.id === tableId) ?? null;
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, table_id: tableId, eficto_tables: table } : r))
    );
    const supabase = createClient();
    await supabase.from("eficto_reservations").update({ table_id: tableId }).eq("id", id);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              tab === t.key
                ? "border-eficto-green bg-eficto-green text-eficto-cream"
                : "border-eficto-gold/30 text-eficto-green-dark/70 hover:border-eficto-gold"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
            <tr>
              <th className="px-5 py-3 text-right font-normal">الوقت</th>
              <th className="px-5 py-3 text-right font-normal">العميل</th>
              <th className="px-5 py-3 text-right font-normal">الجوال</th>
              <th className="px-5 py-3 text-right font-normal">الأشخاص</th>
              <th className="px-5 py-3 text-right font-normal">الطاولة</th>
              <th className="px-5 py-3 text-right font-normal">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-eficto-green-dark/50">
                  لا توجد حجوزات
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id} className="border-t border-eficto-gold/10">
                <td className="whitespace-nowrap px-5 py-3">{formatArabicDateTime(r.reservation_time)}</td>
                <td className="px-5 py-3">{r.eficto_customers?.full_name ?? "—"}</td>
                <td dir="ltr" className="px-5 py-3 text-left">{r.eficto_customers?.phone ?? "—"}</td>
                <td className="px-5 py-3">{r.party_size}</td>
                <td className="px-5 py-3">
                  <select
                    value={r.table_id ?? ""}
                    onChange={(e) => updateTable(r.id, e.target.value)}
                    className="rounded-lg border border-eficto-gold/30 bg-transparent px-2 py-1 text-sm"
                  >
                    <option value="">—</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        طاولة {t.table_number}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-5 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r.id, e.target.value as ReservationStatus)}
                    className="rounded-lg border border-eficto-gold/30 bg-transparent px-2 py-1 text-sm"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
