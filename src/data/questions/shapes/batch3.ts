import { defineOriginalQuestions } from "../define";
import {
  arrowAt,
  circle,
  colorGrid,
  dot,
  gComplement,
  gFlipV,
  gMirror,
  gRot90,
  glyph,
  graphGlyph,
  grid,
  hexagon,
  isoCubes,
  manyDots,
  mapFlipV,
  mapMirror,
  mapRot270,
  mapRot90,
  net,
  ngon,
  pie,
  polyWithDots,
  spread,
  square,
  star,
  streets,
  triangle,
  union,
  type LineGraph,
} from "./kit";
import type { Glyph, Paint, Shape } from "@/lib/types";

/*
 * الدفعة الثالثة من أسئلة الأشكال الأصلية: قطع تكمل المربع، والرسم دون رفع القلم،
 * والطرق الأقصر، وإكمال التماثل، وإكمال المجسّم، والشفافيات، ومعادلات الأشكال.
 */

const SEQ = "ما الشكل الذي يأتي مكان علامة الاستفهام؟ (تُقرأ السلسلة من اليسار إلى اليمين)";
const MATRIX = "ما الشكل الذي يكمل الجدول؟ (يُقرأ كل صف من اليسار إلى اليمين)";

const g = glyph;
const one = (s: Shape) => g(s);

// ---------- بيانات ثابتة (تُستخدم أيضًا في الاختبارات) ----------

const PIECE3 = [0, 1, 3, 6];
const REST3 = gComplement(PIECE3, 3);
const PIECE4 = [0, 1, 4, 5, 6, 8, 12];
const REST4 = gComplement(PIECE4, 4);

const HALF4 = [0, 4, 5, 9, 12]; // في العمودين الأيسرين من شبكة 4×4
const QUARTER4 = [0, 1, 5]; // في الربع العلوي الأيسر

const SHEET_A = [0, 4, 8];
const SHEET_B = [0, 3, 7];

const M9: Record<number, Paint> = { 0: "red", 1: "red", 5: "blue", 6: "blue" };

const ENVELOPE: LineGraph = {
  nodes: { bl: [20, 88], br: [80, 88], tl: [20, 42], tr: [80, 42], apex: [50, 12], c: [50, 65] },
  edges: [["bl", "br"], ["bl", "tl"], ["br", "tr"], ["tl", "tr"], ["tl", "apex"], ["tr", "apex"], ["bl", "c"], ["c", "tr"], ["br", "c"], ["c", "tl"]],
};
const SQUARE_X: LineGraph = {
  nodes: { a: [18, 18], b: [82, 18], c: [82, 82], d: [18, 82], m: [50, 50] },
  edges: [["a", "b"], ["b", "c"], ["c", "d"], ["d", "a"], ["a", "m"], ["b", "m"], ["c", "m"], ["d", "m"]],
};
const PLUS: LineGraph = {
  nodes: { m: [50, 50], n: [50, 14], e: [86, 50], s: [50, 86], w: [14, 50] },
  edges: [["m", "n"], ["m", "e"], ["m", "s"], ["m", "w"]],
};
const TRI_SPOKES: LineGraph = {
  nodes: { a: [50, 12], b: [12, 84], c: [88, 84], m: [50, 60] },
  edges: [["a", "b"], ["b", "c"], ["c", "a"], ["a", "m"], ["b", "m"], ["c", "m"]],
};

// ---------- مساعدات ----------

const g4 = (cells: number[], fill: Paint = "blue") => grid(cells, 4, 4, fill);
const vLine: Shape = { t: "line", x1: 50, y1: 1, x2: 50, y2: 99, dash: true };
const hLine: Shape = { t: "line", x1: 1, y1: 50, x2: 99, y2: 50, dash: true };
const withAxes = (base: Glyph, ...axes: Shape[]): Glyph => ({ shapes: [...base.shapes, ...axes] });

