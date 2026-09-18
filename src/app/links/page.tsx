import type { Metadata } from "next";
import Image from "next/image";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "روابط افيكتو | eficto",
  description: "كل روابط ومنصات مطعم افيكتو في مكان واحد.",
};

const RESERVATION_WHATSAPP = "https://wa.me/message/BKXM5LN3IKKIN1";
const REQUEUE_URL =
  "https://requeue.net?id=1VyKq2At78zrAncDGwMGHYIiuCMpbWIPQ6EVClIlmu0%3D&linkType=restaurant";
const MENU_URL =
  "https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MDM5OTgxNzc4NzA5MTAy?story_media_id=3311920712379424343&stkn=MTk0dWlycHUyYW81Mw==";
const LOCATION_URL = "https://maps.app.goo.gl/XG99zpnxE1FeCHWA7?g_st=ic";

const LINKS: { href: string; labelEn?: string; labelAr: string }[] = [
  { href: RESERVATION_WHATSAPP, labelEn: "FOR RESERVATION", labelAr: "للحجز" },
  { href: LOCATION_URL, labelEn: "LOCATION", labelAr: "الموقع" },
  { href: MENU_URL, labelEn: "MENU", labelAr: "القائمة" },
  { href: REQUEUE_URL, labelEn: "REQUEUE", labelAr: "ريكيو" },
  { href: SITE.instagram, labelEn: "INSTAGRAM", labelAr: "انستقرام" },
  { href: RESERVATION_WHATSAPP, labelAr: "اقتراحاتكم | ملاحظاتكم" },
  { href: RESERVATION_WHATSAPP, labelAr: "طلبات الإمتياز التجاري" },
];

export default function LinksPage() {
  return (
    <div className="relative min-h-screen">
      <Image
        src="/images/interior-arch.jpg"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-eficto-green-deep/80 via-eficto-green-deep/70 to-eficto-green-deep/90" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 py-14">
        <div className="relative h-28 w-28 overflow-hidden rounded-full shadow-elegant ring-2 ring-eficto-gold/50">
          <Image src="/logo/badge-circle.png" alt="افيكتو" fill className="object-cover" priority />
        </div>

        <h1 className="mt-5 font-arabic-display text-2xl font-semibold text-eficto-ivory">
          {SITE.nameAr}
        </h1>
        <p dir="ltr" className="mt-1 text-sm tracking-wide text-eficto-cream/70">
          {SITE.nameEn}
        </p>

        <nav className="mt-10 flex w-full flex-col gap-5" aria-label="روابط افيكتو">
          {LINKS.map(({ href, labelEn, labelAr }, i) => (
            <a
              key={`${href}-${i}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full border-2 border-eficto-cream bg-eficto-green-deep/40 px-6 py-4 text-center font-arabic-display text-[15px] font-bold text-eficto-cream shadow-premium backdrop-blur-sm transition-colors duration-300 ease-soft hover:bg-eficto-cream hover:text-eficto-green-dark"
            >
              {labelEn ? (
                <span>
                  <span dir="ltr">{labelEn}</span> | {labelAr}
                </span>
              ) : (
                <span>{labelAr}</span>
              )}
            </a>
          ))}
        </nav>

        <div className="mt-12 flex w-full items-center gap-4">
          <span className="h-px flex-1 bg-eficto-cream/30" />
          <Image src="/logo/icon-white.png" alt="" width={22} height={22} className="opacity-80" />
          <span className="h-px flex-1 bg-eficto-cream/30" />
        </div>

        <p className="mt-10 text-xs text-eficto-cream/50">افيكتو © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
