import { defineOriginalQuestions } from "../define";
import { arrowAt, circle, dot, glyph, grid, isoCubes, ngon, square, triangle } from "./kit";
import type { Glyph, Shape } from "@/lib/types";

/*
 * الدفعة الرابعة: أسئلة اقترحتها أداة ذكاء اصطناعي (Gemini) باستخدام برومبت المنصة،
 * ثم رُوجعت وعُدّلت قبل الإدراج:
 * - spa-i01: استُبدلت المشتّتات لأن أحدها كان دورانًا للإجابة نفسها (إجابتان صحيحتان)،
 *   وأُزيلت الإشارة إلى موضع الخيار من الشرح.
 * - pat-i01: صُغّر المضلع ونُقل السهم خارجه حتى لا يتداخل الرسم.
 * - رُفض سؤالان: تركيب قطعتين متداخلتين (تكرار لسؤال الشفافيات)، ومجموع الأضلاع
 *   (تكرار لسؤال موجود، ومضلعاته الكثيرة الأضلاع يصعب تمييزها).
 */

const SEQ = "ما الشكل الذي يأتي مكان علامة الاستفهام؟ (تُقرأ السلسلة من اليسار إلى اليمين)";
const one = (s: Shape) => glyph(s);

// المجسّم: عمود من 3 مكعبات، ومكعبان في الطبقة السفلى على شكل زاوية
const TOWER: [number, number, number][] = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 0, 1], [0, 0, 2]];
/** المنظر من الأعلى: كل عمود يظهر مربعًا واحدًا مهما كان ارتفاعه */
const FOOTPRINT = [...new Set(TOWER.map(([x, y]) => y * 3 + x))].sort((a, b) => a - b);

/** مضلع صغير بداخله نقاط، وسهم صغير خارجه في الجهة التي يشير إليها */
const ARROW_POS: Record<number, [number, number]> = { 0: [50, 11], 90: [89, 50], 180: [50, 89], 270: [11, 50] };
function polyDotsArrow(sides: number, n: number, deg: number): Glyph {
  const dots: Shape[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((360 * i) / n) * (Math.PI / 180);
    dots.push(dot(Math.round((50 + (n === 1 ? 0 : 9) * Math.sin(a)) * 10) / 10, Math.round((50 - (n === 1 ? 0 : 9) * Math.cos(a)) * 10) / 10, 3.5));
  }
  const [x, y] = ARROW_POS[deg];
  return glyph(ngon(sides, 27, "white", -90, 50, 50), ...dots, arrowAt(x, y, deg, 0.22));
}

export const spatialShapeQuestions4 = defineOriginalQuestions("spatial", [
  {
    id: "spa-i01",
    difficulty: 2,
    prompt: "كيف يبدو المجسّم عند النظر إليه من الأعلى؟ (لا توجد فراغات تحت المكعبات)",
    visual: { layout: "single", glyph: isoCubes(TOWER) },
    optionVisuals: [grid([0, 1, 2]), grid(FOOTPRINT), grid([0, 1]), grid([0, 1, 3, 4])],
    options: ["ثلاثة مربعات في خط مستقيم", "ثلاثة مربعات على شكل زاوية", "مربعان فقط", "أربعة مربعات على شكل مربع"],
    answer: 1,
    explanation:
      "من الأعلى نرى كل عمود مربعًا واحدًا مهما كان ارتفاعه. في المجسّم ثلاثة أعمدة: العالي (3 مكعبات)، ومكعبان منفردان، وهي معًا على شكل زاوية. لذلك نرى 3 مربعات على شكل زاوية، وليس 5.",
  },
]);

export const patternShapeQuestions4 = defineOriginalQuestions("patterns", [
  {
    id: "pat-i01",
    difficulty: 3,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [polyDotsArrow(3, 1, 0), polyDotsArrow(4, 2, 90), polyDotsArrow(5, 3, 180), polyDotsArrow(6, 4, 270), null],
    },
    optionVisuals: [polyDotsArrow(7, 5, 180), polyDotsArrow(7, 5, 0), polyDotsArrow(6, 5, 0), polyDotsArrow(8, 5, 270)],
    options: ["مسبّع فيه 5 نقاط والسهم في الأسفل", "مسبّع فيه 5 نقاط والسهم في الأعلى", "مسدّس فيه 5 نقاط والسهم في الأعلى", "مثمّن فيه 5 نقاط والسهم يسارًا"],
    answer: 1,
    explanation:
      "تتغير ثلاث صفات معًا: عدد أضلاع المضلع يزيد واحدًا (3، 4، 5، 6، ثم 7)، وعدد النقاط يزيد واحدًا (1، 2، 3، 4، ثم 5)، والسهم الصغير ينتقل ربع دورة مع عقارب الساعة (أعلى، يمين، أسفل، يسار، ثم يعود إلى الأعلى).",
  },
  {
    id: "pat-i02",
    difficulty: 1,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [
        one(circle(32, "black")), one(square(38)), one(triangle(36, "gray", 50, 54)),
        one(circle(32, "black")), one(square(38)), null,
      ],
    },
    optionVisuals: [one(triangle(36, "white", 50, 54)), one(triangle(36, "gray", 50, 54)), one(circle(32, "gray")), one(square(38, "black"))],
    options: ["مثلث أبيض", "مثلث رمادي", "دائرة رمادية", "مربع أسود"],
    answer: 1,
    explanation: "النمط يكرر ثلاثة أشكال بالترتيب نفسه: دائرة سوداء، ثم مربع أبيض، ثم مثلث رمادي. بعد المربع الأبيض يأتي المثلث الرمادي.",
  },
]);

/** للاختبارات */
export const BATCH4_DATA = { TOWER, FOOTPRINT };
