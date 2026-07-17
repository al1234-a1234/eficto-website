import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "@/components/icons";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "تواصل معنا | افيكتو" };

export default function ContactPage() {
  return (
    <>
      <section className="relative flex h-[50vh] min-h-[340px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-xs tracking-[0.3em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-5 font-arabic-display text-5xl text-eficto-cream sm:text-6xl">تواصل معنا</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-28 sm:px-8">
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-5 rounded-[32px] bg-forest px-8 py-9 shadow-elegant transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-soft active:translate-y-0 active:scale-[0.99]"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-eficto-gold/30">
            <PhoneIcon className="h-5 w-5 text-eficto-gold" />
          </span>
          <span>
            <span className="block font-serif text-xl text-eficto-cream">واتساب</span>
            <span dir="ltr" className="mt-1.5 block text-sm font-light text-eficto-cream/60">{SITE.phone}</span>
          </span>
        </a>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-[28px] bg-white/70 p-8 text-center shadow-premium transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-elegant active:translate-y-0 active:scale-[0.99]"
          >
            <MapPinIcon className="h-5 w-5 shrink-0 text-eficto-gold-dark" />
            <div>
              <p className="font-serif text-eficto-green-dark">الموقع</p>
              <p className="mt-1.5 text-sm font-light text-eficto-green-dark/65">{SITE.city}</p>
            </div>
          </a>

          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-[28px] bg-white/70 p-8 text-center shadow-premium transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-elegant active:translate-y-0 active:scale-[0.99]"
          >
            <InstagramIcon className="h-5 w-5 shrink-0 text-eficto-gold-dark" />
            <div>
              <p className="font-serif text-eficto-green-dark">إنستقرام</p>
              <p className="mt-1.5 text-sm font-light text-eficto-green-dark/65">{SITE.instagramHandle}</p>
            </div>
          </a>

          <div className="flex flex-col items-center gap-3 rounded-[28px] bg-white/70 p-8 text-center shadow-premium">
            <ClockIcon className="h-5 w-5 shrink-0 text-eficto-gold-dark" />
            <div>
              <p className="font-serif text-eficto-green-dark">ساعات العمل</p>
              <p className="mt-1.5 text-sm font-light text-eficto-green-dark/65">يومياً {SITE.hoursAr}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-[32px] shadow-premium">
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
