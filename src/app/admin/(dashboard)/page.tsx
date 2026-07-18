import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { HomepageStatusControl } from "@/components/admin/HomepageStatusControl";
import { AdminInsights, AdminInsightsSkeleton } from "@/components/admin/AdminInsights";
import { CalendarIcon, ClockIcon, GridIcon, BellIcon } from "@/components/icons";
import { formatArabicDate, formatArabicTime } from "@/lib/format";
import { RECALL_INACTIVITY_DAYS } from "@/lib/analytics";

function startOfTodayRiyadhISO() {
  const now = new Date();
  const riyadhNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const y = riyadhNow.getUTCFullYear();
  const m = riyadhNow.getUTCMonth();
  const d = riyadhNow.getUTCDate();
  return new Date(Date.UTC(y, m, d, -3, 0, 0)).toISOString();
}

function endOfTodayRiyadhISO() {
  const start = new Date(startOfTodayRiyadhISO());
  return new Date(start.getTime() + 24 * 60 * 60 * 1000).toISOString();
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();
  const dayStart = startOfTodayRiyadhISO();
  const dayEnd = endOfTodayRiyadhISO();
  const recallCutoff = new Date(Date.now() - RECALL_INACTIVITY_DAYS * 24 * 60 * 60 * 1000).toISOString();

  // Only the fast, essential-for-first-paint queries are awaited here. The heavier analytics
  // (departure rate, anomaly detection, wait estimate) live in <AdminInsights> and stream in
  // separately via Suspense so navigating to the dashboard doesn't wait on all of it.
  const [{ count: todayCount }, { count: waitingCount }, { data: tables }, { data: reservationsToday }, { data: quietRegulars }] =
    await Promise.all([
      supabase
        .from("eficto_reservations")
        .select("id", { count: "exact", head: true })
        .eq("status", "confirmed")
        .gte("reservation_time", dayStart)
        .lt("reservation_time", dayEnd),
      supabase.from("eficto_waitlist").select("id", { count: "exact", head: true }).eq("status", "waiting"),
      supabase.from("eficto_tables").select("id, table_number, capacity, location").order("table_number"),
      supabase
        .from("eficto_reservations")
        .select("id, table_id, reservation_time, party_size, eficto_customers(full_name)")
        .eq("status", "confirmed")
        .gte("reservation_time", dayStart)
        .lt("reservation_time", dayEnd)
        .order("reservation_time"),
      supabase
        .from("eficto_customers")
        .select("id, full_name, visit_count, last_visit_at")
        .gte("visit_count", 2)
        .lt("last_visit_at", recallCutoff)
        .order("visit_count", { ascending: false })
        .limit(5),
    ]);

  const now = Date.now();
  const windowMs = 2 * 60 * 60 * 1000;
  const occupiedTableIds = new Set(
    (reservationsToday ?? [])
      .filter((r) => Math.abs(new Date(r.reservation_time).getTime() - now) < windowMs)
      .map((r) => r.table_id)
  );

  const todayLabel = new Intl.DateTimeFormat("ar-SA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    calendar: "gregory",
  }).format(new Date(Date.now() + 3 * 60 * 60 * 1000));

  return (
    <div className="space-y-10">
      <div className="overflow-hidden rounded-[28px] bg-gradient-to-br from-eficto-green-dark to-eficto-green-deep shadow-elegant">
        <div className="flex flex-col gap-6 p-7 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="font-arabic-body text-xs tracking-[0.25em] text-eficto-gold">لوحة تحكم افيكتو</p>
            <h1 className="mt-2 font-arabic-display text-2xl text-eficto-cream sm:text-3xl">أهلاً بك</h1>
            <p className="mt-1 text-sm text-eficto-cream/60">{todayLabel}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <div className="flex items-center gap-2.5 text-eficto-green-dark/60">
              <CalendarIcon className="h-4 w-4" />
              <p className="text-sm">حجوزات اليوم</p>
            </div>
            <p className="mt-2 font-arabic-display text-4xl text-eficto-green">{todayCount ?? 0}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <div className="flex items-center gap-2.5 text-eficto-green-dark/60">
              <ClockIcon className="h-4 w-4" />
              <p className="text-sm">بالانتظار الآن</p>
            </div>
            <p className="mt-2 font-arabic-display text-4xl text-eficto-green">{waitingCount ?? 0}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <div className="flex items-center gap-2.5 text-eficto-green-dark/60">
              <GridIcon className="h-4 w-4" />
              <p className="text-sm">طاولات مشغولة الآن</p>
            </div>
            <p className="mt-2 font-arabic-display text-4xl text-eficto-green">
              {occupiedTableIds.size} / {tables?.length ?? 0}
            </p>
          </div>
        </div>
      </div>

      <Suspense fallback={<AdminInsightsSkeleton />}>
        <AdminInsights />
      </Suspense>

      <div className="grid gap-5 lg:grid-cols-2">
        <HomepageStatusControl />

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <BellIcon className="h-4 w-4 text-eficto-gold-deep" />
                <h2 className="font-serif text-lg text-eficto-green-dark">عملاء يستحقون اهتمام</h2>
              </div>
              <Link href="/admin/recall" className="text-xs text-eficto-green hover:underline">
                عرض الكل ←
              </Link>
            </div>
            <p className="mt-1 text-xs text-eficto-green-dark/50">عملاء متكررون ما زاروا من أكثر من ٣ أسابيع</p>
            <ul className="mt-4 divide-y divide-eficto-gold/10">
              {(quietRegulars ?? []).length === 0 ? (
                <p className="py-3 text-sm text-eficto-green-dark/50">ولا حد — كل العملاء المتكررين نشيطين 👍</p>
              ) : (
                (quietRegulars ?? []).map((c) => (
                  <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                    <Link href={`/admin/customers/${c.id}`} className="text-eficto-green hover:underline">
                      {c.full_name}
                    </Link>
                    <span className="text-eficto-green-dark/60">
                      آخر زيارة {c.last_visit_at ? formatArabicDate(c.last_visit_at) : "—"}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-eficto-green-dark">خريطة الطاولات</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {(tables ?? []).map((t) => {
            const occupied = occupiedTableIds.has(t.id);
            return (
              <div
                key={t.id}
                className={`rounded-xl border p-4 text-center ${
                  occupied
                    ? "border-eficto-alert/40 bg-eficto-alert/10"
                    : "border-eficto-green/30 bg-eficto-green/5"
                }`}
              >
                <p className="font-arabic-display text-lg text-eficto-green-dark">{t.table_number}</p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">{t.capacity} مقاعد</p>
                <p className={`mt-2 text-xs ${occupied ? "text-eficto-alert" : "text-eficto-green"}`}>
                  {occupied ? "مشغولة" : "فاضية"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="font-serif text-xl text-eficto-green-dark">حجوزات اليوم</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          {(reservationsToday ?? []).length === 0 ? (
            <p className="p-6 text-center text-sm text-eficto-green-dark/50">لا توجد حجوزات اليوم</p>
          ) : (
            <table className="w-full min-w-[420px] text-sm">
              <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
                <tr>
                  <th className="px-5 py-3 text-right font-normal">الوقت</th>
                  <th className="px-5 py-3 text-right font-normal">العميل</th>
                  <th className="px-5 py-3 text-right font-normal">عدد الأشخاص</th>
                </tr>
              </thead>
              <tbody>
                {(reservationsToday ?? []).map((r) => (
                  <tr key={r.id} className="border-t border-eficto-gold/10">
                    <td className="px-5 py-3">{formatArabicTime(r.reservation_time)}</td>
                    <td className="px-5 py-3">
                      {(r.eficto_customers as unknown as { full_name: string } | null)?.full_name ?? "—"}
                    </td>
                    <td className="px-5 py-3">{r.party_size}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
