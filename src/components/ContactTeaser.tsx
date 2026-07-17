import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "./icons";
import { SITE } from "@/lib/constants";

export function ContactTeaser() {
  return (
    <section className="section-fade bg-champagne py-36">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <p className="font-arabic-body text-xs tracking-[0.3em] text-eficto-gold-deep">تواصل معنا</p>
        <h2 className="mt-5 font-arabic-display text-4xl leading-[1.4] text-eficto-green-dark sm:text-5xl">
          نسعد باستقبالكم
        </h2>

        <div className="mt-16 space-y-5">
          <a
            href={SITE.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-5 rounded-[32px] bg-forest px-8 py-9 shadow-elegant transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-soft active:translate-y-0 active:scale-[0.99] sm:justify-between"
          >
            <span className="flex items-center gap-5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-eficto-gold/30">
                <PhoneIcon className="h-5 w-5 text-eficto-gold" />
              </span>
              <span className="text-right">
                <span className="block text-xs tracking-[0.1em] text-eficto-cream/55">راسلنا على واتساب</span>
                <span dir="ltr" className="mt-2 block font-serif text-xl text-eficto-cream">
                  {SITE.phone}
                </span>
              </span>
            </span>
          </a>

          <div className="grid gap-5 sm:grid-cols-2">
            <a
              href={SITE.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 rounded-[28px] bg-white/70 p-9 shadow-premium transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-elegant active:translate-y-0 active:scale-[0.99]"
            >
              <MapPinIcon className="h-5 w-5 text-eficto-gold-dark" />
              <span className="text-sm font-light text-eficto-green-dark/75">{SITE.city}</span>
            </a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-4 rounded-[28px] bg-white/70 p-9 shadow-premium transition-all duration-500 ease-soft hover:-translate-y-1 hover:shadow-elegant active:translate-y-0 active:scale-[0.99]"
            >
              <InstagramIcon className="h-5 w-5 text-eficto-gold-dark" />
              <span className="text-sm font-light text-eficto-green-dark/75">{SITE.instagramHandle}</span>
            </a>
          </div>
        </div>

        <div className="divider-hairline mx-auto mt-14 w-16" />
        <div className="mt-6 flex items-center justify-center gap-2.5 text-sm font-light text-eficto-green-dark/60">
          <ClockIcon className="h-4 w-4 text-eficto-gold-deep" />
          <span>يومياً {SITE.hoursAr}</span>
        </div>
      </div>
    </section>
  );
}
