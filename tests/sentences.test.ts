import { describe, expect, it } from "vitest";
import { SENTENCE_QUESTIONS } from "@/data/questions";

describe("إكمال الجمل", () => {
  it("40 جملة: 15 بفراغين، و15 بثلاثة، و10 بفراغ واحد", () => {
    expect(SENTENCE_QUESTIONS.length).toBe(40);
    const blanks = SENTENCE_QUESTIONS.map((q) => (q.prompt.match(/______/g) ?? []).length);
    expect(blanks.filter((b) => b === 2).length).toBe(15);
    expect(blanks.filter((b) => b === 3).length).toBe(15);
    expect(blanks.filter((b) => b === 1).length).toBe(10);
  });

  it("عدد كلمات كل خيار يساوي عدد الفراغات، والخيارات مختلفة", () => {
    for (const q of SENTENCE_QUESTIONS) {
      const blanks = (q.prompt.match(/______/g) ?? []).length;
      expect(new Set(q.options).size, q.id).toBe(4);
      for (const o of q.options) expect(o.split(" / ").length, `${q.id}: ${o}`).toBe(blanks);
      expect(q.topic).toBe("verbal");
    }
  });

  it("الخيارات الخاطئة تشارك الصحيح في كلمة واحدة على الأقل في الأسئلة متعددة الفراغات (فخ نصف الصحيح)", () => {
    for (const q of SENTENCE_QUESTIONS.filter((x) => x.options[0].includes(" / "))) {
      const right = q.options[q.answer].split(" / ");
      for (const [i, o] of q.options.entries()) {
        if (i === q.answer) continue;
        const parts = o.split(" / ");
        expect(parts.some((p, k) => p === right[k]), `${q.id}: ${o}`).toBe(true);
      }
    }
  });

  it("مواضع الإجابات الصحيحة موزعة على الخيارات الأربعة", () => {
    const counts = [0, 0, 0, 0];
    for (const q of SENTENCE_QUESTIONS) counts[q.answer]++;
    for (const c of counts) expect(c).toBeGreaterThanOrEqual(6);
  });
});
