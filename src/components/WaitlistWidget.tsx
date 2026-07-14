"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { relativeMinutesSince } from "@/lib/format";

const STORAGE_KEY = "eficto_waitlist_entry";

type MyEntry = { id: string; joined_at: string; party_size: number };
type FormStatus = "idle" | "submitting" | "error";

export function WaitlistWidget() {
  const [waitingCount, setWaitingCount] = useState<number | null>(null);
  const [myEntry, setMyEntry] = useState<MyEntry | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);
  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState<string | null>(null);

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
    setFormStatus("submitting");
    setError(null);

    const form = new FormData(e.currentTarget);
    const payload = {
      full_name: String(form.get("full_name") ?? ""),
      phone: String(form.get("phone") ?? ""),
      party_size: Number(form.get("party_size")),
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
    <div className="space-y-8">
      <div className="rounded-2xl border border-eficto-gold/30 bg-white/60 p-6 text-center shadow-soft">
        <p className="text-sm text-eficto-green-dark/60">الحالة الآن</p>
        <p className="mt-2 font-arabic-display text-2xl text-eficto-green">
          {waitingCount === null
            ? "جاري التحقق…"
            : waitingCount === 0
            ? "لا يوجد انتظار حالياً"
            : `${waitingCount} ${waitingCount === 1 ? "شخص" : "أشخاص"} بالانتظار`}
        </p>
      </div>

      {myEntry ? (
        <div className="rounded-2xl border border-eficto-gold/40 bg-eficto-green/5 p-6 text-center">
          <p className="text-sm text-eficto-green-dark/70">أنت في قائمة الانتظار</p>
          <p className="mt-2 font-arabic-display text-3xl text-eficto-green">
            المركز {myPosition ?? "…"}
          </p>
          <p className="mt-2 text-xs text-eficto-green-dark/50">
            منذ {relativeMinutesSince(myEntry.joined_at)} دقيقة · {myEntry.party_size} أشخاص
          </p>
          <button
            onClick={handleLeave}
            className="mt-5 rounded-full border border-eficto-alert/40 px-6 py-2 text-sm text-eficto-alert transition-colors hover:bg-eficto-alert/10"
          >
            إلغاء الانتظار
          </button>
        </div>
      ) : (
        <form onSubmit={handleJoin} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm text-eficto-green-dark/80">الاسم الكامل</label>
            <input
              name="full_name"
              required
              minLength={2}
              className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-eficto-green-dark/80">رقم الجوال</label>
            <input
              name="phone"
              type="tel"
              dir="ltr"
              placeholder="05XXXXXXXX"
              required
              pattern="^(?:\+966|0)5\d{8}$"
              className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 text-left outline-none transition-colors focus:border-eficto-gold"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-eficto-green-dark/80">عدد الأشخاص</label>
            <input
              name="party_size"
              type="number"
              min={1}
              max={20}
              defaultValue={2}
              required
              className="w-full rounded-xl border border-eficto-gold/40 bg-white/70 px-4 py-3 outline-none transition-colors focus:border-eficto-gold"
            />
          </div>

          {formStatus === "error" && <p className="text-sm text-eficto-alert">{error}</p>}

          <button
            type="submit"
            disabled={formStatus === "submitting"}
            className="w-full rounded-full bg-eficto-green py-3.5 text-sm font-medium text-eficto-cream transition-transform duration-300 ease-soft hover:scale-[1.01] disabled:opacity-60"
          >
            {formStatus === "submitting" ? "جاري الانضمام…" : "انضم لقائمة الانتظار"}
          </button>
        </form>
      )}
    </div>
  );
}
