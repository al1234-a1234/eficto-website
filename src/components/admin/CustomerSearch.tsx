"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatArabicDate } from "@/lib/format";
import type { Customer } from "@/lib/types";

export function CustomerSearch({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState(initialCustomers);

  useEffect(() => {
    const supabase = createClient();
    const trimmed = query.trim();

    const timeout = setTimeout(async () => {
      if (!trimmed) {
        setCustomers(initialCustomers);
        return;
      }
      const { data } = await supabase
        .from("eficto_customers")
        .select("*")
        .or(`full_name.ilike.%${trimmed}%,phone.ilike.%${trimmed}%`)
        .order("visit_count", { ascending: false })
        .limit(50);
      setCustomers(data ?? []);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query, initialCustomers]);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="ابحث بالاسم أو رقم الجوال…"
        className="w-full max-w-md rounded-xl border border-eficto-gold/30 bg-white px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
      />

      <div className="mt-5 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-soft">
        {customers.length === 0 ? (
          <p className="p-8 text-center text-sm text-eficto-green-dark/50">لا يوجد عملاء</p>
        ) : (
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
              <tr>
                <th className="px-5 py-3 text-right font-normal">الاسم</th>
                <th className="px-5 py-3 text-right font-normal">الجوال</th>
                <th className="px-5 py-3 text-right font-normal">عدد الزيارات</th>
                <th className="px-5 py-3 text-right font-normal">آخر زيارة</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.id} className="border-t border-eficto-gold/10">
                  <td className="px-5 py-3">
                    <Link href={`/admin/customers/${c.id}`} className="text-eficto-green hover:underline">
                      {c.full_name}
                    </Link>
                    {c.visit_count >= 5 && (
                      <span className="mr-2 rounded-full bg-eficto-gold/20 px-2 py-0.5 text-[10px] text-eficto-gold-deep">
                        VIP
                      </span>
                    )}
                  </td>
                  <td dir="ltr" className="px-5 py-3 text-left">{c.phone}</td>
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
