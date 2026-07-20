"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { formatArabicDate } from "@/lib/format";
import { DownloadIcon } from "@/components/icons";
import { RECALL_INACTIVITY_DAYS } from "@/lib/analytics";
import type { Customer } from "@/lib/types";

const GENDER_LABELS: Record<string, string> = { male: "ذكر", female: "أنثى" };

type Segment = "all" | "new" | "repeat" | "vip" | "dormant";

const SEGMENTS: { key: Segment; label: string }[] = [
  { key: "all", label: "الكل" },
  { key: "new", label: "جدد" },
  { key: "repeat", label: "متكررين" },
  { key: "vip", label: "VIP" },
  { key: "dormant", label: "غير نشطين" },
];

function isDormant(customer: Customer) {
  if (!customer.last_visit_at) return false;
  const days = (Date.now() - new Date(customer.last_visit_at).getTime()) / (24 * 60 * 60 * 1000);
  return days >= RECALL_INACTIVITY_DAYS;
}

function matchesSegment(customer: Customer, segment: Segment) {
  switch (segment) {
    case "new":
      return customer.visit_count <= 1;
    case "repeat":
      return customer.visit_count >= 2 && customer.visit_count < 5;
    case "vip":
      return customer.visit_count >= 5;
    case "dormant":
      return isDormant(customer);
    default:
      return true;
  }
}

function exportCustomersCsv(customers: Customer[]) {
  const header = "الاسم,الجوال,الجنس,عدد الزيارات,آخر زيارة\n";
  const rows = customers
    .map((c) => {
      const name = `"${c.full_name.replace(/"/g, '""')}"`;
      const lastVisit = c.last_visit_at ? c.last_visit_at.slice(0, 10) : "";
      return `${name},${c.phone},${c.gender ? GENDER_LABELS[c.gender] : ""},${c.visit_count},${lastVisit}`;
    })
    .join("\n");
  const blob = new Blob(["﻿" + header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `عملاء-افيكتو-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function CustomerSearch({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [query, setQuery] = useState("");
  const [customers, setCustomers] = useState(initialCustomers);
  const [segment, setSegment] = useState<Segment>("all");

  const segmentCounts = useMemo(() => {
    const counts: Record<Segment, number> = { all: customers.length, new: 0, repeat: 0, vip: 0, dormant: 0 };
    for (const c of customers) {
      if (matchesSegment(c, "new")) counts.new++;
      if (matchesSegment(c, "repeat")) counts.repeat++;
      if (matchesSegment(c, "vip")) counts.vip++;
      if (matchesSegment(c, "dormant")) counts.dormant++;
    }
    return counts;
  }, [customers]);

  const filtered = useMemo(() => customers.filter((c) => matchesSegment(c, segment)), [customers, segment]);

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث بالاسم أو رقم الجوال…"
          className="w-full max-w-md rounded-xl border border-eficto-gold/30 bg-white px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
        />
        <button
          onClick={() => exportCustomersCsv(filtered)}
          className="flex items-center justify-center gap-2 rounded-xl border border-eficto-gold/30 bg-white px-4 py-3 text-sm text-eficto-green-dark/80 transition-colors hover:border-eficto-gold sm:w-auto"
        >
          <DownloadIcon className="h-4 w-4" />
          تصدير CSV
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {SEGMENTS.map((s) => (
          <button
            key={s.key}
            onClick={() => setSegment(s.key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
              segment === s.key
                ? "border-eficto-green bg-eficto-green text-eficto-cream"
                : "border-eficto-gold/30 text-eficto-green-dark/70 hover:border-eficto-gold"
            }`}
          >
            {s.label} ({segmentCounts[s.key]})
          </button>
        ))}
      </div>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
        {filtered.length === 0 ? (
          <p className="p-8 text-center text-sm text-eficto-green-dark/50">لا يوجد عملاء</p>
        ) : (
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
              <tr>
                <th className="px-5 py-3 text-right font-normal">الاسم</th>
                <th className="px-5 py-3 text-right font-normal">الجوال</th>
                <th className="px-5 py-3 text-right font-normal">الجنس</th>
                <th className="px-5 py-3 text-right font-normal">عدد الزيارات</th>
                <th className="px-5 py-3 text-right font-normal">آخر زيارة</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
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
                  <td className="px-5 py-3 text-eficto-green-dark/60">{c.gender ? GENDER_LABELS[c.gender] : "—"}</td>
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
