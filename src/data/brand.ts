/** هوية المنصة وبيانات التواصل — مكان واحد لتعديلها. */
export const BRAND = {
  name: "منصة تسنيم التعليمية",
  owner: "تسنيم للحاسوب",
  email: "tasnimsystems@gmail.com",
  /** بصيغة دولية لروابط الاتصال وواتساب */
  phone: "+972547297817",
  /** للعرض: رقم مقروء */
  phoneDisplay: "+972 54-729-7817",
  logo: "/logo.png",
} as const;

export const COPYRIGHT_YEAR = 2026;

/** يضيف المسار الفرعي (مثل /muhoben على GitHub Pages) إلى ملفات المجلد public. */
export function asset(path: string): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
