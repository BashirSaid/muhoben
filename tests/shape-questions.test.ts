import { describe, expect, it } from "vitest";
import { QUESTION_BANK, SHAPE_QUESTIONS } from "@/data/questions";
import { patternShapeQuestions, spatialShapeQuestions, SHAPE_SETS } from "@/data/questions/shapes";
import { complement, intersect, mirror, rot180, rot270, rot90, union, xor } from "@/data/questions/shapes/kit";
import type { Glyph } from "@/lib/types";

const shapeQs = [...patternShapeQuestions, ...spatialShapeQuestions];
const key = (g: Glyph) => JSON.stringify({ ...g, rotate: (g.rotate ?? 0) % 360 });
const sameSet = (a: number[], b: number[]) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
const rotations = (s: number[]) => [s, rot90(s), rot180(s), rot270(s)];

describe("أدوات الشبكات", () => {
  it("الدوران والانعكاس صحيحان", () => {
    expect(rot90([0])).toEqual([2]); // الزاوية العلوية اليسرى ← العلوية اليمنى
    expect(rot90([2])).toEqual([8]);
    expect(rot180([0, 1])).toEqual([7, 8]);
    expect(rot90(rot270([0, 3, 4]))).toEqual([0, 3, 4]);
    expect(mirror([0, 3, 7])).toEqual([2, 5, 7]);
    expect(mirror(mirror([1, 6]))).toEqual([1, 6]);
  });
  it("عمليات المجموعات صحيحة", () => {
    expect(union([0, 4], [4, 8])).toEqual([0, 4, 8]);
    expect(intersect([0, 4], [4, 8])).toEqual([4]);
    expect(xor([0, 4], [4, 8])).toEqual([0, 8]);
    expect(complement([0, 1, 2, 3, 4, 5, 6, 7])).toEqual([8]);
  });
});

describe("أسئلة الأشكال", () => {
  it("36 سؤالًا أصليًا ضمن بنك الأسئلة", () => {
    expect(shapeQs.length).toBe(36);
    for (const q of shapeQs) {
      expect(QUESTION_BANK).toContain(q);
      expect(SHAPE_QUESTIONS).toContain(q);
      expect(q.source.kind).toBe("original");
    }
  });

  it("كل سؤال مرسوم سليم البنية والخيارات المرسومة مختلفة", () => {
    for (const q of shapeQs) {
      expect(q.visual || q.optionVisuals, q.id).toBeTruthy();
      if (q.optionVisuals) {
        expect(q.optionVisuals.length, q.id).toBe(q.options.length);
        expect(new Set(q.optionVisuals.map(key)).size, q.id).toBe(q.options.length);
      }
      // الإجابة ليست نسخة من آخر شكل ظاهر قبل علامة الاستفهام
      if (q.optionVisuals && q.visual && (q.visual.layout === "sequence" || q.visual.layout === "matrix")) {
        const shown = q.visual.cells.filter(Boolean);
        expect(key(shown[shown.length - 1]!), q.id).not.toBe(key(q.optionVisuals[q.answer]));
      }
    }
  });

  it("أشكال التدوير والانعكاس غير متماثلة (فالدوران لا يساوي الانعكاس)", () => {
    for (const s of [SHAPE_SETS.C18, SHAPE_SETS.C19, SHAPE_SETS.C21, SHAPE_SETS.P24, SHAPE_SETS.M26, SHAPE_SETS.S34]) {
      for (const r of rotations(s)) expect(sameSet(r, mirror(s)), JSON.stringify(s)).toBe(false);
    }
  });

  it("سؤال «الشكل المختلف» له إجابة واحدة فقط: صورة المرآة ليست تدويرًا", () => {
    const P = SHAPE_SETS.P24;
    const odd = mirror(rot90(P));
    for (const r of rotations(P)) expect(sameSet(r, odd)).toBe(false);
  });

  it("سؤال «الشكل نفسه بعد التدوير»: خيار واحد فقط هو تدوير", () => {
    const S = SHAPE_SETS.S34;
    const options = [mirror(S), rot90(S), mirror(rot90(S)), mirror(rot180(S))];
    const isRotation = options.map((o) => rotations(S).some((r) => sameSet(r, o)));
    expect(isRotation).toEqual([false, true, false, false]);
  });

  it("كل مجال فيه عدد كافٍ من أسئلة الأشكال لاختبار الأشكال (20 سؤالًا)", () => {
    expect(SHAPE_QUESTIONS.filter((q) => q.topic === "patterns").length).toBeGreaterThanOrEqual(10);
    expect(SHAPE_QUESTIONS.filter((q) => q.topic === "spatial").length).toBeGreaterThanOrEqual(10);
  });
});
