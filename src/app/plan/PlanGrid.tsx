"use client";

import Link from "next/link";
import { useProgress } from "@/components/ProgressProvider";
import { TopicBadge } from "@/components/ui";
import { PLAN } from "@/data/plan";
import { formatNumber } from "@/lib/format";
import { currentDay } from "@/lib/progress";

const WEEK_TITLES: Record<number, string> = {
  1: "الأسبوع الأول: الأساسيات",
  2: "الأسبوع الثاني: توسيع المهارات",
  3: "الأسبوع الثالث: المستوى المتوسط",
  4: "الأسبوع الرابع والأيام الأخيرة: المستوى المتقدم والاستعداد",
};

const KIND_ICON = { lesson: "📘", review: "🔁", exam: "🏁" } as const;

export function PlanGrid() {
  const { state, ready } = useProgress();
  const today = ready ? currentDay(state) : 0;
  const weeks = [...new Set(PLAN.map((d) => d.week))];

  return (
    <div className="space-y-8">
      {weeks.map((week) => (
        <section key={week} aria-labelledby={`week-${week}`}>
          <h2 id={`week-${week}`} className="mb-3 text-lg font-extrabold text-slate-800">
            {WEEK_TITLES[week]}
          </h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PLAN.filter((d) => d.week === week).map((d) => {
              const completion = state.completedDays[d.day];
              const isToday = d.day === today;
              return (
                <li key={d.day}>
                  <Link
                    href={`/day/${d.day}/`}
                    className={`flex h-full flex-col gap-2 rounded-2xl bg-white p-4 shadow-sm ring-1 transition hover:-translate-y-0.5 hover:shadow ${
                      isToday ? "ring-2 ring-indigo-500" : completion ? "ring-emerald-200" : "ring-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-extrabold text-indigo-700">
                        <span aria-hidden="true">{KIND_ICON[d.kind]}</span> اليوم {formatNumber(d.day)}
                      </span>
                      {completion ? (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                          ✓ أُنجز · {formatNumber(completion.percent)}%
                        </span>
                      ) : isToday ? (
                        <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">اليوم الحالي</span>
                      ) : null}
                    </div>
                    <span className="font-bold leading-7 text-slate-800">{d.title}</span>
                    <span className="mt-auto flex flex-wrap gap-1">
                      {d.topics.length > 2 ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">كل المجالات</span>
                      ) : (
                        d.topics.map((t) => <TopicBadge key={t} topic={t} short />)
                      )}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
