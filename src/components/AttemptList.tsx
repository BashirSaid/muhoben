"use client";

import { percent } from "@/lib/quiz";
import { formatDateTime, formatNumber } from "@/lib/format";
import type { AttemptKind, QuizAttempt } from "@/lib/types";

export const KIND_LABELS: Record<AttemptKind, string> = {
  daily: "تدريب يومي",
  practice: "تدريب حر",
  "mini-exam": "اختبار قصير",
  exam: "اختبار شامل",
};

export function scoreColor(pct: number) {
  if (pct >= 85) return "bg-emerald-100 text-emerald-800";
  if (pct >= 65) return "bg-sky-100 text-sky-800";
  if (pct >= 40) return "bg-amber-100 text-amber-900";
  return "bg-slate-100 text-slate-700";
}

export function AttemptRow({ attempt }: { attempt: QuizAttempt }) {
  const pct = percent(attempt.correct, attempt.total);
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="truncate font-bold text-slate-800">{attempt.title}</div>
        <div className="text-xs text-slate-500">
          {KIND_LABELS[attempt.kind]} · {formatDateTime(attempt.finishedAt)}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm text-slate-500">
          {formatNumber(attempt.correct)}/{formatNumber(attempt.total)}
        </span>
        <span className={`rounded-lg px-2 py-1 text-sm font-extrabold ${scoreColor(pct)}`}>{formatNumber(pct)}%</span>
      </div>
    </div>
  );
}
