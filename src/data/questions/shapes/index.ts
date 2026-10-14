import { defineOriginalQuestions } from "../define";
import {
  BORDER_CW,
  arrow,
  circle,
  complement,
  curvedArrow,
  diamond,
  dot,
  dots,
  gear,
  glyph,
  grid,
  heptagon,
  hexagon,
  intersect,
  lineThrough,
  mirror,
  net,
  pentagon,
  rectangle,
  rot180,
  rot270,
  rot90,
  rotate,
  square,
  triangle,
  union,
  xor,
} from "./kit";
import type { Glyph, Paint, Shape } from "@/lib/types";

/*
 * أسئلة أشكال أصلية من إعداد المنصة، مرسومة برمجيًا.
 * أنواع القواعد (الدوران، التراكب، الانعكاس...) أفكار عامة شائعة في اختبارات التفكير،
 * لكن كل سؤال هنا مصمَّم من جديد ولا يُنسخ من أي مصدر منشور.
 */

const SEQ = "ما الشكل الذي يأتي مكان علامة الاستفهام؟ (تُقرأ السلسلة من اليسار إلى اليمين)";
const MATRIX = "ما الشكل الذي يكمل الجدول؟ (يُقرأ كل صف من اليسار إلى اليمين)";
const ANALOGY = "الشكل الأول بالنسبة إلى الثاني، كالشكل الثالث بالنسبة إلى أي شكل؟";
const ODD = "أي شكل مختلف عن البقية؟";

const g = glyph;
const shape = (s: Shape) => g(s);

// شكل خارجي مع نقطة داخلية (للسؤال pat-f07)
const DOT_POS: Record<string, [number, number]> = {
  top: [50, 36],
  right: [64, 50],
  bottom: [50, 62],
  left: [36, 50],
};
const OUTER: Record<string, () => Shape> = {
  circle: () => circle(34),
  square: () => square(38),
  triangle: () => triangle(38, "white", 50, 54),
};
const outerDot = (o: string, p: string) => g(OUTER[o](), dot(...DOT_POS[p]));

const lines = (...degs: number[]) => g(...degs.map((d) => lineThrough(d)));
const tri = (deg: number, fill: Paint) => rotate(g(triangle(36, fill, 50, 54)), deg);

// شكل داخل شكل (للسؤال pat-f16)
const nested = (outer: Shape, inner: Shape) => g(outer, inner);

// أعداد صغيرة من الأشكال (للسؤال spa-f04)
const POS: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 50], [70, 50]],
  3: [[50, 30], [30, 68], [70, 68]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
};
const many = (n: number, kind: "circle" | "square") =>
  g(...POS[n].map(([x, y]) => (kind === "circle" ? circle(13, "black", x, y) : square(17, "black", x, y))));

// ورقة مطوية ومثقوبة
const paper = (holes: [number, number][]): Glyph =>
  g({ t: "rect", x: 10, y: 10, w: 80, h: 80, fill: "white" }, ...holes.map(([x, y]) => dot(x, y, 5)));

// =====================================================================
// الأنماط: سلاسل وجداول أشكال
// =====================================================================

const L1 = [0, 1, 4];
const R1 = [1, 2];
const L2 = [3, 4, 5];
const R2 = [4, 7];
const L3 = [0, 4, 8];
const R3 = [2, 4, 6];

const I1 = [0, 1, 2, 4];
const J1 = [1, 4, 7];
const I2 = [3, 4, 5, 6];
const J2 = [0, 3, 6];
const I3 = [0, 2, 4, 6, 8];
const J3 = [2, 5, 8];

