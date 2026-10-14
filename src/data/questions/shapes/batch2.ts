import { defineOriginalQuestions } from "../define";
import {
  balance,
  circle,
  clock,
  colorGrid,
  difference,
  dot,
  glyph,
  grid,
  heptagon,
  hexagon,
  intersect,
  isoCubes,
  manyDots,
  mapFlipV,
  mapMirror,
  mapRot180,
  mapRot270,
  mapRot90,
  mapSwap,
  ngon,
  pentagon,
  pie,
  pulleys,
  rotate,
  spread,
  square,
  star,
  triangle,
  union,
  xor,
  BORDER_CW,
} from "./kit";
import type { Glyph, Paint, Shape } from "@/lib/types";

/*
 * الدفعة الثانية من أسئلة الأشكال الأصلية: ألوان وقطاعات دائرية ونجوم وساعات
 * ومكعبات مجسّمة وموازين وبكرات وتنقّل على شبكة. كل الإجابات محسوبة من القاعدة نفسها.
 */

const SEQ = "ما الشكل الذي يأتي مكان علامة الاستفهام؟ (تُقرأ السلسلة من اليسار إلى اليمين)";
const MATRIX = "ما الشكل الذي يكمل الجدول؟ (يُقرأ كل صف من اليسار إلى اليمين)";
const ANALOGY = "الشكل الأول بالنسبة إلى الثاني، كالشكل الثالث بالنسبة إلى أي شكل؟";

const g = glyph;
const one = (s: Shape) => g(s);

// ---------- مساعدات خاصة بهذه الدفعة ----------

/ ثلاث دوائر ملوّنة على رؤوس مثلث: [الأعلى، أسفل اليمين، أسفل اليسار] */
const tri3 = (top: Paint, right: Paint, left: Paint) =>
  g(ngon(3, 34, "none", -90, 50, 54), circle(12, top, 50, 22), circle(12, right, 79, 71), circle(12, left, 21, 71));

/ حالة الخطوة k في سؤال المربعين المتحركين على الإطار */
const twoMovers = (k: number) =>
  colorGrid({ [BORDER_CW[k % 8]]: "black", [BORDER_CW[(((5 - k) % 8) + 8) % 8]]: "blue" });

/ درج من k أعمدة في شبكة 4×4 (يبدأ من الزاوية السفلية اليسرى) */
const stairs = (k: number) => {
  const cells: number[] = [];
  for (let c = 0; c < k; c++) for (let h = 0; h < k - c; h++) cells.push((3 - h) * 4 + c);
  return cells;
};

// مربع لاتيني يوناني 3×3: الشكل = (صف + عمود) mod 3، واللون = (صف + 2×عمود) mod 3
const L_SHAPES = [(f: Paint) => star(5, f, 36, 15), (f: Paint) => hexagon(34, f), (f: Paint) => circle(31, f)];
const L_COLORS: Paint[] = ["red", "green", "yellow"];
const latin = (r: number, c: number) => one(L_SHAPES[(r + c) % 3](L_COLORS[(r + 2 * c) % 3]));

// ألوان + أشكال: الشكل من الأول واللون من الثاني
const SH = {
  triangle: (f: Paint) => triangle(36, f, 50, 54),
  square: (f: Paint) => square(38, f),
  star: (f: Paint) => star(5, f, 36, 15),
  circle: (f: Paint) => circle(31, f),
  hexagon: (f: Paint) => hexagon(34, f),
};
const S = (k: keyof typeof SH, f: Paint) => one(SH[k](f));

const halfTurn = (deg: number) => rotate(pie(2, [0], "blue"), deg);

const stars = (n: number, f: Paint) => spread(n, (x, y) => ({ ...star(5, f, n === 1 ? 32 : 17, n === 1 ? 13 : 7), pts: shift(star(5, f, n === 1 ? 32 : 17, n === 1 ? 13 : 7), x, y) }));
function shift(s: Shape, x: number, y: number): number[] {
  if (s.t !== "poly") return [];
  return s.pts.map((v, i) => Math.round((v + (i % 2 === 0 ? x - 50 : y - 52)) * 10) / 10);
}
const circlesN = (n: number, f: Paint) => spread(n, (x, y) => circle(n === 1 ? 28 : 13, f, x, y));

// شبكة 5×5 مع نقطة في خانة واحدة
const pos5 = (cell: number) => grid([cell], 5, 5, "blue");

// ورقة مطوية على القطر
const paper = (holes: [number, number][]): Glyph =>
  g({ t: "rect", x: 10, y: 10, w: 80, h: 80, fill: "white" }, ...holes.map(([x, y]) => dot(x, y, 5)));

