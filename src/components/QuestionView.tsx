"use client";

import type { Question } from "@/lib/types";
import { RichText } from "./RichText";
import { Figure } from "./figures";
import { DifficultyBadge, TopicBadge } from "./ui";

export const OPTION_LETTERS = ["أ", "ب", "ج", "د", "هـ", "و"];

interface Props {
  question: Question;
  /** ترتيب عرض الخيارات (أرقام الخيارات الأصلية) */
  order: number[];
  number: number;
  total: number;
  /** رقم الخيار الأصلي المختار */
  selected: number | null;
  onSelect?: (original: number) => void;
  /** إظهار الإجابة الصحيحة والشرح */
  revealed: boolean;
}

export function QuestionView({ question, order, number, total, selected, onSelect, revealed }: Props) {
  const groupId = `q-${question.id}`;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
        <span className="font-bold text-slate-500">
          السؤال {number} من {total}
        </span>
        <TopicBadge topic={question.topic} short />
        <DifficultyBadge difficulty={question.difficulty} />
      </div>

      <p id={`${groupId}-prompt`} className="text-lg leading-9 font-bold text-slate-900 sm:text-xl">
        <RichText text={question.prompt} />
      </p>

      {question.figure && <Figure id={question.figure} />}

      <div role="radiogroup" aria-labelledby={`${groupId}-prompt`} className="mt-4 grid gap-3 sm:grid-cols-2">
        {order.map((original, displayIdx) => {
          const isSelected = selected === original;
          const isCorrect = original === question.answer;
          let cls = "bg-white ring-slate-300 hover:ring-indigo-400 hover:bg-indigo-50/40";
          if (revealed) {
            if (isCorrect) cls = "bg-emerald-50 ring-emerald-500 ring-2";
            else if (isSelected) cls = "bg-rose-50 ring-rose-400 ring-2";
            else cls = "bg-white ring-slate-200 opacity-70";
          } else if (isSelected) {
            cls = "bg-indigo-50 ring-indigo-500 ring-2";
          }
          return (
            <button
              key={original}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={revealed || !onSelect}
              onClick={() => onSelect?.(original)}
              className={`flex min-h-14 items-center gap-3 rounded-xl px-4 py-3 text-start text-base ring-1 transition disabled:cursor-default ${cls}`}
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm font-extrabold ${
                  isSelected ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700"
                }`}
                aria-hidden="true"
              >
                {OPTION_LETTERS[displayIdx]}
              </span>
              <span className="flex-1 font-semibold text-slate-800">
                <RichText text={question.options[original]} />
              </span>
              {revealed && isCorrect && <span aria-label="الإجابة الصحيحة">✅</span>}
              {revealed && isSelected && !isCorrect && <span aria-label="إجابتك">❌</span>}
            </button>
          );
        })}
      </div>

      {revealed && <Explanation question={question} selected={selected} />}
    </div>
  );
}

export function Explanation({ question, selected }: { question: Question; selected: number | null }) {
  const correct = selected === question.answer;
  return (
    <div
      className={`mt-4 rounded-xl p-4 leading-8 ring-1 ${
        correct ? "bg-emerald-50 ring-emerald-200" : "bg-amber-50 ring-amber-200"
      }`}
      role="status"
    >
      <p className="font-extrabold">
        {selected === null
          ? "لم تُجب عن هذا السؤال."
          : correct
            ? "إجابة صحيحة! 🎉"
            : "ليست الإجابة الصحيحة هذه المرة — لا بأس، لنفهم الحل:"}
      </p>
      <p className="mt-1 text-slate-800">
        <span className="font-bold">الإجابة الصحيحة: </span>
        <RichText text={question.options[question.answer]} />
      </p>
      <p className="mt-1 text-slate-800">
        <span className="font-bold">الشرح: </span>
        <RichText text={question.explanation} />
      </p>
    </div>
  );
}
