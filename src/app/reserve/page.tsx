import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { ReservationForm } from "@/components/ReservationForm";

export const metadata: Metadata = { title: "الحجز | افيكتو" };

export default function ReservePage() {
  return (
    <>
      <section className="relative flex h-[36vh] min-h-[240px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-3 font-arabic-display text-4xl text-eficto-cream">احجز طاولتك</h1>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <ReservationForm />
      </section>
    </>
  );
}
