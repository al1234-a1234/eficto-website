import type { SupabaseClient } from "@supabase/supabase-js";
import type { TableLocation } from "@/lib/types";

/** Riyadh is UTC+3 year-round (no DST). */
export function toRiyadhISOString(date: string, time: string) {
  return new Date(`${date}T${time}:00+03:00`).toISOString();
}

const SLOT_WINDOW_MINUTES = 120;

/** Manual override the owner toggles from the admin dashboard when a section is fully booked. */
export async function isLocationFull(supabase: SupabaseClient, location: TableLocation) {
  const { data, error } = await supabase
    .from("eficto_location_status")
    .select("is_full")
    .eq("location", location)
    .maybeSingle();
  if (error) throw error;
  return data?.is_full ?? false;
}

export async function findAvailableTable(
  supabase: SupabaseClient,
  reservationTimeISO: string,
  partySize: number,
  location: TableLocation
) {
  const requested = new Date(reservationTimeISO).getTime();
  const windowMs = SLOT_WINDOW_MINUTES * 60 * 1000;
  const from = new Date(requested - windowMs).toISOString();
  const to = new Date(requested + windowMs).toISOString();

  const { data: tables, error: tablesError } = await supabase
    .from("eficto_tables")
    .select("id, table_number, capacity, location")
    .eq("location", location)
    .gte("capacity", partySize)
    .order("capacity", { ascending: true });

  if (tablesError) throw tablesError;
  if (!tables || tables.length === 0) return null;

  const { data: overlapping, error: reservationsError } = await supabase
    .from("eficto_reservations")
    .select("table_id")
    .eq("status", "confirmed")
    .gte("reservation_time", from)
    .lte("reservation_time", to);

  if (reservationsError) throw reservationsError;

  const bookedTableIds = new Set((overlapping ?? []).map((r) => r.table_id));
  return tables.find((t) => !bookedTableIds.has(t.id)) ?? null;
}

export async function countAvailableTables(
  supabase: SupabaseClient,
  reservationTimeISO: string,
  partySize: number,
  location: TableLocation
) {
  const requested = new Date(reservationTimeISO).getTime();
  const windowMs = SLOT_WINDOW_MINUTES * 60 * 1000;
  const from = new Date(requested - windowMs).toISOString();
  const to = new Date(requested + windowMs).toISOString();

  const { data: tables, error: tablesError } = await supabase
    .from("eficto_tables")
    .select("id")
    .eq("location", location)
    .gte("capacity", partySize);
  if (tablesError) throw tablesError;

  const { data: overlapping, error: reservationsError } = await supabase
    .from("eficto_reservations")
    .select("table_id")
    .eq("status", "confirmed")
    .gte("reservation_time", from)
    .lte("reservation_time", to);
  if (reservationsError) throw reservationsError;

  const bookedTableIds = new Set((overlapping ?? []).map((r) => r.table_id));
  return (tables ?? []).filter((t) => !bookedTableIds.has(t.id)).length;
}

/** This reservation's place in today's confirmed reservation queue (Riyadh calendar day). */
export async function getDailyReservationNumber(supabase: SupabaseClient, reservationCreatedAt: string) {
  const created = new Date(reservationCreatedAt);
  const riyadh = new Date(created.getTime() + 3 * 60 * 60 * 1000);
  const y = riyadh.getUTCFullYear();
  const m = riyadh.getUTCMonth();
  const d = riyadh.getUTCDate();
  const dayStart = new Date(Date.UTC(y, m, d, -3, 0, 0)).toISOString();
  const dayEnd = new Date(new Date(dayStart).getTime() + 24 * 60 * 60 * 1000).toISOString();

  const { count, error } = await supabase
    .from("eficto_reservations")
    .select("id", { count: "exact", head: true })
    .eq("status", "confirmed")
    .gte("created_at", dayStart)
    .lt("created_at", dayEnd)
    .lte("created_at", reservationCreatedAt);

  if (error) throw error;
  return count ?? 1;
}

export async function upsertCustomer(
  supabase: SupabaseClient,
  fullName: string,
  phone: string
) {
  const { data: existing, error: findError } = await supabase
    .from("eficto_customers")
    .select("id")
    .eq("phone", phone)
    .maybeSingle();
  if (findError) throw findError;

  if (existing) {
    await supabase.from("eficto_customers").update({ full_name: fullName }).eq("id", existing.id);
    return existing.id as string;
  }

  const { data: created, error: createError } = await supabase
    .from("eficto_customers")
    .insert({ full_name: fullName, phone })
    .select("id")
    .single();
  if (createError) throw createError;
  return created.id as string;
}
