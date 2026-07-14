import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { WaitlistWidget } from "@/components/WaitlistWidget";

export const metadata: Metadata = { title: "قائمة الانتظار | إفيكتو" };

export default function WaitlistPage() {
  return (
    <>
      <section className="relative flex h-[36vh] min-h-[240px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء إفيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">إفيكتو</p>
          <h1 className="mt-3 font-arabic-display text-4xl text-eficto-cream">قائمة الانتظار</h1>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <WaitlistWidget />
      </section>
    </>
  );
}
