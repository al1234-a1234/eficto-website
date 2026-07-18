import type { SupabaseClient } from "@supabase/supabase-js";

/** Fallback turnover estimate (minutes) used until enough real "completed" data exists. */
const DEFAULT_TURNOVER_MINUTES = 40;
export const LONG_SEAT_ALERT_MINUTES = 90;
export const ANOMALY_THRESHOLD_PCT = 40;
export const RECALL_INACTIVITY_DAYS = 21;

function riyadhNow() {
  return new Date(Date.now() + 3 * 60 * 60 * 1000);
}

function minutesBetween(a: string, b: string) {
  return (new Date(b).getTime() - new Date(a).getTime()) / 60000;
}

function average(values: number[]) {
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/**
 * Predicted wait in minutes = (queue ahead ÷ tables likely to free up) × avg turnover,
 * blended with the historical average wait for this same weekday/hour when enough samples exist.
 */
export async function computeWaitEstimateMinutes(supabase: SupabaseClient): Promise<number> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const eightWeeksAgo = new Date(Date.now() - 56 * 24 * 60 * 60 * 1000).toISOString();
  const now = riyadhNow();
  const weekday = now.getUTCDay();
  const hour = now.getUTCHours();

  // All five queries are independent of one another — fire them together so the
  // function costs one network round trip instead of stacking them sequentially.
  const [
    { count: waitingCount },
    { count: seatedCount },
    { count: totalTables },
    { data: turnoverRows },
    { data: historicalRows },
  ] = await Promise.all([
    supabase.from("eficto_waitlist").select("id", { count: "exact", head: true }).eq("status", "waiting"),
    supabase.from("eficto_waitlist").select("id", { count: "exact", head: true }).eq("status", "seated"),
    supabase.from("eficto_tables").select("id", { count: "exact", head: true }),
    supabase
      .from("eficto_waitlist")
      .select("seated_at, completed_at")
      .eq("status", "completed")
      .not("seated_at", "is", null)
      .not("completed_at", "is", null)
      .gte("completed_at", thirtyDaysAgo)
      .limit(500),
    supabase
      .from("eficto_waitlist")
      .select("joined_at, seated_at")
      .in("status", ["seated", "completed"])
      .not("seated_at", "is", null)
      .gte("joined_at", eightWeeksAgo)
      .limit(1000),
  ]);

  const turnoverSamples = (turnoverRows ?? []).map((r) => minutesBetween(r.seated_at as string, r.completed_at as string));
  const avgTurnover =
    turnoverSamples.length >= 3 ? (average(turnoverSamples) as number) : DEFAULT_TURNOVER_MINUTES;

  const availableTables = Math.max((totalTables ?? 0) - (seatedCount ?? 0), 1);
  const queueBasedEstimate = Math.ceil((waitingCount ?? 0) / availableTables) * avgTurnover;

  const historicalSamples = (historicalRows ?? [])
    .filter((r) => {
      const joined = new Date(new Date(r.joined_at).getTime() + 3 * 60 * 60 * 1000);
      if (joined.getUTCDay() !== weekday) return false;
      const diff = Math.min(Math.abs(joined.getUTCHours() - hour), 24 - Math.abs(joined.getUTCHours() - hour));
      return diff <= 1;
    })
    .map((r) => minutesBetween(r.joined_at, r.seated_at as string));

  const historicalAvg = historicalSamples.length >= 5 ? average(historicalSamples) : null;

  const blended =
    historicalAvg !== null ? 0.55 * queueBasedEstimate + 0.45 * historicalAvg : queueBasedEstimate;

  return Math.min(90, Math.max(5, Math.round(blended)));
}

export interface DepartureStats {
  totalJoined: number;
  leftCount: number;
  departureRatePct: number;
  wastedTables: number;
  avgWaitAtDepartureMinutes: number | null;
}

/** Abandonment = joined the queue (status "waiting") and left before ever being seated. */
export async function computeDepartureStats(
  supabase: SupabaseClient,
  sinceISO: string
): Promise<DepartureStats> {
  const [{ data: joinedRows }, { data: avgCapacityRows }] = await Promise.all([
    supabase
      .from("eficto_waitlist")
      .select("status, party_size, joined_at, left_at")
      .gte("joined_at", sinceISO)
      .in("status", ["waiting", "seated", "left", "completed"])
      .limit(3000),
    supabase.from("eficto_tables").select("capacity"),
  ]);

  const rows = joinedRows ?? [];
  const totalJoined = rows.length;
  const leftRows = rows.filter((r) => r.status === "left");
  const leftCount = leftRows.length;
  const departureRatePct = totalJoined > 0 ? Math.round((leftCount / totalJoined) * 100) : 0;

  const capacities = (avgCapacityRows ?? []).map((t) => t.capacity ?? 0).filter((c) => c > 0);
  const avgCapacity = capacities.length > 0 ? (average(capacities) as number) : 4;
  const totalLostGuests = leftRows.reduce((sum, r) => sum + (r.party_size ?? 0), 0);
  const wastedTables = Math.round((totalLostGuests / avgCapacity) * 10) / 10;

  const waitSamples = leftRows
    .filter((r) => r.left_at)
    .map((r) => minutesBetween(r.joined_at, r.left_at as string));
  const avgWaitAtDepartureMinutes = waitSamples.length > 0 ? Math.round(average(waitSamples) as number) : null;

  return { totalJoined, leftCount, departureRatePct, wastedTables, avgWaitAtDepartureMinutes };
}

