import type { Metadata } from "next";
import { Fraunces, Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";
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

// Clean, modern Arabic — reads as a real product, not a decorative invitation.
const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["500", "600", "700"],
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
  title: "افيكتو | eficto — مطعم إيطالي في بريدة",
  description:
    "افيكتو، مطعم إيطالي في بريدة يجمع بين الأقواس الخشبية والجلد الأخضر الغامق والإضاءة الدافئة. احجز طاولتك أو انضم لقائمة الانتظار اللحظية.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${fraunces.variable} ${cairo.variable} ${plexArabic.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                function show(title, detail) {
                  try {
                    var box = document.createElement('div');
                    box.setAttribute('data-debug-overlay', '1');
                    box.style.cssText = 'position:fixed;inset:0;z-index:999999;background:#fff;color:#111;font-family:monospace;font-size:12px;padding:16px;overflow:auto;direction:ltr;text-align:left;white-space:pre-wrap;';
                    box.textContent = title + '\\n\\n' + detail + '\\n\\nUA: ' + navigator.userAgent;
                    document.body ? document.body.appendChild(box) : document.addEventListener('DOMContentLoaded', function(){ document.body.appendChild(box); });
                  } catch (e) {}
                }
                window.addEventListener('error', function (e) {
                  show('DEBUG window.onerror', (e && e.error && e.error.stack) || e.message || String(e));
                });
                window.addEventListener('unhandledrejection', function (e) {
                  var r = e && e.reason;
                  show('DEBUG unhandledrejection', (r && r.stack) || (r && r.message) || String(r));
                });
              })();
            `,
          }}
        />
      </head>
      <body className="font-arabic-body bg-eficto-ivory text-eficto-green-dark antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
