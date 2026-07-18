import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { CustomerNotes } from "@/components/admin/CustomerNotes";
import { StarRating } from "@/components/StarRating";
import { getCustomerReviews, averageRating } from "@/lib/data";
import { formatArabicDate, formatArabicDateTime } from "@/lib/format";

const STATUS_LABELS: Record<string, string> = {
  confirmed: "مؤكد",
  cancelled: "ملغي",
  completed: "مكتمل",
  no_show: "لم يحضر",
};

const LOCATION_LABELS: Record<string, string> = { indoor: "داخلي", outdoor: "خارجي", any: "أي مكان" };
const WAITLIST_STATUS_LABELS: Record<string, string> = { waiting: "بالانتظار", seated: "جلس", left: "غادر" };

export default async function CustomerProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const [{ data: customer }, { data: reservations }, { data: waitlistEntries }, reviews] = await Promise.all([
    supabase.from("eficto_customers").select("*").eq("id", params.id).maybeSingle(),
    supabase
      .from("eficto_reservations")
      .select("id, reservation_time, party_size, status, created_at, status_changed_at, eficto_tables(table_number)")
      .eq("customer_id", params.id)
      .order("reservation_time", { ascending: false }),
    supabase
      .from("eficto_waitlist")
      .select("id, party_size, location, status, joined_at, seated_at, left_at, occasion")
      .eq("customer_id", params.id)
      .order("joined_at", { ascending: false }),
    getCustomerReviews(params.id),
  ]);

  if (!customer) notFound();

  const avgRating = averageRating(reviews);

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

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
          <p className="text-xs text-eficto-green-dark/50">عدد الزيارات</p>
          <p className="mt-1 font-arabic-display text-2xl text-eficto-green">{customer.visit_count}</p>
        </div>
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
          <p className="text-xs text-eficto-green-dark/50">آخر زيارة</p>
          <p className="mt-1 font-arabic-display text-lg text-eficto-green">
            {customer.last_visit_at ? formatArabicDate(customer.last_visit_at) : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
          <p className="text-xs text-eficto-green-dark/50">عميل منذ</p>
          <p className="mt-1 font-arabic-display text-lg text-eficto-green">{formatArabicDate(customer.created_at)}</p>
        </div>
        <div className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
          <p className="text-xs text-eficto-green-dark/50">التقييم</p>
          {avgRating ? (
            <div className="mt-1.5 flex items-center gap-1.5">
              <StarRating rating={avgRating} />
              <span className="font-arabic-display text-sm text-eficto-green">{avgRating.toFixed(1)}</span>
            </div>
          ) : (
            <p className="mt-1 font-arabic-display text-lg text-eficto-green">—</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg text-eficto-green-dark">ملاحظات</h2>
        <div className="mt-3">
          <CustomerNotes customerId={customer.id} initialNotes={customer.notes} />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg text-eficto-green-dark">سجل الانتظار</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          {(waitlistEntries ?? []).length === 0 ? (
            <p className="p-6 text-center text-sm text-eficto-green-dark/50">لا يوجد سجل انتظار سابق</p>
          ) : (
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
                <tr>
                  <th className="px-5 py-3 text-right font-normal">وقت الانضمام</th>
                  <th className="px-5 py-3 text-right font-normal">الأشخاص</th>
                  <th className="px-5 py-3 text-right font-normal">المكان</th>
                  <th className="px-5 py-3 text-right font-normal">الحالة</th>
                  <th className="px-5 py-3 text-right font-normal">وقت الجلوس</th>
                  <th className="px-5 py-3 text-right font-normal">وقت الإلغاء</th>
                </tr>
              </thead>
              <tbody>
                {(waitlistEntries ?? []).map((w) => (
                  <tr key={w.id} className="border-t border-eficto-gold/10">
                    <td className="px-5 py-3">{formatArabicDateTime(w.joined_at)}</td>
                    <td className="px-5 py-3">{w.party_size}</td>
                    <td className="px-5 py-3">{LOCATION_LABELS[w.location] ?? w.location}</td>
                    <td className="px-5 py-3">
                      {WAITLIST_STATUS_LABELS[w.status] ?? w.status}
                      {w.occasion && (
                        <span className="mr-2 rounded-full bg-eficto-gold/15 px-2 py-0.5 text-[10px] text-eficto-gold-deep">
                          🎉 {w.occasion}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-eficto-green-dark/50">
                      {w.seated_at ? formatArabicDateTime(w.seated_at) : "—"}
                    </td>
                    <td className="px-5 py-3 text-xs text-eficto-green-dark/50">
                      {w.left_at ? formatArabicDateTime(w.left_at) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg text-eficto-green-dark">سجل الحجوزات</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          {(reservations ?? []).length === 0 ? (
            <p className="p-6 text-center text-sm text-eficto-green-dark/50">لا يوجد حجوزات سابقة</p>
          ) : (
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-eficto-cream/60 text-eficto-green-dark/60">
                <tr>
                  <th className="px-5 py-3 text-right font-normal">وقت الموعد</th>
                  <th className="px-5 py-3 text-right font-normal">وقت الحجز</th>
                  <th className="px-5 py-3 text-right font-normal">الطاولة</th>
                  <th className="px-5 py-3 text-right font-normal">الأشخاص</th>
                  <th className="px-5 py-3 text-right font-normal">الحالة</th>
                  <th className="px-5 py-3 text-right font-normal">تاريخ الحالة</th>
                </tr>
              </thead>
              <tbody>
                {(reservations ?? []).map((r) => (
                  <tr key={r.id} className="border-t border-eficto-gold/10">
                    <td className="px-5 py-3">{formatArabicDateTime(r.reservation_time)}</td>
                    <td className="px-5 py-3 text-eficto-green-dark/60">{formatArabicDateTime(r.created_at)}</td>
                    <td className="px-5 py-3">
                      {(r.eficto_tables as unknown as { table_number: string } | null)?.table_number ?? "—"}
                    </td>
                    <td className="px-5 py-3">{r.party_size}</td>
                    <td className="px-5 py-3">{STATUS_LABELS[r.status]}</td>
                    <td className="px-5 py-3 text-xs text-eficto-green-dark/50">
                      {r.status === "confirmed" || !r.status_changed_at ? "—" : formatArabicDateTime(r.status_changed_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-serif text-lg text-eficto-green-dark">التقييمات</h2>
        <div className="mt-3 space-y-3">
          {reviews.length === 0 ? (
            <p className="rounded-2xl border border-eficto-gold/25 bg-white p-6 text-center text-sm text-eficto-green-dark/50 shadow-premium">
              لا توجد تقييمات بعد
            </p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
                <div className="flex items-center justify-between">
                  {typeof r.rating === "number" && <StarRating rating={r.rating} />}
                  {r.review_date && (
                    <p className="text-xs text-eficto-green-dark/50">{formatArabicDate(r.review_date)}</p>
                  )}
                </div>
                {r.comment && <p className="mt-3 text-sm leading-6 text-eficto-green-dark/80">{r.comment}</p>}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
