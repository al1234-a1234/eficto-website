import { createClient } from "@/lib/supabase/server";
import { ReservationsManager } from "@/components/admin/ReservationsManager";
import type { ReservationWithRelations } from "@/lib/types";

export default async function AdminReservationsPage() {
  const supabase = await createClient();

  const [{ data: reservations }, { data: tables }] = await Promise.all([
    supabase
      .from("eficto_reservations")
      .select(
        "id, customer_id, table_id, reservation_time, party_size, status, created_at, eficto_customers(id, full_name, phone), eficto_tables(id, table_number, capacity, location)"
      )
      .order("reservation_time", { ascending: false })
      .limit(300),
    supabase.from("eficto_tables").select("*").order("table_number"),
  ]);

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">الحجوزات</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">إدارة، تأكيد وتعديل حجوزات العملاء</p>

      <div className="mt-6">
        <ReservationsManager
          initialReservations={(reservations ?? []) as unknown as ReservationWithRelations[]}
          tables={tables ?? []}
        />
      </div>
    </div>
  );
}
