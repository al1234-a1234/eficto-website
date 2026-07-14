import Link from "next/link";
import { PhotoBackground } from "./PhotoBackground";
import { LogoMark } from "./Logo";
import { LiveStatusBadge } from "./LiveStatusBadge";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      <PhotoBackground
        src="/images/interior-arch.jpg"
        alt="أجواء إفيكتو الداخلية"
        className="absolute inset-0"
        dim
        priority
      />

      <div className="section-fade relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <LogoMark className="h-16" />

        <h1 className="mt-8 font-arabic-display text-4xl leading-[1.4] text-eficto-cream sm:text-5xl">
          إفيكتو
        </h1>
        <p className="mt-2 font-serif text-lg tracking-[0.35em] text-eficto-gold sm:text-xl">
          EFICTO
        </p>

        <p className="mt-6 max-w-xl text-balance text-base leading-8 text-eficto-cream/80 sm:text-lg">
          مطعم إيطالي في قلب بريدة، حيث تلتقي الأقواس الخشبية بالجلد الأخضر الغامق والإضاءة
          الدافئة — تجربة طعام أصيلة بأجواء هادئة وفاخرة.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/reserve"
            className="rounded-full bg-eficto-gold px-8 py-3 text-sm font-medium text-eficto-green-dark transition-transform duration-300 ease-soft hover:scale-[1.03]"
          >
            احجز الآن
          </Link>
          <Link
            href="/waitlist"
            className="rounded-full border border-eficto-cream/40 px-8 py-3 text-sm text-eficto-cream transition-colors duration-300 ease-soft hover:border-eficto-gold hover:text-eficto-gold"
          >
            انضم لقائمة الانتظار
          </Link>
        </div>

        <div className="mt-8">
          <LiveStatusBadge />
        </div>
      </div>
    </section>
  );
}
