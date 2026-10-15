"use client";

import { useState } from "react";
import { QuizRunner } from "@/components/QuizRunner";
import { Button, Card, Notice } from "@/components/ui";
import { ARITHMETIC_QUESTIONS, SHAPE_QUESTIONS } from "@/data/questions";
import { TOPIC_IDS } from "@/data/topics";
import { formatNumber, questionsCount } from "@/lib/format";
import type { AttemptKind, Difficulty, Question } from "@/lib/types";

interface ExamType {
  id: string;
  kind: AttemptKind;
  title: string;
  description: string;
  icon: string;
  count: number;
  minutes: number;
  difficulties: Difficulty[];
  pool?: readonly Question[];
}

export const EXAM_TYPES: ExamType[] = [
  {
    id: "mini",
    kind: "mini-exam",
    title: "اختبار قصير شامل",
    description: "3 أسئلة من كل مجال بمستويات متدرجة. مناسب للتدريب السريع.",
    icon: "⚡",
    count: 18,
    minutes: 22,
    difficulties: [1, 2, 3],
  },
  {
    id: "full",
    kind: "exam",
    title: "اختبار شامل كامل",
    description: "5 أسئلة من كل مجال بمستويات متدرجة. يحاكي أجواء اختبار طويل.",
    icon: "🏁",
    count: 30,
    minutes: 40,
    difficulties: [1, 2, 3],
  },
  {
    id: "shapes",
    kind: "mini-exam",
    title: "اختبار الأشكال",
    description: "أسئلة مرسومة فقط: سلاسل وجداول أشكال، ودوران ومرايا، وطيّ ورق، وشبكات مكعّب.",
    icon: "🔷",
    count: 20,
    minutes: 25,
    difficulties: [1, 2, 3],
    pool: SHAPE_QUESTIONS,
  },
  {
    id: "arith",
    kind: "mini-exam",
    title: "اختبار المسائل الحسابية",
    description: "على نمط قسم المسائل الحسابية: العملية الجديدة، والرقم المخفي، والمواعيد، والصعود والانزلاق، والتقدير، والقصّ.",
    icon: "🧮",
    count: 15,
    minutes: 20,
    difficulties: [1, 2, 3],
    pool: ARITHMETIC_QUESTIONS,
  },
];

export function ExamCenter() {
  const [active, setActive] = useState<{ type: ExamType; key: number } | null>(null);

  if (active) {
    return (
      <QuizRunner
        key={active.key}
        kind={active.type.kind}
        title={active.type.title}
        config={{
          count: active.type.count,
          topics: active.type.pool ? [...new Set(active.type.pool.map((q) => q.topic))] : TOPIC_IDS,
          difficulties: active.type.difficulties,
          timeLimitMinutes: active.type.minutes,
          pool: active.type.pool,
        }}
        feedback="end"
        autoStart
        onExit={() => setActive(null)}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        {EXAM_TYPES.map((t) => (
          <Card key={t.id} className="flex flex-col">
            <div className="text-4xl" aria-hidden="true">
              {t.icon}
            </div>
            <h2 className="mt-2 text-xl font-extrabold">{t.title}</h2>
            <p className="mt-1 leading-7 text-slate-600">{t.description}</p>
            <ul className="mt-3 mb-5 space-y-1 text-sm text-slate-600">
              <li>📝 {questionsCount(t.count)}</li>
              <li>⏱️ {formatNumber(t.minutes)} دقيقة</li>
              <li>💬 الإجابات والشروح والتقرير بعد التسليم</li>
            </ul>
            <Button className="mt-auto self-start" onClick={() => setActive({ type: t, key: Date.now() })}>
              ابدأ الاختبار
            </Button>
          </Card>
        ))}
      </div>
      <Notice>
        <b>ملاحظة مهمة:</b> هذه اختبارات تدريبية من إعداد المنصة. عدد الأسئلة والوقت وأنواع الأسئلة لا تمثّل بالضرورة
        الامتحان الرسمي لبرامج الموهوبين، ولا تتنبأ بنتيجته. للمعلومات الرسمية والمحدّثة عن الامتحان راجع المدرسة أو
        الجهات المسؤولة في وزارة التربية والتعليم.
      </Notice>
    </div>
  );
}
