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
    <div className="min-h-screen bg-eficto-cream">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 py-14">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-eficto-green shadow-elegant ring-1 ring-eficto-gold/40">
          <Image src="/logo/icon-white.png" alt="افيكتو" fill className="object-contain p-3" priority />
        </div>

        <h1 className="mt-5 font-arabic-display text-2xl font-semibold text-eficto-green-dark">
          {SITE.nameAr}
        </h1>
        <p dir="ltr" className="mt-1 text-sm tracking-wide text-eficto-green-dark/60">
          {SITE.nameEn}
        </p>

        <nav className="mt-10 flex w-full flex-col gap-5" aria-label="روابط افيكتو">
          {LINKS.map(({ href, labelEn, labelAr }, i) => (
            <a
              key={`${href}-${i}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full border-2 border-eficto-green px-6 py-4 text-center font-arabic-display text-[15px] font-bold text-eficto-green transition-colors duration-300 ease-soft hover:bg-eficto-green hover:text-eficto-cream"
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
          <span className="h-px flex-1 bg-eficto-green/30" />
          <Image src="/logo/icon-green.png" alt="" width={22} height={22} className="opacity-70" />
          <span className="h-px flex-1 bg-eficto-green/30" />
        </div>

        <p className="mt-10 text-xs text-eficto-green-dark/40">افيكتو © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
