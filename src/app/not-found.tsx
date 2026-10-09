import { LinkButton } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-5xl" aria-hidden="true">
        🧭
      </p>
      <h1 className="mt-4 text-2xl font-extrabold">الصفحة غير موجودة</h1>
      <p className="mt-2 text-slate-600">ربما تغيّر الرابط. لنعد إلى لوحتك ونتابع التدريب.</p>
      <LinkButton href="/" className="mt-6">
        العودة إلى لوحتي
      </LinkButton>
    </div>
  );
}
