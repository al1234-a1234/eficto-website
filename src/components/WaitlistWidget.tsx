"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { relativeMinutesSince } from "@/lib/format";
import { useCustomerIdentity } from "@/lib/useCustomerIdentity";
import { IdentityForm } from "./IdentityForm";
import { IdentityBadge } from "./IdentityBadge";

const STORAGE_KEY = "eficto_waitlist_entry";

type WaitlistLocation = "indoor" | "outdoor" | "any";
type MyEntry = { id: string; joined_at: string; party_size: number };
type FormStatus = "idle" | "submitting" | "error";

const LOCATION_LABELS: Record<WaitlistLocation, string> = {
  any: "أي مكان",
  indoor: "الداخل",
  outdoor: "الخارج",
};

export function WaitlistWidget() {
  const { identity, ready, save, clear } = useCustomerIdentity();
  const [waitingCount, setWaitingCount] = useState<number | null>(null);
  const [myEntry, setMyEntry] = useState<MyEntry | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<WaitlistLocation>("any");
  const [partySize, setPartySize] = useState(2);

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("location");
    if (requested === "indoor" || requested === "outdoor") setLocation(requested);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMyEntry(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      const { count } = await supabase
        .from("eficto_waitlist")
        .select("id", { count: "exact", head: true })
        .eq("status", "waiting");
      setWaitingCount(count ?? 0);

      if (myEntry) {
        const { data: current } = await supabase
          .from("eficto_waitlist")
          .select("status")
          .eq("id", myEntry.id)
          .maybeSingle();

        if (!current || current.status !== "waiting") {
          localStorage.removeItem(STORAGE_KEY);
          setMyEntry(null);
          setMyPosition(null);
          return;
        }

        const { count: position } = await supabase
          .from("eficto_waitlist")
          .select("id", { count: "exact", head: true })
          .eq("status", "waiting")
          .lte("joined_at", myEntry.joined_at);
        setMyPosition(position ?? null);
      }
    }

    refresh();
    const channel = supabase
      .channel("waitlist-widget")
      .on("postgres_changes", { event: "*", schema: "public", table: "eficto_waitlist" }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myEntry]);

  async function handleJoin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!identity) return;
    setFormStatus("submitting");
    setError(null);

    const payload = {
      full_name: identity.full_name,
      phone: identity.phone,
      party_size: partySize,
      location,
    };

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.status === 201) {
        const entry: MyEntry = {
          id: data.entry.id,
          joined_at: data.entry.joined_at,
          party_size: data.entry.party_size,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
        setMyEntry(entry);
        setMyPosition(data.position);
        setFormStatus("idle");
      } else {
        setFormStatus("error");
        setError(data.error ?? "حدث خطأ غير متوقع");
      }
    } catch {
      setFormStatus("error");
      setError("تعذر الاتصال بالخادم");
    }
  }

  async function handleLeave() {
    if (!myEntry) return;
    await fetch("/api/waitlist", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: myEntry.id }),
    });
    localStorage.removeItem(STORAGE_KEY);
    setMyEntry(null);
    setMyPosition(null);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-champagne p-8 text-center shadow-premium">
        <p className="text-xs tracking-[0.1em] text-eficto-green-dark/55">الحالة الآن</p>
        <p className="mt-4 font-arabic-display text-2xl font-normal text-eficto-green">
          {waitingCount === null
            ? "جاري التحقق…"
            : waitingCount === 0
            ? "لا يوجد انتظار حالياً"
            : `${waitingCount} ${waitingCount === 1 ? "شخص" : "أشخاص"} بالانتظار`}
        </p>
      </div>

      {myEntry ? (
        <div className="rounded-[32px] bg-champagne p-10 text-center shadow-elegant">
          <p className="text-xs tracking-[0.1em] text-eficto-green-dark/60">دورك</p>
          <p className="mt-4 font-arabic-display text-6xl font-normal text-eficto-green">
            {myPosition ?? "…"}
          </p>
          <p className="mt-4 text-xs font-light text-eficto-green-dark/45">
            منذ {relativeMinutesSince(myEntry.joined_at)} دقيقة · {myEntry.party_size} أشخاص
          </p>
          <button
            onClick={handleLeave}
            className="mt-7 rounded-2xl border border-eficto-alert/30 px-8 py-3 text-sm text-eficto-alert transition-all duration-300 ease-soft hover:bg-eficto-alert/5 active:scale-[0.97]"
          >
            إلغاء الانتظار
          </button>
        </div>
      ) : !ready ? null : !identity ? (
        <IdentityForm onSubmit={save} />
      ) : (
        <form onSubmit={handleJoin} className="space-y-8">
          <IdentityBadge fullName={identity.full_name} onChange={clear} />

          <div>
            <label className="mb-3 block text-xs tracking-[0.1em] text-eficto-green-dark/60">اختر المنطقة</label>
            <div className="grid grid-cols-3 gap-3">
              {(["indoor", "outdoor", "any"] as WaitlistLocation[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`rounded-2xl py-4 text-sm transition-all duration-300 ease-soft active:scale-[0.97] ${
                    location === loc
                      ? "bg-eficto-green text-eficto-cream shadow-premium"
                      : "bg-white/70 text-eficto-green-dark/70 shadow-premium"
                  }`}
                >
                  {LOCATION_LABELS[loc]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-3 block text-xs tracking-[0.1em] text-eficto-green-dark/60">عدد الأشخاص</label>
            <div className="flex flex-wrap gap-3" dir="ltr">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPartySize(n)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-sm transition-all duration-300 ease-soft active:scale-[0.94] ${
                    partySize === n
                      ? "bg-eficto-green text-eficto-cream shadow-premium"
                      : "bg-white/70 text-eficto-green-dark/70 shadow-premium"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {formStatus === "error" && <p className="text-sm text-eficto-alert">{error}</p>}

          <button
            type="submit"
            disabled={formStatus === "submitting"}
            className="w-full rounded-2xl bg-eficto-green py-[18px] text-sm text-eficto-cream shadow-premium transition-all duration-500 ease-soft hover:-translate-y-0.5 hover:shadow-elegant active:translate-y-0 active:scale-[0.98] disabled:opacity-60"
          >
            {formStatus === "submitting" ? "جاري الانضمام…" : "انضم لقائمة الانتظار"}
          </button>
        </form>
      )}
    </div>
  );
}
