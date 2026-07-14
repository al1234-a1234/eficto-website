import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerNotes } from "@/components/admin/CustomerNotes";
import { formatArabicDate, formatArabicDateTime } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  confirmed: "مؤكد",
  cancelled: "ملغي",
  completed: "مكتمل",
  no_show: "لم يحضر",
};

export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const [{ data: customer }, { data: reservations }] = await Promise.all([
    supabase.from("eficto_customers").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("eficto_reservations")
      .select("id, reservation_time, party_size, status, eficto_tables(table_number)")
      .eq("customer_id", params.id)
      .order("reservation_time", { ascending: false }),
  ]);

  if (!customer) notFound();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-arabic-display text-3xl text-eficto-green-dark">{customer.full_name}</h1>
          <p dir="ltr" className="mt-1 text-sm text-eficto-green-dark/60">{customer.phone}</p>
        </div>
        {customer.visit_count >= 5 && (
          <span className="rounded-full bg-eficto-gold/20 px-3 py-1 text-xs text-eficto-gold-deep">عميل VIP</span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-soft">
          <p className="text-xs text-eficto-green-dark/50">عدد الزيارات</p>
          <p className="mt-1 font-arabic-display text-2xl text-eficto-green">{customer.visit_count}</p>
        </div>
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-soft">
          <p className="text-xs text-eficto-green-dark/50">آخر زيارة</p>
          <p className="mt-1 font-arabic-display text-lg text-eficto-green">
            {customer.last_visit_at ? formatArabicDate(customer.last_visit_at) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-soft">
          <p className="text-xs text-eficto-green-dark/50">عميل منذ</p>
          <p className="mt-1 font-arabic-display text-lg text-eficto-green">{formatArabicDate(customer.created_at)}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg text-eficto-green-dark">ملاحظات</h2>
        <div className="mt-3">
          <CustomerNotes customerId={customer.id} initialNotes={customer.notes} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg text-eficto-green-dark">سجل الحجوزات</h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-soft">
          {(reservations ?? []).length === 0 ? (
            <p className="p-6 text-center text-sm text-eficto-green-dark/50">لا يوجد حجوزات سابقة</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
                <tr>
                  <th className="px-5 py-3 text-right font-normal">الوقت</th>
                  <th className="px-5 py-3 text-right font-normal">الطاولة</th>
                  <th className="px-5 py-3 text-right font-normal">الأشخاص</th>
                  <th className="px-5 py-3 text-right font-normal">الحالة</th>
                </tr>
              </thead>
              <tbody>
                {(reservations ?? []).map((r) => (
                  <tr key={r.id} className="border-t border-eficto-gold/10">
                    <td className="px-5 py-3">{formatArabicDateTime(r.reservation_time)}</td>
                    <td className="px-5 py-3">
                      {(r.eficto_tables as unknown as { table_number: string } | null)?.table_number ?? "—"}
                    </td>
                    <td className="px-5 py-3">{r.party_size}</td>
                    <td className="px-5 py-3">{STATUS_LABELS[r.status]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
