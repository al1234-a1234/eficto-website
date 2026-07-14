import type { SupabaseClient } from "@supabase/supabase-js";
import type { TableLocation } from "@/lib/types";

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
