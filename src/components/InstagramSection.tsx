import { InstagramIcon } from "./icons";
import { SITE } from "@/lib/constants";

export function InstagramSection() {
  return (
    <section className="section-fade bg-eficto-green-dark py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-eficto-gold/40 shadow-premium">
          <InstagramIcon className="h-7 w-7 text-eficto-gold" />
        </div>
        <p className="mt-7 font-arabic-body text-sm tracking-[0.25em] text-eficto-gold">تابعونا</p>
        <h2 className="mt-4 font-arabic-display text-4xl text-eficto-cream sm:text-5xl">
          كل جديد عن افيكتو على انستقرام
        </h2>
        <p className="mt-5 max-w-md leading-8 text-eficto-cream/70">
          صور الأطباق والأجواء والعروض أول بأول — تابعونا على {SITE.instagramHandle}
        </p>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-flex items-center gap-2.5 rounded-full bg-eficto-gold px-9 py-4 text-sm font-medium text-eficto-green-dark shadow-premium transition-all duration-300 ease-soft hover:scale-[1.03] hover:shadow-elegant active:scale-[0.97]"
        >
          <InstagramIcon className="h-5 w-5" />
          تابعنا على انستقرام
        </a>
      </div>
    </section>
  );
}
