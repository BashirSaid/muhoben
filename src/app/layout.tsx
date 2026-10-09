import type { Metadata, Viewport } from "next";
import "@fontsource/tajawal/400.css";
import "@fontsource/tajawal/500.css";
import "@fontsource/tajawal/700.css";
import "@fontsource/tajawal/800.css";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SiteHeader, MobileNav } from "@/components/SiteNav";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    default: "منصة تدريب الموهوبين",
    template: "%s | منصة تدريب الموهوبين",
  },
  description:
    "برنامج تدريبي تفاعلي لمدة 30 يومًا لطلاب الصف السادس لتنمية مهارات التفكير والاستدلال وحل المسائل استعدادًا لاختبارات برامج الموهوبين.",
  applicationName: "منصة تدريب الموهوبين",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#4f46e5",
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
          <footer className="mx-auto max-w-5xl px-4 pb-28 text-center text-xs leading-6 text-slate-500 sm:px-6 md:pb-8">
            <p>
              جميع الدروس والأسئلة من إعداد المنصة لأغراض التدريب، وليست أسئلة رسمية ولا صادرة عن وزارة التربية والتعليم.
            </p>
            <p>
              يُحفظ التقدّم على هذا الجهاز فقط.{" "}
              <Link href="/about/" className="underline hover:text-slate-700">
                عن المنصة والخصوصية
              </Link>
            </p>
          </footer>
          <MobileNav />
        </ProgressProvider>
      </body>
    </html>
  );
}
