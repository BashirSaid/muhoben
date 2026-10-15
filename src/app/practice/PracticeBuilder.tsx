"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { QuizRunner, type QuizConfig } from "@/components/QuizRunner";
import { Button, Card } from "@/components/ui";
import { ARITHMETIC_QUESTIONS, QUESTION_BANK, SHAPE_QUESTIONS } from "@/data/questions";
import { DIFFICULTY_LABELS, TOPICS, TOPIC_IDS } from "@/data/topics";
import { formatNumber } from "@/lib/format";
import type { Difficulty, Question, TopicId } from "@/lib/types";

const LEVELS: { id: string; label: string; value: Difficulty[] }[] = [
  { id: "mixed", label: "متدرّج (كل المستويات)", value: [1, 2, 3] },
  { id: "1", label: DIFFICULTY_LABELS[1], value: [1] },
  { id: "2", label: DIFFICULTY_LABELS[2], value: [2] },
  { id: "3", label: DIFFICULTY_LABELS[3], value: [3] },
];
const COUNTS = [5, 10, 15];

/** أنواع خاصة من الأسئلة لها مجموعة أسئلة خاصة بها */
const SPECIAL: Record<string, { label: string; title: string; note: string; pool: Question[] }> = {
  shapes: {
    label: "🔷 أسئلة الأشكال فقط",
    title: "تدريب على أسئلة الأشكال",
    note: "أسئلة مرسومة: سلاسل وجداول أشكال، وتناظر، ودوران ومرايا، وطيّ ورق، وعدّ أشكال، وشبكات مكعّب.",
    pool: SHAPE_QUESTIONS,
  },
  arith: {
    label: "🧮 مسائل حسابية (نمط الامتحان)",
    title: "تدريب على المسائل الحسابية",
    note: "العملية الجديدة (@ و #)، والرقم المخفي، والمواعيد مع الاستراحات، والصعود والانزلاق، والتقدير بالمجموع والفرق، والقصّ من لوح.",
    pool: ARITHMETIC_QUESTIONS,
  },
};
type QuestionType = "all" | keyof typeof SPECIAL;

