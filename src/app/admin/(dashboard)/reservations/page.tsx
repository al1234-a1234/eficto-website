import { createClient } from "@/lib/supabase/server";
import { ReservationsManager } from "@/components/admin/ReservationsManager";
import type { ReservationWithRelations } from "@/lib/types";

function toRiyadhDateInputValue(iso: string) {
  const riyadh = new Date(new Date(iso).getTime() + 3 * 60 * 60 * 1000);
  return riyadh.toISOString().slice(0, 10);
}

export default async function AdminReservationsPage({
  searchParams,
}: {
  searchParams: { start?: string; end?: string };
}) {
  const supabase = await createClient();

  const defaultStart = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const rangeStartISO = searchParams.start ? new Date(`${searchParams.start}T00:00:00+03:00`).toISOString() : defaultStart;
  const rangeEndISO = searchParams.end
    ? new Date(new Date(`${searchParams.end}T00:00:00+03:00`).getTime() + 24 * 60 * 60 * 1000).toISOString()
    : new Date().toISOString();

  const [{ data: reservations }, { data: tables }] = await Promise.all([
    supabase
      .from("eficto_reservations")
      .select(
        "id, customer_id, table_id, reservation_time, party_size, status, created_at, status_changed_at, eficto_customers(id, full_name, phone), eficto_tables(id, table_number, capacity, location)"
      )
      .gte("reservation_time", rangeStartISO)
      .lte("reservation_time", rangeEndISO)
      .order("reservation_time", { ascending: false })
      .limit(1000),
    supabase.from("eficto_tables").select("*").order("table_number"),
  ]);

  const startValue = toRiyadhDateInputValue(rangeStartISO);
  const endValue = toRiyadhDateInputValue(new Date(new Date(rangeEndISO).getTime() - 1).toISOString());

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">الحجوزات</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">إدارة، تأكيد وتعديل حجوزات العملاء</p>

      <div className="mt-8">
        <ReservationsManager
          initialReservations={(reservations ?? []) as unknown as ReservationWithRelations[]}
          tables={tables ?? []}
          startValue={startValue}
          endValue={endValue}
        />
      </div>
    </div>
  );
}
