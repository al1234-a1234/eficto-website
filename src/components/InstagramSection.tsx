import { InstagramIcon } from "./icons";
import { SITE } from "@/lib/constants";

export function InstagramSection() {
  return (
    <section className="section-fade bg-eficto-green-dark py-24">
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-eficto-gold/40">
          <InstagramIcon className="h-7 w-7 text-eficto-gold" />
        </div>
        <p className="mt-6 font-arabic-body text-sm tracking-[0.2em] text-eficto-gold">تابعونا</p>
        <h2 className="mt-3 font-arabic-display text-3xl text-eficto-cream sm:text-4xl">
          كل جديد عن افيكتو على انستقرام
        </h2>
        <p className="mt-4 max-w-md leading-8 text-eficto-cream/70">
          صور الأطباق والأجواء والعروض أول بأول — تابعونا على {SITE.instagramHandle}
        </p>
        <a
          href={SITE.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-eficto-gold px-8 py-3 text-sm font-medium text-eficto-green-dark transition-transform duration-300 ease-soft hover:scale-[1.03]"
        >
          <InstagramIcon className="h-5 w-5" />
          تابعنا على انستقرام
        </a>
      </div>
    </section>
  );
}
