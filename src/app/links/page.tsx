import type { Metadata } from "next";
import Image from "next/image";
import { SITE } from "@/lib/constants";
import {
  BookIcon,
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
  UsersIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "روابط افيكتو | eficto",
  description: "كل روابط ومنصات مطعم افيكتو في مكان واحد.",
};

const LINKS: {
  href: string;
  label: string;
  sublabel: string;
  icon: (props: { className?: string }) => React.ReactNode;
  external?: boolean;
  ltr?: boolean;
}[] = [
  {
    href: "/",
    label: "الموقع الرئيسي",
    sublabel: "eficto.sa",
    icon: MapPinIcon,
    ltr: true,
  },
  {
    href: "/waitlist",
    label: "انضم لقائمة الانتظار",
    sublabel: "احجز مكانك الآن",
    icon: UsersIcon,
  },
  {
    href: "/menu",
    label: "قائمة الطعام",
    sublabel: "تصفّح الأطباق",
    icon: BookIcon,
  },
  {
    href: SITE.whatsapp,
    label: "تواصل عبر واتساب",
    sublabel: SITE.phoneDisplay,
    icon: PhoneIcon,
    external: true,
    ltr: true,
  },
  {
    href: SITE.instagram,
    label: "تابعنا على انستقرام",
    sublabel: SITE.instagramHandle,
    icon: InstagramIcon,
    external: true,
    ltr: true,
  },
  {
    href: SITE.mapsUrl,
    label: "موقعنا على الخريطة",
    sublabel: SITE.city,
    icon: MapPinIcon,
    external: true,
  },
  {
    href: "/reviews",
    label: "شاركنا تقييمك",
    sublabel: "رأيك يهمنا",
    icon: StarIcon,
  },
];

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-eficto-green-deep bg-arch">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center px-6 py-14">
        <div className="relative h-20 w-20 overflow-hidden rounded-full shadow-elegant ring-1 ring-eficto-gold/40">
          <Image src="/logo/icon-white.png" alt="افيكتو" fill className="object-cover" priority />
        </div>

        <h1 className="mt-5 font-arabic-display text-2xl font-semibold text-eficto-ivory">
          {SITE.nameAr}
        </h1>
        <p className="mt-1 text-sm text-eficto-cream/70">مطعم إيطالي في {SITE.city}</p>

        <nav className="mt-10 flex w-full flex-col gap-3.5" aria-label="روابط افيكتو">
          {LINKS.map(({ href, label, sublabel, icon: Icon, external, ltr }) => (
            <a
              key={href}
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="group flex items-center gap-4 rounded-2xl border border-eficto-gold/25 bg-eficto-green-dark/60 px-5 py-4 shadow-premium backdrop-blur transition-all duration-300 ease-soft hover:-translate-y-0.5 hover:border-eficto-gold/60 hover:bg-eficto-green-dark"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-eficto-gold/15 text-eficto-gold transition-colors group-hover:bg-eficto-gold/25">
                <Icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="font-arabic-display text-[15px] font-medium text-eficto-ivory">{label}</span>
                <span dir={ltr ? "ltr" : undefined} className="text-xs text-eficto-cream/60">
                  {sublabel}
                </span>
              </span>
            </a>
          ))}
        </nav>

        <p className="mt-12 text-xs text-eficto-cream/40">افيكتو © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