// قيم ثابتة للأسئلة المبنية على الخانات
const D1 = [0, 1, 2, 4], E1 = [1, 4, 6];
const D2 = [3, 4, 5, 7], E2 = [4, 7, 8];
const D3 = [0, 2, 4, 6, 8], E3 = [0, 1, 8];

const M6: Record<number, Paint> = { 0: "black", 1: "blue", 5: "black", 6: "blue" };
const M7: Record<number, Paint> = { 0: "red", 4: "blue", 5: "red", 7: "blue" };
const A18: Record<number, Paint> = { 0: "black", 1: "blue", 4: "blue" };
const C18: Record<number, Paint> = { 3: "black", 6: "black", 7: "blue" };

// =====================================================================
// الأنماط
// =====================================================================

export const patternShapeQuestions2 = defineOriginalQuestions("patterns", [
  {
    id: "pat-g01",
    difficulty: 1,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [pie(4, [0]), pie(4, [1]), pie(4, [2]), null] },
    optionVisuals: [pie(4, [0]), pie(4, [1, 3]), pie(4, [3]), pie(4, [2])],
    options: ["الربع العلوي الأيمن ملوّن", "ربعان متقابلان ملوّنان", "الربع العلوي الأيسر ملوّن", "الربع السفلي الأيسر ملوّن"],
    answer: 2,
    explanation: "الربع الملوّن يدور ربع دورة مع عقارب الساعة في كل خطوة: أعلى اليمين ← أسفل اليمين ← أسفل اليسار ← ثم أعلى اليسار.",
  },
  {
    id: "pat-g02",
    difficulty: 1,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [pie(8, [0], "red"), pie(8, [0, 1], "red"), pie(8, [0, 1, 2], "red"), null] },
    optionVisuals: [pie(8, [0, 1, 2, 3, 4], "red"), pie(8, [0, 2, 4, 6], "red"), pie(8, [0, 1, 2, 3], "red"), pie(8, [0, 1], "red")],
    options: ["خمسة قطاعات", "أربعة قطاعات متباعدة", "أربعة قطاعات متجاورة (نصف الدائرة)", "قطاعان"],
    answer: 2,
    explanation: "في كل خطوة يُلوَّن القطاع التالي مع عقارب الساعة: 1 ثم 2 ثم 3، فالشكل الرابع فيه 4 قطاعات متجاورة، أي نصف الدائرة.",
  },
  {
    id: "pat-g03",
    difficulty: 2,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [one(star(4)), one(star(5)), one(star(6)), null] },
    optionVisuals: [one(star(8)), one(heptagon(36, "yellow")), one(star(6)), one(star(7))],
    options: ["نجمة بثمانية رؤوس", "مسبّع (ليس نجمة)", "نجمة بستة رؤوس", "نجمة بسبعة رؤوس"],
    answer: 3,
    explanation: "عدد رؤوس النجمة يزيد واحدًا في كل خطوة: 4، 5، 6، ثم 7. (المسبّع له 7 أضلاع لكنه ليس نجمة).",
  },
  {
    id: "pat-g04",
    difficulty: 3,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [twoMovers(0), twoMovers(1), twoMovers(2), null] },
    optionVisuals: [
      colorGrid({ 2: "black", 5: "blue" }),
      colorGrid({ 5: "black", 8: "blue" }),
      twoMovers(3),
      colorGrid({ 8: "black", 2: "blue" }),
    ],
    options: ["تبادل اللونان", "الأزرق تحرك مع عقارب الساعة", "الأسود في وسط اليمين والأزرق في أعلى اليمين", "الأسود قفز خانتين"],
    answer: 2,
    explanation:
      "المربع الأسود يتحرك خطوة واحدة على الإطار مع عقارب الساعة، والمربع الأزرق يتحرك خطوة واحدة عكس عقارب الساعة. في الخطوة الرابعة: الأسود في وسط العمود الأيمن، والأزرق في الزاوية العلوية اليمنى.",
  },
  {
    id: "pat-g05",
    difficulty: 2,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [tri3("red", "green", "yellow"), tri3("yellow", "red", "green"), tri3("green", "yellow", "red"), null],
    },
    optionVisuals: [
      tri3("yellow", "red", "green"),
      tri3("red", "green", "yellow"),
      tri3("red", "yellow", "green"),
      tri3("green", "red", "yellow"),
    ],
    options: ["مثل الشكل الثاني", "الأحمر في الأعلى والأخضر يمينًا والأصفر يسارًا", "الأحمر في الأعلى والأصفر يمينًا والأخضر يسارًا", "الأخضر في الأعلى والأحمر يمينًا والأصفر يسارًا"],
    answer: 1,
    explanation:
      "كل لون ينتقل إلى الدائرة التالية مع عقارب الساعة (الأعلى ← أسفل اليمين ← أسفل اليسار). بعد ثلاث خطوات يعود كل لون إلى مكانه الأول، فيتكرر الشكل الأول.",
  },
  {
    id: "pat-g06",
    difficulty: 3,
    prompt: "العقربان يتحركان وفق قاعدة ثابتة. ما الشكل الذي يأتي مكان علامة الاستفهام؟ (من اليسار إلى اليمين)",
    visual: { layout: "sequence", cells: [clock(0, 0), clock(30, 90), clock(60, 180), null] },
    optionVisuals: [clock(90, 0), clock(270, 90), clock(90, 270), clock(120, 270)],
    options: ["القصير على 3 والطويل على 12", "القصير على 9 والطويل على 3", "القصير على 3 والطويل على 9", "القصير على 4 والطويل على 9"],
    answer: 2,
    explanation:
      "العقرب الطويل (الأزرق) يدور ربع دورة في كل خطوة: 12 ← 3 ← 6 ← 9. والعقرب القصير (الأسود) يتقدم رقمًا واحدًا في كل خطوة: 12 ← 1 ← 2 ← 3.",
  },
  {
    id: "pat-g07",
    difficulty: 3,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [manyDots(1), manyDots(1), manyDots(2), manyDots(3), manyDots(5), null] },
    optionVisuals: [manyDots(7), manyDots(9), manyDots(8), manyDots(6)],
    options: ["7 نقاط", "9 نقاط", "8 نقاط", "6 نقاط"],
    answer: 2,
    explanation: "كل عدد = مجموع العددين اللذين قبله: $1 + 1 = 2$، $1 + 2 = 3$، $2 + 3 = 5$، ثم $3 + 5 = 8$.",
  },
  {
    id: "pat-g08",
    difficulty: 1,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [one(hexagon(36, "red")), one(pentagon(36, "green")), one(square(40, "red")), null],
    },
    optionVisuals: [one(triangle(38, "red", 50, 54)), one(square(40, "green")), one(triangle(38, "green", 50, 54)), one(circle(32, "green"))],
    options: ["مثلث أحمر", "مربع أخضر", "مثلث أخضر", "دائرة خضراء"],
    answer: 2,
    explanation: "يقل عدد الأضلاع ضلعًا واحدًا في كل خطوة (6، 5، 4، ثم 3)، ويتناوب اللون بين الأحمر والأخضر. إذن: مثلث أخضر.",
  },
  {
    id: "pat-g09",
    difficulty: 2,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [grid(stairs(1), 4, 4, "blue"), grid(stairs(2), 4, 4, "blue"), grid(stairs(3), 4, 4, "blue"), null] },
    optionVisuals: [
      grid([8, 9, 10, 11, 12, 13, 14, 15], 4, 4, "blue"),
      grid(stairs(4), 4, 4, "blue"),
      grid([...stairs(3), 15], 4, 4, "blue"),
      grid([0, 4, 5, 8, 9, 12, 13, 14], 4, 4, "blue"),
    ],
    options: ["صفّان كاملان", "درج من أربع درجات (10 مربعات)", "درج من ثلاث درجات ومربع زائد", "درج ناقص"],
    answer: 1,
    explanation: "في كل خطوة يكبر الدرج درجة جديدة: 1 ثم 3 ثم 6 مربعات، فالتالي 10 مربعات ($6 + 4$) على شكل درج من أربع درجات.",
  },
  {
    id: "pat-g10",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [latin(0, 0), latin(0, 1), latin(0, 2), latin(1, 0), latin(1, 1), latin(1, 2), latin(2, 0), latin(2, 1), null],
    },
    optionVisuals: [one(hexagon(34, "green")), one(star(5, "red", 36, 15)), one(hexagon(34, "red")), one(circle(31, "yellow"))],
    options: ["مسدّس أخضر", "نجمة حمراء", "مسدّس أحمر", "دائرة صفراء"],
    answer: 2,
    explanation:
      "في كل صف وكل عمود يظهر كل شكل (نجمة، مسدّس، دائرة) مرة واحدة، وكل لون (أحمر، أخضر، أصفر) مرة واحدة. ينقص الصف الثالث المسدّس، وينقص العمود الأخير اللون الأحمر: مسدّس أحمر.",
  },
  {
    id: "pat-g11",
    difficulty: 3,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [
        S("triangle", "red"), S("square", "green"), S("triangle", "green"),
        S("star", "yellow"), S("circle", "red"), S("star", "red"),
        S("hexagon", "green"), S("triangle", "yellow"), null,
      ],
    },
    optionVisuals: [S("hexagon", "green"), S("triangle", "yellow"), S("hexagon", "yellow"), S("triangle", "green")],
    options: ["مسدّس أخضر", "مثلث أصفر", "مسدّس أصفر", "مثلث أخضر"],
    answer: 2,
    explanation: "الشكل الأخير في كل صف يأخذ شكل الأول ولون الثاني. في الصف الثالث: شكل المسدّس، ولون المثلث الأصفر = مسدّس أصفر.",
  },
  {
    id: "pat-g12",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [manyDots(1), manyDots(2), manyDots(2), manyDots(2), manyDots(2), manyDots(4), manyDots(3), manyDots(2), null],
    },
    optionVisuals: [manyDots(5), manyDots(9), manyDots(6), manyDots(8)],
    options: ["5 نقاط", "9 نقاط", "6 نقاط", "8 نقاط"],
    answer: 2,
    explanation:
      "عدد النقاط في الشكل الأخير = حاصل ضرب العددين قبله: $1 × 2 = 2$، $2 × 2 = 4$، إذن $3 × 2 = 6$. (الجمع لا يصلح، لأن $1 + 2 = 3$ وليس 2).",
  },
  {
    id: "pat-g13",
    difficulty: 3,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [grid(D1), grid(E1), grid(difference(D1, E1)), grid(D2), grid(E2), grid(difference(D2, E2)), grid(D3), grid(E3), null],
    },
    optionVisuals: [grid(xor(D3, E3)), grid(intersect(D3, E3)), grid(union(D3, E3)), grid(difference(D3, E3))],
    options: ["المربعات المظللة في أحدهما فقط", "المربعات المشتركة", "كل المربعات المظللة", "مربعات الأول بعد حذف مربعات الثاني"],
    answer: 3,
    explanation:
      "الشكل الأخير = الشكل الأول بعد حذف كل مربع مظلل في الشكل الثاني. المربعات الموجودة في الثاني فقط لا تُضاف. في الصف الثالث تُحذف الزاويتان العلوية اليسرى والسفلية اليمنى، فيبقى القطر الآخر.",
  },
  {
    id: "pat-g14",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [halfTurn(0), halfTurn(45), halfTurn(90), halfTurn(90), halfTurn(135), halfTurn(180), halfTurn(180), halfTurn(225), null],
    },
    optionVisuals: [halfTurn(315), halfTurn(270), halfTurn(90), halfTurn(0)],
    options: ["بعد سبعة أثمان دورة", "النصف الملوّن في الأعلى", "النصف الملوّن في الأسفل", "النصف الملوّن يمينًا"],
    answer: 1,
    explanation:
      "في كل صف يدور الشكل ثُمن دورة (45°) مع عقارب الساعة من خانة إلى التي تليها، وكل صف يبدأ بعد ربع دورة من الصف الذي قبله. في الصف الثالث: 180° ← 225° ← 270°، فيصبح النصف الملوّن في الأعلى.",
  },
  {
    id: "pat-g15",
    difficulty: 1,
    prompt: MATRIX,
    visual: { layout: "matrix", cols: 2, cells: [stars(1, "red"), stars(2, "red"), circlesN(1, "green"), null] },
    optionVisuals: [circlesN(1, "green"), circlesN(2, "red"), circlesN(2, "green"), circlesN(3, "green")],
    options: ["دائرة خضراء واحدة", "دائرتان حمراوان", "دائرتان خضراوان", "ثلاث دوائر خضراء"],
    answer: 2,
    explanation: "في كل صف يتضاعف عدد الأشكال ويصغر حجمها، ويبقى نوعها ولونها كما هما: دائرة خضراء ← دائرتان خضراوان.",
  },
  {
    id: "pat-g16",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [
        one(hexagon(34, "red")), one(pentagon(34, "red")), one(square(38, "red")),
        one(pentagon(34, "green")), one(square(38, "green")), one(triangle(36, "green", 50, 54)),
        one(heptagon(34, "yellow")), one(hexagon(34, "yellow")), null,
      ],
    },
    optionVisuals: [one(pentagon(34, "green")), one(square(38, "yellow")), one(hexagon(34, "yellow")), one(pentagon(34, "yellow"))],
    options: ["مخمّس أخضر", "مربع أصفر", "مسدّس أصفر", "مخمّس أصفر"],
    answer: 3,
    explanation: "في كل صف يقل عدد الأضلاع ضلعًا واحدًا من خانة إلى التي تليها، ولكل صف لون ثابت. الصف الثالث: 7 ← 6 ← 5 أضلاع باللون الأصفر = مخمّس أصفر.",
  },
]);

