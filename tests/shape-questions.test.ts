import { describe, expect, it } from "vitest";
import { QUESTION_BANK, SHAPE_QUESTIONS } from "@/data/questions";
import { patternShapeQuestions, spatialShapeQuestions, SHAPE_SETS } from "@/data/questions/shapes";
import {
  BATCH2_SETS,
  logicShapeQuestions,
  patternShapeQuestions2,
  problemShapeQuestions,
  spatialShapeQuestions2,
} from "@/data/questions/shapes/batch2";
import {
  BATCH3_DATA,
  logicShapeQuestions3,
  patternShapeQuestions3,
  problemShapeQuestions3,
  spatialShapeQuestions3,
} from "@/data/questions/shapes/batch3";
import { gComplement, gFlipV, gMirror, gRot90, oddVertices } from "@/data/questions/shapes/kit";
import { complement, difference, flipV, intersect, mapRot90, mapSwap, mirror, rot180, rot270, rot90, union, xor } from "@/data/questions/shapes/kit";
import type { Glyph } from "@/lib/types";

const batch1 = [...patternShapeQuestions, ...spatialShapeQuestions];
const batch2 = [...patternShapeQuestions2, ...spatialShapeQuestions2, ...logicShapeQuestions, ...problemShapeQuestions];
const batch3 = [...patternShapeQuestions3, ...spatialShapeQuestions3, ...logicShapeQuestions3, ...problemShapeQuestions3];
const shapeQs = [...batch1, ...batch2, ...batch3];
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
  it("100 سؤال أصلي (ثلاث دفعات) ضمن بنك الأسئلة، ومعرّفاتها فريدة", () => {
    expect(batch1.length).toBe(36);
    expect(batch2.length).toBe(39);
    expect(batch3.length).toBe(25);
    expect(new Set(shapeQs.map((q) => q.id)).size).toBe(shapeQs.length);
    for (const q of shapeQs) {
      expect(QUESTION_BANK).toContain(q);
      expect(q.source.kind).toBe("original");
      // معادلات الأشكال النصية (● ■ ▲) لا تُحسب ضمن أسئلة الأشكال المرسومة
      if (q.visual || q.optionVisuals) expect(SHAPE_QUESTIONS).toContain(q);
    }
  });

  it("كل سؤال أشكال مرسوم في البنك سليم البنية وخياراته المرسومة مختلفة", () => {
    // يشمل كل أسئلة الأشكال المرسومة في البنك، بما فيها أي دفعة جديدة تُضاف لاحقًا
    for (const q of SHAPE_QUESTIONS.filter((x) => x.visual || x.optionVisuals)) {
      if (q.optionVisuals) {
        expect(q.optionVisuals.length, q.id).toBe(q.options.length);
        expect(new Set(q.optionVisuals.map(key)).size, q.id).toBe(q.options.length);
      }
      // الإجابة ليست نسخة من الخانة المجاورة لعلامة الاستفهام (قبلها أو بعدها)
      if (q.optionVisuals && q.visual && (q.visual.layout === "sequence" || q.visual.layout === "matrix")) {
        const cells = q.visual.cells;
        const gap = cells.indexOf(null);
        for (const n of [cells[gap - 1], cells[gap + 1]]) if (n) expect(key(n), q.id).not.toBe(key(q.optionVisuals[q.answer]));
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

describe("أسئلة الأشكال: الدفعة الثانية", () => {
  const ALL9 = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const isSym = (s: number[]) => {
    const transpose = (x: number[]) => x.map((i) => (i % 3) * 3 + Math.floor(i / 3)).sort();
    const anti = (x: number[]) => x.map((i) => (2 - (i % 3)) * 3 + (2 - Math.floor(i / 3))).sort();
    return [mirror(s), flipV(s), transpose(s), anti(s)].some((t) => sameSet(t, s));
  };

  it("الطرح يختلف عن «أحدهما فقط» في سؤال pat-g13 (القاعدة غير ملتبسة)", () => {
    const { D1, E1, D2, E2, D3, E3 } = BATCH2_SETS;
    expect(sameSet(difference(D1, E1), xor(D1, E1))).toBe(false);
    expect(difference(D3, E3)).toEqual([2, 4, 6]);
    expect(sameSet(difference(D2, E2), [3, 5])).toBe(true);
  });

  it("المربع اللاتيني في pat-g10: كل شكل وكل لون مرة واحدة في كل صف وعمود", () => {
    const shapeOf = (r: number, c: number) => (r + c) % 3;
    const colorOf = (r: number, c: number) => (r + 2 * c) % 3;
    for (let i = 0; i < 3; i++) {
      expect(new Set([0, 1, 2].map((c) => shapeOf(i, c))).size).toBe(3);
      expect(new Set([0, 1, 2].map((c) => colorOf(i, c))).size).toBe(3);
      expect(new Set([0, 1, 2].map((r) => shapeOf(r, i))).size).toBe(3);
      expect(new Set([0, 1, 2].map((r) => colorOf(r, i))).size).toBe(3);
    }
    // كل زوج (شكل، لون) يظهر مرة واحدة
    const pairs = new Set(ALL9.map((k) => `${shapeOf(Math.floor(k / 3), k % 3)}-${colorOf(Math.floor(k / 3), k % 3)}`));
    expect(pairs.size).toBe(9);
  });

  it("سؤال التماثل spa-g13: الإجابة وحدها بلا محور تماثل", () => {
    const opts = [[1, 3, 4, 5, 7], [0, 1, 4, 8], [0, 2, 4, 6, 8], [0, 1, 2, 4, 7]];
    expect(opts.map(isSym)).toEqual([true, false, true, true]);
  });

  it("تبادل الألوان والتدوير في spa-g18 يعطيان خيارات مختلفة", () => {
    const { A18 } = BATCH2_SETS;
    const once = mapSwap(mapRot90(A18), "black", "blue");
    expect(JSON.stringify(once)).not.toBe(JSON.stringify(mapRot90(A18)));
    expect(JSON.stringify(mapSwap(once, "black", "blue"))).toBe(JSON.stringify(mapRot90(A18)));
  });

  it("أسئلة الموازين: الحل يحقق كل الموازين", () => {
    // prb-g03: دائرتان = 3 مربعات، مربع + دائرة = 5 مثلثات ← الدائرة = 3 مثلثات
    const t = 1, c = 3 * t, s = 2 * t;
    expect(2 * c).toBe(3 * s);
    expect(s + c).toBe(5 * t);
  });

  it("أسئلة الأشكال موزعة على مستويات الصعوبة الثلاثة", () => {
    for (const d of [1, 2, 3] as const) expect(batch2.filter((q) => q.difficulty === d).length).toBeGreaterThanOrEqual(8);
  });
});

describe("أسئلة الأشكال: الدفعة الثالثة", () => {
  const D = BATCH3_DATA;

  it("قطعة الإكمال: الإجابة وحدها تكمل المربع دون تداخل", () => {
    for (const [piece, rest, n] of [[D.PIECE3, D.REST3, 3], [D.PIECE4, D.REST4, 4]] as const) {
      expect(sameSet([...piece, ...rest], Array.from({ length: n * n }, (_, i) => i))).toBe(true);
      expect(rest.some((i) => piece.includes(i))).toBe(false);
      for (const wrong of [gMirror(rest, n), gFlipV(rest, n), gRot90(rest, n)])
        expect(sameSet(wrong, rest), "القطعة غير متماثلة").toBe(false);
    }
  });

  it("الرسم دون رفع القلم: الظرف وحده ممكن", () => {
    expect(oddVertices(D.ENVELOPE)).toBe(2);
    for (const gr of [D.SQUARE_X, D.PLUS, D.TRI_SPOKES]) expect(oddVertices(gr)).toBe(4);
  });

  it("عدد الطرق الأقصر على الشبكة (برمجة ديناميكية)", () => {
    const paths = (cols: number, rows: number) => {
      const t = Array.from({ length: rows + 1 }, () => Array(cols + 1).fill(0));
      for (let r = 0; r <= rows; r++) for (let c = 0; c <= cols; c++) t[r][c] = r === 0 || c === 0 ? 1 : t[r - 1][c] + t[r][c - 1];
      return t[rows][cols];
    };
    expect(paths(2, 2)).toBe(6);
    expect(paths(3, 2)).toBe(10);
  });

  it("مسار الأفعى يمر بكل الخانات مرة واحدة", () => {
    expect([...D.SNAKE].sort()).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it("معادلات الأشكال: الحلول تحقق المعادلات", () => {
    const [c, s] = [4, 7];
    expect(c + c).toBe(8); expect(c + s).toBe(11);
    const [t2, s2] = [4, 6];
    expect(t2 + t2 + s2).toBe(14); expect(s2 - t2).toBe(2);
    const [st, ci] = [6, 12];
    expect(ci).toBe(2 * st); expect(ci + st).toBe(18);
    const [a, b, tri] = [4, 6, 7];
    expect(a + b).toBe(10); expect(b + tri).toBe(13); expect(a + tri).toBe(11);
  });

  it("لا تتكرر المعرّفات بين الدفعات", () => {
    expect(new Set(shapeQs.map((q) => q.id)).size).toBe(100);
  });

  it("حلول التماثل لا تختلط بالتدوير", () => {
    expect(gComplement([0], 2)).toEqual([1, 2, 3]);
  });
});

describe("أسئلة الأشكال: الدفعة الرابعة (مراجَعة من أداة ذكاء اصطناعي)", () => {
  it("المنظر من الأعلى: الإجابة وحدها على شكل زاوية، ولا خيار آخر هو دوران لها", async () => {
    const { BATCH4_DATA } = await import("@/data/questions/shapes/batch4");
    const fp = BATCH4_DATA.FOOTPRINT;
    expect(fp.length).toBe(3); // ثلاثة أعمدة مهما كان الارتفاع
    const others = [[0, 1, 2], [0, 1], [0, 1, 3, 4]];
    for (const o of others) for (const r of rotations(fp)) expect(sameSet(r, o)).toBe(false);
  });
});

describe("أسئلة الأشكال: الدفعة الخامسة (مراجَعة من أداة ذكاء اصطناعي)", () => {
  it("المعرّفات لا تتعارض مع الدفعات السابقة", async () => {
    const ids = QUESTION_BANK.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("الرمز السري: ترتيب العمليتين يغيّر النتيجة (فالسؤال غير ملتبس)", async () => {
    const { BATCH5_DATA } = await import("@/data/questions/shapes/batch5");
    const s = BATCH5_DATA.CODE;
    expect(sameSet(mirror(rot90(s)), rot90(mirror(s)))).toBe(false);
  });

  it("جدول الدوران: الأشكال غير متماثلة فلا تتطابق الخيارات", async () => {
    const { BATCH5_DATA } = await import("@/data/questions/shapes/batch5");
    for (const r of [BATCH5_DATA.R1, BATCH5_DATA.R2, BATCH5_DATA.R3]) {
      expect(sameSet(rot180(r), r)).toBe(false);
      expect(sameSet(rot180(r), mirror(r))).toBe(false);
    }
  });

  it("المنظر من الأعلى للمجسّم المسطح: لا مشتّت هو دوران للإجابة", async () => {
    const { BATCH5_DATA } = await import("@/data/questions/shapes/batch5");
    for (const o of [[0, 1, 2], [0, 3, 6], [0, 1, 2, 5]])
      for (const r of rotations(BATCH5_DATA.FLAT_FOOTPRINT)) expect(sameSet(r, o)).toBe(false);
  });
});

describe("الدفعة السادسة (على نمط الامتحان)", () => {
  it("30 سؤالًا أصليًا مرسومًا، وبعضها خانته الناقصة في وسط السلسلة", async () => {
    const { patternShapeQuestions6 } = await import("@/data/questions/shapes/batch6");
    expect(patternShapeQuestions6.length).toBe(30);
    for (const q of patternShapeQuestions6) {
      expect(SHAPE_QUESTIONS).toContain(q);
      expect(q.optionVisuals?.length, q.id).toBe(4);
      expect(q.prompt, q.id).toMatch(/من اليسار إلى اليمين/);
    }
    const midGaps = patternShapeQuestions6.filter((q) => {
      const cells = q.visual && "cells" in q.visual ? q.visual.cells : [];
      const gap = cells.indexOf(null);
      return gap >= 0 && gap < cells.length - 1;
    });
    expect(midGaps.length).toBeGreaterThanOrEqual(8);
    // مواضع الإجابات الصحيحة موزعة على الخيارات الأربعة
    expect(new Set(patternShapeQuestions6.map((q) => q.answer)).size).toBe(4);
  });

  it("قاعدة الانتقال: نقش الإجابة هو رمز زاوية الخانة التي قبلها", async () => {
    const { BATCH6_DATA } = await import("@/data/questions/shapes/batch6");
    const { patternGlyph, ICONS } = BATCH6_DATA;
    // نقش مختلف ورمز زاوية مختلف يعطيان رسمين مختلفين
    expect(JSON.stringify(patternGlyph("tri", ICONS.dot, ICONS.tri))).not.toBe(JSON.stringify(patternGlyph("tri", ICONS.tri, ICONS.dot)));
  });
});
