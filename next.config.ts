import type { NextConfig } from "next";

// تصدير ثابت (Static Export): ينتج مجلد out/ يمكن نشره على Netlify دون خادم.
// عند إضافة حسابات وقاعدة بيانات لاحقًا يمكن إزالة output: "export"
// والاعتماد على محوّل Netlify الخاص بـ Next.js.
// مسار فرعي اختياري، مثل "/muhoben" عند النشر على GitHub Pages
// (https://<user>.github.io/<repo>/). يبقى فارغًا في Netlify والتشغيل المحلي.
const basePath = process.env.BASE_PATH?.replace(/\/$/, "") || undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  // عدم إنشاء ملف AGENTS.md تلقائيًا عند تشغيل خادم التطوير
  agentRules: false,
};

export default nextConfig;