// =====================================================================
// المنطق: اكتشاف القاعدة المشتركة
// =====================================================================

const inner = (outer: Shape, innerShape: Shape) => g(outer, innerShape);

export const logicShapeQuestions = defineOriginalQuestions("logic", [
  {
    id: "log-g01",
    difficulty: 2,
    prompt: "الأشكال في الأعلى تشترك في قاعدة واحدة. أي خيار ينتمي إليها؟",
    visual: {
      layout: "group",
      caption: "أشكال تتبع القاعدة",
      cells: [
        inner(circle(36), circle(15, "black")),
        inner(square(40), square(17, "black")),
        inner(triangle(40, "white", 50, 56), triangle(16, "black", 50, 60)),
      ],
    },
    optionVisuals: [
      inner(square(40), circle(15, "black")),
      inner(pentagon(38), ngon(5, 16, "black")),
      inner(hexagon(38), ngon(6, 16, "white")),
      inner(triangle(40, "black", 50, 56), triangle(16, "white", 50, 60)),
    ],
    options: ["مربع بداخله دائرة سوداء", "مخمّس أبيض بداخله مخمّس أسود", "مسدّس أبيض بداخله مسدّس أبيض", "مثلث أسود بداخله مثلث أبيض"],
    answer: 1,
    explanation:
      "القاعدة: شكل أبيض كبير، بداخله شكل أسود صغير من النوع نفسه. الخيار الصحيح مخمّس أبيض بداخله مخمّس أسود. أما الخيارات الأخرى فإما أن الشكلين مختلفان، وإما أن الألوان غير صحيحة.",
  },
  {
    id: "log-g02",
    difficulty: 3,
    prompt: "الأشكال في الأعلى تشترك في صفة واحدة. أي خيار ينتمي إليها؟",
    visual: {
      layout: "group",
      caption: "أشكال تشترك في صفة",
      cells: [one(square(38, "light")), one(hexagon(36, "light")), one({ t: "rect", x: 12, y: 30, w: 76, h: 40, fill: "light" })],
    },
    optionVisuals: [one(pentagon(36, "light")), one(triangle(38, "light", 50, 54)), one(ngon(8, 36, "light", -67.5)), one(heptagon(36, "light"))],
    options: ["مخمّس", "مثلث", "مثمّن", "مسبّع"],
    answer: 2,
    explanation:
      "كل الأشكال في الأعلى عدد أضلاعها زوجي: المربع 4، والمسدّس 6، والمستطيل 4. ومن الخيارات، وحده المثمّن عدد أضلاعه زوجي (8). المخمّس 5، والمثلث 3، والمسبّع 7.",
  },
]);

