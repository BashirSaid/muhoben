"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { AttemptRow } from "@/components/AttemptList";
import { TOPIC_STYLES } from "@/components/topicStyles";
import { Card, LoadingCard, ProgressBar, ProgressRing, StatCard } from "@/components/ui";
import { getDay, TOTAL_DAYS } from "@/data/plan";
import { getTopic } from "@/data/topics";
import { formatNumber } from "@/lib/format";
import {
  LEVEL_LABELS,
  completedDayCount,
  currentDay,
  planCompletionPercent,
  streakDays,
  suggestions,
  topicPerformance,
  totalAnswered,
  totalCorrect,
} from "@/lib/progress";
import { percent } from "@/lib/quiz";

export default function DashboardPage() {
  const { state, ready } = useProgress();

  if (!ready) {
    return (
      <div className="space-y-4">
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  const day = currentDay(state);
  const plan = getDay(day)!;
  const done = completedDayCount(state);
  const allDone = done >= TOTAL_DAYS;
  const answered = totalAnswered(state);
  const accuracy = percent(totalCorrect(state), state.attempts.reduce((s, a) => s + a.total, 0));
  const perf = topicPerformance(state);
  const recent = [...state.attempts].reverse().slice(0, 5);
  const isNew = state.attempts.length === 0;
  const streak = streakDays(state);

  return (
    <div className="space-y-6">
      {/* بطاقة اليوم الحالي */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-l from-blue-700 to-sky-500 p-6 text-white shadow-lg sm:p-8">
        <p className="text-sm font-bold text-sky-100">
          {isNew ? "أهلًا بك! 👋" : allDone ? "أنهيت الخطة كاملة! 🏆" : "مرحبًا من جديد! 👋"}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
          {allDone ? "أحسنت! أكملت 30 يومًا من التدريب" : `اليوم ${formatNumber(day)} من ${formatNumber(TOTAL_DAYS)}`}
        </h1>
        {!allDone && <p className="mt-2 text-lg text-blue-50">{plan.title}</p>}
        {isNew && (
          <p className="mt-3 max-w-2xl leading-8 text-blue-50">
            برنامج من 30 يومًا لتقوية التفكير المنطقي، والأنماط، واللغة، والتفكير الكمي، والأشكال، وحل المشكلات. كل يوم: درس قصير، وأمثلة محلولة، وأسئلة تدريبية مع شرح.
          </p>
        )}
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href={allDone ? "/exam/" : `/day/${day}/`}
            className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-2.5 font-extrabold text-blue-700 shadow hover:bg-blue-50"
          >
            {allDone ? "اختبار شامل جديد" : isNew ? "ابدأ اليوم الأول ←" : "تابع درس اليوم ←"}
          </Link>
          <Link href="/plan/" className="inline-flex min-h-11 items-center rounded-xl px-5 py-2.5 font-bold text-white ring-1 ring-white/50 hover:bg-white/10">
            عرض الخطة كاملة
          </Link>
        </div>
      </section>

      {/* الإحصاءات */}
      <section aria-label="ملخص التقدّم" className="grid gap-4 md:grid-cols-[auto_1fr]">
        <Card className="flex flex-col items-center justify-center gap-2 text-center">
          <ProgressRing value={planCompletionPercent(state)} label="إنجاز الخطة" />
          <p className="text-sm text-slate-600">
            أنجزت {formatNumber(done)} من {formatNumber(TOTAL_DAYS)} يومًا
          </p>
        </Card>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard icon="📝" label="سؤالًا أجبت عنها" value={formatNumber(answered)} />
          <StatCard icon="✅" label="نسبة الإجابات الصحيحة" value={answered ? `${formatNumber(accuracy)}%` : "—"} />
          <StatCard icon="🧪" label="اختبارات وتدريبات" value={formatNumber(state.attempts.length)} />
          <StatCard icon="🔥" label="أيام تدريب متتالية" value={formatNumber(streak)} />
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* الدروس المقترحة */}
        <Card>
          <h2 className="mb-3 text-lg font-extrabold">الخطوات المقترحة لك</h2>
          <ul className="space-y-2">
            {suggestions(state).map((s) => (
              <li key={s.href + s.title}>
                <Link
                  href={s.href}
                  className="flex items-center gap-3 rounded-xl p-3 ring-1 ring-slate-200 transition hover:bg-blue-50 hover:ring-blue-200"
                >
                  <span className="text-2xl" aria-hidden="true">
                    {s.icon}
                  </span>
                  <span>
                    <span className="block font-bold text-slate-800">{s.title}</span>
                    <span className="block text-sm text-slate-500">{s.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        {/* نتائج سابقة */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-extrabold">آخر النتائج</h2>
            {recent.length > 0 && (
              <Link href="/results/" className="text-sm font-bold text-blue-700 hover:underline">
                كل النتائج
              </Link>
            )}
          </div>
          {recent.length === 0 ? (
            <p className="leading-8 text-slate-600">لم تُجرِ أي اختبار بعد. نتائجك ستظهر هنا بعد أول تدريب.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((a) => (
                <li key={a.id} className="py-2.5">
                  <AttemptRow attempt={a} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* المستوى في كل مجال */}
      <Card>
        <h2 className="mb-1 text-lg font-extrabold">مستواك في كل مجال</h2>
        <p className="mb-4 text-sm text-slate-500">يُحسب من آخر إجاباتك في كل مجال، ويتحدّث كلما تدرّبت.</p>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perf.map((p) => {
            const t = getTopic(p.topic);
            const st = TOPIC_STYLES[t.color];
            return (
              <li key={p.topic} className={`rounded-xl p-4 ring-1 ${st.soft} ${st.ring}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold">
                    <span aria-hidden="true">{t.icon}</span> {t.shortName}
                  </span>
                  <span className={`text-sm font-bold ${st.text}`}>{LEVEL_LABELS[p.level]}</span>
                </div>
                <ProgressBar className="mt-3 bg-white" value={p.percent} barClass={st.bar} label={t.name} />
                <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                  <span>{p.total ? `${formatNumber(p.correct)} صحيحة من ${formatNumber(p.total)}` : "لا توجد إجابات بعد"}</span>
                  <Link href={`/practice/?topic=${p.topic}`} className="font-bold text-blue-700 hover:underline">
                    تدرّب
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      {isNew && (
        <p className="text-center text-sm text-slate-500">
          💾 يُحفظ تقدّمك في متصفح هذا الجهاز فقط ولا يُرسل إلى أي خادم.{" "}
          <Link href="/about/" className="underline">
            اعرف المزيد
          </Link>
        </p>
      )}
    </div>
  );
}
