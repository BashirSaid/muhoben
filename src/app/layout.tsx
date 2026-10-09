import type { Metadata, Viewport } from "next";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/tajawal/800.css";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SiteHeader, MobileNav } from "@/components/SiteNav";
import Link from "next/link";
import { BRAND, COPYRIGHT_YEAR } from "@/data/brand";

export const metadata: Metadata = {
  title: {
    default: BRAND.name,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "برنامج تدريبي تفاعلي لمدة 30 يومًا لطلاب الصف السادس لتنمية مهارات التفكير والاستدلال وحل المسائل استعدادًا لاختبارات برامج الموهوبين.",
  applicationName: BRAND.name,
  authors: [{ name: BRAND.owner }],
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1d6fd8",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-dvh font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow"
        >
          انتقل إلى المحتوى
        </a>
        <ProgressProvider>
          <SiteHeader />
          <main id="main" className="mx-auto w-full max-w-5xl px-4 pt-6 pb-28 sm:px-6 md:pb-12">
            {children}
          </main>
          <footer className="mt-6 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-5xl space-y-2 px-4 pt-6 pb-28 text-center text-xs leading-6 text-slate-500 sm:px-6 md:pb-8">
              <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-slate-600">
                <a href={`mailto:${BRAND.email}`} className="hover:text-blue-700 hover:underline">
                  ✉️ <bdi dir="ltr">{BRAND.email}</bdi>
                </a>
                <a href={`tel:${BRAND.phone}`} className="hover:text-blue-700 hover:underline">
                  📞 <bdi dir="ltr">{BRAND.phoneDisplay}</bdi>
                </a>
              </p>
              <p>
                جميع الدروس والأسئلة من إعداد المنصة لأغراض التدريب، وليست أسئلة رسمية ولا صادرة عن وزارة التربية والتعليم.
                يُحفظ التقدّم على هذا الجهاز فقط.{" "}
                <Link href="/about/" className="underline hover:text-slate-700">
                  عن المنصة والخصوصية
                </Link>
              </p>
              <p className="font-bold text-slate-600">
                © <bdi>{COPYRIGHT_YEAR}</bdi> جميع الحقوق محفوظة ل{BRAND.owner}
              </p>
            </div>
          </footer>
          <MobileNav />
        </ProgressProvider>
      </body>
    </html>
  );
}
