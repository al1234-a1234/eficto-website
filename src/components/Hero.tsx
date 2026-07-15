import Image from "next/image";
import Link from "next/link";
import { PhotoBackground } from "./PhotoBackground";
import { LogoMark } from "./Logo";
import { LiveStatusBadge } from "./LiveStatusBadge";
import { IMAGES, LOGO } from "@/lib/assets";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden">
      <PhotoBackground
        src={IMAGES.interiorArch}
        alt="أجواء افيكتو الداخلية"
        className="absolute inset-0"
        dim
        priority
      />

      <div className="section-fade relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 text-center">
        <LogoMark className="h-16" />

        <h1 className="sr-only">افيكتو | eficto</h1>

        <Image
          src={LOGO.wordmarkEnWhite.src}
          width={LOGO.wordmarkEnWhite.width}
          height={LOGO.wordmarkEnWhite.height}
          alt="EFICTO"
          className="mt-8 h-7 w-auto sm:h-8"
          unoptimized
        />
        <Image
          src={LOGO.wordmarkArWhite.src}
          width={LOGO.wordmarkArWhite.width}
          height={LOGO.wordmarkArWhite.height}
          alt="افيكتو"
          className="mt-3 h-14 w-auto sm:h-16"
          unoptimized
        />

        <p className="mt-6 max-w-xl text-balance text-base leading-8 text-eficto-cream/80 sm:text-lg">
          مطعم إيطالي في قلب بريدة، حيث تلتقي الأقواس الخشبية بالجلد الأخضر الغامق والإضاءة
          الدافئة — تجربة طعام أصيلة بأجواء هادئة وفاخرة.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/waitlist?location=indoor"
            className="rounded-full bg-eficto-gold px-8 py-3 text-sm font-medium text-eficto-green-dark transition-transform duration-300 ease-soft hover:scale-[1.03]"
          >
            طاولة داخلية
          </Link>
          <Link
            href="/waitlist?location=outdoor"
            className="rounded-full border border-eficto-cream/40 px-8 py-3 text-sm text-eficto-cream transition-colors duration-300 ease-soft hover:border-eficto-gold hover:text-eficto-gold"
          >
            طاولة خارجية
          </Link>
        </div>

        <div className="mt-8">
          <LiveStatusBadge />
        </div>
      </div>
    </section>
  );
}
