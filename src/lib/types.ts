/**
 * الأنواع الأساسية المشتركة بين البيانات والمنطق والواجهة.
 * هذه الأنواع مستقلة عن طريقة التخزين، حتى يمكن لاحقًا نقل البيانات
 * إلى قاعدة بيانات أو واجهة برمجية (API) دون تغيير المكونات.
 */

export type TopicId =
  | "logic"
  | "patterns"
  | "verbal"
  | "quantitative"
  | "spatial"
  | "problem-solving";

/** 1 = سهل، 2 = متوسط، 3 = متقدم */
export type Difficulty = 1 | 2 | 3;

/** معرّفات الرسوم التوضيحية (تُرسم في طبقة الواجهة كمكونات SVG). */
export type FigureId =
  | "triangle-split"
  | "grid-3x3"
  | "cube-net"
  | "shaded-grid"
  | "strip-4"
  | "plus-shape"
  | "dot-rotation";

/**
 * مصدر السؤال:
 * - original: سؤال أصلي من إعداد المنصة (كل أسئلة النسخة الحالية).
 * - licensed: مخصّص مستقبلًا لمواد مرخّصة صراحة مع ذكر المصدر.
 * لا تُضاف أسئلة رسمية أو محمية بحقوق النشر دون ترخيص.
 */
export type QuestionSource =
  | { kind: "original" }
  | { kind: "licensed"; attribution: string; license: string };

export interface Question {
  id: string;
  topic: TopicId;
  difficulty: Difficulty;
  /** نص السؤال. المقاطع بين علامتي $...$ تُعرض من اليسار إلى اليمين (تعابير رياضية). */
  prompt: string;
  figure?: FigureId;
  options: string[];
  /** رقم الخيار الصحيح (يبدأ من 0) بحسب ترتيب options الأصلي. */
  answer: number;
  explanation: string;
  source: QuestionSource;
}

export interface Topic {
  id: TopicId;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  /** اسم لون Tailwind الأساسي لهذا المجال */
  color: "violet" | "sky" | "emerald" | "amber" | "rose" | "teal";
}

export interface LessonSection {
  title: string;
  points: string[];
}

export interface WorkedExample {
  problem: string;
  figure?: FigureId;
  steps: string[];
  answer: string;
}

export type DayKind = "lesson" | "review" | "exam";

export interface DayQuizConfig {
  count: number;
  difficulties: Difficulty[];
  /** إذا حُدّد: اختبار بمؤقت وتظهر التغذية الراجعة في النهاية فقط. */
  timeLimitMinutes?: number;
}

export interface DayPlan {
  day: number;
  week: number;
  kind: DayKind;
  title: string;
  topics: TopicId[];
  goals: string[];
  lessons: LessonSection[];
  examples: WorkedExample[];
  tip: string;
  quiz: DayQuizConfig;
}

export type AttemptKind = "daily" | "practice" | "mini-exam" | "exam";

export interface AttemptItem {
  questionId: string;
  topic: TopicId;
  difficulty: Difficulty;
  /** رقم الخيار الذي اختاره الطالب في ترتيب options الأصلي، أو null إذا لم يُجب. */
  chosen: number | null;
  correct: boolean;
}

export interface QuizAttempt {
  id: string;
  kind: AttemptKind;
  title: string;
  day?: number;
  startedAt: string;
  finishedAt: string;
  durationSec: number;
  timeLimitSec?: number;
  timedOut?: boolean;
  items: AttemptItem[];
  correct: number;
  total: number;
}

export interface DayCompletion {
  completedAt: string;
  attemptId: string;
  percent: number;
}

/** حالة تقدّم الطالب. لا تحتوي أي بيانات شخصية (لا اسم، لا بريد، لا هوية). */
export interface ProgressState {
  version: 1;
  createdAt: string;
  completedDays: Record<number, DayCompletion>;
  attempts: QuizAttempt[];
  /** عدد مرات ظهور كل سؤال، لتقليل التكرار بين الاختبارات. */
  seen: Record<string, number>;
}
