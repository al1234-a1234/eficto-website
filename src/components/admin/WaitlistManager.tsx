"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { relativeMinutesSince } from "@/lib/format";

export interface WaitlistRow {
  id: string;
  party_size: number;
  location: "indoor" | "outdoor" | "any";
  status: "waiting" | "seated" | "left";
  joined_at: string;
  eficto_customers: { full_name: string; phone: string } | null;
}

const LOCATION_LABELS: Record<WaitlistRow["location"], string> = {
  indoor: "داخلي",
  outdoor: "خارجي",
  any: "أي مكان",
};

export function WaitlistManager({ initialRows }: { initialRows: WaitlistRow[] }) {
  const [rows, setRows] = useState(initialRows.filter((r) => r.status === "waiting"));

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      const { data } = await supabase
        .from("eficto_waitlist")
        .select("id, party_size, location, status, joined_at, eficto_customers(full_name, phone)")
        .eq("status", "waiting")
        .order("joined_at", { ascending: true });
      setRows((data ?? []) as unknown as WaitlistRow[]);
    }

    const channel = supabase
      .channel("admin-waitlist")
      .on("postgres_changes", { event: "*", schema: "public", table: "eficto_waitlist" }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function setStatus(id: string, status: "seated" | "left") {
    setRows((prev) => prev.filter((r) => r.id !== id));
    const supabase = createClient();
    await supabase.from("eficto_waitlist").update({ status }).eq("id", id);

    if (status === "seated") {
      const row = rows.find((r) => r.id === id);
      if (row?.eficto_customers?.phone) {
        const { data: customer } = await supabase
          .from("eficto_customers")
          .select("id, visit_count")
          .eq("phone", row.eficto_customers.phone)
          .maybeSingle();
        if (customer) {
          await supabase
            .from("eficto_customers")
            .update({ visit_count: (customer.visit_count ?? 0) + 1, last_visit_at: new Date().toISOString() })
            .eq("id", customer.id);
        }
      }
    }
  }

  return (
    <div className="mt-6 space-y-3">
      {rows.length === 0 && (
        <p className="rounded-2xl border border-eficto-gold/25 bg-white p-8 text-center text-sm text-eficto-green-dark/50 shadow-soft">
          لا يوجد أحد بالانتظار حالياً
        </p>
      )}
      {rows.map((row, i) => (
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
      ))}
    </div>
  );
}