// =====================================================================
// حل المشكلات: الموازين
// =====================================================================

export const problemShapeQuestions = defineOriginalQuestions("problem-solving", [
  {
    id: "prb-g01",
    difficulty: 1,
    prompt: "الميزان متوازن: دائرة واحدة تساوي في الوزن مربعين. كم مربعًا يوازن 3 دوائر؟",
    visual: { layout: "single", glyph: balance(["circle"], ["square", "square"]) },
    options: ["3", "5", "6", "9"],
    answer: 2,
    explanation: "كل دائرة تساوي مربعين، إذن 3 دوائر تساوي $3 × 2 = 6$ مربعات.",
  },
  {
    id: "prb-g02",
    difficulty: 2,
    prompt: "الميزانان متوازنان. كم مثلثًا يوازن دائرة واحدة؟",
    visual: {
      layout: "group",
      cells: [balance(["circle"], ["square", "square"]), balance(["square"], ["triangle", "triangle", "triangle"])],
    },
    options: ["3", "5", "6", "4"],
    answer: 2,
    explanation: "من الميزان الأول: الدائرة = مربعان. ومن الثاني: المربع = 3 مثلثات. إذن الدائرة = $2 × 3 = 6$ مثلثات.",
  },
  {
    id: "prb-g03",
    difficulty: 3,
    prompt: "الميزانان متوازنان. كم مثلثًا يوازن دائرة واحدة؟",
    visual: {
      layout: "group",
      cells: [
        balance(["circle", "circle"], ["square", "square", "square"]),
        balance(["square", "circle"], ["triangle", "triangle", "triangle", "triangle", "triangle"]),
      ],
    },
    options: ["2", "3", "4", "5"],
    answer: 1,
    explanation:
      "نجرّب: لو كانت الدائرة = 3 مثلثات، فمن الميزان الأول: دائرتان = 6 مثلثات = 3 مربعات، أي المربع = مثلثان. نتحقق من الميزان الثاني: مربع + دائرة = $2 + 3 = 5$ مثلثات ✓.",
  },
]);

