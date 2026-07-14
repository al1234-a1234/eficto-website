import Link from "next/link";
import { getReviews, averageRating } from "@/lib/data";
import { StarRating } from "./StarRating";

export async function ReviewsPreview() {
  const reviews = await getReviews(3);
  const avg = averageRating(reviews);

  if (reviews.length === 0) return null;

  return (
    <section className="section-fade mx-auto max-w-6xl px-5 py-24 sm:px-8">
      <div className="text-center">
        <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">آراء عملائنا</p>
        <h2 className="mt-3 font-arabic-display text-3xl text-eficto-green-dark sm:text-4xl">
          ماذا يقول ضيوفنا
        </h2>
        {avg && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <StarRating rating={avg} />
            <span className="text-sm text-eficto-green-dark/70">{avg.toFixed(1)} من ٥</span>
          </div>
        )}
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-2xl border border-eficto-gold/25 bg-white/60 p-6 shadow-soft">
            {typeof r.rating === "number" && <StarRating rating={r.rating} />}
            <p className="mt-4 leading-7 text-eficto-green-dark/80">{r.comment}</p>
            <p className="mt-4 font-serif text-sm text-eficto-green">{r.customer_name}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/reviews"
          className="rounded-full border border-eficto-green px-8 py-3 text-sm text-eficto-green transition-colors duration-300 ease-soft hover:bg-eficto-green hover:text-eficto-cream"
        >
          كل التقييمات
        </Link>
      </div>
    </section>
  );
}
