import { PLAN, TOTAL_DAYS } from "@/data/plan";
import { TOPICS } from "@/data/topics";
import { MAX_ATTEMPTS } from "./storage";
import { percent } from "./quiz";
import type { ProgressState, QuizAttempt, TopicId } from "./types";

/** تسجيل محاولة جديدة وتحديث الأيام المنجزة والأسئلة التي ظهرت. دالة نقية. */
export function applyAttempt(state: ProgressState, attempt: QuizAttempt): ProgressState {
  const seen = { ...state.seen };
  for (const it of attempt.items) seen[it.questionId] = (seen[it.questionId] ?? 0) + 1;

  const completedDays = { ...state.completedDays };
  // أي محاولة مرتبطة بيوم من الخطة تجعل ذلك اليوم منجزًا
  if (attempt.day !== undefined) {
    const pct = percent(attempt.correct, attempt.total);
    const prev = completedDays[attempt.day];
    // نحتفظ بأفضل نتيجة لليوم (تشجيع على إعادة المحاولة)
    if (!prev || pct >= prev.percent) {
      completedDays[attempt.day] = {
        completedAt: attempt.finishedAt,
        attemptId: attempt.id,
        percent: pct,
      };
    }
  }

  const attempts = [...state.attempts, attempt].slice(-MAX_ATTEMPTS);
  return { ...state, seen, completedDays, attempts };
}

export function completedDayCount(state: ProgressState): number {
  return Object.keys(state.completedDays).length;
}

/** اليوم الحالي = أول يوم لم يُنجز بعد (أو اليوم الأخير إذا أُنجزت كل الأيام). */
export function currentDay(state: ProgressState): number {
  for (const d of PLAN) if (!state.completedDays[d.day]) return d.day;
  return TOTAL_DAYS;
}

export function planCompletionPercent(state: ProgressState): number {
  return percent(completedDayCount(state), TOTAL_DAYS);
}

export function totalAnswered(state: ProgressState): number {
  return state.attempts.reduce((sum, a) => sum + a.items.filter((it) => it.chosen !== null).length, 0);
}

export function totalCorrect(state: ProgressState): number {
  return state.attempts.reduce((sum, a) => sum + a.correct, 0);
}

export type Level = "not-started" | "needs-practice" | "good" | "very-good" | "excellent";

export const LEVEL_LABELS: Record<Level, string> = {
  "not-started": "لم يبدأ بعد",
  "needs-practice": "يحتاج إلى تدريب",
  good: "جيد",
  "very-good": "جيد جدًا",
  excellent: "ممتاز",
};

/** الحد الأدنى من الإجابات قبل إصدار حكم على المستوى. */
export const MIN_FOR_LEVEL = 3;

export function levelFor(correct: number, total: number): Level {
  if (total < MIN_FOR_LEVEL) return total === 0 ? "not-started" : "good";
  const p = percent(correct, total);
  if (p >= 85) return "excellent";
  if (p >= 70) return "very-good";
  if (p >= 50) return "good";
  return "needs-practice";
}

export interface TopicPerformance {
  topic: TopicId;
  correct: number;
  total: number;
  percent: number;
  level: Level;
}

/**
 * الأداء في كل مجال، محسوبًا من آخر 40 إجابة في المجال
 * حتى يعكس المستوى الحالي وليس البدايات فقط.
 */
export function topicPerformance(state: ProgressState, window = 40): TopicPerformance[] {
  return TOPICS.map(({ id }) => {
    const items = state.attempts
      .flatMap((a) => a.items)
      .filter((it) => it.topic === id && it.chosen !== null)
      .slice(-window);
    const correct = items.filter((it) => it.correct).length;
    return {
      topic: id,
      correct,
      total: items.length,
      percent: percent(correct, items.length),
      level: levelFor(correct, items.length),
    };
  });
}

export function strengthsAndWeaknesses(perf: TopicPerformance[]): {
  strengths: TopicPerformance[];
  toImprove: TopicPerformance[];
} {
  const rated = perf.filter((p) => p.total >= MIN_FOR_LEVEL);
  return {
    strengths: rated.filter((p) => p.percent >= 70).sort((a, b) => b.percent - a.percent),
    toImprove: rated.filter((p) => p.percent < 60).sort((a, b) => a.percent - b.percent),
  };
}

export interface Suggestion {
  href: string;
  title: string;
  description: string;
  icon: string;
}

export function suggestions(state: ProgressState): Suggestion[] {
  const list: Suggestion[] = [];
  const day = currentDay(state);
  const allDone = completedDayCount(state) >= TOTAL_DAYS;
  const plan = PLAN.find((d) => d.day === day)!;

  if (!allDone) {
    list.push({
      href: `/day/${day}/`,
      title: `اليوم ${day}: ${plan.title}`,
      description: "الخطوة التالية في خطتك التدريبية.",
      icon: "📅",
    });
  }

  const { toImprove } = strengthsAndWeaknesses(topicPerformance(state));
  const weakest = toImprove[0];
  if (weakest) {
    const topic = TOPICS.find((t) => t.id === weakest.topic)!;
    list.push({
      href: `/practice/?topic=${weakest.topic}`,
      title: `تدريب إضافي: ${topic.name}`,
      description: "تدريب قصير في مجال يمكنك التحسّن فيه أكثر.",
      icon: topic.icon,
    });
  }

  const hasExam = state.attempts.some((a) => a.kind === "exam" || a.kind === "mini-exam");
  if (completedDayCount(state) >= 7 && !hasExam) {
    list.push({
      href: "/exam/",
      title: "جرّب اختبارًا قصيرًا بمؤقت",
      description: "تعوّد على أجواء الاختبار وتنظيم الوقت.",
      icon: "⏱️",
    });
  }

  if (allDone) {
    list.push({
      href: "/exam/",
      title: "اختبار شامل جديد",
      description: "أنهيت الخطة! استمر بالتدريب عبر اختبارات شاملة جديدة.",
      icon: "🏆",
    });
  }

  if (list.length < 3) {
    list.push({
      href: "/practice/",
      title: "تدريب حر",
      description: "اختر المجال والمستوى وعدد الأسئلة بنفسك.",
      icon: "🎯",
    });
  }
  return list.slice(0, 3);
}

/** عدد أيام التدريب المتتالية (حسب التاريخ المحلي) — يُعرض للتشجيع فقط. */
export function streakDays(state: ProgressState, now: Date = new Date()): number {
  const days = new Set(
    state.attempts.map((a) => new Date(a.finishedAt).toLocaleDateString("en-CA")),
  );
  let streak = 0;
  const cursor = new Date(now);
  // إذا لم يتدرّب اليوم بعد، نبدأ العدّ من الأمس
  if (!days.has(cursor.toLocaleDateString("en-CA"))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toLocaleDateString("en-CA"))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}
