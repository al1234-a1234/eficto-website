import type { Metadata } from "next";
import { Fraunces, Aref_Ruqaa, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

// Soft, ball-terminal serif — the closest free match to the real "eficto" wordmark.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  variable: "--font-serif",
  display: "swap",
});

const arefRuqaa = Aref_Ruqaa({
  subsets: ["arabic"],
  weight: ["400", "700"],
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
    <html lang="ar" dir="rtl" className={`${fraunces.variable} ${arefRuqaa.variable} ${plexArabic.variable}`}>
      <body className="font-arabic-body bg-eficto-ivory text-eficto-green-dark antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