/** خطوة k في سؤال السهمين: الأيسر يدور مع عقارب الساعة والأيمن عكسها */
const twoArrows = (left: number, right: number) => g(arrowAt(30, 50, left), arrowAt(70, 50, right));

/** نجمة ودائرة تتبادلان، ونقطة تدور على الزوايا */
const CORNERS: [number, number][] = [[16, 16], [84, 16], [84, 84], [16, 84]];
const starAt = (x: number, y: number): Shape => ({ t: "poly", fill: "yellow", pts: shiftPts(star(5, "yellow", 16, 7), x, y) });
const swapper = (starLeft: boolean, corner: number) =>
  g(starAt(starLeft ? 30 : 70, 50), circle(12, "blue", starLeft ? 70 : 30, 50), dot(...CORNERS[corner], 6));
function shiftPts(s: Shape, x: number, y: number): number[] {
  if (s.t !== "poly") return [];
  return s.pts.map((v, i) => Math.round((v + (i % 2 === 0 ? x - 50 : y - 52)) * 10) / 10);
}

const SNAKE = [0, 1, 2, 5, 4, 3, 6, 7, 8];
const snake = (k: number) => grid(SNAKE.slice(0, k), 3, 3, "green");

const circles = (n: number, fill: Paint) => spread(n, (x, y) => circle(n === 1 ? 26 : 12, fill, x, y));
const sized = (make: (r: number) => Shape, k: number) => one(make([16, 26, 38][k]));

// =====================================================================
// الأنماط
// =====================================================================

