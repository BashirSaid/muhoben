import { describe, expect, it } from "vitest";
import { ARITHMETIC_QUESTIONS } from "@/data/questions";
import { ARITHMETIC_DATA, arithmeticProblemSolving, arithmeticQuantitative } from "@/data/questions/arithmetic";

const all = [...arithmeticQuantitative, ...arithmeticProblemSolving];

describe("المسائل الحسابية على نمط الامتحان", () => {
  it("40 سؤالًا جديدًا، و80 سؤالًا في قسم المسائل الحسابية مع أسئلة العملية الجديدة", () => {
    expect(all.length).toBe(40);
    expect(ARITHMETIC_QUESTIONS.length).toBe(80);
    expect(new Set(ARITHMETIC_QUESTIONS.map((q) => q.id)).size).toBe(80);
    for (const q of all) {
      expect(q.options.length, q.id).toBe(4);
      expect(new Set(q.options).size, q.id).toBe(4);
    }
    expect(new Set(all.map((q) => q.answer)).size).toBe(4);
  });

  it("الرقم المخفي: لكل تمرين حل واحد فقط، وهو الإجابة الصحيحة", () => {
    for (const q of all.filter((x) => x.prompt.includes("△"))) {
      const eq = q.prompt.match(/\$(.+)\$/)![1];
      const sols = ARITHMETIC_DATA.digitSolutions(eq);
      expect(sols, q.id).toEqual([Number(q.options[q.answer])]);
    }
  });

  it("الصعود والانزلاق: الإجابة تطابق محاكاة يومًا بيوم", () => {
    const simulate = (h: number, up: number, down: number) => {
      let pos = 0;
      for (let day = 1; day < 1000; day++) {
        pos += up;
        if (pos >= h) return day;
        pos -= down;
      }
      return -1;
    };
    for (const q of all.filter((x) => x.prompt.includes("ينزلق"))) {
      const [h, up, down] = (q.prompt.match(/\d+/g) ?? []).map(Number);
      expect(q.options[q.answer], q.id).toBe(`في اليوم ${simulate(h, up, down)}`);
      expect(ARITHMETIC_DATA.climbDays({ who: "", where: "", unit: "", up, down, height: h })).toBe(simulate(h, up, down));
    }
  });

  it("القصّ: العدد الصحيح يساوي الحد الأعلى من المساحة (فهو الأكبر فعلًا)", () => {
    for (const q of all.filter((x) => x.prompt.includes("تقصّ"))) {
      const [W, H, a, b] = (q.prompt.match(/\d+/g) ?? []).map(Number);
      const best = ARITHMETIC_DATA.bestCut({ thing: "", board: "", W, H, a, b }).count;
      expect(best, q.id).toBe(Math.floor((W * H) / (a * b)));
      expect(q.options[q.answer], q.id).toMatch(new RegExp(`^${best} |قطعتان|واحدة`));
    }
  });
});
