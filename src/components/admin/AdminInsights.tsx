import { createClient } from "@/lib/supabase/server";
import { BellIcon, ClockIcon } from "@/components/icons";
import {
  computeDepartureStatsBoth,
  computeAnomalyAlerts,
  computeWaitEstimateMinutes,
  getActiveSeatedEntries,
} from "@/lib/analytics";

function startOfTodayRiyadhISO() {
  const now = new Date();
  const riyadhNow = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const y = riyadhNow.getUTCFullYear();
  const m = riyadhNow.getUTCMonth();
  const d = riyadhNow.getUTCDate();
  return new Date(Date.UTC(y, m, d, -3, 0, 0)).toISOString();
}

/**
 * Deliberately split out from the main overview page and rendered inside a <Suspense> boundary:
 * these are the heavier analytics queries, and streaming them in separately keeps the rest of
 * the dashboard (hero, basic counts, table map) painting instantly on every navigation.
 */
export async function AdminInsights() {
  const supabase = await createClient();
  const dayStart = startOfTodayRiyadhISO();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [{ narrow: departureToday, wide: departureWeek }, anomalyAlerts, waitEstimateMinutes, activeSeated] =
    await Promise.all([
      computeDepartureStatsBoth(supabase, dayStart, weekAgo),
      computeAnomalyAlerts(supabase),
      computeWaitEstimateMinutes(supabase),
      getActiveSeatedEntries(supabase),
    ]);

  const longSeated = activeSeated.filter((r) => r.isLongSeated);

  return (
    <div className="space-y-6">
      {(anomalyAlerts.length > 0 || longSeated.length > 0) && (
        <div className="space-y-3">
          {anomalyAlerts.map((alert) => (
            <div
              key={alert.metric}
              className="flex items-center gap-3 rounded-2xl border border-eficto-alert/40 bg-eficto-alert/10 p-4"
            >
              <BellIcon className="h-4 w-4 shrink-0 text-eficto-alert" />
              <p className="text-sm text-eficto-alert">{alert.message}</p>
            </div>
          ))}
          {longSeated.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-eficto-alert/40 bg-eficto-alert/10 p-4">
              <BellIcon className="mt-0.5 h-4 w-4 shrink-0 text-eficto-alert" />
              <div className="text-sm text-eficto-alert">
                <p>طاولات جالسة مدة طويلة غير معتادة:</p>
                <ul className="mt-1 space-y-0.5 text-xs">
                  {longSeated.map((r) => (
                    <li key={r.id}>
                      {r.party_size} أشخاص ({r.location === "indoor" ? "داخلي" : "خارجي"}) — منذ {r.elapsedMinutes} دقيقة
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <div className="flex items-center gap-2.5 text-eficto-green-dark/60">
              <ClockIcon className="h-4 w-4" />
              <p className="text-sm">الانتظار المتوقع الآن</p>
            </div>
            <p className="mt-2 font-arabic-display text-4xl text-eficto-green">
              ~{waitEstimateMinutes}
              <span className="text-lg text-eficto-green-dark/50"> د</span>
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="p-5">
            <h2 className="font-serif text-lg text-eficto-green-dark">معدل الانصراف</h2>
            <p className="mt-1 text-xs text-eficto-green-dark/50">عملاء انضموا للانتظار ثم غادروا قبل الجلوس</p>
            <div className="mt-4 flex items-end gap-6">
              <div>
                <p className="font-arabic-display text-3xl text-eficto-green">{departureToday.departureRatePct}%</p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">اليوم</p>
              </div>
              <div>
                <p className="font-arabic-display text-xl text-eficto-green-dark/70">{departureWeek.departureRatePct}%</p>
                <p className="mt-1 text-xs text-eficto-green-dark/50">هذا الأسبوع</p>
              </div>
            </div>
            {departureWeek.wastedTables > 0 && (
              <p className="mt-3 text-xs text-eficto-alert">
                خسّرت ~{departureWeek.wastedTables} طاولة هذا الأسبوع بسبب الانصراف
                {departureWeek.avgWaitAtDepartureMinutes !== null &&
                  ` (متوسط انتظارهم قبل الانصراف: ${departureWeek.avgWaitAtDepartureMinutes} د)`}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminInsightsSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {[0, 1].map((i) => (
        <div key={i} className="h-[140px] animate-pulse rounded-2xl border border-eficto-gold/15 bg-white/60" />
      ))}
    </div>
  );
}
