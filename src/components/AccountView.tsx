"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { relativeMinutesSince } from "@/lib/format";
import { useCustomerIdentity } from "@/lib/useCustomerIdentity";
import { IdentityForm } from "./IdentityForm";

const STORAGE_KEY = "eficto_waitlist_entry";

type MyEntry = { id: string; joined_at: string; party_size: number };

export function AccountView() {
  const { identity, ready, save, clear } = useCustomerIdentity();
  const [myEntry, setMyEntry] = useState<MyEntry | null>(null);
  const [myPosition, setMyPosition] = useState<number | null>(null);

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
    if (!myEntry) return;
    const supabase = createClient();

    async function refresh() {
      const { data: current } = await supabase
        .from("eficto_waitlist")
        .select("status")
        .eq("id", myEntry!.id)
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
        .lte("joined_at", myEntry!.joined_at);
      setMyPosition(position ?? null);
    }

    refresh();
    const channel = supabase
      .channel("account-waitlist")
      .on("postgres_changes", { event: "*", schema: "public", table: "eficto_waitlist" }, refresh)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [myEntry]);

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

  if (!ready) return null;

  if (!identity) {
    return <IdentityForm onSubmit={save} />;
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[32px] bg-forest shadow-elegant">
        <div className="flex flex-col items-center px-8 py-14 text-center">
          <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border border-eficto-gold/25">
            <span className="font-arabic-display text-3xl font-normal text-eficto-gold">
              {identity.full_name.trim().charAt(0)}
            </span>
          </div>
          <p className="mt-8 font-serif text-2xl font-normal text-eficto-cream">{identity.full_name}</p>
          <p dir="ltr" className="mt-2 text-sm font-light text-eficto-cream/50">
            {identity.phone}
          </p>
          <div className="divider-hairline mt-8 w-12" />
          <button
            onClick={clear}
            className="mt-8 text-xs tracking-[0.08em] text-eficto-gold/80 underline underline-offset-4 transition-colors duration-300 ease-soft hover:text-eficto-gold"
          >
            تسجيل بحساب آخر
          </button>
        </div>
      </div>

      {myEntry ? (
        <div className="rounded-[32px] bg-champagne p-10 text-center shadow-elegant">
          <p className="text-xs tracking-[0.1em] text-eficto-green-dark/55">دورك الحالي</p>
          <p className="mt-4 font-arabic-display text-6xl font-normal text-eficto-green">{myPosition ?? "…"}</p>
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
      ) : (
        <div className="rounded-[32px] bg-champagne p-10 text-center shadow-elegant">
          <p className="text-sm font-light text-eficto-green-dark/55">ما عندك حجز حالي</p>
          <Link
            href="/waitlist"
            className="mt-6 inline-block rounded-2xl bg-eficto-green px-9 py-4 text-sm text-eficto-cream shadow-premium transition-all duration-500 ease-soft hover:-translate-y-0.5 hover:shadow-elegant active:translate-y-0 active:scale-[0.97]"
          >
            احجز طاولة الآن
          </Link>
        </div>
      )}
    </div>
  );
}
