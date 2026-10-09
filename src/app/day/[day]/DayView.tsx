"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { QuizRunner } from "@/components/QuizRunner";
import { RichText } from "@/components/RichText";
import { Figure } from "@/components/figures";
import { Card, TopicBadge } from "@/components/ui";
import { getDay, TOTAL_DAYS } from "@/data/plan";
import { formatNumber } from "@/lib/format";

export function DayView({ day }: { day: number }) {
  const plan = getDay(day)!;
  const { state } = useProgress();
  const completion = state.completedDays[day];
  const timed = plan.quiz.timeLimitMinutes !== undefined;
  const quizTitle = plan.kind === "exam" ? plan.title : `أسئلة اليوم ${day}`;

  return (
    <article className="space-y-6">
      <nav aria-label="مسار التنقل" className="text-sm text-slate-500">
        <Link href="/plan/" className="hover:underline">
          الخطة
        </Link>{" "}
        / اليوم {formatNumber(day)}
      </nav>

      <header>
        <p className="text-sm font-extrabold text-blue-700">
          اليوم {formatNumber(day)} من {formatNumber(TOTAL_DAYS)}
          {completion && <span className="ms-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">✓ أُنجز</span>}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">{plan.title}</h1>
        <div className="mt-3 flex flex-wrap gap-2">
          {plan.topics.map((t) => (
            <TopicBadge key={t} topic={t} />
          ))}
        </div>
      </header>

      <Card>
        <h2 className="text-lg font-extrabold">🎯 أهداف اليوم</h2>
        <ul className="mt-2 list-inside list-disc space-y-1 leading-8 text-slate-700">
          {plan.goals.map((g) => (
            <li key={g}>{g}</li>
          ))}
        </ul>
      </Card>

      <section aria-labelledby="lesson-heading" className="space-y-4">
        <h2 id="lesson-heading" className="text-xl font-extrabold">
          📘 {plan.kind === "lesson" ? "الدرس" : "قبل أن تبدأ"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {plan.lessons.map((l) => (
            <Card key={l.title} as="div">
              <h3 className="font-extrabold text-blue-800">{l.title}</h3>
              <ul className="mt-2 space-y-2 leading-8 text-slate-700">
                {l.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" aria-hidden="true" />
                    <RichText text={p} />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {plan.examples.length > 0 && (
        <section aria-labelledby="examples-heading" className="space-y-4">
          <h2 id="examples-heading" className="text-xl font-extrabold">
            ✏️ أمثلة محلولة
          </h2>
          {plan.examples.map((ex, i) => (
            <details key={i} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200" open={i === 0}>
              <summary className="cursor-pointer list-none font-bold leading-8 text-slate-900">
                <span className="me-2 rounded-lg bg-amber-100 px-2 py-0.5 text-sm text-amber-900">مثال {formatNumber(i + 1)}</span>
                <RichText text={ex.problem} />
                <span className="ms-2 text-sm font-normal text-blue-700 group-open:hidden">(اضغط لعرض الحل)</span>
              </summary>
              {ex.figure && <Figure id={ex.figure} />}
              <ol className="mt-3 space-y-2 border-s-4 border-blue-200 ps-4 leading-8 text-slate-700">
                {ex.steps.map((s, k) => (
                  <li key={k}>
                    <span className="font-bold text-blue-700">الخطوة {formatNumber(k + 1)}: </span>
                    <RichText text={s} />
                  </li>
                ))}
              </ol>
              <p className="mt-3 rounded-xl bg-emerald-50 p-3 font-bold text-emerald-900">
                الإجابة: <RichText text={ex.answer} />
              </p>
            </details>
          ))}
        </section>
      )}

      <p className="rounded-xl bg-sky-50 p-4 leading-8 text-sky-900 ring-1 ring-sky-200">
        <span className="font-extrabold">💡 نصيحة: </span>
        {plan.tip}
      </p>

      <section aria-labelledby="quiz-heading" className="space-y-3">
        <h2 id="quiz-heading" className="text-xl font-extrabold">
          📝 {plan.kind === "exam" ? "الاختبار" : "تدرّب الآن"}
        </h2>
        {completion && (
          <p className="text-sm text-slate-600">
            أنجزت هذا اليوم بنتيجة {formatNumber(completion.percent)}%. يمكنك التدرّب مرة أخرى بأسئلة جديدة، وسنحتفظ بأفضل نتيجة.
          </p>
        )}
        <QuizRunner
          key={day}
          kind={plan.kind === "exam" ? "exam" : timed ? "mini-exam" : "daily"}
          day={day}
          title={quizTitle}
          config={{ ...plan.quiz, topics: plan.topics }}
          feedback={timed ? "end" : "immediate"}
          startLabel={timed ? "ابدأ الاختبار ⏱️" : "ابدأ الأسئلة"}
          intro={
            timed
              ? "اختبار بمؤقت لتتدرب على تنظيم الوقت. ستظهر الإجابات والشروح بعد التسليم."
              : "أجب عن كل سؤال، ثم اضغط «تحقّق» لترى الشرح مباشرة. يُسجَّل اليوم منجزًا عند إنهاء الأسئلة."
          }
        />
      </section>

      <nav aria-label="التنقل بين الأيام" className="flex items-center justify-between gap-3 pt-2">
        {day > 1 ? (
          <Link href={`/day/${day - 1}/`} className="rounded-xl px-4 py-2 font-bold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50">
            → اليوم {formatNumber(day - 1)}
          </Link>
        ) : (
          <span />
        )}
        {day < TOTAL_DAYS && (
          <Link href={`/day/${day + 1}/`} className="rounded-xl px-4 py-2 font-bold text-blue-700 ring-1 ring-blue-200 hover:bg-blue-50">
            اليوم {formatNumber(day + 1)} ←
          </Link>
        )}
      </nav>
    </article>
  );
}