function summarizeDeparture(
  rows: { status: string; party_size: number; joined_at: string; left_at: string | null }[],
  avgCapacity: number,
  sinceISO: string
): DepartureStats {
  const scoped = rows.filter((r) => r.joined_at >= sinceISO);
  const totalJoined = scoped.length;
  const leftRows = scoped.filter((r) => r.status === "left");
  const leftCount = leftRows.length;
  const departureRatePct = totalJoined > 0 ? Math.round((leftCount / totalJoined) * 100) : 0;

  const totalLostGuests = leftRows.reduce((sum, r) => sum + (r.party_size ?? 0), 0);
  const wastedTables = Math.round((totalLostGuests / avgCapacity) * 10) / 10;

  const waitSamples = leftRows
    .filter((r) => r.left_at)
    .map((r) => minutesBetween(r.joined_at, r.left_at as string));
  const avgWaitAtDepartureMinutes = waitSamples.length > 0 ? Math.round(average(waitSamples) as number) : null;

  return { totalJoined, leftCount, departureRatePct, wastedTables, avgWaitAtDepartureMinutes };
}

/**
 * Same as computeDepartureStats but for two overlapping windows (e.g. today + this week) —
 * fetches the wider window once and derives both from the same rows instead of two round trips.
 */
export async function computeDepartureStatsBoth(
  supabase: SupabaseClient,
  narrowSinceISO: string,
  wideSinceISO: string
): Promise<{ narrow: DepartureStats; wide: DepartureStats }> {
  const [{ data: joinedRows }, { data: avgCapacityRows }] = await Promise.all([
    supabase
      .from("eficto_waitlist")
      .select("status, party_size, joined_at, left_at")
      .gte("joined_at", wideSinceISO)
      .in("status", ["waiting", "seated", "left", "completed"])
      .limit(3000),
    supabase.from("eficto_tables").select("capacity"),
  ]);

  const rows = joinedRows ?? [];
  const capacities = (avgCapacityRows ?? []).map((t) => t.capacity ?? 0).filter((c) => c > 0);
  const avgCapacity = capacities.length > 0 ? (average(capacities) as number) : 4;

  return {
    narrow: summarizeDeparture(rows, avgCapacity, narrowSinceISO),
    wide: summarizeDeparture(rows, avgCapacity, wideSinceISO),
  };
}

export interface TurnoverStats {
  indoor: { avgMinutes: number | null; sampleSize: number };
  outdoor: { avgMinutes: number | null; sampleSize: number };
}

/** Table turnover time = from being seated until the table is freed ("completed"), grouped by section. */
export async function computeTurnoverStats(supabase: SupabaseClient, sinceISO: string): Promise<TurnoverStats> {
  const { data } = await supabase
    .from("eficto_waitlist")
    .select("location, seated_at, completed_at")
    .eq("status", "completed")
    .not("seated_at", "is", null)
    .not("completed_at", "is", null)
    .gte("completed_at", sinceISO)
    .limit(2000);

  const rows = data ?? [];
  function statsFor(location: "indoor" | "outdoor") {
    const samples = rows
      .filter((r) => r.location === location)
      .map((r) => minutesBetween(r.seated_at as string, r.completed_at as string));
    return { avgMinutes: samples.length > 0 ? Math.round(average(samples) as number) : null, sampleSize: samples.length };
  }

  return { indoor: statsFor("indoor"), outdoor: statsFor("outdoor") };
}

export interface ActiveSeatedRow {
  id: string;
  party_size: number;
  location: "indoor" | "outdoor" | "any";
  seated_at: string;
  elapsedMinutes: number;
  isLongSeated: boolean;
  eficto_customers: { full_name: string; phone: string } | null;
}

export async function getActiveSeatedEntries(supabase: SupabaseClient): Promise<ActiveSeatedRow[]> {
  const { data } = await supabase
    .from("eficto_waitlist")
    .select("id, party_size, location, seated_at, eficto_customers(full_name, phone)")
    .eq("status", "seated")
    .order("seated_at", { ascending: true });

  return ((data ?? []) as unknown as Omit<ActiveSeatedRow, "elapsedMinutes" | "isLongSeated">[]).map((row) => {
    const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(row.seated_at).getTime()) / 60000));
    return { ...row, elapsedMinutes, isLongSeated: elapsedMinutes >= LONG_SEAT_ALERT_MINUTES };
  });
}

