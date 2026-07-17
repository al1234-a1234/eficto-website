import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { ReviewForm } from "@/components/ReviewForm";

export const metadata: Metadata = { title: "شاركنا تقييمك | افيكتو" };

export default function ReviewsPage() {
  return (
    <>
      <section className="relative flex h-[42vh] min-h-[280px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.25em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-4 font-arabic-display text-5xl text-eficto-cream">شاركنا تقييمك</h1>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-5 py-20 sm:px-8">
        <ReviewForm />
      </section>
    </>
  );
}