export const patternShapeQuestions3 = defineOriginalQuestions("patterns", [
  {
    id: "pat-h01",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [
        one(triangle(34, "light", 50, 54)), one(triangle(34, "light", 50, 54)), one(hexagon(34, "light")),
        one(square(38, "light")), one(triangle(34, "light", 50, 54)), one(ngon(7, 34, "light")),
        one(square(38, "light")), one(square(38, "light")), null,
      ],
    },
    optionVisuals: [one(ngon(7, 34, "light")), one(ngon(8, 34, "light", -67.5)), one(ngon(9, 34, "light")), one(hexagon(34, "light"))],
    options: ["مسبّع (7 أضلاع)", "مثمّن (8 أضلاع)", "متساعي (9 أضلاع)", "مسدّس (6 أضلاع)"],
    answer: 1,
    explanation: "عدد أضلاع الشكل الأخير في كل صف = مجموع أضلاع الشكلين قبله: $3 + 3 = 6$، $4 + 3 = 7$، إذن $4 + 4 = 8$: مثمّن.",
  },
  {
    id: "pat-h02",
    difficulty: 2,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [snake(3), snake(4), snake(5), null] },
    optionVisuals: [grid([0, 1, 2, 4, 5, 8], 3, 3, "green"), grid([0, 1, 2, 4, 5, 7], 3, 3, "green"), snake(6), grid([0, 1, 2, 4, 5, 6], 3, 3, "green")],
    options: ["إضافة الزاوية السفلية اليمنى", "إضافة وسط الصف السفلي", "إضافة وسط العمود الأيسر", "إضافة الزاوية السفلية اليسرى"],
    answer: 2,
    explanation:
      "المربعات تُلوَّن على مسار متعرّج مثل الأفعى: الصف الأول من اليسار إلى اليمين، ثم الصف الثاني من اليمين إلى اليسار. بعد المركز يأتي وسط العمود الأيسر.",
  },
  {
    id: "pat-h03",
    difficulty: 1,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [circles(4, "red"), circles(3, "green"), circles(2, "red"), null] },
    optionVisuals: [circles(1, "red"), circles(1, "green"), circles(2, "green"), circles(3, "red")],
    options: ["دائرة حمراء واحدة", "دائرة خضراء واحدة", "دائرتان خضراوان", "ثلاث دوائر حمراء"],
    answer: 1,
    explanation: "عدد الدوائر يقل واحدًا في كل خطوة (4، 3، 2، ثم 1)، ويتناوب اللون بين الأحمر والأخضر. إذن: دائرة خضراء واحدة.",
  },
  {
    id: "pat-h04",
    difficulty: 3,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [swapper(true, 0), swapper(false, 1), swapper(true, 2), null] },
    optionVisuals: [swapper(false, 3), swapper(true, 3), swapper(false, 0), swapper(false, 2)],
    options: ["النجمة يمينًا والنقطة في الزاوية السفلية اليسرى", "النجمة يسارًا والنقطة في الزاوية السفلية اليسرى", "النجمة يمينًا والنقطة في الزاوية العلوية اليسرى", "النجمة يمينًا والنقطة في الزاوية السفلية اليمنى"],
    answer: 0,
    explanation:
      "يتغير أمران: النجمة والدائرة تتبادلان مكانيهما في كل خطوة، والنقطة الصغيرة تنتقل إلى الزاوية التالية مع عقارب الساعة. الرابع: النجمة على اليمين، والنقطة في الزاوية السفلية اليسرى.",
  },
  {
    id: "pat-h05",
    difficulty: 1,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [
        sized((r) => triangle(r, "red", 50, 54), 0), sized((r) => triangle(r, "red", 50, 54), 1), sized((r) => triangle(r, "red", 50, 54), 2),
        sized((r) => square(r * 1.1, "yellow"), 0), sized((r) => square(r * 1.1, "yellow"), 1), sized((r) => square(r * 1.1, "yellow"), 2),
        sized((r) => hexagon(r, "green"), 0), sized((r) => hexagon(r, "green"), 1), null,
      ],
    },
    optionVisuals: [sized((r) => hexagon(r, "yellow"), 2), sized((r) => hexagon(r, "green"), 1), sized((r) => square(r * 1.1, "green"), 2), sized((r) => hexagon(r, "green"), 2)],
    options: ["مسدّس أصفر كبير", "مسدّس أخضر متوسط", "مربع أخضر كبير", "مسدّس أخضر كبير"],
    answer: 3,
    explanation: "في كل صف يبقى الشكل ولونه، ويكبر من خانة إلى التي تليها: صغير ← متوسط ← كبير. إذن: مسدّس أخضر كبير.",
  },
  {
    id: "pat-h06",
    difficulty: 2,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [pie(8, [0], "red"), pie(8, [2], "blue"), pie(8, [4], "red"), null] },
    optionVisuals: [pie(8, [6], "red"), pie(8, [5], "blue"), pie(8, [6], "blue"), pie(8, [7], "blue")],
    options: ["قطاع أحمر في الموضع السابع", "قطاع أزرق في الموضع السادس", "قطاع أزرق في الموضع السابع", "قطاع أزرق في الموضع الثامن"],
    answer: 2,
    explanation:
      "القطاع الملوّن يقفز قطاعين مع عقارب الساعة في كل خطوة (ربع دورة)، ويتناوب لونه بين الأحمر والأزرق. بعد الأحمر يأتي الأزرق، وموضعه بعد قطاعين آخرين.",
  },
  {
    id: "pat-h07",
    difficulty: 3,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [twoArrows(0, 0), twoArrows(90, 270), twoArrows(180, 180), null] },
    optionVisuals: [twoArrows(90, 270), twoArrows(270, 270), twoArrows(270, 90), twoArrows(0, 0)],
    options: ["الأيسر إلى اليمين والأيمن إلى اليسار", "السهمان إلى اليسار", "الأيسر إلى اليسار والأيمن إلى اليمين", "السهمان إلى الأعلى"],
    answer: 2,
    explanation:
      "السهم الأيسر يدور ربع دورة مع عقارب الساعة (أعلى ← يمين ← أسفل ← يسار)، والسهم الأيمن يدور ربع دورة عكسها (أعلى ← يسار ← أسفل ← يمين). في الخطوة الرابعة: الأيسر يشير إلى اليسار، والأيمن إلى اليمين.",
  },
  {
    id: "pat-h08",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [manyDots(2), manyDots(3), manyDots(4), manyDots(4), manyDots(2), manyDots(3), manyDots(3), manyDots(4), null],
    },
    optionVisuals: [manyDots(4), manyDots(3), manyDots(5), manyDots(2)],
    options: ["4 نقاط", "3 نقاط", "5 نقاط", "نقطتان"],
    answer: 3,
    explanation: "في كل صف وكل عمود تظهر الأعداد 2 و3 و4 مرة واحدة. ينقص الصف الثالث العدد 2، والعمود الأخير ينقصه العدد 2 أيضًا.",
  },
]);

