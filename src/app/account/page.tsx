import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { AccountView } from "@/components/AccountView";

export const metadata: Metadata = { title: "حسابي | افيكتو" };

export default function AccountPage() {
  return (
    <>
      <section className="relative flex h-[32vh] min-h-[220px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-3 font-arabic-display text-4xl text-eficto-cream">حسابي</h1>
        </div>
      </section>

      <section className="mx-auto max-w-lg px-5 py-16 sm:px-8">
        <AccountView />
      </section>
    </>
  );
}
