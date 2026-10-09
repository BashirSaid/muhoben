import type { NextConfig } from "next";

// تصدير ثابت (Static Export): ينتج مجلد out/ يمكن نشره على Netlify دون خادم.
// عند إضافة حسابات وقاعدة بيانات لاحقًا يمكن إزالة output: "export"
// والاعتماد على محوّل Netlify الخاص بـ Next.js.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // عدم إنشاء ملف AGENTS.md تلقائيًا عند تشغيل خادم التطوير
  agentRules: false,
};

export default nextConfig;
