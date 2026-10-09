"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QUESTION_BANK } from "@/data/questions";
import { buildAttempt, prepareQuestions, selectQuestions, type PreparedQuestion } from "@/lib/quiz";
import { createRng, randomSeed } from "@/lib/random";
import { formatClock, formatNumber, newId, questionsCount } from "@/lib/format";
import type { AttemptKind, Difficulty, QuizAttempt, TopicId } from "@/lib/types";
import { useProgress } from "./ProgressProvider";
import { QuestionView, OPTION_LETTERS } from "./QuestionView";
import { QuizReport } from "./QuizReport";
import { Button, Card, LinkButton, ProgressBar } from "./ui";

export interface QuizConfig {
  count: number;
  topics: readonly TopicId[];
  difficulties: readonly Difficulty[];
  timeLimitMinutes?: number;
}

interface Props {
  kind: AttemptKind;
  title: string;
  day?: number;
  config: QuizConfig;
  /** immediate: شرح بعد كل سؤال. end: الشرح بعد إنهاء الاختبار (نمط الامتحان). */
  feedback: "immediate" | "end";
  startLabel?: string;
  intro?: React.ReactNode;
  onFinished?: (attempt: QuizAttempt) => void;
  /** بدء الاختبار مباشرة دون شاشة البداية */
  autoStart?: boolean;
  onExit?: () => void;
}

type Phase = "intro" | "running" | "finished";

