"use client";

import { useMemo, useState } from "react";
import { formatArabicDate } from "@/lib/format";
import type { Customer } from "@/lib/types";

export function StaffCustomerSearch({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return initialCustomers;
    return initialCustomers.filter(
      (c) => c.full_name.includes(trimmed) || c.phone.includes(trimmed)
    );
  }, [query, initialCustomers]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث بالاسم أو رقم الجوال…"
        className="w-full max-w-md rounded-xl border border-eficto-gold/30 bg-white px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
      />

      <div className="mt-5 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-eficto-green-dark/50">لا يوجد عملاء</p>
        ) : (
          <table className="w-full min-w-[480px] text-sm">
            <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
              <tr>
                <th className="px-5 py-3 text-right font-normal">الاسم</th>
                <th className="px-5 py-3 text-right font-normal">الجوال</th>
                <th className="px-5 py-3 text-right font-normal">عدد الزيارات</th>
                <th className="px-5 py-3 text-right font-normal">آخر زيارة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="border-t border-eficto-gold/10">
                  <td className="px-5 py-3">{c.full_name}</td>
                  <td dir="ltr" className="px-5 py-3 text-left">
                    <a href={`tel:${c.phone}`} className="text-eficto-green underline decoration-eficto-green/30 underline-offset-2">
                      {c.phone}
                    </a>
                  </td>
                  <td className="px-5 py-3">{c.visit_count}</td>
                  <td className="px-5 py-3">{c.last_visit_at ? formatArabicDate(c.last_visit_at) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
