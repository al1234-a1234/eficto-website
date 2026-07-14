import { InstagramIcon, MapPinIcon, PhoneIcon, ClockIcon } from "./icons";
import { SITE } from "@/lib/constants";

export function ContactTeaser() {
  return (
    <section className="section-fade bg-eficto-cream py-24">
      <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
        <p className="font-arabic-body text-sm tracking-[0.2em] text-eficto-gold-deep">تواصل معنا</p>
        <h2 className="mt-3 font-arabic-display text-3xl text-eficto-green-dark sm:text-4xl">
          نسعد باستقبالكم
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <a
            href={`tel:${SITE.phone}`}
            className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/30 bg-white/50 p-6 transition-colors hover:border-eficto-gold"
          >
            <PhoneIcon className="h-6 w-6 text-eficto-green" />
            <span dir="ltr" className="text-sm text-eficto-green-dark/80">
              {SITE.phone}
            </span>
          </a>
          <a
            href={SITE.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/30 bg-white/50 p-6 transition-colors hover:border-eficto-gold"
          >
            <MapPinIcon className="h-6 w-6 text-eficto-green" />
            <span className="text-sm text-eficto-green-dark/80">{SITE.city}</span>
          </a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-3 rounded-2xl border border-eficto-gold/30 bg-white/50 p-6 transition-colors hover:border-eficto-gold"
          >
            <InstagramIcon className="h-6 w-6 text-eficto-green" />
            <span className="text-sm text-eficto-green-dark/80">{SITE.instagramHandle}</span>
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-eficto-green-dark/70">
          <ClockIcon className="h-4 w-4 text-eficto-gold-deep" />
          <span>يومياً {SITE.hoursAr}</span>
        </div>
      </div>
    </section>
  );
}
