import { describe, expect, it } from "vitest";
import { QUESTION_BANK } from "@/data/questions";
import { TOPIC_IDS } from "@/data/topics";
import { FIGURE_IDS } from "@/components/figures/ids";

describe("بنك الأسئلة", () => {
  it("يحتوي على عدد كافٍ من الأسئلة في كل مجال وكل مستوى", () => {
    for (const topic of TOPIC_IDS) {
      const inTopic = QUESTION_BANK.filter((q) => q.topic === topic);
      expect(inTopic.length, topic).toBeGreaterThanOrEqual(20);
      for (const d of [1, 2, 3] as const) {
        expect(inTopic.filter((q) => q.difficulty === d).length, `${topic}/${d}`).toBeGreaterThanOrEqual(6);
      }
    }
  });

  it("معرّفات الأسئلة فريدة", () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("كل سؤال سليم البنية", () => {
    for (const q of QUESTION_BANK) {
      expect(q.prompt.trim().length, q.id).toBeGreaterThan(5);
      expect(q.explanation.trim().length, q.id).toBeGreaterThan(5);
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(3);
      expect(q.options.length, q.id).toBeLessThanOrEqual(5);
      expect(Number.isInteger(q.answer), q.id).toBe(true);
      expect(q.answer, q.id).toBeGreaterThanOrEqual(0);
      expect(q.answer, q.id).toBeLessThan(q.options.length);
      // لا توجد خيارات مكررة
      expect(new Set(q.options.map((o) => o.trim())).size, q.id).toBe(q.options.length);
      // علامات $ للتعابير الرياضية متوازنة
      for (const text of [q.prompt, q.explanation, ...q.options]) {
        expect((text.match(/\$/g) ?? []).length % 2, `${q.id}: ${text}`).toBe(0);
      }
      if (q.figure) expect(FIGURE_IDS, q.id).toContain(q.figure);
    }
  });

  it("كل الأسئلة أصلية من إعداد المنصة (مفصولة عن أي مواد رسمية)", () => {
    for (const q of QUESTION_BANK) expect(q.source.kind, q.id).toBe("original");
  });

  it("لا تُنسب أي أسئلة إلى الوزارة", () => {
    for (const q of QUESTION_BANK) {
      const all = [q.prompt, q.explanation, ...q.options].join(" ");
      expect(all, q.id).not.toMatch(/وزارة|رسمي/);
    }
  });

  it("الإجابات الصحيحة موزّعة على مواقع مختلفة (لا نمط ثابت)", () => {
    const positions = new Set(QUESTION_BANK.map((q) => q.answer));
    expect(positions.size).toBeGreaterThanOrEqual(3);
  });
});