export interface AnomalyAlert {
  metric: "wait" | "departure" | "volume";
  message: string;
  deviationPct: number;
}

/**
 * Compares tonight-so-far to the historical average for the same weekday, same time-of-night window,
 * over the last 6 weeks. Flags any metric that deviates by more than ANOMALY_THRESHOLD_PCT.
 */
export async function computeAnomalyAlerts(supabase: SupabaseClient): Promise<AnomalyAlert[]> {
  const now = riyadhNow();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();
  const d = now.getUTCDate();
  const tonightStartISO = new Date(Date.UTC(y, m, d, -3, 0, 0)).toISOString();
  const nowISO = new Date().toISOString();
  const weekday = now.getUTCDay();
  const minutesSinceOpen = Math.max(1, Math.round((Date.now() - new Date(tonightStartISO).getTime()) / 60000));

  const sixWeeksAgo = new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString();

  const [{ data: tonightRows }, { data: historyRows }] = await Promise.all([
    supabase
      .from("eficto_waitlist")
      .select("status, joined_at, seated_at, left_at")
      .gte("joined_at", tonightStartISO)
      .lte("joined_at", nowISO)
      .limit(1000),
    supabase
      .from("eficto_waitlist")
      .select("status, joined_at, seated_at, left_at")
      .gte("joined_at", sixWeeksAgo)
      .lt("joined_at", tonightStartISO)
      .limit(5000),
  ]);

  const tonight = tonightRows ?? [];
  const relevantHistory = (historyRows ?? []).filter((r) => {
    const joined = new Date(new Date(r.joined_at).getTime() + 3 * 60 * 60 * 1000);
    if (joined.getUTCDay() !== weekday) return false;
    const joinedMinutesSinceOpen =
      (joined.getTime() - new Date(joined.getUTCFullYear(), joined.getUTCMonth(), joined.getUTCDate()).getTime()) /
      60000;
    return joinedMinutesSinceOpen <= minutesSinceOpen + 60;
  });

  const alerts: AnomalyAlert[] = [];
  if (relevantHistory.length < 8) return alerts;

  function waitAvg(rows: typeof tonight) {
    const samples = rows
      .filter((r) => r.seated_at)
      .map((r) => minutesBetween(r.joined_at, r.seated_at as string));
    return average(samples);
  }

  const tonightWait = waitAvg(tonight);
  const historyWait = waitAvg(relevantHistory);
  if (tonightWait !== null && historyWait !== null && historyWait > 0) {
    const deviation = Math.round(((tonightWait - historyWait) / historyWait) * 100);
    if (Math.abs(deviation) >= ANOMALY_THRESHOLD_PCT) {
      alerts.push({
        metric: "wait",
        deviationPct: deviation,
        message:
          deviation > 0
            ? `وقت الانتظار الليلة أعلى ${deviation}% من المعتاد لنفس اليوم`
            : `وقت الانتظار الليلة أقل ${Math.abs(deviation)}% من المعتاد لنفس اليوم`,
      });
    }
  }

  function departureRate(rows: typeof tonight) {
    if (rows.length === 0) return null;
    return (rows.filter((r) => r.status === "left").length / rows.length) * 100;
  }

  const tonightDep = departureRate(tonight);
  const historyDep = departureRate(relevantHistory);
  if (tonightDep !== null && historyDep !== null && historyDep > 0) {
    const deviation = Math.round(((tonightDep - historyDep) / historyDep) * 100);
    if (Math.abs(deviation) >= ANOMALY_THRESHOLD_PCT) {
      alerts.push({
        metric: "departure",
        deviationPct: deviation,
        message:
          deviation > 0
            ? `نسبة الانصراف الليلة أعلى ${deviation}% من المعتاد لنفس اليوم`
            : `نسبة الانصراف الليلة أقل ${Math.abs(deviation)}% من المعتاد`,
      });
    }
  }

  const historyVolumeAvg = relevantHistory.length / 6;
  if (historyVolumeAvg > 0) {
    const deviation = Math.round(((tonight.length - historyVolumeAvg) / historyVolumeAvg) * 100);
    if (Math.abs(deviation) >= ANOMALY_THRESHOLD_PCT && tonight.length >= 3) {
      alerts.push({
        metric: "volume",
        deviationPct: deviation,
        message:
          deviation > 0
            ? `عدد الانضمامات الليلة أعلى ${deviation}% من المعتاد لنفس اليوم`
            : `عدد الانضمامات الليلة أقل ${Math.abs(deviation)}% من المعتاد`,
      });
    }
  }

  return alerts;
}
