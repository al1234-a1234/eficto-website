import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { StarRating } from "@/components/StarRating";
import { getReviews, averageRating } from "@/lib/data";
import { formatArabicDate } from "@/lib/format";

export const metadata: Metadata = { title: "التقييمات | إفيكتو" };

export default async function ReviewsPage() {
  const reviews = await getReviews(100);
  const avg = averageRating(reviews);

  return (
    <>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء إفيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">إفيكتو</p>
          <h1 className="mt-3 font-arabic-display text-4xl text-eficto-cream">آراء ضيوفنا</h1>
          {avg && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <StarRating rating={avg} />
              <span className="text-sm text-eficto-cream/80">{avg.toFixed(1)} من ٥ · {reviews.length} تقييم</span>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        {reviews.length === 0 ? (
          <p className="text-center text-eficto-green-dark/60">لا توجد تقييمات بعد.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl border border-eficto-gold/25 bg-white/60 p-6 shadow-soft">
                {typeof r.rating === "number" && <StarRating rating={r.rating} />}
                <p className="mt-4 leading-7 text-eficto-green-dark/80">{r.comment}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-serif text-sm text-eficto-green">{r.customer_name}</p>
                  {r.review_date && (
                    <p className="text-xs text-eficto-green-dark/50">{formatArabicDate(r.review_date)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
