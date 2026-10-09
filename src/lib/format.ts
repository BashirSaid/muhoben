/**
 * تنسيق الأرقام والتواريخ بالعربية مع أرقام «عربية غربية» (0–9)،
 * وهي الأرقام المستخدمة عادة في المدارس العربية في البلاد.
 */
const numberFmt = new Intl.NumberFormat("ar", { numberingSystem: "latn" });
const dateFmt = new Intl.DateTimeFormat("ar", {
  numberingSystem: "latn",
  day: "numeric",
  month: "long",
  year: "numeric",
});
const dateTimeFmt = new Intl.DateTimeFormat("ar", {
  numberingSystem: "latn",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatNumber(n: number): string {
  return numberFmt.format(n);
}

export function formatPercent(n: number): string {
  return `${formatNumber(n)}%`;
}

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return dateTimeFmt.format(new Date(iso));
}

/** مدة بصيغة دقائق:ثوانٍ، مثل 05:09 */
export function formatClock(totalSec: number): string {
  const s = Math.max(0, Math.floor(totalSec));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** مدة بالكلمات، مثل «4 دقائق و10 ثوانٍ» */
export function formatDuration(totalSec: number): string {
  const s = Math.max(0, Math.round(totalSec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  const min = m === 0 ? "" : m === 1 ? "دقيقة" : m === 2 ? "دقيقتان" : m <= 10 ? `${m} دقائق` : `${m} دقيقة`;
  const sec = r === 0 ? "" : r === 1 ? "ثانية" : r === 2 ? "ثانيتان" : r <= 10 ? `${r} ثوانٍ` : `${r} ثانية`;
  if (min && sec) return `${min} و${sec}`;
  return min || sec || "0 ثانية";
}

/** «سؤال واحد / سؤالان / 3 أسئلة / 11 سؤالًا» */
export function questionsCount(n: number): string {
  if (n === 1) return "سؤال واحد";
  if (n === 2) return "سؤالان";
  if (n >= 3 && n <= 10) return `${n} أسئلة`;
  return `${n} سؤالًا`;
}

export function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }
}
