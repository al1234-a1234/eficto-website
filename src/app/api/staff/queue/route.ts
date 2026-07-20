import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStaffSession } from "@/lib/staffAuth";
import { getDailyReservationNumber } from "@/lib/reservationLogic";

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

export async function GET() {
  const session = await getStaffSession();
  if (!session?.permissions.queue) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const dayStart = startOfTodayRiyadhISO();
  const dayEnd = endOfTodayRiyadhISO();

  const [{ data: waitlist }, { data: seated }, { data: reservations }] = await Promise.all([
    supabase
      .from("eficto_waitlist")
      .select("id, party_size, location, status, joined_at, occasion, eficto_customers(full_name, phone)")
      .eq("status", "waiting")
      .order("joined_at", { ascending: true }),
    supabase
      .from("eficto_waitlist")
      .select("id, party_size, location, seated_at, eficto_customers(full_name, phone)")
      .eq("status", "seated")
      .order("seated_at", { ascending: true }),
    supabase
      .from("eficto_reservations")
      .select(
        "id, party_size, reservation_time, status, created_at, eficto_customers(full_name, phone), eficto_tables(table_number, location)"
      )
      .eq("status", "confirmed")
      .gte("reservation_time", dayStart)
      .lt("reservation_time", dayEnd)
      .order("reservation_time", { ascending: true }),
  ]);

  const reservationsWithNumbers = await Promise.all(
    (reservations ?? []).map(async (r) => ({
      ...r,
      dailyNumber: await getDailyReservationNumber(supabase, r.created_at),
    }))
  );

  return NextResponse.json({
    waitlist: waitlist ?? [],
    seated: seated ?? [],
    reservations: reservationsWithNumbers,
  });
}
