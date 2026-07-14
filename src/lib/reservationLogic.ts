import type { SupabaseClient } from "@supabase/supabase-js";

/** Riyadh is UTC+3 year-round (no DST). */
export function toRiyadhISOString(date: string, time: string) {
  return new Date(`${date}T${time}:00+03:00`).toISOString();
}

const SLOT_WINDOW_MINUTES = 120;

export async function findAvailableTable(
  supabase: SupabaseClient,
  reservationTimeISO: string,
  partySize: number
) {
  const requested = new Date(reservationTimeISO).getTime();
  const windowMs = SLOT_WINDOW_MINUTES * 60 * 1000;
  const from = new Date(requested - windowMs).toISOString();
  const to = new Date(requested + windowMs).toISOString();

  const { data: tables, error: tablesError } = await supabase
    .from("eficto_tables")
    .select("id, table_number, capacity, location")
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
  partySize: number
) {
  const requested = new Date(reservationTimeISO).getTime();
  const windowMs = SLOT_WINDOW_MINUTES * 60 * 1000;
  const from = new Date(requested - windowMs).toISOString();
  const to = new Date(requested + windowMs).toISOString();

  const { data: tables, error: tablesError } = await supabase
    .from("eficto_tables")
    .select("id")
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
