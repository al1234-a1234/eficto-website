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
      <div className="rounded-2xl border border-eficto-gold/25 bg-white/70 p-6 shadow-soft">
        <p className="text-sm text-eficto-green-dark/60">الاسم</p>
        <p className="mt-1 font-serif text-lg text-eficto-green-dark">{identity.full_name}</p>
        <p className="mt-4 text-sm text-eficto-green-dark/60">رقم الجوال</p>
        <p dir="ltr" className="mt-1 text-eficto-green-dark">
          {identity.phone}
        </p>
        <button onClick={clear} className="mt-5 text-sm text-eficto-green underline">
          تسجيل بحساب آخر
        </button>
      </div>

      {myEntry ? (
        <div className="rounded-2xl border border-eficto-gold/40 bg-eficto-green/5 p-6 text-center">
          <p className="text-sm text-eficto-green-dark/70">دورك الحالي</p>
          <p className="mt-2 font-arabic-display text-5xl text-eficto-green">{myPosition ?? "…"}</p>
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
        <div className="rounded-2xl border border-eficto-gold/25 bg-white/70 p-6 text-center shadow-soft">
          <p className="text-sm text-eficto-green-dark/60">ما عندك حجز حالي</p>
          <Link
            href="/waitlist"
            className="mt-4 inline-block rounded-full bg-eficto-green px-6 py-2.5 text-sm text-eficto-cream transition-transform hover:scale-105"
          >
            احجز طاولة الآن
          </Link>
        </div>
      )}
    </div>
  );
}
