import { InstagramIcon } from "./icons";
import { SITE } from "@/lib/constants";

export function InstagramSection() {
  return (
    <section className="section-fade relative overflow-hidden bg-forest py-36">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(215,183,144,0.08)_0%,transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-xl flex-col items-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-eficto-gold/30">
          <InstagramIcon className="h-6 w-6 text-eficto-gold" />
        </div>
        <p className="mt-8 font-arabic-body text-xs tracking-[0.3em] text-eficto-gold/90">تابعونا</p>
        <h2 className="mt-5 font-arabic-display text-4xl leading-[1.4] text-eficto-cream sm:text-5xl">
          كل جديد عن افيكتو
          <br />
          على انستقرام
        </h2>
        <div className="divider-hairline mt-8 w-16" />
        <p className="mt-8 max-w-sm text-balance font-light leading-8 text-eficto-cream/60">
          صور الأطباق والأجواء والعروض أول بأول — تابعونا على {SITE.instagramHandle}
        </p>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-12 inline-flex items-center gap-3 rounded-2xl border border-eficto-gold/50 px-10 py-4 text-sm text-eficto-gold transition-all duration-500 ease-soft hover:bg-eficto-gold hover:text-eficto-green-dark active:scale-[0.98]"
        >
          <InstagramIcon className="h-[18px] w-[18px]" />
          تابعنا على انستقرام
        </a>
      </div>
    </section>
  );
}