export function PracticeBuilder() {
  const params = useSearchParams();
  const initialTopic = params.get("topic") as TopicId | null;
  const [topics, setTopics] = useState<TopicId[]>(
    initialTopic && TOPIC_IDS.includes(initialTopic) ? [initialTopic] : [...TOPIC_IDS],
  );
  const [level, setLevel] = useState("mixed");
  const [count, setCount] = useState(10);
  const [timed, setTimed] = useState(false);
  const [feedback, setFeedback] = useState<"immediate" | "end">("immediate");
  const initialType = params.get("type") ?? "all";
  const [type, setType] = useState<QuestionType>(initialType in SPECIAL ? initialType : "all");
  const special = type === "all" ? undefined : SPECIAL[type];
  const [session, setSession] = useState<{ key: number; title: string; config: QuizConfig; feedback: "immediate" | "end" } | null>(
    null,
  );

  const difficulties = LEVELS.find((l) => l.id === level)!.value;
  const activeTopics = special ? [...new Set(special.pool.map((q) => q.topic))] : topics;
  const available = (special?.pool ?? QUESTION_BANK).filter((q) => activeTopics.includes(q.topic)).length;

  const toggleTopic = (id: TopicId) =>
    setTopics((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  if (session) {
    return (
      <QuizRunner
        key={session.key}
        kind="practice"
        title={session.title}
        config={session.config}
        feedback={session.feedback}
        autoStart
        onExit={() => setSession(null)}
      />
    );
  }

  return (
    <Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSession({
            key: Date.now(),
            title: special?.title ?? "تدريب حر",
            config: {
              count,
              topics: activeTopics,
              difficulties,
              timeLimitMinutes: timed ? count : undefined,
              pool: special?.pool,
            },
            feedback: timed ? "end" : feedback,
          });
        }}
        className="space-y-6"
      >
        <fieldset>
          <legend className="mb-2 font-extrabold">نوع الأسئلة</legend>
          <div className="flex flex-wrap gap-2">
            {[{ id: "all", label: "كل الأسئلة" }, ...Object.entries(SPECIAL).map(([id, v]) => ({ id, label: v.label }))].map((o) => (
              <label
                key={o.id}
                className={`cursor-pointer rounded-xl px-4 py-2 font-bold ring-1 ${
                  type === o.id ? "bg-blue-600 text-white ring-blue-600" : "bg-white ring-slate-300"
                }`}
              >
                <input type="radio" name="type" checked={type === o.id} onChange={() => setType(o.id)} className="sr-only" />
                {o.label}
              </label>
            ))}
          </div>
          {special && <p className="mt-2 text-sm text-slate-500">{special.note}</p>}
        </fieldset>

        <fieldset disabled={Boolean(special)} className={special ? "opacity-50" : undefined}>
          <legend className="mb-2 font-extrabold">المجالات</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <label
                key={t.id}
                className={`flex cursor-pointer items-center gap-3 rounded-xl p-3 ring-1 transition ${
                  topics.includes(t.id) ? "bg-blue-50 ring-blue-300" : "bg-white ring-slate-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-blue-600"
                  checked={topics.includes(t.id)}
                  onChange={() => toggleTopic(t.id)}
                />
                <span aria-hidden="true" className="text-xl">
                  {t.icon}
                </span>
                <span className="font-bold">{t.name}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-sm">
            <button type="button" className="font-bold text-blue-700 hover:underline" onClick={() => setTopics([...TOPIC_IDS])}>
              اختر الكل
            </button>
            <button type="button" className="font-bold text-slate-500 hover:underline" onClick={() => setTopics([])}>
              إلغاء الكل
            </button>
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-extrabold">المستوى</legend>
          <div className="flex flex-wrap gap-2">
            {LEVELS.map((l) => (
              <label
                key={l.id}
                className={`cursor-pointer rounded-xl px-4 py-2 font-bold ring-1 ${
                  level === l.id ? "bg-blue-600 text-white ring-blue-600" : "bg-white ring-slate-300"
                }`}
              >
                <input type="radio" name="level" value={l.id} checked={level === l.id} onChange={() => setLevel(l.id)} className="sr-only" />
                {l.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 font-extrabold">عدد الأسئلة</legend>
          <div className="flex flex-wrap gap-2">
            {COUNTS.map((c) => (
              <label
                key={c}
                className={`cursor-pointer rounded-xl px-5 py-2 font-bold ring-1 ${
                  count === c ? "bg-blue-600 text-white ring-blue-600" : "bg-white ring-slate-300"
                }`}
              >
                <input type="radio" name="count" value={c} checked={count === c} onChange={() => setCount(c)} className="sr-only" />
                {formatNumber(c)}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="space-y-2">
          <legend className="mb-2 font-extrabold">طريقة التدريب</legend>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              className="h-5 w-5 accent-blue-600"
              checked={timed}
              onChange={(e) => setTimed(e.target.checked)}
            />
            <span>مع مؤقت (دقيقة لكل سؤال) — تظهر الشروح بعد التسليم</span>
          </label>
          {!timed && (
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                className="h-5 w-5 accent-blue-600"
                checked={feedback === "end"}
                onChange={(e) => setFeedback(e.target.checked ? "end" : "immediate")}
              />
              <span>أظهر الشروح في النهاية فقط (بدلًا من بعد كل سؤال)</span>
            </label>
          )}
        </fieldset>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={activeTopics.length === 0}>
            ابدأ التدريب
          </Button>
          <span className="text-sm text-slate-500">
            {activeTopics.length === 0 ? "اختر مجالًا واحدًا على الأقل." : `في بنك الأسئلة ${formatNumber(available)} سؤالًا في المجالات المختارة.`}
          </span>
        </div>
      </form>
    </Card>
  );
}
