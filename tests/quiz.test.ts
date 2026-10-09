import { describe, expect, it } from "vitest";
import { QUESTION_BANK } from "@/data/questions";
import { TOPIC_IDS } from "@/data/topics";
import { buildAttempt, encouragement, percent, prepareQuestions, scoreByTopic, selectQuestions } from "@/lib/quiz";
import { createRng, shuffle } from "@/lib/random";

describe("المولّد العشوائي", () => {
  it("قابل للتكرار بالبذرة نفسها", () => {
    const a = createRng(42);
    const b = createRng(42);
    for (let i = 0; i < 10; i++) expect(a()).toBe(b());
  });

  it("الخلط لا يغيّر العناصر ولا يعدّل الأصل", () => {
    const src = [1, 2, 3, 4, 5, 6];
    const out = shuffle(src, createRng(1));
    expect([...out].sort()).toEqual(src);
    expect(src).toEqual([1, 2, 3, 4, 5, 6]);
  });
});

describe("اختيار الأسئلة", () => {
  it("لا يكرر السؤال نفسه داخل الاختبار", () => {
    for (let seed = 0; seed < 50; seed++) {
      const qs = selectQuestions({
        pool: QUESTION_BANK,
        count: 30,
        topics: TOPIC_IDS,
        difficulties: [1, 2, 3],
        rng: createRng(seed),
      });
      expect(qs.length).toBe(30);
      expect(new Set(qs.map((q) => q.id)).size).toBe(30);
    }
  });

  it("يوزّع الأسئلة بالتساوي بين المجالات", () => {
    const qs = selectQuestions({
      pool: QUESTION_BANK,
      count: 30,
      topics: TOPIC_IDS,
      difficulties: [1, 2, 3],
      rng: createRng(7),
    });
    for (const t of TOPIC_IDS) expect(qs.filter((q) => q.topic === t).length).toBe(5);
  });

  it("يلتزم بالمجال والمستوى المطلوبين", () => {
    const qs = selectQuestions({
      pool: QUESTION_BANK,
      count: 6,
      topics: ["logic"],
      difficulties: [1],
      rng: createRng(3),
    });
    expect(qs.length).toBe(6);
    expect(qs.every((q) => q.topic === "logic" && q.difficulty === 1)).toBe(true);
  });

  it("يكمل من مستويات أخرى في المجال نفسه إذا لم تكفِ الأسئلة", () => {
    const qs = selectQuestions({
      pool: QUESTION_BANK,
      count: 15,
      topics: ["patterns"],
      difficulties: [3],
      rng: createRng(5),
    });
    expect(qs.length).toBe(15);
    expect(qs.every((q) => q.topic === "patterns")).toBe(true);
    expect(new Set(qs.map((q) => q.id)).size).toBe(15);
  });

  it("يفضّل الأسئلة التي لم تظهر من قبل", () => {
    const pool = QUESTION_BANK.filter((q) => q.topic === "verbal" && q.difficulty === 1);
    const seen = Object.fromEntries(pool.slice(0, 4).map((q) => [q.id, 3]));
    const qs = selectQuestions({ pool, count: pool.length - 4, topics: ["verbal"], difficulties: [1], seen, rng: createRng(9) });
    for (const q of qs) expect(seen[q.id]).toBeUndefined();
  });

  it("يرتّب الأسئلة من الأسهل إلى الأصعب", () => {
    const qs = selectQuestions({ pool: QUESTION_BANK, count: 18, topics: TOPIC_IDS, difficulties: [1, 2, 3], rng: createRng(11) });
    for (let i = 1; i < qs.length; i++) expect(qs[i].difficulty).toBeGreaterThanOrEqual(qs[i - 1].difficulty);
  });
});

describe("خلط الخيارات وحساب النتيجة", () => {
  it("خلط الخيارات يحافظ على كل الخيارات", () => {
    const prepared = prepareQuestions(QUESTION_BANK.slice(0, 20), createRng(1));
    for (const p of prepared) {
      expect([...p.order].sort()).toEqual(p.question.options.map((_, i) => i));
    }
  });

  it("يحسب النتيجة والنسبة والمجالات", () => {
    const questions = QUESTION_BANK.filter((q) => q.topic === "logic").slice(0, 4);
    const answers = [questions[0].answer, (questions[1].answer + 1) % questions[1].options.length, null, questions[3].answer];
    const attempt = buildAttempt({
      id: "t1",
      kind: "practice",
      title: "اختبار",
      questions,
      answers,
      startedAt: new Date("2026-01-01T10:00:00Z"),
      finishedAt: new Date("2026-01-01T10:05:30Z"),
    });
    expect(attempt.correct).toBe(2);
    expect(attempt.total).toBe(4);
    expect(attempt.durationSec).toBe(330);
    expect(attempt.items[2].chosen).toBeNull();
    expect(attempt.items[2].correct).toBe(false);
    expect(percent(attempt.correct, attempt.total)).toBe(50);
    expect(scoreByTopic(attempt.items)).toEqual([{ topic: "logic", correct: 2, total: 4, percent: 50 }]);
  });

  it("رسائل تشجيعية لكل المستويات", () => {
    for (const p of [0, 30, 50, 70, 100]) {
      const m = encouragement(p);
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.message.length).toBeGreaterThan(0);
    }
  });
});
