"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { relativeMinutesSince } from "@/lib/format";
import { waitlistWhatsAppLink } from "@/lib/whatsapp";
import { formatDistanceAr } from "@/lib/distance";
import { LONG_SEAT_ALERT_MINUTES } from "@/lib/analytics";

export interface WaitlistRow {
  id: string;
  party_size: number;
  location: "indoor" | "outdoor" | "any";
  status: "waiting" | "seated" | "left" | "completed";
  joined_at: string;
  occasion: string | null;
  distance_meters: number | null;
  eficto_customers: { full_name: string; phone: string } | null;
}

export interface SeatedRow {
  id: string;
  party_size: number;
  location: "indoor" | "outdoor" | "any";
  seated_at: string;
  eficto_customers: { full_name: string; phone: string } | null;
}

const LOCATION_LABELS: Record<WaitlistRow["location"], string> = {
  indoor: "داخلي",
  outdoor: "خارجي",
  any: "أي مكان",
};

export function WaitlistManager({
  initialRows,
  initialSeatedRows,
}: {
  initialRows: WaitlistRow[];
  initialSeatedRows: SeatedRow[];
}) {
  const [rows, setRows] = useState(initialRows.filter((r) => r.status === "waiting"));
  const [seated, setSeated] = useState(initialSeatedRows);

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      try {
        const [{ data: waiting }, { data: seatedData }] = await Promise.all([
          supabase
            .from("eficto_waitlist")
            .select(
              "id, party_size, location, status, joined_at, occasion, distance_meters, eficto_customers(full_name, phone)"
            )
            .eq("status", "waiting")
            .order("joined_at", { ascending: true }),
          supabase
            .from("eficto_waitlist")
            .select("id, party_size, location, seated_at, eficto_customers(full_name, phone)")
            .eq("status", "seated")
            .order("seated_at", { ascending: true }),
        ]);
        setRows((waiting ?? []) as unknown as WaitlistRow[]);
        setSeated((seatedData ?? []) as unknown as SeatedRow[]);
      } catch {
        // network/realtime hiccup — leave rows as-is, next refresh will retry
      }
    }

    const interval = setInterval(refresh, 2500);
    return () => clearInterval(interval);
  }, []);

  async function setStatus(id: string, status: "seated" | "left" | "completed") {
    const location = rows.find((r) => r.id === id)?.location ?? seated.find((r) => r.id === id)?.location;
    setRows((prev) => prev.filter((r) => r.id !== id));
    setSeated((prev) => prev.filter((r) => r.id !== id));
    const supabase = createClient();
    const update: { status: string; seated_at?: string; left_at?: string; completed_at?: string } = { status };
    if (status === "seated") update.seated_at = new Date().toISOString();
    if (status === "left") update.left_at = new Date().toISOString();
    if (status === "completed") update.completed_at = new Date().toISOString();
    await supabase.from("eficto_waitlist").update(update).eq("id", id);

    if (location === "indoor" || location === "outdoor") {
      fetch("/api/waitlist/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location }),
      }).catch(() => {});
    }

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

  function renderQueue(location: "indoor" | "outdoor") {
    const locationRows = rows.filter((r) => r.location === location);
    return (
      <div>
        <h2 className="font-serif text-lg text-eficto-green-dark">
          الانتظار — {LOCATION_LABELS[location]} ({locationRows.length})
        </h2>
        <div className="mt-3 space-y-3">
          {locationRows.length === 0 ? (
            <p className="rounded-2xl border border-eficto-gold/25 bg-white p-8 text-center text-sm text-eficto-green-dark/50 shadow-premium">
              لا يوجد أحد بالانتظار حالياً
            </p>
          ) : (
            locationRows.map((row, i) => (
              <div
                key={row.id}
                className="flex items-center justify-between rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-eficto-green/10 font-arabic-display text-eficto-green">
                    {i + 1}
                  </span>
                  <div>
                    <p className="flex items-center gap-2 font-serif text-eficto-green-dark">
                      {row.eficto_customers?.full_name ?? "—"}
                      {row.occasion && (
                        <span className="rounded-full bg-eficto-gold/15 px-2 py-0.5 text-[10px] text-eficto-gold-deep">
                          🎉 {row.occasion}
                        </span>
                      )}
                    </p>
                    {row.eficto_customers?.phone && (
                      <a
                        href={`tel:${row.eficto_customers.phone}`}
                        dir="ltr"
                        className="text-xs text-eficto-green underline decoration-eficto-green/30 underline-offset-2"
                      >
                        {row.eficto_customers.phone}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-left text-sm text-eficto-green-dark/60">
                    <p>{row.party_size} أشخاص</p>
                    <p className="text-xs">منذ {relativeMinutesSince(row.joined_at)} دقيقة</p>
                    <p
                      className={`text-xs ${
                        row.distance_meters !== null && row.distance_meters > 5000
                          ? "text-eficto-alert"
                          : "text-eficto-green-dark/40"
                      }`}
                    >
                      {row.distance_meters !== null ? `يبعد ${formatDistanceAr(row.distance_meters)}` : "الموقع غير محدد"}
                    </p>
                  </div>
                  {row.eficto_customers?.phone && (
                    <a
                      href={waitlistWhatsAppLink(row.eficto_customers.phone, row.eficto_customers.full_name ?? "")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-[#25D366]/50 px-3 py-2 text-xs text-[#128C4A] transition-colors hover:bg-[#25D366]/10"
                    >
                      تذكير واتساب
                    </a>
                  )}
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
    );
  }

  return (
    <div className="mt-6 space-y-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {renderQueue("indoor")}
        {renderQueue("outdoor")}
      </div>

      <h2 className="pt-4 font-serif text-lg text-eficto-green-dark">الطاولات النشطة الآن ({seated.length})</h2>
      <div className="space-y-3">
      {seated.length === 0 ? (
        <p className="rounded-2xl border border-eficto-gold/25 bg-white p-8 text-center text-sm text-eficto-green-dark/50 shadow-premium">
          لا توجد طاولات مشغولة حالياً
        </p>
      ) : (
        seated.map((row) => {
          const elapsed = relativeMinutesSince(row.seated_at);
          const longSeated = elapsed >= LONG_SEAT_ALERT_MINUTES;
          return (
            <div
              key={row.id}
              className={`flex items-center justify-between rounded-2xl border p-5 shadow-premium ${
                longSeated ? "border-eficto-alert/50 bg-eficto-alert/5" : "border-eficto-gold/25 bg-white"
              }`}
            >
              <div>
                <p className="font-serif text-eficto-green-dark">{row.eficto_customers?.full_name ?? "—"}</p>
                <p className="text-xs text-eficto-green-dark/60">
                  {row.party_size} أشخاص · {LOCATION_LABELS[row.location]}
                </p>
                <p className={`mt-1 text-xs ${longSeated ? "text-eficto-alert" : "text-eficto-green-dark/50"}`}>
                  {longSeated ? `جالسة منذ ${elapsed} دقيقة — طالت المدة` : `جالسة منذ ${elapsed} دقيقة`}
                </p>
              </div>
              <button
                onClick={() => setStatus(row.id, "completed")}
                className="rounded-full bg-eficto-green px-4 py-2 text-xs text-eficto-cream transition-transform hover:scale-105"
              >
                أنهى الجلسة
              </button>
            </div>
          );
        })
      )}
      </div>
    </div>
  );
}
