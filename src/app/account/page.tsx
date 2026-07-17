import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { AccountView } from "@/components/AccountView";

export const metadata: Metadata = { title: "حسابي | افيكتو" };

export default function AccountPage() {
  return (
    <>
      <section className="relative flex h-[42vh] min-h-[280px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-xs tracking-[0.3em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-5 font-arabic-display text-5xl font-normal text-eficto-cream">حسابي</h1>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-6 py-28 sm:px-8">
        <AccountView />
      </section>
    </>
  );
}