export const patternShapeQuestions = defineOriginalQuestions("patterns", [
  {
    id: "pat-f01",
    difficulty: 1,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [arrow(0), arrow(45), arrow(90), null] },
    optionVisuals: [arrow(135), arrow(180), arrow(45), arrow(270)],
    options: ["سهم مائل إلى الأسفل واليمين", "سهم إلى الأسفل", "سهم مائل إلى الأعلى واليمين", "سهم إلى اليسار"],
    answer: 0,
    explanation:
      "يدور السهم ثُمن دورة (45°) مع عقارب الساعة في كل خطوة: إلى الأعلى ← مائل إلى الأعلى واليمين ← إلى اليمين ← ثم مائل إلى الأسفل واليمين.",
  },
  {
    id: "pat-f02",
    difficulty: 1,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [dots(1), dots(2), dots(3), null] },
    optionVisuals: [dots(5), dots(4), dots(6), dots(3)],
    options: ["5 نقاط", "4 نقاط", "6 نقاط", "3 نقاط"],
    answer: 1,
    explanation: "عدد النقاط يزيد واحدًا في كل خطوة: 1، 2، 3، ثم 4.",
  },
  {
    id: "pat-f03",
    difficulty: 1,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [shape(triangle()), shape(square()), shape(pentagon()), null] },
    optionVisuals: [shape(pentagon()), shape(heptagon()), shape(hexagon()), shape(circle())],
    options: ["مخمّس", "مسبّع", "مسدّس", "دائرة"],
    answer: 2,
    explanation: "عدد الأضلاع يزيد ضلعًا واحدًا في كل خطوة: مثلث (3)، مربع (4)، مخمّس (5)، ثم مسدّس (6).",
  },
  {
    id: "pat-f04",
    difficulty: 2,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [grid([0]), grid([1]), grid([2]), null] },
    optionVisuals: [grid([3]), grid([8]), grid([4]), grid([5])],
    options: [
      "المربع الأسود في وسط العمود الأيسر",
      "المربع الأسود في الزاوية السفلية اليمنى",
      "المربع الأسود في المركز",
      "المربع الأسود في وسط العمود الأيمن",
    ],
    answer: 3,
    explanation:
      "المربع الأسود يتحرك خطوة واحدة على الإطار الخارجي مع عقارب الساعة: الزاوية العلوية اليسرى ← الوسط العلوي ← الزاوية العلوية اليمنى ← ثم ينزل إلى وسط العمود الأيمن.",
  },
  {
    id: "pat-f05",
    difficulty: 2,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [tri(0, "black"), tri(90, "white"), tri(180, "black"), null] },
    optionVisuals: [tri(270, "black"), tri(0, "white"), tri(270, "white"), tri(90, "white")],
    options: ["مثلث أسود يشير إلى اليسار", "مثلث أبيض يشير إلى الأعلى", "مثلث أبيض يشير إلى اليسار", "مثلث أبيض يشير إلى اليمين"],
    answer: 2,
    explanation:
      "يتغير أمران معًا: يدور المثلث ربع دورة مع عقارب الساعة (أعلى ← يمين ← أسفل ← يسار)، ويتبدّل لونه بين الأسود والأبيض. الرابع: مثلث أبيض يشير إلى اليسار.",
  },
  {
    id: "pat-f06",
    difficulty: 2,
    prompt: SEQ,
    visual: { layout: "sequence", cells: [lines(0), lines(0, 90), lines(0, 90, 45), null] },
    optionVisuals: [lines(0, 90, 135), lines(0, 90, 45, 135), lines(45, 135), lines(0)],
    options: ["ثلاثة خطوط", "أربعة خطوط", "خطان متقاطعان مائلان", "خط واحد"],
    answer: 1,
    explanation:
      "في كل خطوة يُضاف خط جديد يمر بالمركز، وتبقى الخطوط السابقة: 1 ثم 2 ثم 3، فالشكل الرابع فيه 4 خطوط (عمودي وأفقي وقطران).",
  },
  {
    id: "pat-f07",
    difficulty: 3,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [outerDot("circle", "top"), outerDot("square", "right"), outerDot("triangle", "bottom"), null],
    },
    optionVisuals: [
      outerDot("square", "left"),
      outerDot("circle", "top"),
      outerDot("triangle", "left"),
      outerDot("circle", "left"),
    ],
    options: ["مربع والنقطة يسارًا", "دائرة والنقطة في الأعلى", "مثلث والنقطة يسارًا", "دائرة والنقطة يسارًا"],
    answer: 3,
    explanation:
      "يتغير أمران كلٌّ بقاعدته: الشكل الخارجي يتكرر (دائرة، مربع، مثلث) فيعود إلى الدائرة، والنقطة تدور داخله مع عقارب الساعة (أعلى، يمين، أسفل) فتنتقل إلى اليسار.",
  },
  {
    id: "pat-f08",
    difficulty: 2,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [grid([4]), grid([1, 4, 7]), grid([1, 3, 4, 5, 7]), grid([0, 1, 3, 4, 5, 7, 8]), null],
    },
    optionVisuals: [
      grid([0, 1, 3, 4, 5, 6, 7, 8]),
      grid([0, 1, 2, 3, 4, 5, 6, 7, 8]),
      grid([1, 2, 3, 4, 5, 6, 7]),
      grid([0, 2, 4, 6, 8]),
    ],
    options: ["8 مربعات مظللة", "الشبكة كلها مظللة (9)", "7 مربعات مظللة", "5 مربعات على شكل X"],
    answer: 1,
    explanation: "عدد المربعات المظللة يزيد 2 في كل خطوة: 1، 3، 5، 7، فالتالي 9، أي الشبكة كلها مظللة.",
  },
  {
    id: "pat-f09",
    difficulty: 1,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 2,
      cells: [shape(circle(34, "black")), shape(circle(18, "black")), shape(square(40)), null],
    },
    optionVisuals: [shape(square(22, "black")), shape(square(40)), shape(circle(18)), shape(square(22))],
    options: ["مربع أسود صغير", "مربع أبيض كبير", "دائرة بيضاء صغيرة", "مربع أبيض صغير"],
    answer: 3,
    explanation: "في كل صف يبقى الشكل ولونه كما هما، لكنه يصغر. إذن المربع الأبيض الكبير يصبح مربعًا أبيض صغيرًا.",
  },
  {
    id: "pat-f10",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [
        shape(circle(30, "black")), shape(square(36, "gray")), shape(triangle(34, "white")),
        shape(square(36, "black")), shape(triangle(34, "gray")), shape(circle(30, "white")),
        shape(triangle(34, "black")), shape(circle(30, "gray")), null,
      ],
    },
    optionVisuals: [shape(square(36, "gray")), shape(square(36, "white")), shape(triangle(34, "white")), shape(square(36, "black"))],
    options: ["مربع رمادي", "مربع أبيض", "مثلث أبيض", "مربع أسود"],
    answer: 1,
    explanation:
      "في كل صف وكل عمود تظهر الأشكال الثلاثة (دائرة، مربع، مثلث) مرة واحدة، ولكل عمود لون ثابت. ينقص الصف الثالث المربع، ولون العمود الأخير أبيض.",
  },
  {
    id: "pat-f11",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [
        grid([0]), grid([8]), grid(union([0], [8])),
        grid([1, 4]), grid([7]), grid(union([1, 4], [7])),
        grid([2]), grid([4, 6]), null,
      ],
    },
    optionVisuals: [grid(union([2], [4, 6])), grid([2, 6]), grid([0, 4, 8]), grid([2, 4, 6, 8])],
    options: ["قطر من الزاوية العلوية اليمنى إلى السفلية اليسرى", "زاويتان فقط", "القطر الآخر", "قطر وزاوية إضافية"],
    answer: 0,
    explanation:
      "الشكل الأخير في كل صف هو تراكب الشكلين الأولين: نجمع المربعات المظللة فيهما معًا. في الصف الثالث: الزاوية العلوية اليمنى + المركز والزاوية السفلية اليسرى = قطر كامل.",
  },
  {
    id: "pat-f12",
    difficulty: 3,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [grid(L1), grid(R1), grid(xor(L1, R1)), grid(L2), grid(R2), grid(xor(L2, R2)), grid(L3), grid(R3), null],
    },
    optionVisuals: [grid(union(L3, R3)), grid(intersect(L3, R3)), grid(xor(L3, R3)), grid([0, 8])],
    options: ["الزوايا الأربع والمركز", "المركز فقط", "الزوايا الأربع فقط", "زاويتان متقابلتان"],
    answer: 2,
    explanation:
      "الشكل الأخير يحتفظ فقط بالمربعات المظللة في أحد الشكلين دون الآخر، أما المربع المظلل في الشكلين معًا فيُحذف. في الصف الثالث المركز مظلل في الشكلين فيُحذف، وتبقى الزوايا الأربع.",
  },
  {
    id: "pat-f13",
    difficulty: 3,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [
        grid(I1), grid(J1), grid(intersect(I1, J1)),
        grid(I2), grid(J2), grid(intersect(I2, J2)),
        grid(I3), grid(J3), null,
      ],
    },
    optionVisuals: [grid(J3), grid([8]), grid(union(I3, J3)), grid(intersect(I3, J3))],
    options: ["العمود الأيمن كاملًا", "الزاوية السفلية اليمنى فقط", "كل المربعات المظللة في الشكلين", "الزاويتان اليمنيان فقط"],
    answer: 3,
    explanation:
      "الشكل الأخير في كل صف يحتفظ فقط بالمربعات المظللة في الشكلين معًا (المشتركة). في الصف الثالث المشترك هو الزاويتان العلوية اليمنى والسفلية اليمنى.",
  },
  {
    id: "pat-f14",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [dots(1), dots(2), dots(3), dots(2), dots(2), dots(4), dots(3), dots(2), null],
    },
    optionVisuals: [dots(6), dots(5), dots(1), dots(4)],
    options: ["6 نقاط", "5 نقاط", "نقطة واحدة", "4 نقاط"],
    answer: 1,
    explanation: "عدد النقاط في الشكل الأخير من كل صف = مجموع النقاط في الشكلين الأولين. في الصف الثالث: $3 + 2 = 5$.",
  },
  {
    id: "pat-f15",
    difficulty: 3,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 3,
      cells: [arrow(0), arrow(90), arrow(180), arrow(90), arrow(180), arrow(270), arrow(180), arrow(270), null],
    },
    optionVisuals: [arrow(90), arrow(270), arrow(0), arrow(180)],
    options: ["سهم إلى اليمين", "سهم إلى اليسار", "سهم إلى الأعلى", "سهم إلى الأسفل"],
    answer: 2,
    explanation:
      "في كل صف يدور السهم ربع دورة مع عقارب الساعة من شكل إلى الذي يليه. في الصف الثالث: إلى الأسفل ← إلى اليسار ← إلى الأعلى.",
  },
  {
    id: "pat-f16",
    difficulty: 2,
    prompt: MATRIX,
    visual: {
      layout: "matrix",
      cols: 2,
      cells: [
        nested(square(42), circle(13, "black")),
        nested(circle(36, "black"), square(15)),
        nested(triangle(42, "white", 50, 56), diamond(13, "black", 50, 60)),
        null,
      ],
    },
    optionVisuals: [
      nested(diamond(42), triangle(14, "black", 50, 52)),
      nested(triangle(42, "black", 50, 56), diamond(13, "white", 50, 60)),
      nested(diamond(42, "black"), triangle(14, "white", 50, 52)),
      nested(diamond(42), triangle(14, "white", 50, 52)),
    ],
    options: [
      "معيّن أبيض بداخله مثلث أسود",
      "مثلث أسود بداخله معيّن أبيض",
      "معيّن أسود بداخله مثلث أبيض",
      "معيّن أبيض بداخله مثلث أبيض",
    ],
    answer: 2,
    explanation:
      "الشكلان الخارجي والداخلي يتبادلان مكانيهما، وكل شكل يحمل لونه معه: في الصف الأول صارت الدائرة السوداء الصغيرة كبيرة في الخارج، والمربع الأبيض صغيرًا في الداخل. إذن: معيّن أسود كبير بداخله مثلث أبيض صغير.",
  },
  {
    id: "pat-f17",
    difficulty: 1,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [shape(circle(30, "black")), shape(square(38)), shape(circle(30, "black")), shape(square(38)), null],
    },
    optionVisuals: [shape(square(38)), shape(square(38, "black")), shape(circle(30, "black")), shape(circle(30))],
    options: ["مربع أبيض", "مربع أسود", "دائرة سوداء", "دائرة بيضاء"],
    answer: 2,
    explanation: "النمط يتكرر كل شكلين: دائرة سوداء ثم مربع أبيض. الشكل الخامس يعيد بداية النمط: دائرة سوداء.",
  },
  {
    id: "pat-f18",
    difficulty: 3,
    prompt: SEQ,
    visual: {
      layout: "sequence",
      cells: [grid([BORDER_CW[0]]), grid([BORDER_CW[2]]), grid([BORDER_CW[4]]), null],
    },
    optionVisuals: [grid([7]), grid([BORDER_CW[6]]), grid([3]), grid([5])],
    options: [
      "المربع الأسود في وسط الصف السفلي",
      "المربع الأسود في الزاوية السفلية اليسرى",
      "المربع الأسود في وسط العمود الأيسر",
      "المربع الأسود في وسط العمود الأيمن",
    ],
    answer: 1,
    explanation:
      "المربع الأسود يقفز خانتين على الإطار مع عقارب الساعة في كل مرة: الزاوية العلوية اليسرى ← العلوية اليمنى ← السفلية اليمنى ← ثم السفلية اليسرى.",
  },
]);