// =====================================================================
// المنطق
// =====================================================================

export const logicShapeQuestions3 = defineOriginalQuestions("logic", [
  {
    id: "log-h01",
    difficulty: 3,
    prompt: "الأشكال في الأعلى تتبع قاعدة واحدة. أي خيار يتبعها أيضًا؟",
    visual: { layout: "group", caption: "أشكال تتبع القاعدة", cells: [grid([0, 4, 8]), grid([2, 3, 7]), grid([1, 5, 6])] },
    optionVisuals: [grid([0, 1, 8]), grid([2, 5, 8]), grid([0, 5, 7]), grid([3, 4, 6])],
    options: ["مربعان في الصف الأول", "ثلاثة مربعات في العمود الأيمن", "مربع واحد في كل صف وكل عمود", "مربعان في الصف الأوسط"],
    answer: 2,
    explanation:
      "القاعدة: في كل صف مربع أسود واحد فقط، وفي كل عمود مربع أسود واحد فقط. الخيار الصحيح يحقق ذلك. أما البقية ففيها صف أو عمود فيه أكثر من مربع.",
  },
  {
    id: "log-h02",
    difficulty: 2,
    prompt: "الأشكال في الأعلى تتبع قاعدة واحدة. أي خيار يتبعها أيضًا؟",
    visual: { layout: "group", caption: "أشكال تتبع القاعدة", cells: [polyWithDots(3, 3), polyWithDots(4, 4), polyWithDots(5, 5)] },
    optionVisuals: [polyWithDots(6, 5), polyWithDots(4, 3), polyWithDots(6, 6), polyWithDots(3, 4)],
    options: ["مسدّس فيه 5 نقاط", "مربع فيه 3 نقاط", "مسدّس فيه 6 نقاط", "مثلث فيه 4 نقاط"],
    answer: 2,
    explanation: "القاعدة: عدد النقاط داخل الشكل يساوي عدد أضلاعه. المسدّس له 6 أضلاع وفيه 6 نقاط.",
  },
]);

// =====================================================================
// حل المشكلات: معادلات الأشكال
// =====================================================================

export const problemShapeQuestions3 = defineOriginalQuestions("problem-solving", [
  {
    id: "prb-h01",
    difficulty: 1,
    prompt: "كل شكل يمثّل عددًا. إذا كان $● + ● = 8$ و$● + ■ = 11$، فما قيمة ■؟",
    options: ["3", "4", "7", "11"],
    answer: 2,
    explanation: "من المعادلة الأولى: ● = $8 ÷ 2 = 4$. ومن الثانية: ■ = $11 − 4 = 7$.",
  },
  {
    id: "prb-h02",
    difficulty: 2,
    prompt: "كل شكل يمثّل عددًا. إذا كان $▲ + ▲ + ■ = 14$ و■ أكبر من ▲ بـ 2، فما قيمة $▲ + ■$؟",
    options: ["8", "10", "12", "14"],
    answer: 1,
    explanation: "نعوّض ■ = ▲ + 2: ثلاثة مثلثات + 2 = 14، إذن المثلثات الثلاثة = 12، و▲ = 4، و■ = 6. المطلوب $4 + 6 = 10$.",
  },
  {
    id: "prb-h03",
    difficulty: 2,
    prompt: "كل شكل يمثّل عددًا. إذا كان ● يساوي ضعف ★، و$● + ★ = 18$، فما قيمة ●؟",
    options: ["6", "9", "12", "16"],
    answer: 2,
    explanation: "● = ★ + ★، إذن ● + ★ = ثلاث نجمات = 18، فالنجمة = 6، و● = 12. تحقق: $12 + 6 = 18$ ✓.",
  },
  {
    id: "prb-h04",
    difficulty: 3,
    prompt: "كل شكل يمثّل عددًا. إذا كان $● + ■ = 10$ و$■ + ▲ = 13$ و$● + ▲ = 11$، فما قيمة ▲؟",
    options: ["5", "6", "7", "8"],
    answer: 2,
    explanation:
      "نجمع المعادلات الثلاث: كل شكل يظهر مرتين، فمجموعها $10 + 13 + 11 = 34$ = ضعف (● + ■ + ▲)، إذن مجموع الأشكال الثلاثة 17. وبما أن ● + ■ = 10، فإن ▲ = $17 − 10 = 7$.",
  },
]);