export function QuizRunner({
  kind,
  title,
  day,
  config,
  feedback,
  startLabel = "ابدأ",
  intro,
  onFinished,
  autoStart = false,
  onExit,
}: Props) {
  const { state, recordAttempt } = useProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [items, setItems] = useState<PreparedQuestion[]>([]);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [checked, setChecked] = useState<boolean[]>([]);
  const [index, setIndex] = useState(0);
  const [startedAt, setStartedAt] = useState<Date>(new Date(0));
  const [deadline, setDeadline] = useState<number | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  const start = useCallback(() => {
    const rng = createRng(randomSeed());
    const questions = selectQuestions({
      pool: QUESTION_BANK,
      count: config.count,
      topics: config.topics,
      difficulties: config.difficulties,
      seen: state.seen,
      rng,
    });
    const prepared = prepareQuestions(questions, rng);
    const now = new Date();
    setItems(prepared);
    setAnswers(prepared.map(() => null));
    setChecked(prepared.map(() => false));
    setIndex(0);
    setStartedAt(now);
    setDeadline(config.timeLimitMinutes ? now.getTime() + config.timeLimitMinutes * 60_000 : null);
    setAttempt(null);
    setConfirmSubmit(false);
    setPhase("running");
  }, [config, state.seen]);

  // بدء تلقائي مرة واحدة فقط
  const autoStarted = useRef(false);
  useEffect(() => {
    if (autoStart && !autoStarted.current) {
      autoStarted.current = true;
      start();
    }
  }, [autoStart, start]);

  const finish = useCallback(
    (timedOut = false) => {
      const result = buildAttempt({
        id: newId(),
        kind,
        title,
        day,
        questions: items.map((p) => p.question),
        answers,
        startedAt,
        finishedAt: new Date(),
        timeLimitSec: config.timeLimitMinutes ? config.timeLimitMinutes * 60 : undefined,
        timedOut,
      });
      recordAttempt(result);
      setAttempt(result);
      setPhase("finished");
      setConfirmSubmit(false);
      onFinished?.(result);
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [kind, title, day, items, answers, startedAt, config.timeLimitMinutes, recordAttempt, onFinished],
  );

  // تحذير عند محاولة مغادرة الصفحة أثناء الاختبار
  useEffect(() => {
    if (phase !== "running") return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  if (phase === "intro") {
    return (
      <Card>
        <h2 className="text-xl font-extrabold">{title}</h2>
        {intro && <div className="mt-2 leading-8 text-slate-700">{intro}</div>}
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          <li>📝 عدد الأسئلة: {questionsCount(config.count)}</li>
          <li>⏱️ {config.timeLimitMinutes ? `الوقت: ${formatNumber(config.timeLimitMinutes)} دقيقة` : "بلا مؤقت — خذ وقتك"}</li>
          <li>{feedback === "immediate" ? "💬 يظهر الشرح بعد كل سؤال" : "💬 تظهر الإجابات والشروح بعد التسليم"}</li>
        </ul>
        <Button className="mt-5" onClick={start}>
          {startLabel}
        </Button>
      </Card>
    );
  }

  if (phase === "finished" && attempt) {
    return (
      <div ref={topRef} className="scroll-mt-24 space-y-4">
        <Card>
          <QuizReport attempt={attempt} orders={items.map((p) => p.order)} />
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={start}>🔄 محاولة جديدة بأسئلة أخرى</Button>
            <LinkButton href="/" variant="secondary">
              🏠 لوحتي
            </LinkButton>
            <LinkButton href="/results/" variant="secondary">
              📊 كل النتائج
            </LinkButton>
            {onExit && (
              <Button variant="ghost" onClick={onExit}>
                رجوع
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  if (items.length === 0) {
    return <Card>لا توجد أسئلة متاحة لهذا الاختيار. جرّب مجالًا أو مستوى آخر.</Card>;
  }

  const current = items[index];
  const selected = answers[index];
  const isChecked = checked[index];
  const answeredCount = answers.filter((a) => a !== null).length;
  const isLast = index === items.length - 1;

  const select = (original: number) => {
    if (feedback === "immediate" && isChecked) return;
    setAnswers((prev) => prev.map((a, i) => (i === index ? original : a)));
  };

  const goTo = (i: number) => {
    setIndex(i);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={topRef} className="scroll-mt-24">
      <Card className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">{title}</h2>
          {deadline !== null && <Countdown deadline={deadline} onExpire={() => finish(true)} />}
        </div>
        <ProgressBar
          value={((feedback === "immediate" ? checked.filter(Boolean).length : answeredCount) / items.length) * 100}
          label="التقدّم في الاختبار"
        />

        {feedback === "end" && (
          <nav aria-label="التنقل بين الأسئلة" className="flex flex-wrap gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-current={i === index ? "step" : undefined}
                aria-label={`السؤال ${i + 1}${answers[i] !== null ? " (تمت الإجابة)" : ""}`}
                className={`h-9 w-9 rounded-lg text-sm font-bold ring-1 ${
                  i === index
                    ? "bg-blue-600 text-white ring-blue-600"
                    : answers[i] !== null
                      ? "bg-blue-50 text-blue-800 ring-blue-200"
                      : "bg-white text-slate-600 ring-slate-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        )}

        <QuestionView
          question={current.question}
          order={current.order}
          number={index + 1}
          total={items.length}
          selected={selected}
          onSelect={select}
          revealed={feedback === "immediate" && isChecked}
        />

        <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
          {feedback === "immediate" ? (
            !isChecked ? (
              <Button
                disabled={selected === null}
                onClick={() => setChecked((prev) => prev.map((c, i) => (i === index ? true : c)))}
              >
                تحقّق من الإجابة
              </Button>
            ) : isLast ? (
              <Button variant="success" onClick={() => finish()}>
                إنهاء وعرض النتيجة 🎯
              </Button>
            ) : (
              <Button onClick={() => goTo(index + 1)}>السؤال التالي ←</Button>
            )
          ) : (
            <>
              <Button variant="secondary" disabled={index === 0} onClick={() => goTo(index - 1)}>
                → السابق
              </Button>
              {!isLast && <Button onClick={() => goTo(index + 1)}>التالي ←</Button>}
              <Button variant="success" onClick={() => setConfirmSubmit(true)}>
                تسليم الاختبار
              </Button>
              <span className="text-sm text-slate-500">
                أجبت عن {formatNumber(answeredCount)} من {formatNumber(items.length)}
              </span>
            </>
          )}
          {feedback === "immediate" && selected === null && !isChecked && (
            <span className="text-sm text-slate-500">اختر إجابة من الخيارات ({OPTION_LETTERS.slice(0, current.order.length).join("، ")})</span>
          )}
        </div>

        {confirmSubmit && (
          <div role="alertdialog" aria-labelledby="confirm-title" className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <p id="confirm-title" className="font-bold text-amber-900">
              {answeredCount < items.length
                ? `بقي ${questionsCount(items.length - answeredCount)} بلا إجابة. هل تريد التسليم الآن؟`
                : "هل أنت متأكد من تسليم الاختبار؟"}
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
              <Button variant="success" onClick={() => finish()}>
                نعم، سلّم الاختبار
              </Button>
              <Button variant="secondary" onClick={() => setConfirmSubmit(false)}>
                أكمل الحل
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

/** مؤقت تنازلي يعتمد على الوقت الفعلي (يبقى دقيقًا حتى لو كان التبويب في الخلفية). */
function Countdown({ deadline, onExpire }: { deadline: number; onExpire: () => void }) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;
  const fired = useRef(false);

  useEffect(() => {
    const tick = () => {
      const left = Math.max(0, deadline - Date.now());
      setRemaining(left);
      if (left === 0 && !fired.current) {
        fired.current = true;
        expireRef.current();
      }
    };
    tick();
    const id = window.setInterval(tick, 500);
    return () => window.clearInterval(id);
  }, [deadline]);

  const sec = Math.ceil(remaining / 1000);
  const low = sec <= 60;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 font-bold tabular-nums ${
        low ? "bg-amber-100 text-amber-900" : "bg-slate-100 text-slate-800"
      }`}
      role="timer"
      aria-live={low ? "polite" : "off"}
      aria-label={`الوقت المتبقي ${formatClock(sec)}`}
    >
      <span aria-hidden="true">⏱️</span>
      <bdi dir="ltr">{formatClock(sec)}</bdi>
    </div>
  );
}
