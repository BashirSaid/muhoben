"use client";

import { useState } from "react";
import { getQuestion } from "@/data/questions";
import { getTopic } from "@/data/topics";
import { encouragement, percent, scoreByTopic } from "@/lib/quiz";
import { formatDuration, formatNumber, questionsCount } from "@/lib/format";
import type { QuizAttempt } from "@/lib/types";
import { QuestionView } from "./QuestionView";
import { TOPIC_STYLES } from "./topicStyles";
import { ProgressBar, ProgressRing, TopicBadge } from "./ui";

/** تقرير نتيجة اختبار: النسبة، والأداء حسب المجال، ومراجعة الأخطاء مع الشرح. */
export function QuizReport({ attempt, orders }: { attempt: QuizAttempt; orders?: number[][] }) {
  const pct = percent(attempt.correct, attempt.total);
  const msg = encouragement(pct);
  const byTopic = scoreByTopic(attempt.items).sort((a, b) => b.percent - a.percent);
  const strengths = byTopic.filter((t) => t.percent >= 70);
  const toImprove = byTopic.filter((t) => t.percent < 60);
  const unanswered = attempt.items.filter((it) => it.chosen === null).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-l from-blue-50 to-sky-50 p-6 text-center sm:flex-row sm:text-start">
        <ProgressRing value={pct} label="نسبة النجاح" />
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold text-slate-900">{msg.title}</h2>
          <p className="mt-1 leading-8 text-slate-700">{msg.message}</p>
          <ul className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm text-slate-600 sm:justify-start">
            <li>
              ✅ الإجابات الصحيحة: <b>{formatNumber(attempt.correct)}</b> من {formatNumber(attempt.total)}
            </li>
            <li>⏱️ المدة: {formatDuration(attempt.durationSec)}</li>
            {unanswered > 0 && <li>⚪ بلا إجابة: {questionsCount(unanswered)}</li>}
          </ul>
          {attempt.timedOut && (
            <p className="mt-2 text-sm text-amber-800">انتهى الوقت وسُلّم الاختبار تلقائيًا. التدريب على الوقت يتحسّن مع الممارسة.</p>
          )}
        </div>
      </div>

      <section>
        <h3 className="mb-3 text-lg font-extrabold">الأداء حسب المجال</h3>
        <ul className="space-y-3">
          {byTopic.map((t) => {
            const topic = getTopic(t.topic);
            return (
              <li key={t.topic}>
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <TopicBadge topic={t.topic} />
                  <span className="font-bold text-slate-700">
                    {formatNumber(t.correct)}/{formatNumber(t.total)} ({formatNumber(t.percent)}%)
                  </span>
                </div>
                <ProgressBar value={t.percent} barClass={TOPIC_STYLES[topic.color].bar} label={topic.name} />
              </li>
            );
          })}
        </ul>
      </section>

      {(strengths.length > 0 || toImprove.length > 0) && (
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <h3 className="font-extrabold text-emerald-900">💪 نقاط القوة</h3>
            {strengths.length ? (
              <ul className="mt-2 space-y-1 text-sm">
                {strengths.map((t) => (
                  <li key={t.topic}>• {getTopic(t.topic).name}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-emerald-900">ستظهر هنا المجالات التي تتقنها مع استمرار التدريب.</p>
            )}
          </div>
          <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <h3 className="font-extrabold text-amber-900">🌱 مجالات للتدريب الإضافي</h3>
            {toImprove.length ? (
              <ul className="mt-2 space-y-1 text-sm">
                {toImprove.map((t) => (
                  <li key={t.topic}>• {getTopic(t.topic).name}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-amber-900">لا توجد مجالات ضعيفة في هذا الاختبار. ممتاز!</p>
            )}
          </div>
        </section>
      )}

      <AttemptReview attempt={attempt} orders={orders} />
    </div>
  );
}

export function AttemptReview({ attempt, orders }: { attempt: QuizAttempt; orders?: number[][] }) {
  const mistakes = attempt.items.filter((it) => !it.correct).length;
  const [onlyMistakes, setOnlyMistakes] = useState(mistakes > 0);
  const items = attempt.items
    .map((it, i) => ({ it, i, question: getQuestion(it.questionId) }))
    .filter((x) => x.question && (!onlyMistakes || !x.it.correct));

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-extrabold">مراجعة الإجابات</h3>
        <div className="flex rounded-xl bg-slate-100 p-1 text-sm font-bold" role="group" aria-label="تصفية الأسئلة">
          <button
            type="button"
            onClick={() => setOnlyMistakes(true)}
            aria-pressed={onlyMistakes}
            className={`rounded-lg px-3 py-1.5 ${onlyMistakes ? "bg-white shadow-sm" : "text-slate-600"}`}
          >
            الأخطاء فقط ({formatNumber(mistakes)})
          </button>
          <button
            type="button"
            onClick={() => setOnlyMistakes(false)}
            aria-pressed={!onlyMistakes}
            className={`rounded-lg px-3 py-1.5 ${!onlyMistakes ? "bg-white shadow-sm" : "text-slate-600"}`}
          >
            كل الأسئلة ({formatNumber(attempt.items.length)})
          </button>
        </div>
      </div>
      {items.length === 0 ? (
        <p className="rounded-xl bg-emerald-50 p-4 text-emerald-900">لا توجد أخطاء — كل إجاباتك صحيحة! 🎉</p>
      ) : (
        <ol className="space-y-4">
          {items.map(({ it, i, question }) => (
            <li key={`${it.questionId}-${i}`} className="rounded-2xl bg-white p-4 ring-1 ring-slate-200">
              <QuestionView
                question={question!}
                order={orders?.[i] ?? question!.options.map((_, k) => k)}
                number={i + 1}
                total={attempt.items.length}
                selected={it.chosen}
                revealed
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