// =====================================================================
// الأشكال والعلاقات المكانية
// =====================================================================

export const spatialShapeQuestions3 = defineOriginalQuestions("spatial", [
  {
    id: "spa-h01",
    difficulty: 1,
    prompt: "الجزء الأزرق قطعة من مربع. أي قطعة تكمل المربع تمامًا (دون تدوير أو قلب)؟",
    visual: { layout: "single", glyph: grid(PIECE3, 3, 3, "blue") },
    optionVisuals: [net(gMirror(REST3, 3), 3, 3), net(REST3, 3, 3), net(gRot90(gRot90(REST3, 3), 3), 3, 3), net([2, 4, 5, 6, 7], 3, 3)],
    options: ["القطعة مقلوبة", "القطعة الصحيحة", "القطعة بعد نصف دورة", "قطعة بشكل مختلف"],
    answer: 1,
    explanation: "القطعة المطلوبة تملأ كل المربعات البيضاء بالضبط: الزاوية العلوية اليمنى، والمركز، ووسط العمود الأيمن، ووسط الصف السفلي، والزاوية السفلية اليمنى.",
  },
  {
    id: "spa-h02",
    difficulty: 2,
    prompt: "الجزء الأزرق قطعة من مربع. أي قطعة تكمل المربع تمامًا (دون تدوير أو قلب)؟",
    visual: { layout: "single", glyph: g4(PIECE4) },
    optionVisuals: [net(REST4, 4, 4), net(gMirror(REST4, 4), 4, 4), net(gFlipV(REST4, 4), 4, 4), net(gRot90(REST4, 4), 4, 4)],
    options: ["القطعة الصحيحة", "القطعة مقلوبة بين اليمين واليسار", "القطعة مقلوبة بين الأعلى والأسفل", "القطعة بعد ربع دورة"],
    answer: 0,
    explanation: "نتحقق خانة بخانة: القطعة الصحيحة تملأ كل المربعات البيضاء ولا تغطي أي مربع أزرق. القطع الأخرى صور مقلوبة أو مدارة لها، فتترك فراغات أو تتداخل مع الجزء الأزرق.",
  },
  {
    id: "spa-h03",
    difficulty: 3,
    prompt: "أي شكل يمكن رسمه بخط واحد متصل، دون رفع القلم ودون المرور على أي خط مرتين؟",
    optionVisuals: [graphGlyph(SQUARE_X), graphGlyph(PLUS), graphGlyph(ENVELOPE), graphGlyph(TRI_SPOKES)],
    options: ["مربع بقطريه", "علامة +", "شكل الظرف (بيت بقطرين)", "مثلث تلتقي خطوطه في المركز"],
    answer: 2,
    explanation:
      "نعدّ عند كل نقطة عدد الخطوط الخارجة منها. يمكن الرسم دون رفع القلم إذا كان عدد النقاط التي يخرج منها عدد فردي من الخطوط 0 أو 2 فقط. في الظرف توجد نقطتان فقط (الزاويتان السفليتان)، فنبدأ من إحداهما وننتهي عند الأخرى. أما الأشكال الأخرى ففي كل منها 4 نقاط من هذا النوع.",
  },
  {
    id: "spa-h04",
    difficulty: 2,
    prompt: "نتحرك على خطوط الشبكة من النقطة الخضراء إلى النقطة الحمراء، يمينًا أو إلى الأعلى فقط. كم طريقًا مختلفًا يمكن أن نسلك؟",
    visual: { layout: "single", glyph: streets(2, 2) },
    options: ["4", "5", "6", "8"],
    answer: 2,
    explanation:
      "نكتب عند كل تقاطع عدد الطرق الموصلة إليه: تقاطعات الحافة السفلى والحافة اليسرى لها طريق واحد. وكل تقاطع آخر = مجموع ما تحته وما على يساره. المركز: $1 + 1 = 2$، ثم 3 و3، ثم النهاية: $3 + 3 = 6$.",
  },
  {
    id: "spa-h05",
    difficulty: 3,
    prompt: "نتحرك على خطوط الشبكة من النقطة الخضراء إلى النقطة الحمراء، يمينًا أو إلى الأعلى فقط. كم طريقًا مختلفًا يمكن أن نسلك؟",
    visual: { layout: "single", glyph: streets(3, 2) },
    options: ["6", "8", "10", "12"],
    answer: 2,
    explanation:
      "نكتب عند كل تقاطع عدد الطرق الموصلة إليه، وكل تقاطع = مجموع ما تحته وما على يساره. الصف الأوسط: 1، 2، 3، 4. الصف العلوي: 1، 3، 6، ثم النهاية: $6 + 4 = 10$.",
  },
  {
    id: "spa-h06",
    difficulty: 2,
    prompt: "الخط المتقطع محور تماثل. كيف يبدو الشكل بعد إكماله؟",
    visual: { layout: "single", glyph: withAxes(g4(HALF4), vLine) },
    optionVisuals: [
      g4(union(HALF4, HALF4.map((i) => i + 2))),
      g4(union(HALF4, gMirror(HALF4, 4))),
      g4(union(HALF4, gFlipV(HALF4, 4))),
      g4(union(HALF4, gRot90(gRot90(HALF4, 4), 4))),
    ],
    options: ["نسخ النصف دون قلب", "إكمال بالانعكاس حول المحور", "انعكاس بين الأعلى والأسفل", "إكمال بنصف دورة"],
    answer: 1,
    explanation: "محور التماثل يعمل كمرآة: كل مربع أزرق في النصف الأيسر يقابله مربع أزرق في النصف الأيمن على البعد نفسه من المحور، وفي الصف نفسه.",
  },
  {
    id: "spa-h07",
    difficulty: 3,
    prompt: "الخطان المتقطعان محورا تماثل. كيف يبدو الشكل بعد إكماله؟",
    visual: { layout: "single", glyph: withAxes(g4(QUARTER4), vLine, hLine) },
    optionVisuals: [
      g4(union(QUARTER4, gMirror(QUARTER4, 4))),
      g4(union(union(QUARTER4, gRot90(QUARTER4, 4)), union(gRot90(gRot90(QUARTER4, 4), 4), gRot90(gRot90(gRot90(QUARTER4, 4), 4), 4)))),
      g4(union(QUARTER4, gFlipV(QUARTER4, 4))),
      g4(union(union(QUARTER4, gMirror(QUARTER4, 4)), union(gFlipV(QUARTER4, 4), gFlipV(gMirror(QUARTER4, 4), 4)))),
    ],
    options: ["انعكاس حول المحور العمودي فقط", "تدوير الربع حول المركز", "انعكاس حول المحور الأفقي فقط", "انعكاس حول المحورين معًا"],
    answer: 3,
    explanation:
      "نعكس الربع حول المحور العمودي فنحصل على النصف العلوي، ثم نعكس النصف العلوي حول المحور الأفقي فنحصل على الشكل كاملًا. النتيجة متماثلة حول المحورين معًا.",
  },
  {
    id: "spa-h08",
    difficulty: 2,
    prompt: "كم مكعبًا صغيرًا يجب أن نضيف ليصبح المجسّم مكعبًا كبيرًا $2 × 2 × 2$؟ (لا توجد فراغات تحت أي مكعب)",
    visual: { layout: "single", glyph: isoCubes([[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1]]) },
    options: ["2", "3", "4", "5"],
    answer: 1,
    explanation:
      "المكعب $2 × 2 × 2$ فيه 8 مكعبات. في المجسّم 5 مكعبات: 4 في الطبقة السفلى (أحدها مختبئ تحت المكعب العلوي)، وواحد في الطبقة العليا. نحتاج $8 − 5 = 3$.",
  },
  {
    id: "spa-h09",
    difficulty: 3,
    prompt: "شفافيتان عليهما مربعات سوداء. نقلب الشفافية الثانية (اليمين ↔ اليسار)، ثم نضعها فوق الأولى. ماذا نرى؟",
    visual: { layout: "group", cells: [grid(SHEET_A), grid(SHEET_B)] },
    optionVisuals: [
      grid(union(SHEET_A, SHEET_B)),
      grid(union(SHEET_A, gMirror(SHEET_B, 3))),
      grid(union(SHEET_A, gFlipV(SHEET_B, 3))),
      grid(gMirror(union(SHEET_A, SHEET_B), 3)),
    ],
    options: ["تراكب دون قلب", "قلب الثانية ثم التراكب", "قلب الثانية بين الأعلى والأسفل ثم التراكب", "قلب الشفافيتين معًا"],
    answer: 1,
    explanation:
      "نقلب الشفافية الثانية أولًا: كل مربع ينتقل إلى الجهة المقابلة في الصف نفسه. ثم نضعها فوق الأولى فنرى كل المربعات السوداء في الشفافيتين معًا.",
  },
  {
    id: "spa-h10",
    difficulty: 2,
    prompt: "أي شكل مختلف عن البقية؟",
    optionVisuals: [grid([0, 2, 4, 7]), grid([1, 3, 5, 8]), grid([0, 4, 5, 6, 8]), grid([2, 3, 6, 7])],
    options: ["4 مربعات متفرقة", "4 مربعات في نمط آخر", "5 مربعات", "4 مربعات بعضها متجاور"],
    answer: 2,
    explanation: "في ثلاثة أشكال 4 مربعات سوداء بالضبط، أما الشكل المختلف ففيه 5 مربعات سوداء.",
  },
  {
    id: "spa-h11",
    difficulty: 2,
    prompt: "كيف يبدو الشكل بعد تدويره ربع دورة عكس اتجاه عقارب الساعة؟",
    visual: { layout: "single", glyph: colorGrid(M9) },
    optionVisuals: [colorGrid(mapRot90(M9)), colorGrid(mapMirror(M9)), colorGrid(mapRot270(M9)), colorGrid(mapFlipV(M9))],
    options: ["ربع دورة مع عقارب الساعة", "صورته في مرآة عمودية", "ربع دورة عكس عقارب الساعة", "صورته في مرآة أفقية"],
    answer: 2,
    explanation:
      "عند التدوير ربع دورة عكس عقارب الساعة: الصف العلوي يصبح العمود الأيسر، والعمود الأيمن يصبح الصف العلوي. انتبه للفرق بين الاتجاهين.",
  },
]);

/** للاختبارات */
export const BATCH3_DATA = { PIECE3, REST3, PIECE4, REST4, HALF4, QUARTER4, SHEET_A, SHEET_B, M9, ENVELOPE, SQUARE_X, PLUS, TRI_SPOKES, SNAKE };
