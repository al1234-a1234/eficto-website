import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "./icons";
import { SITE } from "@/lib/constants";

export function ContactTeaser() {
  return (
    <section className="section-fade bg-eficto-cream py-28">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <p className="font-arabic-body text-sm tracking-[0.25em] text-eficto-gold-deep">تواصل معنا</p>
        <h2 className="mt-4 font-arabic-display text-4xl text-eficto-green-dark sm:text-5xl">
          نسعد باستقبالكم
        </h2>

        <div className="mt-12 space-y-4">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-4 rounded-[28px] bg-eficto-green px-7 py-7 shadow-elegant transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:shadow-premium active:scale-[0.99] sm:justify-between"
          >
            <span className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-eficto-cream/10">
                <PhoneIcon className="h-5 w-5 text-eficto-gold" />
              </span>
              <span className="text-right">
                <span className="block text-sm text-eficto-cream/65">راسلنا على واتساب</span>
                <span dir="ltr" className="mt-1 block font-serif text-lg text-eficto-cream">
                  {SITE.phone}
                </span>
              </span>
            </span>
          </a>

          <div className="grid gap-4 sm:grid-cols-2">
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/25 bg-white/60 p-7 shadow-premium transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-eficto-gold active:scale-[0.99]"
            >
              <MapPinIcon className="h-6 w-6 text-eficto-green" />
              <span className="text-sm text-eficto-green-dark/80">{SITE.city}</span>
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/25 bg-white/60 p-7 shadow-premium transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-eficto-gold active:scale-[0.99]"
            >
              <InstagramIcon className="h-6 w-6 text-eficto-green" />
              <span className="text-sm text-eficto-green-dark/80">{SITE.instagramHandle}</span>
            </a>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-eficto-green-dark/70">
          <ClockIcon className="h-4 w-4 text-eficto-gold-deep" />
          <span>يومياً {SITE.hoursAr}</span>
        </div>
      </div>
    </section>
  );
}