// =====================================================================
// الأشكال والعلاقات المكانية: قياس، تصنيف، مرايا، طيّ، مسنّنات، شبكات
// =====================================================================

const A18 = [0, 3, 6, 7];
const C18 = [0, 1, 4, 7];
const A19 = [0, 1, 3, 6];
const C19 = [0, 4, 5, 8];
const A21 = [0, 1, 3];
const C21 = [0, 1, 5];
const P24 = [0, 1, 3, 6];
const M26 = [0, 3, 4, 7];
const S34 = [0, 3, 4, 5];

const blue = (cells: number[]) => grid(cells, 3, 3, "blue");
const halfLeft: Shape = { t: "rect", x: 10, y: 10, w: 40, h: 80, fill: "none", dash: true };

export const spatialShapeQuestions = defineOriginalQuestions("spatial", [
  {
    id: "spa-f01",
    difficulty: 1,
    prompt: ANALOGY,
    visual: { layout: "analogy", cells: [shape(square(38, "black")), shape(square(38)), shape(triangle(38, "black"))] },
    optionVisuals: [shape(triangle(38, "black")), shape(circle(32)), shape(triangle(38)), shape(square(38))],
    options: ["مثلث أسود", "دائرة بيضاء", "مثلث أبيض", "مربع أبيض"],
    answer: 2,
    explanation: "الشكل يبقى كما هو ويتغير لونه من الأسود إلى الأبيض. إذن المثلث الأسود يصبح مثلثًا أبيض.",
  },
  {
    id: "spa-f02",
    difficulty: 2,
    prompt: ANALOGY,
    visual: { layout: "analogy", cells: [blue(A18), blue(rot90(A18)), blue(C18)] },
    optionVisuals: [blue(rot270(C18)), blue(rot90(C18)), blue(mirror(C18)), blue(rot180(C18))],
    options: ["الشكل بعد ربع دورة عكس عقارب الساعة", "الشكل بعد ربع دورة مع عقارب الساعة", "صورة الشكل في المرآة", "الشكل بعد نصف دورة"],
    answer: 1,
    explanation: "الشكل الثاني هو الشكل الأول بعد تدويره ربع دورة مع عقارب الساعة. نطبّق الدوران نفسه على الشكل الثالث.",
  },
  {
    id: "spa-f03",
    difficulty: 2,
    prompt: ANALOGY,
    visual: { layout: "analogy", cells: [blue(A19), blue(mirror(A19)), blue(C19)] },
    optionVisuals: [blue(C19), blue(rot90(C19)), blue(rot180(C19)), blue(mirror(C19))],
    options: ["الشكل نفسه دون تغيير", "الشكل بعد ربع دورة", "الشكل بعد نصف دورة", "صورة الشكل في المرآة"],
    answer: 3,
    explanation: "الشكل الثاني صورة الشكل الأول في مرآة عمودية: ينقلب اليمين واليسار ويبقى الأعلى والأسفل. نطبّق الانعكاس نفسه على الشكل الثالث.",
  },
  {
    id: "spa-f04",
    difficulty: 1,
    prompt: ANALOGY,
    visual: { layout: "analogy", cells: [many(1, "circle"), many(2, "circle"), many(2, "square")] },
    optionVisuals: [many(3, "square"), many(4, "square"), many(4, "circle"), many(2, "square")],
    options: ["3 مربعات", "4 مربعات", "4 دوائر", "مربعان"],
    answer: 1,
    explanation: "عدد الأشكال يتضاعف ويبقى نوعها كما هو: دائرة واحدة ← دائرتان، إذن مربعان ← 4 مربعات.",
  },
  {
    id: "spa-f05",
    difficulty: 3,
    prompt: ANALOGY,
    visual: { layout: "analogy", cells: [grid(A21), grid(complement(rot180(A21))), grid(C21)] },
    optionVisuals: [grid(rot180(C21)), grid(complement(C21)), grid(complement(mirror(C21))), grid(complement(rot180(C21)))],
    options: ["الشكل بعد نصف دورة فقط", "الشكل بعد عكس الألوان فقط", "صورة المرآة بعد عكس الألوان", "الشكل بعد نصف دورة وعكس الألوان"],
    answer: 3,
    explanation:
      "من الشكل الأول إلى الثاني حدث أمران: دار الشكل نصف دورة، ثم انعكست الألوان (الأسود صار أبيض والأبيض صار أسود). نطبّق الخطوتين على الشكل الثالث.",
  },
  {
    id: "spa-f06",
    difficulty: 1,
    prompt: ODD,
    optionVisuals: [shape(square(38)), shape(rectangle()), shape(pentagon()), shape(diamond(38))],
    options: ["مربع", "مستطيل", "مخمّس", "معيّن"],
    answer: 2,
    explanation: "المربع والمستطيل والمعيّن لكل منها 4 أضلاع، أما المخمّس فله 5 أضلاع.",
  },
  {
    id: "spa-f07",
    difficulty: 1,
    prompt: ODD,
    optionVisuals: [
      g(circle(34), dot(50, 50, 7)),
      g(square(38), dot(50, 50, 7)),
      g(diamond(26, "white", 44, 56), dot(84, 18, 7)),
      g(triangle(38, "white", 50, 54), dot(50, 62, 7)),
    ],
    options: ["دائرة والنقطة داخلها", "مربع والنقطة داخله", "معيّن والنقطة خارجه", "مثلث والنقطة داخله"],
    answer: 2,
    explanation: "في ثلاثة أشكال تقع النقطة داخل الشكل، أما في المعيّن فتقع النقطة خارجه.",
  },
  {
    id: "spa-f08",
    difficulty: 3,
    prompt: "ثلاثة من هذه الأشكال هي الشكل نفسه بعد تدويره. أي شكل لا يمكن الحصول عليه بالتدوير؟",
    optionVisuals: [blue(rot90(P24)), blue(P24), blue(mirror(rot90(P24))), blue(rot180(P24))],
    options: ["الشكل بعد ربع دورة", "الشكل الأصلي", "صورة الشكل في المرآة", "الشكل بعد نصف دورة"],
    answer: 2,
    explanation:
      "ثلاثة من الأشكال هي الشكل نفسه بعد تدويره ربع دورة أو نصف دورة. أما الشكل المختلف فهو صورته في المرآة، ولا يمكن الوصول إليه بالتدوير مهما أدرناه.",
  },
  {
    id: "spa-f09",
    difficulty: 2,
    prompt: "أي شكل يختلف عن البقية في عدد خطوطه المستقيمة؟",
    optionVisuals: [
      g({ t: "line", x1: 38, y1: 14, x2: 38, y2: 86 }, { t: "line", x1: 62, y1: 14, x2: 62, y2: 86 }, { t: "line", x1: 14, y1: 38, x2: 86, y2: 38 }, { t: "line", x1: 14, y1: 62, x2: 86, y2: 62 }),
      shape(pentagon()),
      shape(square(38)),
      g(
        { t: "line", x1: 12, y1: 70, x2: 31, y2: 30 },
        { t: "line", x1: 31, y1: 30, x2: 50, y2: 70 },
        { t: "line", x1: 50, y1: 70, x2: 69, y2: 30 },
        { t: "line", x1: 69, y1: 30, x2: 88, y2: 70 },
      ),
    ],
    options: ["الشبكة #", "المخمّس", "المربع", "الخط المتعرّج"],
    answer: 1,
    explanation: "نعدّ الخطوط المستقيمة: الشبكة # فيها 4 خطوط، والمربع 4، والخط المتعرّج 4، أما المخمّس فخطوطه 5.",
  },
  {
    id: "spa-f10",
    difficulty: 2,
    prompt: "الخط المتقطع مرآة. ما صورة الشكل في المرآة؟",
    visual: { layout: "mirror", glyph: blue(M26) },
    optionVisuals: [blue(M26), blue(mirror(M26)), blue(rot180(M26)), blue(rot90(M26))],
    options: ["الشكل نفسه دون تغيير", "الشكل مقلوبًا بين اليمين واليسار", "الشكل بعد نصف دورة", "الشكل بعد ربع دورة"],
    answer: 1,
    explanation:
      "في المرآة العمودية ينقلب اليمين واليسار، ويبقى الأعلى والأسفل كما هما: كل مربع ينتقل إلى الجهة المقابلة في الصف نفسه.",
  },
  {
    id: "spa-f11",
    difficulty: 2,
    prompt:
      "طُويت ورقة مربعة من المنتصف، فوُضع النصف الأيسر (المتقطع) فوق النصف الأيمن، ثم ثُقبت الطبقتان معًا كما في الشكل. كيف تبدو الورقة بعد فتحها؟",
    visual: {
      layout: "single",
      glyph: g(halfLeft, { t: "rect", x: 50, y: 10, w: 40, h: 80, fill: "white" }, dot(62, 30, 5)),
    },
    optionVisuals: [paper([[62, 30]]), paper([[38, 30], [62, 30]]), paper([[62, 30], [62, 70]]), paper([[38, 70], [62, 30]])],
    options: ["ثقب واحد", "ثقبان متقابلان أفقيًا", "ثقبان فوق بعضهما", "ثقبان متقابلان قطريًا"],
    answer: 1,
    explanation:
      "بعد الطي تصبح الورقة طبقتين، فيمرّ الثقب في الطبقتين. عند الفتح يظهر ثقب ثانٍ في النصف الأيسر، في الموضع المقابل تمامًا للثقب الأول حول خط الطي.",
  },
  {
    id: "spa-f12",
    difficulty: 3,
    prompt:
      "طُويت ورقة مربعة مرتين: النصف الأيسر فوق الأيمن، ثم النصف العلوي فوق السفلي، فصارت ربع الورقة (المنطقة البيضاء)، ثم ثُقبت ثقبًا واحدًا. كيف تبدو بعد فتحها؟",
    visual: {
      layout: "single",
      glyph: g(
        { t: "rect", x: 10, y: 10, w: 80, h: 80, fill: "none", dash: true },
        { t: "rect", x: 50, y: 50, w: 40, h: 40, fill: "white" },
        dot(64, 64, 5),
      ),
    },
    optionVisuals: [
      paper([[36, 64], [64, 64]]),
      paper([[36, 64], [64, 64], [64, 36]]),
      paper([[36, 36], [64, 36], [36, 64], [64, 64]]),
      paper([[20, 64], [40, 64], [60, 64], [80, 64]]),
    ],
    options: ["ثقبان", "ثلاثة ثقوب", "أربعة ثقوب متماثلة حول المركز", "أربعة ثقوب في صف واحد"],
    answer: 2,
    explanation:
      "بعد طيّتين تصبح الورقة 4 طبقات، فيصير الثقب 4 ثقوب. عند الفتح ينعكس الثقب حول خط الطي الأفقي ثم حول خط الطي العمودي، فتتوزع الثقوب الأربعة بالتماثل حول مركز الورقة.",
  },
  {
    id: "spa-f13",
    difficulty: 2,
    prompt:
      "ثلاثة مسنّنات متلامسة. يدور المسنّن الأول (على اليمين) مع اتجاه عقارب الساعة كما يشير السهم. في أي اتجاه يدور المسنّن الثالث (على اليسار)؟",
    visual: {
      layout: "single",
      glyph: g(gear(78, 55), gear(50, 55), gear(22, 55), ...curvedArrow(78, 55, 21, true)),
    },
    options: ["مع اتجاه عقارب الساعة", "عكس اتجاه عقارب الساعة", "لا يدور", "لا يمكن المعرفة"],
    answer: 0,
    explanation:
      "كل مسنّنين متلامسين يدوران في اتجاهين متعاكسين: الأول مع عقارب الساعة، فالثاني عكسها، فالثالث مع عقارب الساعة من جديد.",
  },
  {
    id: "spa-f14",
    difficulty: 2,
    prompt: "أي شبكة يمكن طيّها لتكوين مكعّب؟",
    optionVisuals: [
      net([0, 1, 2, 3, 4, 5], 3, 2),
      net([0, 1, 2, 3, 4, 5], 6, 1),
      net([0, 1, 4, 5, 6, 7], 4, 2),
      net([1, 4, 5, 6, 7, 9], 4, 3),
    ],
    options: ["مستطيل من 6 مربعات (2×3)", "شريط من 6 مربعات", "صف من 4 مربعات فوقه مربعان متجاوران", "صليب: صف من 4 مربعات ومربع فوقه وآخر تحته"],
    answer: 3,
    explanation:
      "الصف من 4 مربعات يلتف حول المكعب ليصنع 4 أوجه جانبية، والمربعان فوقه وتحته يصبحان الوجهين العلوي والسفلي. أما الشبكة التي فيها مربع 2×2 (مثل المستطيل 2×3)، والشريط من 6 مربعات، فلا يمكن طيّها إلى مكعب.",
  },
  {
    id: "spa-f15",
    difficulty: 1,
    prompt: "أي شكل له محورا تماثل فقط؟",
    optionVisuals: [shape(square(38)), shape(rectangle()), shape(triangle(38)), shape(circle(34))],
    options: ["مربع", "مستطيل", "مثلث متساوي الأضلاع", "دائرة"],
    answer: 1,
    explanation: "للمستطيل محورا تماثل فقط (أفقي وعمودي). للمربع 4 محاور، وللمثلث متساوي الأضلاع 3، وللدائرة عدد لا نهائي.",
  },
  {
    id: "spa-f16",
    difficulty: 2,
    prompt: "كم مثلثًا في الشكل؟",
    visual: {
      layout: "single",
      glyph: g(
        { t: "rect", x: 15, y: 15, w: 70, h: 70, fill: "white" },
        { t: "line", x1: 15, y1: 15, x2: 85, y2: 85 },
        { t: "line", x1: 85, y1: 15, x2: 15, y2: 85 },
      ),
    },
    options: ["4", "6", "8", "10"],
    answer: 2,
    explanation:
      "المثلثات الصغيرة: 4. وكل قطر يقسم المربع إلى مثلثين كبيرين، فيكون هناك $2 + 2 = 4$ مثلثات كبيرة. المجموع $4 + 4 = 8$.",
  },
  {
    id: "spa-f17",
    difficulty: 3,
    prompt: "كم مستطيلًا (بما في ذلك المربعات) في الشبكة؟",
    visual: { layout: "single", glyph: grid([], 3, 2, "white", 84) },
    options: ["15", "18", "12", "20"],
    answer: 1,
    explanation:
      "نعدّ حسب الحجم: مربعات مفردة 6، ومستطيلات من مربعين أفقيًا 4، ومن مربعين عموديًا 3، ومن ثلاثة مربعات أفقيًا 2، ومربعات 2×2 عددها 2، والشبكة كلها 1. المجموع $6 + 4 + 3 + 2 + 2 + 1 = 18$.",
  },
  {
    id: "spa-f18",
    difficulty: 2,
    prompt: "أي خيار هو الشكل نفسه بعد تدويره (وليس صورته في المرآة)؟",
    visual: { layout: "single", glyph: blue(S34) },
    optionVisuals: [blue(mirror(S34)), blue(rot90(S34)), blue(mirror(rot90(S34))), blue(mirror(rot180(S34)))],
    options: ["صورة الشكل في المرآة", "الشكل بعد ربع دورة مع عقارب الساعة", "صورة المرآة بعد ربع دورة", "صورة المرآة بعد نصف دورة"],
    answer: 1,
    explanation:
      "التدوير لا يقلب الشكل. الخيار الصحيح هو الشكل بعد ربع دورة مع عقارب الساعة. أما الخيارات الأخرى فهي صور مرآة للشكل، ولا يمكن الحصول عليها بالتدوير.",
  },
]);

/** للاختبارات: الخانات المستخدمة في أسئلة التدوير والانعكاس */
export const SHAPE_SETS = { A18, C18, A19, C19, A21, C21, P24, M26, S34 };
