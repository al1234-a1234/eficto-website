import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "@/components/icons";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "تواصل معنا | افيكتو" };

export default function ContactPage() {
  return (
    <>
      <section className="relative flex h-[46vh] min-h-[320px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.25em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-4 font-arabic-display text-5xl text-eficto-cream sm:text-6xl">تواصل معنا</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-24 sm:px-8">
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 rounded-[28px] bg-eficto-green px-7 py-7 shadow-elegant transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-premium active:scale-[0.99]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-eficto-cream/10">
            <PhoneIcon className="h-6 w-6 text-eficto-gold" />
          </span>
          <span>
            <span className="block font-serif text-lg text-eficto-cream">واتساب</span>
            <span dir="ltr" className="mt-1 block text-sm text-eficto-cream/70">{SITE.phone}</span>
          </span>
        </a>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/25 bg-white/60 p-7 text-center shadow-premium transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-eficto-gold active:scale-[0.99]"
          >
            <MapPinIcon className="h-6 w-6 shrink-0 text-eficto-green" />
            <div>
              <p className="font-serif text-eficto-green-dark">الموقع</p>
              <p className="mt-1 text-sm text-eficto-green-dark/70">{SITE.city}</p>
            </div>
          </a>

          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/25 bg-white/60 p-7 text-center shadow-premium transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-eficto-gold active:scale-[0.99]"
          >
            <InstagramIcon className="h-6 w-6 shrink-0 text-eficto-green" />
            <div>
              <p className="font-serif text-eficto-green-dark">إنستقرام</p>
              <p className="mt-1 text-sm text-eficto-green-dark/70">{SITE.instagramHandle}</p>
            </div>
          </a>

          <div className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/25 bg-white/60 p-7 text-center shadow-premium">
            <ClockIcon className="h-6 w-6 shrink-0 text-eficto-green" />
            <div>
              <p className="font-serif text-eficto-green-dark">ساعات العمل</p>
              <p className="mt-1 text-sm text-eficto-green-dark/70">يومياً {SITE.hoursAr}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[28px] border border-eficto-gold/25 shadow-premium">
          <iframe
            title="موقع افيكتو على الخريطة"
            src="https://maps.google.com/maps?q=Buraidah,Saudi%20Arabia&z=13&output=embed"
            className="h-80 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
