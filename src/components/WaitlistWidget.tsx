"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { relativeMinutesSince } from "@/lib/format";
import { useCustomerIdentity } from "@/lib/useCustomerIdentity";
import { safeGetItem, safeRemoveItem, safeSetItem } from "@/lib/safeStorage";
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
    const stored = safeGetItem(STORAGE_KEY);
    if (stored) {
      try {
        setMyEntry(JSON.parse(stored));
      } catch {
        safeRemoveItem(STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function refresh() {
      try {
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
            safeRemoveItem(STORAGE_KEY);
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
      } catch {
        // network/realtime hiccup — leave state as-is, next refresh will retry
      }
    }

    refresh();
    const interval = setInterval(refresh, 6000);
    return () => clearInterval(interval);
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
        safeSetItem(STORAGE_KEY, JSON.stringify(entry));
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
    safeRemoveItem(STORAGE_KEY);
    setMyEntry(null);
    setMyPosition(null);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-eficto-gold/25 bg-white/60 p-7 text-center shadow-premium">
        <p className="text-sm text-eficto-green-dark/60">الحالة الآن</p>
        <p className="mt-3 font-arabic-display text-2xl text-eficto-green">
          {waitingCount === null
            ? "جاري التحقق…"
            : waitingCount === 0
            ? "لا يوجد انتظار حالياً"
            : `${waitingCount} ${waitingCount === 1 ? "شخص" : "أشخاص"} بالانتظار`}
        </p>
      </div>

      {myEntry ? (
        <div className="rounded-[28px] border border-eficto-gold/30 bg-white/70 p-8 text-center shadow-elegant">
          <p className="text-sm text-eficto-green-dark/70">دورك</p>
          <p className="mt-3 font-arabic-display text-6xl text-eficto-green">
            {myPosition ?? "…"}
          </p>
          <p className="mt-3 text-xs text-eficto-green-dark/50">
            منذ {relativeMinutesSince(myEntry.joined_at)} دقيقة · {myEntry.party_size} أشخاص
          </p>
          <button
            onClick={handleLeave}
            className="mt-6 rounded-full border border-eficto-alert/40 px-7 py-2.5 text-sm text-eficto-alert transition-all duration-300 ease-soft hover:bg-eficto-alert/10 active:scale-[0.97]"
          >
            إلغاء الانتظار
          </button>
        </div>
      ) : !ready ? null : !identity ? (
        <IdentityForm onSubmit={save} />
      ) : (
        <form onSubmit={handleJoin} className="space-y-6">
          <IdentityBadge fullName={identity.full_name} onChange={clear} />

          <div>
            <label className="mb-2.5 block text-sm text-eficto-green-dark/80">اختر المنطقة</label>
            <div className="grid grid-cols-3 gap-3">
              {(["indoor", "outdoor", "any"] as WaitlistLocation[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  onClick={() => setLocation(loc)}
                  className={`rounded-2xl border py-3.5 text-sm transition-all duration-300 ease-soft active:scale-[0.97] ${
                    location === loc
                      ? "border-eficto-green bg-eficto-green text-eficto-cream shadow-premium"
                      : "border-eficto-gold/30 bg-white/70 text-eficto-green-dark/80"
                  }`}
                >
                  {LOCATION_LABELS[loc]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2.5 block text-sm text-eficto-green-dark/80">عدد الأشخاص</label>
            <div className="flex flex-wrap gap-2.5" dir="ltr">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPartySize(n)}
                  className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm transition-all duration-300 ease-soft active:scale-[0.94] ${
                    partySize === n
                      ? "border-eficto-green bg-eficto-green text-eficto-cream shadow-premium"
                      : "border-eficto-gold/30 bg-white/70 text-eficto-green-dark/80"
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
            className="w-full rounded-full bg-eficto-green py-4 text-sm font-medium text-eficto-cream shadow-premium transition-all duration-300 ease-soft hover:scale-[1.01] hover:shadow-elegant active:scale-[0.98] disabled:opacity-60"
          >
            {formStatus === "submitting" ? "جاري الانضمام…" : "انضم لقائمة الانتظار"}
          </button>
        </form>
      )}
    </div>
  );
}
