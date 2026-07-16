import type { Metadata } from "next";
import { PhotoBackground } from "@/components/PhotoBackground";
import { IMAGES } from "@/lib/assets";
import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "@/components/icons";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = { title: "تواصل معنا | افيكتو" };

export default function ContactPage() {
  return (
    <>
      <section className="relative flex h-[40vh] min-h-[280px] items-center justify-center overflow-hidden">
        <PhotoBackground src={IMAGES.interiorBooth} alt="أجواء افيكتو" className="absolute inset-0" dim />
        <div className="relative z-10 text-center">
          <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">افيكتو</p>
          <h1 className="mt-3 font-arabic-display text-4xl text-eficto-cream">تواصل معنا</h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-eficto-gold/30 bg-white/50 p-6 transition-colors hover:border-eficto-gold"
          >
            <PhoneIcon className="h-7 w-7 shrink-0 text-eficto-green" />
            <div>
              <p className="font-serif text-eficto-green-dark">واتساب</p>
              <p dir="ltr" className="text-sm text-eficto-green-dark/70">{SITE.phone}</p>
            </div>
          </a>

          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-eficto-gold/30 bg-white/50 p-6 transition-colors hover:border-eficto-gold"
          >
            <MapPinIcon className="h-7 w-7 shrink-0 text-eficto-green" />
            <div>
              <p className="font-serif text-eficto-green-dark">الموقع</p>
              <p className="text-sm text-eficto-green-dark/70">{SITE.city} — عرض على خرائط قوقل</p>
            </div>
          </a>

          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-2xl border border-eficto-gold/30 bg-white/50 p-6 transition-colors hover:border-eficto-gold"
          >
            <InstagramIcon className="h-7 w-7 shrink-0 text-eficto-green" />
            <div>
              <p className="font-serif text-eficto-green-dark">إنستقرام</p>
              <p className="text-sm text-eficto-green-dark/70">{SITE.instagramHandle}</p>
            </div>
          </a>

          <div className="flex items-center gap-4 rounded-2xl border border-eficto-gold/30 bg-white/50 p-6">
            <ClockIcon className="h-7 w-7 shrink-0 text-eficto-green" />
            <div>
              <p className="font-serif text-eficto-green-dark">ساعات العمل</p>
              <p className="text-sm text-eficto-green-dark/70">يومياً {SITE.hoursAr}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-eficto-gold/30">
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
