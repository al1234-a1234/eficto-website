import { createClient } from "@/lib/supabase/server";
import { formatArabicTime } from "@/lib/format";

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

  const [{ count: todayCount }, { count: waitingCount }, { data: tables }, { data: reservationsToday }] =
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
    ]);

  const now = Date.now();
  const windowMs = 2 * 60 * 60 * 1000;
  const occupiedTableIds = new Set(
    (reservationsToday ?? [])
      .filter((r) => Math.abs(new Date(r.reservation_time).getTime() - now) < windowMs)
      .map((r) => r.table_id)
  );

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-arabic-display text-3xl text-eficto-green-dark">نظرة عامة</h1>
        <p className="mt-1 text-sm text-eficto-green-dark/60">ملخص اليوم بالحجوزات وحالة الطاولات</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-soft">
          <p className="text-sm text-eficto-green-dark/60">حجوزات اليوم</p>
          <p className="mt-2 font-arabic-display text-4xl text-eficto-green">{todayCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-soft">
          <p className="text-sm text-eficto-green-dark/60">بالانتظار الآن</p>
          <p className="mt-2 font-arabic-display text-4xl text-eficto-green">{waitingCount ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-soft">
          <p className="text-sm text-eficto-green-dark/60">طاولات مشغولة الآن</p>
          <p className="mt-2 font-arabic-display text-4xl text-eficto-green">
            {occupiedTableIds.size} / {tables?.length ?? 0}
          </p>
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
        <div className="mt-4 overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-soft">
          {(reservationsToday ?? []).length === 0 ? (
            <p className="p-6 text-center text-sm text-eficto-green-dark/50">لا توجد حجوزات اليوم</p>
          ) : (
            <table className="w-full text-sm">
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
