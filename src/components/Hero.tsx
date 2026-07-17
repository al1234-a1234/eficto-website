import Image from "next/image";
import Link from "next/link";
import { PhotoBackground } from "./PhotoBackground";
import { LogoMark } from "./Logo";
import { LiveStatusBadge } from "./LiveStatusBadge";
import { IMAGES, LOGO } from "@/lib/assets";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <PhotoBackground
        src={IMAGES.interiorArch}
        alt="أجواء افيكتو الداخلية"
        className="absolute inset-0"
        dim
        priority
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_40%,transparent_0%,rgba(16,43,23,0.35)_100%)]"
        aria-hidden="true"
      />

      <div className="section-fade relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <LogoMark className="h-14" />

        <h1 className="sr-only">افيكتو eficto</h1>

        <div className="mt-8 flex flex-col items-center">
          <Image
            src={LOGO.wordmarkEnWhite.src}
            width={LOGO.wordmarkEnWhite.width}
            height={LOGO.wordmarkEnWhite.height}
            alt="EFICTO"
            className="h-9 w-auto sm:h-11"
            unoptimized
          />
          <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-eficto-gold/70 to-transparent" />
        </div>
        <Image
          src={LOGO.wordmarkArWhite.src}
          width={LOGO.wordmarkArWhite.width}
          height={LOGO.wordmarkArWhite.height}
          alt="افيكتو"
          className="mt-5 h-16 w-auto sm:h-20"
          unoptimized
        />

        <p className="mt-16 max-w-md text-balance text-base font-light leading-9 text-eficto-cream/75 sm:text-lg">
          تجربة طهي فاخرة تُعيد تقديم المذاق الإيطالي الأصيل، حيث تُحضّر أطباقنا الكلاسيكية بشغف
          وعلى أصولها العريقة.
        </p>

        <div className="mt-14">
          <LiveStatusBadge />
        </div>

        <div className="mt-10 flex flex-row items-center gap-4">
          <Link
            href="/waitlist?location=indoor"
            className="rounded-2xl bg-eficto-gold px-7 py-4 text-sm text-eficto-green-dark shadow-premium transition-all duration-500 ease-soft hover:-translate-y-0.5 hover:shadow-elegant active:translate-y-0 active:scale-[0.98] sm:px-10"
          >
            طاولة داخلية
          </Link>
          <Link
            href="/waitlist?location=outdoor"
            className="rounded-2xl border border-eficto-cream/25 px-7 py-4 text-sm text-eficto-cream/90 transition-all duration-500 ease-soft hover:border-eficto-gold/60 hover:text-eficto-gold active:scale-[0.98] sm:px-10"
          >
            طاولة خارجية
          </Link>
        </div>
      </div>
    </section>
  );
}
