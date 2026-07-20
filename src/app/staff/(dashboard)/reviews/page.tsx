import { getStaffSession } from "@/lib/staffAuth";
import { createAdminClient } from "@/lib/supabase/admin";
import { StaffAccessDenied } from "@/components/staff/StaffAccessDenied";
import { StarRating } from "@/components/StarRating";
import { formatArabicDate } from "@/lib/format";

export default async function StaffReviewsPage() {
  const session = await getStaffSession();
  if (!session?.permissions.reviews) return <StaffAccessDenied />;

  const supabase = createAdminClient();
  const { data } = await supabase
    .from("eficto_reviews")
    .select("id, customer_name, rating, comment, review_date")
    .order("review_date", { ascending: false })
    .limit(100);

  const reviews = data ?? [];

  return (
    <div>
      <h1 className="font-arabic-display text-3xl text-eficto-green-dark">التقييمات</h1>
      <p className="mt-1 text-sm text-eficto-green-dark/60">آخر التقييمات اللي أرسلها العملاء</p>

      <div className="mt-6 space-y-3">
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
              {r.comment && <p className="mt-3 text-sm leading-7 text-eficto-green-dark/75">{r.comment}</p>}
              <p className="mt-3 text-xs text-eficto-green-dark/40">{formatArabicDate(r.review_date)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
