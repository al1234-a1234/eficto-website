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
        <LogoMark className="h-16" />

        <h1 className="sr-only">افيكتو eficto</h1>

        <div className="mt-10 flex flex-col items-center">
          <Image
            src={LOGO.wordmarkEnWhite.src}
            width={LOGO.wordmarkEnWhite.width}
            height={LOGO.wordmarkEnWhite.height}
            alt="EFICTO"
            className="h-10 w-auto sm:h-12"
            unoptimized
          />
          <div className="mt-4 h-px w-full bg-gradient-to-r from-transparent via-eficto-gold to-transparent" />
        </div>
        <Image
          src={LOGO.wordmarkArWhite.src}
          width={LOGO.wordmarkArWhite.width}
          height={LOGO.wordmarkArWhite.height}
          alt="افيكتو"
          className="mt-4 h-16 w-auto sm:h-20"
          unoptimized
        />

        <p className="mt-8 max-w-xl text-balance text-base leading-8 tracking-wide text-eficto-cream/80 sm:text-lg">
          تجربة طهي فاخرة تُعيد تقديم المذاق الإيطالي الأصيل، حيث تُحضّر أطباقنا الكلاسيكية بشغف
          وعلى أصولها العريقة.
        </p>

        <div className="mt-12">
          <LiveStatusBadge />
        </div>

        <div className="mt-8 flex flex-row items-center gap-3 sm:gap-4">
          <Link
            href="/waitlist?location=indoor"
            className="rounded-full bg-eficto-gold px-6 py-3.5 text-sm font-medium text-eficto-green-dark shadow-premium transition-all duration-300 ease-soft hover:scale-[1.03] hover:shadow-elegant active:scale-[0.97] sm:px-9"
          >
            طاولة داخلية
          </Link>
          <Link
            href="/waitlist?location=outdoor"
            className="rounded-full border border-eficto-cream/40 bg-eficto-cream/[0.04] px-6 py-3.5 text-sm text-eficto-cream backdrop-blur-sm transition-all duration-300 ease-soft hover:border-eficto-gold hover:text-eficto-gold active:scale-[0.97] sm:px-9"
          >
            طاولة خارجية
          </Link>
        </div>
      </div>
    </section>
  );
}
