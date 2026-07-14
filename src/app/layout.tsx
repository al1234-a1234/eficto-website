import type { Metadata } from "next";
import { Playfair_Display, Noto_Naskh_Arabic, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const notoNaskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic-display",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-arabic-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "إفيكتو | eficto — مطعم إيطالي في بريدة",
  description:
    "إفيكتو، مطعم إيطالي في بريدة يجمع بين الأقواس الخشبية والجلد الأخضر الغامق والإضاءة الدافئة. احجز طاولتك أو انضم لقائمة الانتظار اللحظية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${playfair.variable} ${notoNaskh.variable} ${plexArabic.variable}`}>
      <body className="font-arabic-body bg-eficto-ivory text-eficto-green-dark antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
