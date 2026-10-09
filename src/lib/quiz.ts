import type {
  AttemptItem,
  AttemptKind,
  Difficulty,
  Question,
  QuizAttempt,
  TopicId,
} from "./types";
import { shuffle, type Rng } from "./random";

export interface SelectOptions {
  pool: readonly Question[];
  count: number;
  topics: readonly TopicId[];
  difficulties: readonly Difficulty[];
  /** عدد مرات ظهور كل سؤال سابقًا — الأسئلة الأقل ظهورًا تُفضَّل. */
  seen?: Record<string, number>;
  rng: Rng;
}

/**
 * يختار أسئلة دون تكرار داخل الاختبار الواحد:
 * - يوزّع الأسئلة بالتساوي تقريبًا بين المجالات المطلوبة.
 * - يفضّل الأسئلة التي لم تظهر للطالب من قبل (أو ظهرت أقل).
 * - إذا لم تكفِ الأسئلة بالمستويات المطلوبة، يكمل من مستويات أخرى في المجال نفسه.
 */
export function selectQuestions(opts: SelectOptions): Question[] {
  const { pool, count, topics, difficulties, seen = {}, rng } = opts;

  const rank = (list: readonly Question[]) =>
    // خلط أولًا ثم ترتيب ثابت حسب عدد مرات الظهور، فتبقى العشوائية بين المتساوين
    shuffle(list, rng).sort((a, b) => (seen[a.id] ?? 0) - (seen[b.id] ?? 0));

  const queues = new Map<TopicId, Question[]>();
  for (const topic of topics) {
    const inTopic = pool.filter((q) => q.topic === topic);
    const preferred = rank(inTopic.filter((q) => difficulties.includes(q.difficulty)));
    const fallback = rank(inTopic.filter((q) => !difficulties.includes(q.difficulty)));
    queues.set(topic, [...preferred, ...fallback]);
  }

  const chosen: Question[] = [];
  const used = new Set<string>();
  // ترتيب عشوائي للمجالات حتى لا يبدأ كل اختبار بالمجال نفسه
  const order = shuffle(topics, rng);
  let progress = true;
  while (chosen.length < count && progress) {
    progress = false;
    for (const topic of order) {
      if (chosen.length >= count) break;
      const queue = queues.get(topic)!;
      while (queue.length > 0) {
        const q = queue.shift()!;
        if (!used.has(q.id)) {
          used.add(q.id);
          chosen.push(q);
          progress = true;
          break;
        }
      }
    }
  }

  // ترتيب الأسئلة: من الأسهل إلى الأصعب مع خلط داخل كل مستوى (أكثر تشجيعًا)
  return shuffle(chosen, rng).sort((a, b) => a.difficulty - b.difficulty);
}

/** سؤال جاهز للعرض مع ترتيب خيارات مخلوط. */
export interface PreparedQuestion {
  question: Question;
  /** order[i] = رقم الخيار الأصلي المعروض في الموقع i */
  order: number[];
}

export function prepareQuestions(questions: readonly Question[], rng: Rng): PreparedQuestion[] {
  return questions.map((question) => ({
    question,
    order: shuffle(
      question.options.map((_, i) => i),
      rng,
    ),
  }));
}

export interface TopicScore {
  topic: TopicId;
  correct: number;
  total: number;
  percent: number;
}

export function percent(correct: number, total: number): number {
  return total === 0 ? 0 : Math.round((correct / total) * 100);
}

export function buildAttempt(params: {
  id: string;
  kind: AttemptKind;
  title: string;
  day?: number;
  questions: readonly Question[];
  /** الإجابات بحسب رقم الخيار الأصلي، أو null لسؤال لم يُجب عنه */
  answers: readonly (number | null)[];
  startedAt: Date;
  finishedAt: Date;
  timeLimitSec?: number;
  timedOut?: boolean;
}): QuizAttempt {
  const items: AttemptItem[] = params.questions.map((q, i) => {
    const chosen = params.answers[i] ?? null;
    return {
      questionId: q.id,
      topic: q.topic,
      difficulty: q.difficulty,
      chosen,
      correct: chosen === q.answer,
    };
  });
  const correct = items.filter((it) => it.correct).length;
  return {
    id: params.id,
    kind: params.kind,
    title: params.title,
    day: params.day,
    startedAt: params.startedAt.toISOString(),
    finishedAt: params.finishedAt.toISOString(),
    durationSec: Math.max(
      0,
      Math.round((params.finishedAt.getTime() - params.startedAt.getTime()) / 1000),
    ),
    timeLimitSec: params.timeLimitSec,
    timedOut: params.timedOut,
    items,
    correct,
    total: items.length,
  };
}

export function scoreByTopic(items: readonly AttemptItem[]): TopicScore[] {
  const map = new Map<TopicId, { correct: number; total: number }>();
  for (const it of items) {
    const s = map.get(it.topic) ?? { correct: 0, total: 0 };
    s.total += 1;
    if (it.correct) s.correct += 1;
    map.set(it.topic, s);
  }
  return [...map.entries()].map(([topic, s]) => ({
    topic,
    correct: s.correct,
    total: s.total,
    percent: percent(s.correct, s.total),
  }));
}

/** رسالة تشجيعية حسب النتيجة — دون مقارنة بالآخرين. */
export function encouragement(pct: number): { title: string; message: string } {
  if (pct >= 85)
    return { title: "عمل رائع! 🌟", message: "تفكيرك منظم ودقيق. استمر على هذا المستوى وجرّب أسئلة أصعب." };
  if (pct >= 65)
    return { title: "أحسنت! 👏", message: "أنت تتقدم بشكل جيد. راجع الأسئلة التي أخطأت فيها لتتعلم منها." };
  if (pct >= 40)
    return { title: "جهد طيب 💪", message: "كل سؤال تحلّه يقوّي مهاراتك. اقرأ الشروح بهدوء ثم جرّب مرة أخرى." };
  return {
    title: "بداية جيدة 🌱",
    message: "الأخطاء جزء من التعلم. اقرأ شرح كل سؤال، وراجع الدرس، ثم حاول من جديد — ستلاحظ الفرق.",
  };
}
