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
    <div className="space-y-5">
      <div className="overflow-hidden rounded-[28px] bg-eficto-green-dark shadow-elegant">
        <div className="flex flex-col items-center px-7 py-10 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-eficto-gold/40 bg-eficto-cream/5">
            <span className="font-arabic-display text-3xl text-eficto-gold">
              {identity.full_name.trim().charAt(0)}
            </span>
          </div>
          <p className="mt-6 font-serif text-xl text-eficto-cream">{identity.full_name}</p>
          <p dir="ltr" className="mt-1.5 text-sm text-eficto-cream/60">
            {identity.phone}
          </p>
          <button
            onClick={clear}
            className="mt-7 text-xs tracking-wide text-eficto-gold underline underline-offset-4 transition-colors hover:text-eficto-cream"
          >
            تسجيل بحساب آخر
          </button>
        </div>
      </div>

      {myEntry ? (
        <div className="rounded-[28px] border border-eficto-gold/30 bg-white/70 p-8 text-center shadow-premium">
          <p className="text-sm text-eficto-green-dark/70">دورك الحالي</p>
          <p className="mt-3 font-arabic-display text-6xl text-eficto-green">{myPosition ?? "…"}</p>
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
      ) : (
        <div className="rounded-[28px] border border-eficto-gold/25 bg-white/70 p-8 text-center shadow-premium">
          <p className="text-sm text-eficto-green-dark/60">ما عندك حجز حالي</p>
          <Link
            href="/waitlist"
            className="mt-5 inline-block rounded-full bg-eficto-green px-7 py-3 text-sm text-eficto-cream shadow-premium transition-all duration-300 ease-soft hover:scale-[1.03] hover:shadow-elegant active:scale-[0.97]"
          >
            احجز طاولة الآن
          </Link>
        </div>
      )}
    </div>
  );
}
