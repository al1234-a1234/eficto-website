import { getStaffSession } from "@/lib/staffAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { StaffAccessDenied } from "@/components/staff/StaffAccessDenied";
import { computeDepartureStats, computeTurnoverStats } from "@/lib/analytics";

export default async function StaffReportsPage() {
  const session = await getStaffSession();
  if (!session?.permissions.reports) return <StaffAccessDenied />;

  const supabase = createAdminClient();
  const rangeStartISO = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: reservations }, departure, turnover] = await Promise.all([
    supabase.from("eficto_reservations").select("status").gte("reservation_time", rangeStartISO).limit(2000),
    computeDepartureStats(supabase, rangeStartISO),
    computeTurnoverStats(supabase, rangeStartISO),
  ]);

  const all = reservations ?? [];
  const total = all.length;
  const cancelled = all.filter((r) => r.status === "cancelled" || r.status === "no_show").length;
  const cancellationRate = total > 0 ? Math.round((cancelled / total) * 100) : 0;

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">التقارير</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">آخر ٣٠ يوم</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">معدل الانصراف من قائمة الانتظار</h2>
            <p className="mt-3 font-arabic-display text-4xl text-eficto-green">{departure.departureRatePct}%</p>
            <p className="mt-1 text-xs text-eficto-green-dark/50">
              {departure.leftCount} من أصل {departure.totalJoined} انضمام
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">معدل الإلغاء / عدم الحضور</h2>
            <p className="mt-3 font-arabic-display text-4xl text-eficto-green">{cancellationRate}%</p>
            <p className="mt-1 text-xs text-eficto-green-dark/50">{cancelled} من أصل {total} حجز</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium sm:col-span-2">
          <div className="border-t-4 border-eficto-gold p-6">
            <h2 className="font-serif text-lg text-eficto-green-dark">دوران الطاولة حسب القسم</h2>
            <div className="mt-3 flex items-end gap-8">
              <div>
                <p className="font-arabic-display text-3xl text-eficto-green">
                  {turnover.indoor.avgMinutes === null ? "—" : turnover.indoor.avgMinutes}
                  {turnover.indoor.avgMinutes !== null && <span className="text-sm text-eficto-green-dark/50"> د</span>}
                </p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">داخلي ({turnover.indoor.sampleSize} جلسة)</p>
              </div>
              <div>
                <p className="font-arabic-display text-3xl text-eficto-green">
                  {turnover.outdoor.avgMinutes === null ? "—" : turnover.outdoor.avgMinutes}
                  {turnover.outdoor.avgMinutes !== null && <span className="text-sm text-eficto-green-dark/50"> د</span>}
                </p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">خارجي ({turnover.outdoor.sampleSize} جلسة)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
