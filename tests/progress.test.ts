import { describe, expect, it } from "vitest";
import { QUESTION_BANK } from "@/data/questions";
import { buildAttempt } from "@/lib/quiz";
import {
  applyAttempt,
  completedDayCount,
  currentDay,
  levelFor,
  planCompletionPercent,
  streakDays,
  strengthsAndWeaknesses,
  suggestions,
  topicPerformance,
  totalAnswered,
} from "@/lib/progress";
import { MAX_ATTEMPTS, MemoryRepository, emptyState, parseState } from "@/lib/storage";
import type { Question } from "@/lib/types";

function attemptFor(questions: Question[], correctCount: number, opts: { day?: number; id?: string; at?: string } = {}) {
  const at = new Date(opts.at ?? "2026-03-01T10:00:00Z");
  return buildAttempt({
    id: opts.id ?? Math.random().toString(36),
    kind: opts.day ? "daily" : "practice",
    title: "t",
    day: opts.day,
    questions,
    answers: questions.map((q, i) => (i < correctCount ? q.answer : (q.answer + 1) % q.options.length)),
    startedAt: at,
    finishedAt: new Date(at.getTime() + 60_000),
  });
}

const logic = QUESTION_BANK.filter((q) => q.topic === "logic").slice(0, 6);
const spatial = QUESTION_BANK.filter((q) => q.topic === "spatial").slice(0, 6);

describe("حساب التقدّم", () => {
  it("حالة جديدة تبدأ من اليوم الأول", () => {
    const s = emptyState();
    expect(currentDay(s)).toBe(1);
    expect(planCompletionPercent(s)).toBe(0);
    expect(totalAnswered(s)).toBe(0);
  });

  it("إنهاء اختبار يوم يجعله منجزًا وينقل إلى اليوم التالي", () => {
    let s = emptyState();
    s = applyAttempt(s, attemptFor(logic, 4, { day: 1 }));
    expect(completedDayCount(s)).toBe(1);
    expect(currentDay(s)).toBe(2);
    expect(s.completedDays[1].percent).toBe(67);
    expect(totalAnswered(s)).toBe(6);
    expect(Object.keys(s.seen).length).toBe(6);
  });

  it("يحتفظ بأفضل نتيجة لليوم", () => {
    let s = emptyState();
    s = applyAttempt(s, attemptFor(logic, 5, { day: 1, id: "a" }));
    s = applyAttempt(s, attemptFor(logic, 2, { day: 1, id: "b" }));
    expect(s.completedDays[1].attemptId).toBe("a");
    expect(s.attempts.length).toBe(2);
  });

  it("التدريب الحر لا يُنجز أيامًا", () => {
    const s = applyAttempt(emptyState(), attemptFor(logic, 6));
    expect(completedDayCount(s)).toBe(0);
  });

  it("اليوم الحالي هو أول يوم غير منجز", () => {
    let s = emptyState();
    s = applyAttempt(s, attemptFor(logic, 3, { day: 1 }));
    s = applyAttempt(s, attemptFor(logic, 3, { day: 3 }));
    expect(currentDay(s)).toBe(2);
  });

  it("يحدد نقاط القوة والضعف ومستوى كل مجال", () => {
    let s = emptyState();
    s = applyAttempt(s, attemptFor(logic, 6));
    s = applyAttempt(s, attemptFor(spatial, 1));
    const perf = topicPerformance(s);
    expect(perf.find((p) => p.topic === "logic")!.level).toBe("excellent");
    expect(perf.find((p) => p.topic === "spatial")!.level).toBe("needs-practice");
    expect(perf.find((p) => p.topic === "verbal")!.level).toBe("not-started");
    const { strengths, toImprove } = strengthsAndWeaknesses(perf);
    expect(strengths.map((p) => p.topic)).toEqual(["logic"]);
    expect(toImprove.map((p) => p.topic)).toEqual(["spatial"]);
    // الاقتراحات تتضمن اليوم التالي وتدريبًا في المجال الأضعف
    const sug = suggestions(s);
    expect(sug[0].href).toBe("/day/1/");
    expect(sug.some((x) => x.href.includes("topic=spatial"))).toBe(true);
  });

  it("مستويات الأداء", () => {
    expect(levelFor(0, 0)).toBe("not-started");
    expect(levelFor(9, 10)).toBe("excellent");
    expect(levelFor(7, 10)).toBe("very-good");
    expect(levelFor(5, 10)).toBe("good");
    expect(levelFor(2, 10)).toBe("needs-practice");
  });

  it("يحسب أيام التدريب المتتالية", () => {
    let s = emptyState();
    s = applyAttempt(s, attemptFor(logic, 3, { at: "2026-03-01T10:00:00" }));
    s = applyAttempt(s, attemptFor(logic, 3, { at: "2026-03-02T10:00:00" }));
    s = applyAttempt(s, attemptFor(logic, 3, { at: "2026-03-03T10:00:00" }));
    expect(streakDays(s, new Date("2026-03-03T20:00:00"))).toBe(3);
    expect(streakDays(s, new Date("2026-03-04T08:00:00"))).toBe(3);
    expect(streakDays(s, new Date("2026-03-06T08:00:00"))).toBe(0);
  });

  it("يحدّ عدد المحاولات المحفوظة", () => {
    let s = emptyState();
    for (let i = 0; i < MAX_ATTEMPTS + 5; i++) s = applyAttempt(s, attemptFor(logic.slice(0, 1), 1, { id: `x${i}` }));
    expect(s.attempts.length).toBe(MAX_ATTEMPTS);
    expect(s.attempts.at(-1)!.id).toBe(`x${MAX_ATTEMPTS + 4}`);
  });
});

describe("التخزين", () => {
  it("يرفض البيانات التالفة ويعيد حالة فارغة", () => {
    expect(parseState(null).attempts).toEqual([]);
    expect(parseState({ version: 2 }).attempts).toEqual([]);
    expect(parseState("text").completedDays).toEqual({});
  });

  it("يحفظ ويستعيد الحالة", () => {
    const repo = new MemoryRepository();
    const s = applyAttempt(emptyState(), attemptFor(logic, 3, { day: 1 }));
    repo.save(s);
    expect(repo.load()).toEqual(s);
    expect(parseState(JSON.parse(JSON.stringify(s)))).toEqual(s);
    repo.clear();
    expect(repo.load().attempts).toEqual([]);
  });

  it("الحالة لا تحتوي حقولًا لبيانات شخصية", () => {
    const keys = Object.keys(emptyState()).sort();
    expect(keys).toEqual(["attempts", "completedDays", "createdAt", "seen", "version"]);
  });
});
