"use client";

import Link from "next/link";
import { useState } from "react";
import { AttemptRow, KIND_LABELS } from "@/components/AttemptList";
import { useProgress } from "@/components/ProgressProvider";
import { QuizReport } from "@/components/QuizReport";
import { TOPIC_STYLES } from "@/components/topicStyles";
import { Card, LinkButton, LoadingCard, ProgressBar } from "@/components/ui";
import { getTopic } from "@/data/topics";
import { formatNumber } from "@/lib/format";
import { LEVEL_LABELS, strengthsAndWeaknesses, topicPerformance } from "@/lib/progress";
import type { AttemptKind } from "@/lib/types";

type Filter = "all" | AttemptKind;

export function ResultsView() {
  const { state, ready } = useProgress();
  const [filter, setFilter] = useState<Filter>("all");
  const [openId, setOpenId] = useState<string | null>(null);

  if (!ready) return <LoadingCard />;

  if (state.attempts.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-4xl" aria-hidden="true">
          📊
        </p>
        <p className="mt-2 leading-8 text-slate-600">لا توجد نتائج بعد. ابدأ أول يوم في الخطة وستظهر تقاريرك هنا.</p>
        <LinkButton href="/day/1/" className="mt-4">
          ابدأ اليوم الأول
        </LinkButton>
      </Card>
    );
  }

  const perf = topicPerformance(state);
  const { strengths, toImprove } = strengthsAndWeaknesses(perf);
  const attempts = [...state.attempts].reverse().filter((a) => filter === "all" || a.kind === filter);

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-lg font-extrabold">التقرير العام</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-emerald-50 p-4 ring-1 ring-emerald-200">
            <h3 className="font-extrabold text-emerald-900">💪 نقاط القوة</h3>
            {strengths.length ? (
              <ul className="mt-2 space-y-1 text-sm">
                {strengths.map((p) => (
                  <li key={p.topic}>
                    • {getTopic(p.topic).name} ({formatNumber(p.percent)}%)
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-emerald-900">تحتاج إلى مزيد من الإجابات لتحديد نقاط القوة بدقة. استمر بالتدريب!</p>
            )}
          </div>
          <div className="rounded-xl bg-amber-50 p-4 ring-1 ring-amber-200">
            <h3 className="font-extrabold text-amber-900">🌱 مواضيع تحتاج إلى تحسين</h3>
            {toImprove.length ? (
              <ul className="mt-2 space-y-2 text-sm">
                {toImprove.map((p) => (
                  <li key={p.topic} className="flex items-center justify-between gap-2">
                    <span>
                      • {getTopic(p.topic).name} ({formatNumber(p.percent)}%)
                    </span>
                    <Link href={`/practice/?topic=${p.topic}`} className="font-bold text-blue-700 hover:underline">
                      تدرّب
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-amber-900">لا توجد مجالات ضعيفة حاليًا. رائع!</p>
            )}
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {perf.map((p) => {
            const t = getTopic(p.topic);
            return (
              <li key={p.topic}>
                <div className="mb-1 flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="font-bold">
                    <span aria-hidden="true">{t.icon}</span> {t.name}
                  </span>
                  <span className="text-slate-600">
                    {LEVEL_LABELS[p.level]}
                    {p.total > 0 && ` · ${formatNumber(p.correct)}/${formatNumber(p.total)}`}
                  </span>
                </div>
                <ProgressBar value={p.percent} barClass={TOPIC_STYLES[t.color].bar} label={t.name} />
              </li>
            );
          })}
        </ul>
      </Card>

      <Card>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-extrabold">سجل الاختبارات ({formatNumber(state.attempts.length)})</h2>
          <label className="flex items-center gap-2 text-sm">
            <span>عرض:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as Filter)}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1.5"
            >
              <option value="all">الكل</option>
              {(Object.keys(KIND_LABELS) as AttemptKind[]).map((k) => (
                <option key={k} value={k}>
                  {KIND_LABELS[k]}
                </option>
              ))}
            </select>
          </label>
        </div>
        {attempts.length === 0 ? (
          <p className="text-slate-600">لا توجد نتائج من هذا النوع.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {attempts.map((a) => (
              <li key={a.id} className="py-3">
                <button
                  type="button"
                  className="w-full rounded-lg text-start hover:bg-slate-50"
                  aria-expanded={openId === a.id}
                  onClick={() => setOpenId(openId === a.id ? null : a.id)}
                >
                  <AttemptRow attempt={a} />
                  <span className="mt-1 block text-xs font-bold text-blue-700">
                    {openId === a.id ? "إخفاء التفاصيل ▲" : "عرض التقرير ومراجعة الأخطاء ▼"}
                  </span>
                </button>
                {openId === a.id && (
                  <div className="mt-4">
                    <QuizReport attempt={a} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
