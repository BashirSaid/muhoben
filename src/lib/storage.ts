import type { ProgressState } from "./types";

/**
 * طبقة التخزين.
 *
 * النسخة الحالية تحفظ التقدّم في التخزين المحلي للمتصفح (localStorage) فقط:
 * - البيانات خاصة بهذا الجهاز وهذا المتصفح، ولا تُرسَل إلى أي خادم.
 * - لا تنتقل تلقائيًا إلى جهاز آخر، وقد تُحذف عند مسح بيانات المتصفح.
 * - هذا ليس تخزينًا مركزيًا، ولا يتيح للمعلّم الاطلاع على النتائج.
 *
 * لإضافة حسابات وقاعدة بيانات لاحقًا: أنشئ صنفًا جديدًا يطبّق الواجهة
 * ProgressRepository (مثلًا يتصل بواجهة برمجية على الخادم) واستبدله في
 * ProgressProvider دون الحاجة إلى تعديل الصفحات أو المكونات.
 */
export interface ProgressRepository {
  load(): ProgressState;
  save(state: ProgressState): void;
  clear(): void;
}

export const STORAGE_KEY = "muhoben:progress:v1";
/** حد أعلى لعدد المحاولات المحفوظة حتى لا يكبر التخزين المحلي بلا حدود. */
export const MAX_ATTEMPTS = 300;

export function emptyState(now: Date = new Date()): ProgressState {
  return { version: 1, createdAt: now.toISOString(), completedDays: {}, attempts: [], seen: {} };
}

/** يتحقق من شكل البيانات المقروءة ويعيد حالة سليمة دائمًا. */
export function parseState(raw: unknown): ProgressState {
  if (!raw || typeof raw !== "object") return emptyState();
  const r = raw as Partial<ProgressState>;
  if (r.version !== 1) return emptyState();
  return {
    version: 1,
    createdAt: typeof r.createdAt === "string" ? r.createdAt : new Date().toISOString(),
    completedDays:
      r.completedDays && typeof r.completedDays === "object" ? r.completedDays : {},
    attempts: Array.isArray(r.attempts)
      ? r.attempts.filter(
          (a) => a && typeof a.id === "string" && Array.isArray(a.items),
        )
      : [],
    seen: r.seen && typeof r.seen === "object" ? r.seen : {},
  };
}

export class LocalStorageRepository implements ProgressRepository {
  constructor(private readonly key: string = STORAGE_KEY) {}

  private get storage(): Storage | null {
    try {
      return typeof window !== "undefined" ? window.localStorage : null;
    } catch {
      return null; // مثلًا: التخزين محظور في وضع التصفح الخاص
    }
  }

  load(): ProgressState {
    try {
      const text = this.storage?.getItem(this.key);
      return text ? parseState(JSON.parse(text)) : emptyState();
    } catch {
      return emptyState();
    }
  }

  save(state: ProgressState): void {
    try {
      this.storage?.setItem(this.key, JSON.stringify(state));
    } catch {
      // التخزين ممتلئ أو غير متاح — يستمر التطبيق في العمل داخل الجلسة الحالية
    }
  }

  clear(): void {
    try {
      this.storage?.removeItem(this.key);
    } catch {
      /* تجاهل */
    }
  }
}

/** مستودع في الذاكرة — للاختبارات أو عند تعذّر التخزين المحلي. */
export class MemoryRepository implements ProgressRepository {
  private state: ProgressState;
  constructor(initial?: ProgressState) {
    this.state = initial ?? emptyState();
  }
  load(): ProgressState {
    return structuredClone(this.state);
  }
  save(state: ProgressState): void {
    this.state = structuredClone(state);
  }
  clear(): void {
    this.state = emptyState();
  }
}
