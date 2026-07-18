import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StarRating } from "@/components/StarRating";
import { CalendarIcon, CloseIcon } from "@/components/icons";
import { formatArabicDate } from "@/lib/format";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eficto_reviews")
    .select("id, customer_id, customer_name, rating, comment, review_date")
    .order("review_date", { ascending: false })
    .limit(200);

  const reviews = data ?? [];
  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / total : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating ?? 0) === star).length,
  }));

  const customerIds = [...new Set(reviews.map((r) => r.customer_id).filter(Boolean))] as string[];

  const [{ data: customers }, { data: reservations }] =
    customerIds.length > 0
      ? await Promise.all([
          supabase.from("eficto_customers").select("id, visit_count").in("id", customerIds),
          supabase.from("eficto_reservations").select("customer_id, status").in("customer_id", customerIds),
        ])
      : [{ data: [] }, { data: [] }];

  const visitsByCustomer = new Map((customers ?? []).map((c) => [c.id, c.visit_count ?? 0]));
  const cancelledByCustomer = new Map<string, number>();
  for (const r of reservations ?? []) {
    if (r.status === "cancelled" || r.status === "no_show") {
      cancelledByCustomer.set(r.customer_id, (cancelledByCustomer.get(r.customer_id) ?? 0) + 1);
    }
  }

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">التقييمات</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">كل التقييمات اللي أرسلها العملاء من صفحة الموقع</p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <p className="text-sm text-eficto-green-dark/60">متوسط التقييم</p>
            <div className="mt-2 flex items-end gap-3">
              <p className="font-arabic-display text-5xl text-eficto-green">{average.toFixed(1)}</p>
              <StarRating rating={average} />
            </div>
            <p className="mt-1 text-xs text-eficto-green-dark/50">من {total} تقييم</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-eficto-gold/25 bg-white shadow-premium">
          <div className="border-t-4 border-eficto-gold p-6">
            <p className="text-sm text-eficto-green-dark/60">توزيع النجوم</p>
            <ul className="mt-3 space-y-2">
              {distribution.map((d) => (
                <li key={d.star} className="flex items-center gap-3 text-sm">
                  <span dir="ltr" className="w-8 text-eficto-gold-deep">
                    {d.star}★
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-eficto-cream">
                    <div
                      className="h-full bg-eficto-gold"
                      style={{ width: total > 0 ? `${(d.count / total) * 100}%` : "0%" }}
                    />
                  </div>
                  <span className="w-6 text-left text-eficto-green-dark/60">{d.count}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-eficto-gold/25 bg-white p-8 text-center text-sm text-eficto-green-dark/50 shadow-premium">
            لا توجد تقييمات بعد
          </p>
        ) : (
          reviews.map((r) => {
            const visits = r.customer_id ? visitsByCustomer.get(r.customer_id) : undefined;
            const cancellations = r.customer_id ? cancelledByCustomer.get(r.customer_id) ?? 0 : 0;
            return (
              <div key={r.id} className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
                <div className="flex items-center justify-between">
                  {r.customer_id ? (
                    <Link
                      href={`/admin/customers/${r.customer_id}`}
                      className="font-serif text-eficto-green-dark hover:text-eficto-green hover:underline"
                    >
                      {r.customer_name}
                    </Link>
                  ) : (
                    <p className="font-serif text-eficto-green-dark">{r.customer_name}</p>
                  )}
                  {typeof r.rating === "number" && <StarRating rating={r.rating} />}
                </div>

                {visits !== undefined && (
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-eficto-green-dark/50">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {visits} حجز/زيارة
                    </span>
                    {cancellations > 0 && (
                      <span className="flex items-center gap-1.5 text-eficto-alert/80">
                        <CloseIcon className="h-3.5 w-3.5" />
                        {cancellations} إلغاء
                      </span>
                    )}
                  </div>
                )}

                {r.comment && <p className="mt-3 text-sm leading-7 text-eficto-green-dark/75">{r.comment}</p>}
                <p className="mt-3 text-xs text-eficto-green-dark/40">{formatArabicDate(r.review_date)}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