// =====================================================================
// الأشكال والعلاقات المكانية
// =====================================================================

const twoTriangles = g(ngon(3, 38, "light", -90), ngon(3, 38, "none", 90));
const splitTriangle = g(
  { t: "poly", pts: [50, 12, 10, 88, 90, 88], fill: "white" },
  { t: "line", x1: 50, y1: 12, x2: 37, y2: 88 },
  { t: "line", x1: 50, y1: 12, x2: 63, y2: 88 },
  { t: "line", x1: 30, y1: 50, x2: 70, y2: 50 },
);

export const spatialShapeQuestions2 = defineOriginalQuestions("spatial", [
  {
    id: "spa-g01",
    difficulty: 1,
    prompt: "كم مربعًا (بكل الأحجام) في الشكل؟",
    visual: { layout: "single", glyph: grid([], 2, 2, "white", 70) },
    options: ["4", "5", "6", "8"],
    answer: 1,
    explanation: "4 مربعات صغيرة، ومربع كبير واحد يتكوّن منها جميعًا: $4 + 1 = 5$.",
  },
  {
    id: "spa-g02",
    difficulty: 2,
    prompt: "كم مثلثًا في الشكل؟",
    visual: { layout: "single", glyph: twoTriangles },
    options: ["2", "6", "8", "10"],
    answer: 2,
    explanation: "المثلثان الكبيران المتداخلان: 2. وتتكوّن من تداخلهما 6 مثلثات صغيرة عند الرؤوس. المجموع $2 + 6 = 8$.",
  },
  {
    id: "spa-g03",
    difficulty: 2,
    prompt: "كم مكعبًا في المجسّم؟ (المكعبات مرصوصة دون فراغات تحتها)",
    visual: { layout: "single", glyph: isoCubes([[0, 0, 0], [0, 0, 1], [0, 0, 2], [1, 0, 0], [1, 0, 1], [2, 0, 0]]) },
    options: ["5", "6", "7", "4"],
    answer: 1,
    explanation: "المجسّم درج من ثلاثة أعمدة: الأول 3 مكعبات، والثاني 2، والثالث 1. المجموع $3 + 2 + 1 = 6$.",
  },
  {
    id: "spa-g04",
    difficulty: 3,
    prompt: "كم مكعبًا في المجسّم؟ (لا توجد فراغات داخل المجسّم ولا تحت أي مكعب)",
    visual: {
      layout: "single",
      glyph: isoCubes([[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1]]),
    },
    options: ["6", "7", "8", "5"],
    answer: 1,
    explanation:
      "في الطبقة السفلى 4 مكعبات (أحدها في الخلف لا يظهر، لكنه موجود لأن مكعبًا يرتكز فوقه)، وفي الطبقة العليا 3 مكعبات. المجموع $4 + 3 = 7$. هو مكعب $2 × 2 × 2$ نُزع منه مكعب واحد.",
  },
  {
    id: "spa-g05",
    difficulty: 3,
    prompt:
      "طُويت ورقة مربعة على قطرها، فوُضع المثلث السفلي الأيسر (المتقطع) فوق المثلث العلوي الأيمن، ثم ثُقبت الطبقتان معًا. كيف تبدو الورقة بعد فتحها؟",
    visual: {
      layout: "single",
      glyph: g(
        { t: "rect", x: 10, y: 10, w: 80, h: 80, fill: "none", dash: true },
        { t: "poly", pts: [10, 10, 90, 10, 90, 90], fill: "white" },
        dot(70, 35, 5),
      ),
    },
    optionVisuals: [paper([[70, 35], [30, 35]]), paper([[70, 35], [70, 65]]), paper([[70, 35], [30, 65]]), paper([[70, 35], [35, 70]])],
    options: ["ثقبان في الصف نفسه", "ثقبان فوق بعضهما", "ثقبان متقابلان حول المركز", "ثقبان متقابلان حول القطر"],
    answer: 3,
    explanation:
      "خط الطي هو القطر من الزاوية العلوية اليسرى إلى السفلية اليمنى. عند الفتح يظهر ثقب ثانٍ في صورة الأول المنعكسة حول هذا القطر: ما كان قريبًا من الأعلى وإلى اليمين يصبح قريبًا من اليسار وإلى الأسفل.",
  },
  {
    id: "spa-g06",
    difficulty: 2,
    prompt: "كيف يبدو الشكل بعد تدويره نصف دورة؟",
    visual: { layout: "single", glyph: colorGrid(M6) },
    optionVisuals: [colorGrid(mapMirror(M6)), colorGrid(mapRot180(M6)), colorGrid(mapFlipV(M6)), colorGrid(mapRot90(M6))],
    options: ["صورته في مرآة عمودية", "بعد نصف دورة", "صورته في مرآة أفقية", "بعد ربع دورة"],
    answer: 1,
    explanation:
      "في نصف الدورة ينتقل كل مربع إلى الجهة المقابلة تمامًا حول المركز: ما كان في الأعلى يسارًا يصبح في الأسفل يمينًا، وهكذا. انتبه: هذا يختلف عن صورة المرآة.",
  },
  {
    id: "spa-g07",
    difficulty: 2,
    prompt: "الخط المتقطع مرآة أفقية. ما صورة الشكل في المرآة؟",
    visual: { layout: "mirror", axis: "horizontal", glyph: colorGrid(M7) },
    optionVisuals: [colorGrid(M7), colorGrid(mapMirror(M7)), colorGrid(mapFlipV(M7)), colorGrid(mapRot180(M7))],
    options: ["الشكل نفسه", "مقلوب بين اليمين واليسار", "مقلوب بين الأعلى والأسفل", "بعد نصف دورة"],
    answer: 2,
    explanation:
      "المرآة الأفقية تقلب الأعلى والأسفل، ويبقى اليمين واليسار كما هما: الصف العلوي يصبح سفليًا، والصف الأوسط يبقى في مكانه.",
  },
  {
    id: "spa-g08",
    difficulty: 1,
    prompt: "تبدأ النقطة من مركز الشبكة، ثم تتحرك خانة واحدة في كل مرة: يمينًا، يمينًا، إلى الأعلى، إلى الأعلى. أين تصل؟",
    visual: { layout: "single", glyph: pos5(12) },
    optionVisuals: [pos5(0), pos5(4), pos5(24), pos5(3)],
    options: ["الزاوية العلوية اليسرى", "الزاوية العلوية اليمنى", "الزاوية السفلية اليمنى", "الصف العلوي قبل الزاوية اليمنى"],
    answer: 1,
    explanation: "من المركز: خانتان إلى اليمين تصلان إلى العمود الأخير، ثم خانتان إلى الأعلى تصلان إلى الصف الأول. النتيجة: الزاوية العلوية اليمنى.",
  },
  {
    id: "spa-g09",
    difficulty: 2,
    prompt:
      "تبدأ النقطة من مركز الشبكة، ثم تتحرك خانة واحدة في كل مرة: إلى الأعلى، يسارًا، يسارًا، إلى الأسفل، إلى الأسفل، إلى الأسفل. أين تصل؟",
    visual: { layout: "single", glyph: pos5(12) },
    optionVisuals: [pos5(15), pos5(24), pos5(0), pos5(20)],
    options: ["العمود الأيسر قبل الزاوية", "الزاوية السفلية اليمنى", "الزاوية العلوية اليسرى", "الزاوية السفلية اليسرى"],
    answer: 3,
    explanation:
      "نتتبّع الحركة: إلى الأعلى (صف واحد للأعلى)، ثم يسارًا مرتين (إلى العمود الأول)، ثم إلى الأسفل 3 مرات: من الصف الثاني إلى الصف الخامس. النتيجة: الزاوية السفلية اليسرى. (أعلى مرة وأسفل 3 مرات = أسفل مرتين من المركز).",
  },
  {
    id: "spa-g10",
    difficulty: 3,
    prompt:
      "ثلاث بكرات تربطها أحزمة. البكرة الأولى (على اليمين) تدور مع عقارب الساعة. الحزام بين الأولى والثانية متقاطع، وبين الثانية والثالثة مستقيم. في أي اتجاه تدور البكرة الثالثة (على اليسار)؟",
    visual: { layout: "single", glyph: pulleys() },
    options: ["مع اتجاه عقارب الساعة", "عكس اتجاه عقارب الساعة", "لا تدور", "مرة مع ومرة عكس"],
    answer: 1,
    explanation:
      "الحزام المتقاطع يعكس اتجاه الدوران، والحزام المستقيم يحافظ عليه. الأولى مع عقارب الساعة ← الثانية عكسها (حزام متقاطع) ← الثالثة عكسها أيضًا (حزام مستقيم).",
  },
  {
    id: "spa-g11",
    difficulty: 1,
    prompt: "أي شكل مختلف عن البقية؟",
    optionVisuals: [one(star(5)), rotate(one(star(5)), 20), one(star(6)), rotate(one(star(5)), 50)],
    options: ["نجمة خماسية", "نجمة خماسية مائلة", "نجمة سداسية", "نجمة خماسية مائلة أكثر"],
    answer: 2,
    explanation: "ثلاث نجوم لها 5 رؤوس لكنها مدارة بزوايا مختلفة، والدوران لا يغيّر الشكل. أما النجمة المختلفة فلها 6 رؤوس.",
  },
  {
    id: "spa-g12",
    difficulty: 2,
    prompt: "أي شكل مختلف عن البقية؟",
    optionVisuals: [pie(4, [0, 1, 2], "green"), pie(4, [1, 2, 3], "green"), pie(4, [0, 1], "green"), pie(4, [0, 2, 3], "green")],
    options: ["ثلاثة أرباع ملوّنة", "ثلاثة أرباع ملوّنة (بعد دوران)", "ربعان ملوّنان", "ثلاثة أرباع ملوّنة (بدوران آخر)"],
    answer: 2,
    explanation: "ثلاثة أشكال لُوّن فيها ثلاثة أرباع الدائرة، لكن بدورانات مختلفة. الشكل المختلف لُوّن فيه ربعان فقط، أي نصف الدائرة.",
  },
  {
    id: "spa-g13",
    difficulty: 2,
    prompt: "أي شكل ليس له أي محور تماثل؟",
    optionVisuals: [grid([1, 3, 4, 5, 7], 3, 3, "blue"), grid([0, 1, 4, 8], 3, 3, "blue"), grid([0, 2, 4, 6, 8], 3, 3, "blue"), grid([0, 1, 2, 4, 7], 3, 3, "blue")],
    options: ["علامة +", "شكل غير منتظم", "علامة X", "حرف T"],
    answer: 1,
    explanation:
      "علامة + وعلامة X لهما عدة محاور تماثل، وشكل T له محور عمودي. أما الشكل الثاني فلا يوجد خط يقسمه إلى نصفين متطابقين، لا عموديًا ولا أفقيًا ولا قطريًا.",
  },
  {
    id: "spa-g14",
    difficulty: 3,
    prompt: "كم مثلثًا في الشكل؟",
    visual: { layout: "single", glyph: splitTriangle },
    options: ["6", "9", "12", "15"],
    answer: 2,
    explanation:
      "كل مثلث في الشكل له رأس في القمة. نختار له قاعدة: إما على الخط الأفقي الأوسط (عليه 4 نقاط، فيها 6 قواعد ممكنة)، وإما على القاعدة السفلية (4 نقاط، 6 قواعد). المجموع $6 + 6 = 12$.",
  },
  {
    id: "spa-g15",
    difficulty: 2,
    prompt: "هذه صورة ساعة في المرآة. ما الوقت الحقيقي؟",
    visual: { layout: "single", glyph: clock(300, 0) },
    options: ["10:00", "2:00", "4:00", "8:00"],
    answer: 1,
    explanation:
      "المرآة تقلب اليمين واليسار. العقرب الطويل على 12 لا يتغير، والعقرب القصير يبدو على 10، وفي الحقيقة هو على الرقم المقابل له حول الخط العمودي: 2. إذن الوقت الحقيقي 2:00.",
  },
  {
    id: "spa-g16",
    difficulty: 1,
    prompt: ANALOGY,
    visual: {
      layout: "analogy",
      cells: [one(triangle(40, "white", 50, 54)), one(triangle(20, "blue", 50, 54)), one(star(5, "white", 40, 17))],
    },
    optionVisuals: [one(star(5, "blue", 40, 17)), one(star(5, "white", 20, 9)), one(star(5, "blue", 20, 9)), one(pentagon(20, "blue"))],
    options: ["نجمة زرقاء كبيرة", "نجمة بيضاء صغيرة", "نجمة زرقاء صغيرة", "مخمّس أزرق صغير"],
    answer: 2,
    explanation: "الشكل يصغر ويُلوَّن بالأزرق، ويبقى نوعه كما هو. إذن النجمة البيضاء الكبيرة تصبح نجمة زرقاء صغيرة.",
  },
  {
    id: "spa-g17",
    difficulty: 2,
    prompt: ANALOGY,
    visual: { layout: "analogy", cells: [one(triangle(38, "white", 50, 54)), manyDots(3), one(pentagon(36))] },
    optionVisuals: [manyDots(4), manyDots(5), manyDots(6), one(pentagon(20, "black"))],
    options: ["4 نقاط", "5 نقاط", "6 نقاط", "مخمّس صغير أسود"],
    answer: 1,
    explanation: "عدد النقاط يساوي عدد أضلاع الشكل: للمثلث 3 أضلاع ← 3 نقاط، وللمخمّس 5 أضلاع ← 5 نقاط.",
  },
  {
    id: "spa-g18",
    difficulty: 3,
    prompt: ANALOGY,
    visual: { layout: "analogy", cells: [colorGrid(A18), colorGrid(mapSwap(mapRot90(A18), "black", "blue")), colorGrid(C18)] },
    optionVisuals: [
      colorGrid(mapRot90(C18)),
      colorGrid(mapSwap(C18, "black", "blue")),
      colorGrid(mapSwap(mapRot270(C18), "black", "blue")),
      colorGrid(mapSwap(mapRot90(C18), "black", "blue")),
    ],
    options: ["بعد ربع دورة فقط", "تبادل الألوان فقط", "ربع دورة عكس عقارب الساعة وتبادل الألوان", "ربع دورة مع عقارب الساعة وتبادل الألوان"],
    answer: 3,
    explanation:
      "من الشكل الأول إلى الثاني حدث أمران: دار الشكل ربع دورة مع عقارب الساعة، وتبادل اللونان الأسود والأزرق. نطبّق الأمرين على الشكل الثالث.",
  },
]);

/ للاختبارات */
export const BATCH2_SETS = { D1, E1, D2, E2, D3, E3, M6, M7, A18, C18, latin };
