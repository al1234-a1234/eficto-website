import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { computeDepartureStats, computeTurnoverStats, computeTableUtilization } from "@/lib/analytics";

function startOfTodayRiyadhISO() {
  const now = new Date();
  const riyadhNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const y = riyadhNow.getUTCFullYear();
  const m = riyadhNow.getUTCMonth();
  const d = riyadhNow.getUTCDate();
  return new Date(Date.UTC(y, m, d, -3, 0, 0)).toISOString();
}

function toRiyadhDateInputValue(iso: string) {
  const riyadh = new Date(new Date(iso).getTime() + 3 * 60 * 60 * 1000);
  return riyadh.toISOString().slice(0, 10);
}

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) {
  const supabase = await createClient();
  const dayStart = startOfTodayRiyadhISO();

  const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const rangeStartISO = searchParams.start ? new Date(`${searchParams.start}T00:00:00+03:00`).toISOString() : defaultStart;
  const rangeEndISO = searchParams.end
    ? new Date(new Date(`${searchParams.end}T00:00:00+03:00`).getTime() + 24 * 60 * 60 * 1000).toISOString()
    : new Date().toISOString();

  const { count: tableCount } = await supabase.from("eficto_tables").select("id", { count: "exact", head: true });

  const [{ data: reservations }, { data: topCustomers }, { data: seatedWaits }, departureRange, turnoverRange, utilization] =
    await Promise.all([
      supabase.from("eficto_reservations").select("reservation_time, status").limit(2000),
      supabase
        .from("eficto_customers")
        .select("id, full_name, phone, visit_count")
        .order("visit_count", { ascending: false })
        .limit(10),
      supabase
        .from("eficto_waitlist")
        .select("joined_at, seated_at")
        .eq("status", "seated")
        .not("seated_at", "is", null)
        .gte("joined_at", rangeStartISO)
        .lte("joined_at", rangeEndISO)
        .limit(1000),
      computeDepartureStats(supabase, rangeStartISO),
      computeTurnoverStats(supabase, rangeStartISO),
      computeTableUtilization(supabase, rangeStartISO, rangeEndISO, tableCount ?? 0),
    ]);

  function avgWaitMinutes(rows: { joined_at: string; seated_at: string | null }[]) {
    if (rows.length === 0) return null;
    const totalMs = rows.reduce(
      (sum, r) => sum + (new Date(r.seated_at as string).getTime() - new Date(r.joined_at).getTime()),
      0
    );
    return Math.round(totalMs / rows.length / 60000);
  }

  const allWaits = seatedWaits ?? [];
  const todayWaits = allWaits.filter((r) => r.joined_at >= dayStart);
  const avgWaitToday = avgWaitMinutes(todayWaits);
  const avgWaitRange = avgWaitMinutes(allWaits);

  const all = reservations ?? [];
  const total = all.length;
  const cancelled = all.filter((r) => r.status === "cancelled").length;
  const noShow = all.filter((r) => r.status === "no_show").length;
  const cancellationRate = total > 0 ? Math.round(((cancelled + noShow) / total) * 100) : 0;

  const hourCounts = new Map<number, number>();
  const dayCounts = new Map<string, number>();
  for (const r of all) {
    const hour = new Date(r.reservation_time).getUTCHours();
    hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    const dayKey = toRiyadhDateInputValue(r.reservation_time);
    dayCounts.set(dayKey, (dayCounts.get(dayKey) ?? 0) + 1);
  }
  const busiestHours = [...hourCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([hour, count]) => {
      const riyadhHour = (hour + 3) % 24;
      return { label: `${riyadhHour.toString().padStart(2, "0")}:00`, count };
    });

  const daysInRange = Math.max(
    1,
    Math.round((new Date(rangeEndISO).getTime() - new Date(rangeStartISO).getTime()) / (24 * 60 * 60 * 1000))
  );
  const avgReservationsPerDay = Math.round((total / daysInRange) * 10) / 10;

  const startValue = toRiyadhDateInputValue(rangeStartISO);
  const endValue = toRiyadhDateInputValue(new Date(new Date(rangeEndISO).getTime() - 1).toISOString());

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">التقارير</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">مؤشرات سريعة لأداء الحجوزات والانتظار والعملاء</p>

      <form className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl border border-eficto-gold/25 bg-white p-4 shadow-premium">
        <div>
          <label className="block text-xs text-eficto-green-dark/60">من تاريخ</label>
          <input
            type="date"
            name="start"
            defaultValue={startValue}
            className="mt-1 rounded-lg border border-eficto-gold/30 bg-transparent px-3 py-1.5 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-eficto-green-dark/60">إلى تاريخ</label>
          <input
            type="date"
            name="end"
            defaultValue={endValue}
            className="mt-1 rounded-lg border border-eficto-gold/30 bg-transparent px-3 py-1.5 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-eficto-green px-5 py-2 text-sm text-eficto-cream transition-transform hover:scale-105"
        >
          تحديث
        </button>
        <Link href="/admin/reports" className="text-xs text-eficto-green-dark/50 hover:underline">
          إعادة تعيين (آخر ٣٠ يوم)
        </Link>
      </form>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">متوسط وقت الانتظار (من الانضمام للجلوس)</h2>
            <div className="mt-3 flex items-end gap-6">
              <div>
                <p className="font-arabic-display text-4xl text-eficto-green">
                  {avgWaitToday === null ? "—" : avgWaitToday}
                  {avgWaitToday !== null && <span className="text-lg text-eficto-green-dark/50"> د</span>}
                </p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">اليوم ({todayWaits.length} حالة)</p>
              </div>
              <div>
                <p className="font-arabic-display text-2xl text-eficto-green-dark/70">
                  {avgWaitRange === null ? "—" : avgWaitRange}
                  {avgWaitRange !== null && <span className="text-sm text-eficto-green-dark/50"> د</span>}
                </p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">متوسط الفترة المحددة</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">معدل الانصراف من قائمة الانتظار</h2>
            <p className="mt-3 font-arabic-display text-4xl text-eficto-green">{departureRange.departureRatePct}%</p>
            <p className="mt-1 text-xs text-eficto-green-dark/50">
              {departureRange.leftCount} من أصل {departureRange.totalJoined} انضمام — ~{departureRange.wastedTables} طاولة ضائعة تقريباً
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">دوران الطاولة حسب القسم</h2>
            <div className="mt-3 flex items-end gap-6">
              <div>
                <p className="font-arabic-display text-3xl text-eficto-green">
                  {turnoverRange.indoor.avgMinutes === null ? "—" : turnoverRange.indoor.avgMinutes}
                  {turnoverRange.indoor.avgMinutes !== null && (
                    <span className="text-sm text-eficto-green-dark/50"> د</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">داخلي ({turnoverRange.indoor.sampleSize} جلسة)</p>
              </div>
              <div>
                <p className="font-arabic-display text-3xl text-eficto-green">
                  {turnoverRange.outdoor.avgMinutes === null ? "—" : turnoverRange.outdoor.avgMinutes}
                  {turnoverRange.outdoor.avgMinutes !== null && (
                    <span className="text-sm text-eficto-green-dark/50"> د</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">خارجي ({turnoverRange.outdoor.sampleSize} جلسة)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">نسبة إشغال الطاولات</h2>
            <p className="mt-3 font-arabic-display text-4xl text-eficto-green">{utilization.utilizationPct}%</p>
            <p className="mt-1 text-xs text-eficto-green-dark/50">
              {utilization.occupiedHours} ساعة إشغال فعلية خلال الفترة — من بيانات الجلوس الموثقة فقط
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">معدل الإلغاء / عدم الحضور (حجوزات)</h2>
            <p className="mt-3 font-arabic-display text-4xl text-eficto-green">{cancellationRate}%</p>
            <p className="mt-1 text-xs text-eficto-green-dark/50">
              {cancelled + noShow} من أصل {total} حجز
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">أكثر الأوقات ازدحاماً</h2>
            <ul className="mt-3 space-y-2">
              {busiestHours.length === 0 ? (
                <p className="text-sm text-eficto-green-dark/50">لا توجد بيانات كافية</p>
              ) : (
                busiestHours.map((h) => (
                  <li key={h.label} className="flex items-center justify-between text-sm">
                    <span dir="ltr">{h.label}</span>
                    <span className="text-eficto-green-dark/60">{h.count} حجز</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">متوسط الحجوزات باليوم</h2>
            <p className="mt-3 font-arabic-display text-4xl text-eficto-green">{avgReservationsPerDay}</p>
            <p className="mt-1 text-xs text-eficto-green-dark/50">خلال الفترة المحددة ({daysInRange} يوم)</p>
          </div>
        </div>

        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-6 shadow-premium sm:col-span-2">
          <h2 className="font-serif text-lg text-eficto-green-dark">العملاء الأكثر تكراراً (VIP)</h2>
          <ul className="mt-3 divide-y divide-eficto-gold/10">
            {(topCustomers ?? []).length === 0 ? (
              <p className="py-3 text-sm text-eficto-green-dark/50">لا توجد بيانات كافية</p>
            ) : (
              (topCustomers ?? []).map((c) => (
                <li key={c.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link href={`/admin/customers/${c.id}`} className="text-eficto-green hover:underline">
                    {c.full_name}
                  </Link>
                  <span className="text-eficto-green-dark/60">{c.visit_count} زيارة</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
