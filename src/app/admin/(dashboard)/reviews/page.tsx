import { createClient } from "@/lib/supabase/server";
import { StarRating } from "@/components/StarRating";
import { formatArabicDate } from "@/lib/format";

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eficto_reviews")
    .select("id, customer_name, rating, comment, review_date")
    .order("review_date", { ascending: false })
    .limit(200);

  const reviews = data ?? [];
  const total = reviews.length;
  const average = total > 0 ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / total : 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.round(r.rating ?? 0) === star).length,
  }));

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
          reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-eficto-gold/25 bg-white p-5 shadow-premium">
              <div className="flex items-center justify-between">
                <p className="font-serif text-eficto-green-dark">{r.customer_name}</p>
                {typeof r.rating === "number" && <StarRating rating={r.rating} />}
              </div>
              {r.comment && <p className="mt-2 text-sm leading-7 text-eficto-green-dark/75">{r.comment}</p>}
              <p className="mt-3 text-xs text-eficto-green-dark/40">{formatArabicDate(r.review_date)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
