"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND, asset } from "@/data/brand";

const NAV = [
  { href: "/", label: "لوحتي", icon: "🏠" },
  { href: "/plan/", label: "الخطة", icon: "📅" },
  { href: "/practice/", label: "تدريب", icon: "🎯" },
  { href: "/exam/", label: "اختبارات", icon: "⏱️" },
  { href: "/results/", label: "التقارير", icon: "📊" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/plan/") return pathname.startsWith("/plan") || pathname.startsWith("/day");
  return pathname.startsWith(href.replace(/\/$/, ""));
}

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-extrabold text-blue-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={asset(BRAND.logo)} alt="" width={40} height={40} className="h-10 w-10 rounded-lg" />
          <span className="text-lg">{BRAND.name}</span>
        </Link>
        <nav aria-label="التنقل الرئيسي" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                      active ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}

/** شريط تنقل سفلي للهواتف والأجهزة الصغيرة */
export function MobileNav() {
  const pathname = usePathname() ?? "/";
  return (
    <nav
      aria-label="التنقل السفلي"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center gap-0.5 py-2 text-xs font-bold ${
                  active ? "text-blue-700" : "text-slate-500"
                }`}
              >
                <span className="text-xl" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
