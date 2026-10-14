import type { Glyph, Paint, Shape } from "@/lib/types";
import { defineOriginalQuestions } from "../define";
import { arrow, glyph, star } from "./kit";

/*
 * الدفعة السادسة: أسئلة أصلية على نمط قسم الأشكال في الامتحان (جداول وسلاسل تُقرأ من اليسار إلى اليمين).
 * الرسوم وتفاصيل القواعد من تصميم المنصة، ولم يُنقل أي رسم من أي امتحان منشور.
 * خمسة أنواع من القواعد، وكل سؤال يُبنى من نموذج برمجي فتكون الإجابة الصحيحة صحيحة بالبناء:
 *   1) دمج شكلين في شكل واحد مع قاعدة للون (k01–k06)
 *   2) تدرّج الحجم مع إضافة التفاصيل أو حذفها (k07–k12)
 *   3) سلاسل تتغير فيها عدة صفات معًا (k13–k19)
 *   4) خانة ناقصة في وسط السلسلة: دوران مع تبادل الطبقات (k20–k24)
 *   5) انتقال صفة بين الخانات: رمز الزاوية يصبح نقش الخانة التالية (k25–k30)
 */

const SEQ = "ما الشكل الذي يأتي مكان علامة الاستفهام؟ (تُقرأ السلسلة من اليسار إلى اليمين)";
const MATRIX = "ما الشكل الذي يكمل الجدول؟ (يُقرأ كل صف من اليسار إلى اليمين)";

type Q = Parameters<typeof defineOriginalQuestions>[1][number];

const r1 = (n: number) => Math.round(n * 10) / 10;
const place = (shapes: Shape[], cx = 50, cy = 50, s = 1, r = 0): Shape => ({ t: "g", shapes, cx, cy, s, r });

/** يرتّب الخيارات: الصحيح في الموضع answer، ويتأكد أن الرسوم مختلفة */
function options(correct: [Glyph, string], wrong: [Glyph, string][], answer: number) {
  const list = [...wrong];
  list.splice(answer, 0, correct);
  const keys = new Set(list.map(([g]) => JSON.stringify(g)));
  if (keys.size !== list.length) throw new Error(`خيارات مكررة: ${correct[1]}`);
  return { optionVisuals: list.map(([g]) => g), options: list.map(([, l]) => l), answer };
}

const COLOR_NAME: Partial<Record<Paint, string>> = {
  red: "الأحمر",
  blue: "الأزرق",
  yellow: "الأصفر",
  green: "الأخضر",
  pink: "الوردي",
  purple: "البنفسجي",
  orange: "البرتقالي",
  black: "الأسود",
  gray: "الرمادي",
};
const colorName = (c: Paint) => COLOR_NAME[c] ?? c;
/** صفة اللون لاسم مذكّر نكرة (قمر أحمر، وسط أصفر) */
const COLOR_ADJ: Partial<Record<Paint, string>> = {
  red: "أحمر",
  blue: "أزرق",
  yellow: "أصفر",
  green: "أخضر",
  pink: "وردي",
  purple: "بنفسجي",
  orange: "برتقالي",
  black: "أسود",
  light: "أزرق فاتح",
};
const colorAdj = (c: Paint) => COLOR_ADJ[c] ?? c;

// =====================================================================
// 1) دمج شكلين: الشكل الثالث في كل صف = الشكلان معًا في قطعة واحدة
// =====================================================================

type Part = "barH" | "barV" | "disc" | "tri" | "sq" | "diag" | "anti" | "diamond" | "cap";
const PART_NAME: Record<Part, string> = {
  barH: "شريط أفقي",
  barV: "شريط عمودي",
  disc: "دائرة",
  tri: "مثلث",
  sq: "مربع",
  diag: "شريط مائل",
  anti: "شريط مائل معاكس",
  diamond: "معيّن",
  cap: "نصف دائرة",
};

function part(p: Part, c: Paint, turn = 0): Shape {
  const bar: Shape = { t: "rect", x: 12, y: 40, w: 76, h: 20, fill: c, bare: true };
  const base: Record<Part, Shape> = {
    barH: bar,
    barV: { t: "rect", x: 40, y: 12, w: 20, h: 76, fill: c, bare: true },
    disc: { t: "circle", cx: 50, cy: 50, r: 24, fill: c, bare: true },
    tri: { t: "poly", pts: [50, 16, 84, 78, 16, 78], fill: c, bare: true },
    sq: { t: "rect", x: 29, y: 29, w: 42, h: 42, fill: c, bare: true },
    diag: place([bar], 50, 50, 1, 45),
    anti: place([bar], 50, 50, 1, -45),
    diamond: { t: "poly", pts: [50, 18, 78, 50, 50, 82, 22, 50], fill: c, bare: true },
    cap: { t: "path", d: "M 16 56 A 34 34 0 0 1 84 56 Z", fill: c, bare: true },
  };
  return turn ? place([base[p]], 50, 50, 1, turn) : base[p];
}

interface FuseRow {
  a: Part;
  ca: Paint;
  b: Part;
  cb: Paint;
}

type ColorRule = "first" | "second";

function fuseQuestion(
  id: string,
  difficulty: 1 | 2 | 3,
  rule: ColorRule,
  rows: [FuseRow, FuseRow, FuseRow],
  wrongPart: Part,
  answer: number,
  turnSecond = 0,
): Q {
  const resultColor = (r: FuseRow) => (rule === "first" ? r.ca : r.cb);
  const otherColor = (r: FuseRow) => (rule === "first" ? r.cb : r.ca);
  const fused = (r: FuseRow, c: Paint, b: Part = r.b) => glyph(part(r.a, c), part(b, c, turnSecond));
  const cells: (Glyph | null)[] = [];
  rows.forEach((r, i) => {
    cells.push(glyph(part(r.a, r.ca)), glyph(part(r.b, r.cb)), i < 2 ? fused(r, resultColor(r)) : null);
  });
  const q = rows[2];
  const c = resultColor(q);
  const turnNote = turnSecond ? " (بعد تدوير الثاني)" : "";
  const name = (b: Part) => `${PART_NAME[q.a]} و${PART_NAME[b]}`;
  const wrong: [Glyph, string][] = [
    [fused(q, otherColor(q)), `دمج ${name(q.b)}${turnNote} باللون ${colorName(otherColor(q))}`],
    [glyph(part(q.a, c)), `${PART_NAME[q.a]} وحده باللون ${colorName(c)}`],
    [fused(q, c, wrongPart), `دمج ${name(wrongPart)} باللون ${colorName(c)}`],
  ];
  if (turnSecond) wrong[2] = [glyph(part(q.a, c), part(q.b, c)), `دمج ${name(q.b)} دون تدوير باللون ${colorName(c)}`];
  const whose = rule === "first" ? "الشكل الأول" : "الشكل الثاني";
  const turnText = turnSecond
    ? " لكن الشكل الثاني يُدار ربع دورة مع عقارب الساعة قبل الدمج (قارن اتجاهه في الصف الأول قبل الدمج وبعده)."
    : "";
  return {
    id,
    difficulty,
    prompt: MATRIX,
    visual: { layout: "matrix", cols: 3, cells },
    ...options([fused(q, c), `دمج ${name(q.b)}${turnNote} باللون ${colorName(c)}`], wrong, answer),
    explanation:
      `في كل صف: الشكل الثالث هو الشكلان الأولان مدموجين في قطعة واحدة، ولونه لون ${whose}.${turnText} ` +
      `في الصف الثالث: ${PART_NAME[q.a]} (باللون ${colorName(q.ca)}) و${PART_NAME[q.b]} (باللون ${colorName(q.cb)}) ← دمجهما باللون ${colorName(c)}. ` +
      `انتبه للخيار الذي فيه الدمج الصحيح باللون الآخر: هذا الفخ الأشهر في هذا النوع.`,
  };
}

const fusionQuestions: Q[] = [
  fuseQuestion(
    "pat-k01",
    1,
    "first",
    [
      { a: "barH", ca: "blue", b: "barV", cb: "red" },
      { a: "disc", ca: "yellow", b: "tri", cb: "blue" },
      { a: "sq", ca: "red", b: "diamond", cb: "yellow" },
    ],
    "disc",
    2,
  ),
  fuseQuestion(
    "pat-k02",
    2,
    "second",
    [
      { a: "tri", ca: "red", b: "barH", cb: "green" },
      { a: "diag", ca: "green", b: "anti", cb: "purple" },
      { a: "cap", ca: "purple", b: "barV", cb: "red" },
    ],
    "barH",
    0,
  ),
  fuseQuestion(
    "pat-k03",
    2,
    "first",
    [
      { a: "diamond", ca: "pink", b: "barH", cb: "blue" },
      { a: "cap", ca: "blue", b: "disc", cb: "orange" },
      { a: "diag", ca: "orange", b: "sq", cb: "pink" },
    ],
    "tri",
    3,
  ),
  fuseQuestion(
    "pat-k04",
    2,
    "second",
    [
      { a: "sq", ca: "yellow", b: "tri", cb: "blue" },
      { a: "barV", ca: "blue", b: "cap", cb: "pink" },
      { a: "disc", ca: "pink", b: "anti", cb: "yellow" },
    ],
    "diag",
    1,
  ),
  fuseQuestion(
    "pat-k05",
    3,
    "second",
    [
      { a: "disc", ca: "red", b: "barV", cb: "blue" },
      { a: "tri", ca: "blue", b: "diag", cb: "green" },
      { a: "cap", ca: "green", b: "tri", cb: "red" },
    ],
    "sq",
    2,
    90,
  ),
  fuseQuestion(
    "pat-k06",
    3,
    "first",
    [
      { a: "disc", ca: "purple", b: "barH", cb: "yellow" },
      { a: "sq", ca: "yellow", b: "cap", cb: "red" },
      { a: "diamond", ca: "red", b: "tri", cb: "purple" },
    ],
    "barH",
    1,
    90,
  ),
];

// =====================================================================
// 2) تدرّج الحجم مع التفاصيل: كل صف شيء واحد يكبر أو يصغر وتُضاف إليه تفاصيل أو تُحذف
// =====================================================================

type Thing = "house" | "tree" | "boat" | "mushroom" | "cup" | "candle";
interface ThingInfo {
  name: string;
  fem: boolean;
  details: string[];
  draw: (level: number) => Shape[];
}

const THINGS: Record<Thing, ThingInfo> = {
  house: {
    name: "بيت",
    fem: false,
    details: ["باب", "نافذة", "مدخنة"],
    draw: (k) => [
      ...(k >= 3 ? [{ t: "rect", x: 64, y: 14, w: 10, h: 22, fill: "gray" } as Shape] : []),
      { t: "poly", pts: [10, 48, 50, 12, 90, 48], fill: "red" },
      { t: "rect", x: 18, y: 48, w: 64, h: 42, fill: "yellow" },
      ...(k >= 1 ? [{ t: "rect", x: 42, y: 62, w: 16, h: 28, fill: "orange" } as Shape] : []),
      ...(k >= 2 ? [{ t: "rect", x: 24, y: 56, w: 12, h: 12, fill: "light" } as Shape] : []),
    ],
  },
  tree: {
    name: "شجرة",
    fem: true,
    details: ["تفاحة", "تفاحة ثانية", "عصفور"],
    draw: (k) => [
      { t: "rect", x: 43, y: 58, w: 14, h: 32, fill: "orange" },
      { t: "circle", cx: 50, cy: 40, r: 30, fill: "green" },
      ...(k >= 1 ? [{ t: "circle", cx: 38, cy: 34, r: 6, fill: "red" } as Shape] : []),
      ...(k >= 2 ? [{ t: "circle", cx: 62, cy: 48, r: 6, fill: "red" } as Shape] : []),
      ...(k >= 3 ? [{ t: "poly", pts: [70, 14, 86, 8, 82, 20, 92, 20, 78, 26], fill: "blue" } as Shape] : []),
    ],
  },
  boat: {
    name: "قارب",
    fem: false,
    details: ["علم", "شراع ثانٍ", "نافذة"],
    draw: (k) => [
      { t: "line", x1: 50, y1: 12, x2: 50, y2: 70 },
      { t: "poly", pts: [52, 16, 52, 64, 84, 64], fill: "white" },
      ...(k >= 2 ? [{ t: "poly", pts: [48, 26, 48, 64, 22, 64], fill: "light" } as Shape] : []),
      ...(k >= 1 ? [{ t: "poly", pts: [50, 12, 34, 8, 50, 4], fill: "red" } as Shape] : []),
      { t: "poly", pts: [12, 70, 88, 70, 76, 88, 24, 88], fill: "blue" },
      ...(k >= 3 ? [{ t: "circle", cx: 50, cy: 79, r: 5, fill: "yellow" } as Shape] : []),
    ],
  },
  mushroom: {
    name: "فطر",
    fem: false,
    details: ["نقطة بيضاء", "نقطة ثانية", "عشب"],
    draw: (k) => [
      { t: "rect", x: 40, y: 50, w: 20, h: 36, fill: "white" },
      { t: "path", d: "M 12 54 A 38 36 0 0 1 88 54 Z", fill: "red" },
      ...(k >= 1 ? [{ t: "circle", cx: 36, cy: 38, r: 6, fill: "white" } as Shape] : []),
      ...(k >= 2 ? [{ t: "circle", cx: 62, cy: 32, r: 5, fill: "white" } as Shape] : []),
      ...(k >= 3 ? [{ t: "poly", pts: [20, 90, 26, 74, 30, 90, 36, 78, 40, 90], fill: "green" } as Shape] : []),
    ],
  },
  cup: {
    name: "فنجان",
    fem: false,
    details: ["مقبض", "صحن", "بخار"],
    draw: (k) => [
      ...(k >= 3 ? [{ t: "path", d: "M 40 26 Q 34 18 40 10 M 56 26 Q 50 18 56 10", fill: "none" } as Shape] : []),
      ...(k >= 1 ? [{ t: "circle", cx: 74, cy: 50, r: 10, fill: "white" } as Shape] : []),
      { t: "path", d: "M 22 32 L 78 32 L 70 76 L 30 76 Z", fill: "pink" },
      ...(k >= 2 ? [{ t: "rect", x: 12, y: 78, w: 76, h: 8, fill: "purple" } as Shape] : []),
    ],
  },
  candle: {
    name: "شمعة",
    fem: true,
    details: ["لهب", "شريط", "حامل"],
    draw: (k) => [
      { t: "rect", x: 38, y: 30, w: 24, h: 54, fill: "light" },
      ...(k >= 1 ? [{ t: "path", d: "M 50 6 Q 60 18 50 28 Q 40 18 50 6 Z", fill: "orange" } as Shape] : []),
      ...(k >= 2 ? [{ t: "rect", x: 38, y: 50, w: 24, h: 8, fill: "red" } as Shape] : []),
      ...(k >= 3 ? [{ t: "rect", x: 24, y: 84, w: 52, h: 8, fill: "gray" } as Shape] : []),
    ],
  },
};

const SIZES = [0.55, 0.75, 0.95];
const SIZE_NAME = [
  ["صغير", "صغيرة"],
  ["متوسط", "متوسطة"],
  ["كبير", "كبيرة"],
];
const thingGlyph = (t: Thing, size: number, level: number): Glyph =>
  glyph(place(THINGS[t].draw(level), 50, 50 + r1((1 - SIZES[size]) * 40), SIZES[size]));

function thingLabel(t: Thing, size: number, level: number) {
  const info = THINGS[t];
  const sz = SIZE_NAME[size][info.fem ? 1 : 0];
  const extra = level === 0 ? " دون إضافات" : ` مع ${info.details.slice(0, level).join(" و")}`;
  return `${info.name} ${sz}${extra}`;
}

/** steps: [الحجم، مستوى التفاصيل] للخانات الثلاث في كل صف */
function sizeQuestion(
  id: string,
  difficulty: 1 | 2 | 3,
  things: [Thing, Thing, Thing],
  steps: [[number, number], [number, number], [number, number]],
  missing: 1 | 2,
  answer: number,
  ruleText: string,
): Q {
  const cells: (Glyph | null)[] = [];
  things.forEach((t, row) =>
    steps.forEach(([s, l], col) => cells.push(row === 2 && col === missing ? null : thingGlyph(t, s, l))),
  );
  const t = things[2];
  const [s, l] = steps[missing];
  // الخانة المعروفة الأخرى في الصف نفسه: أحجام الصف وتفاصيله مختلفة، فنأخذ منها الحجم الخاطئ والتفاصيل الخاطئة
  const [sAlt, lAlt] = missing === 2 ? steps[1] : steps[2];
  const wrong: [Glyph, string][] = [
    [thingGlyph(t, sAlt, l), thingLabel(t, sAlt, l)],
    [thingGlyph(t, s, lAlt), thingLabel(t, s, lAlt)],
    [thingGlyph(t, sAlt, lAlt), thingLabel(t, sAlt, lAlt)],
  ];
  return {
    id,
    difficulty,
    prompt: MATRIX,
    visual: { layout: "matrix", cols: 3, cells },
    ...options([thingGlyph(t, s, l), thingLabel(t, s, l)], wrong, answer),
    explanation: `${ruleText} الخانة الناقصة: ${thingLabel(t, s, l)}. تابع الصفتين معًا (الحجم والتفاصيل)، فكل خيار خاطئ يخطئ في واحدة منهما على الأقل.`,
  };
}

const sizeQuestions: Q[] = [
  sizeQuestion(
    "pat-k07",
    1,
    ["tree", "house", "mushroom"],
    [[0, 0], [1, 1], [2, 2]],
    2,
    1,
    "في كل صف يكبر الشيء خطوة بعد خطوة، وتُضاف إليه تفصيلة جديدة في كل خطوة.",
  ),
  sizeQuestion(
    "pat-k08",
    2,
    ["candle", "boat", "cup"],
    [[2, 0], [1, 1], [0, 2]],
    2,
    3,
    "في كل صف يصغر الشيء خطوة بعد خطوة، ومع ذلك تُضاف إليه تفصيلة جديدة في كل خطوة.",
  ),
  sizeQuestion(
    "pat-k09",
    2,
    ["house", "cup", "tree"],
    [[0, 3], [1, 2], [2, 1]],
    2,
    0,
    "في كل صف يكبر الشيء، وتُحذف منه تفصيلة في كل خطوة (آخر تفصيلة أُضيفت هي أول ما يُحذف).",
  ),
  sizeQuestion(
    "pat-k10",
    2,
    ["mushroom", "candle", "boat"],
    [[0, 1], [1, 2], [2, 3]],
    1,
    2,
    "في كل صف يكبر الشيء وتُضاف إليه تفصيلة في كل خطوة. الخانة الناقصة هنا في الوسط: نستنتجها مما قبلها وما بعدها.",
  ),
  sizeQuestion(
    "pat-k11",
    3,
    ["boat", "tree", "candle"],
    [[1, 0], [2, 1], [0, 2]],
    2,
    1,
    "الحجم في كل صف: متوسط ثم كبير ثم صغير (الترتيب نفسه في الصفين الأولين)، وتُضاف تفصيلة في كل خطوة.",
  ),
  sizeQuestion(
    "pat-k12",
    3,
    ["cup", "mushroom", "house"],
    [[2, 3], [0, 1], [1, 2]],
    1,
    3,
    "الحجم في كل صف: كبير ثم صغير ثم متوسط، وعدد التفاصيل يتبع الحجم: الكبير بثلاث تفاصيل، والصغير بواحدة، والمتوسط باثنتين.",
  ),
];

// =====================================================================
// 3) سلاسل متعددة الصفات: سهم يدور، ونقاط تزيد، وقمر صغير يدور حول الحلقة، ولون الوسط يتبدّل
// =====================================================================

interface Orbit {
  arrow?: number; // اتجاه السهم بالدرجات
  dots?: number;
  sat?: number; // موضع القمر الصغير على الحلقة
  satColor?: Paint;
  core?: Paint; // لون القرص الأوسط
}

const DIR_NAME: Record<number, string> = {
  0: "الأعلى",
  45: "الأعلى واليمين",
  90: "اليمين",
  135: "الأسفل واليمين",
  180: "الأسفل",
  225: "الأسفل واليسار",
  270: "اليسار",
  315: "الأعلى واليسار",
};
const POS_NAME: Record<number, string> = { 0: "في الأعلى", 90: "على اليمين", 180: "في الأسفل", 270: "على اليسار" };
const NUM = ["", "نقطة واحدة", "نقطتان", "ثلاث نقاط", "أربع نقاط", "خمس نقاط"];
const norm = (d: number) => ((d % 360) + 360) % 360;

function orbitGlyph(o: Orbit): Glyph {
  const shapes: Shape[] = [{ t: "circle", cx: 50, cy: 50, r: 38, fill: "white" }];
  if (o.core) shapes.push({ t: "circle", cx: 50, cy: 46, r: 18, fill: o.core });
  if (o.arrow !== undefined) shapes.push(place(arrow(0).shapes, 50, 46, 0.4, o.arrow));
  if (o.dots) {
    const n = o.dots;
    for (let i = 0; i < n; i++) shapes.push({ t: "circle", cx: r1(50 + (i - (n - 1) / 2) * 9), cy: 74, r: 3.5, fill: "black" });
  }
  if (o.sat !== undefined) {
    const a = (o.sat * Math.PI) / 180;
    shapes.push({ t: "circle", cx: r1(50 + 38 * Math.sin(a)), cy: r1(50 - 38 * Math.cos(a)), r: 9, fill: o.satColor ?? "black" });
  }
  return glyph(...shapes);
}

function orbitLabel(o: Orbit) {
  const parts: string[] = [];
  if (o.arrow !== undefined) parts.push(`سهم إلى ${DIR_NAME[norm(o.arrow)]}`);
  if (o.dots) parts.push(NUM[o.dots]);
  if (o.sat !== undefined) parts.push(`قمر ${o.satColor ? colorAdj(o.satColor) + " " : ""}${POS_NAME[norm(o.sat)]}`);
  if (o.core) parts.push(`وسط ${colorAdj(o.core)}`);
  return parts.join("، ");
}

/** state(k) يعطي الخانة رقم k؛ wrongs تغيّر صفة واحدة في الإجابة */
function orbitQuestion(
  id: string,
  difficulty: 1 | 2 | 3,
  count: number,
  missing: number,
  state: (k: number) => Orbit,
  wrongs: ((o: Orbit) => Orbit)[],
  answer: number,
  explanation: string,
): Q {
  const cells = Array.from({ length: count }, (_, k) => (k === missing ? null : orbitGlyph(state(k))));
  const right = state(missing);
  const norm2 = (o: Orbit): Orbit => ({ ...o, arrow: o.arrow === undefined ? undefined : norm(o.arrow), sat: o.sat === undefined ? undefined : norm(o.sat) });
  const wrong = wrongs.map((w) => {
    const o = norm2(w(right));
    return [orbitGlyph(o), orbitLabel(o)] as [Glyph, string];
  });
  const r = norm2(right);
  return {
    id,
    difficulty,
    prompt: SEQ,
    visual: { layout: "sequence", cells },
    ...options([orbitGlyph(r), orbitLabel(r)], wrong, answer),
    explanation: `${explanation} إذن: ${orbitLabel(r)}.`,
  };
}

const CYCLE3: Paint[] = ["yellow", "pink", "blue"];

const orbitQuestions: Q[] = [
  orbitQuestion(
    "pat-k13",
    1,
    4,
    3,
    (k) => ({ arrow: 90 * k, dots: k + 1 }),
    [(o) => ({ ...o, arrow: o.arrow! - 90 }), (o) => ({ ...o, dots: o.dots! - 1 }), (o) => ({ ...o, arrow: o.arrow! + 90, dots: o.dots! + 1 })],
    1,
    "صفتان تتغيران معًا: السهم يدور ربع دورة مع عقارب الساعة، ويزيد عدد النقاط نقطة واحدة في كل خطوة.",
  ),
  orbitQuestion(
    "pat-k14",
    2,
    4,
    3,
    (k) => ({ arrow: -45 * k, sat: 90 * k, satColor: "red" }),
    [(o) => ({ ...o, arrow: o.arrow! + 90 }), (o) => ({ ...o, sat: o.sat! - 180 }), (o) => ({ ...o, arrow: o.arrow! + 45, sat: o.sat! - 90 })],
    2,
    "السهم يدور ثُمن دورة عكس عقارب الساعة، والقمر الأحمر يتحرك ربع دورة مع عقارب الساعة على الحلقة. الحركتان في اتجاهين متعاكسين.",
  ),
  orbitQuestion(
    "pat-k15",
    2,
    4,
    3,
    (k) => ({ dots: 4 - k, core: CYCLE3[k % 3], sat: 180 - 90 * k, satColor: "black" }),
    [(o) => ({ ...o, core: "pink" }), (o) => ({ ...o, dots: 2 }), (o) => ({ ...o, sat: o.sat! + 180 })],
    0,
    "ثلاث صفات: النقاط تنقص واحدة في كل خطوة، ولون الوسط يتكرر (أصفر، وردي، أزرق) ثم يعود، والقمر يتحرك ربع دورة عكس عقارب الساعة.",
  ),
  orbitQuestion(
    "pat-k16",
    3,
    5,
    4,
    (k) => ({ arrow: 90 * k, dots: [1, 3, 2, 4, 3][k], sat: 270 * k, satColor: k % 2 ? "blue" : "yellow" }),
    [(o) => ({ ...o, dots: 5 }), (o) => ({ ...o, satColor: "blue" }), (o) => ({ ...o, arrow: o.arrow! + 90 })],
    3,
    "أربع قواعد معًا: السهم يدور ربع دورة مع عقارب الساعة؛ والنقاط تزيد 2 ثم تنقص 1 بالتناوب (1، 3، 2، 4، 3)؛ والقمر يتحرك ربع دورة عكس عقارب الساعة؛ ولونه يتناوب بين الأصفر والأزرق.",
  ),
  orbitQuestion(
    "pat-k17",
    2,
    5,
    2,
    (k) => ({ arrow: 45 * k, core: k % 2 ? "green" : "orange" }),
    [(o) => ({ ...o, core: "green" }), (o) => ({ ...o, arrow: o.arrow! + 45 }), (o) => ({ ...o, arrow: o.arrow! - 45, core: "green" })],
    1,
    "الخانة الناقصة في وسط السلسلة. السهم يدور ثُمن دورة مع عقارب الساعة، ولون الوسط يتناوب بين البرتقالي والأخضر. الخانة الثالثة تأتي بعد الثانية وقبل الرابعة.",
  ),
  orbitQuestion(
    "pat-k18",
    3,
    5,
    1,
    (k) => ({ arrow: 180 - 90 * k, dots: 5 - k, sat: 90 * k, satColor: CYCLE3[k % 3] }),
    [(o) => ({ ...o, dots: 5 }), (o) => ({ ...o, arrow: o.arrow! + 180 }), (o) => ({ ...o, satColor: "yellow" })],
    0,
    "الخانة الناقصة هي الثانية. السهم يدور ربع دورة عكس عقارب الساعة، والنقاط تنقص واحدة في كل خطوة (5، 4، 3...)، والقمر يتحرك ربع دورة مع عقارب الساعة ولونه يتكرر: أصفر، وردي، أزرق.",
  ),
  orbitQuestion(
    "pat-k19",
    1,
    4,
    3,
    (k) => ({ sat: 90 * k, satColor: k % 2 ? "red" : "blue", core: "light" }),
    [(o) => ({ ...o, satColor: "blue" }), (o) => ({ ...o, sat: 0 }), (o) => ({ ...o, sat: 90, satColor: "blue" })],
    3,
    "القمر يتحرك ربع دورة مع عقارب الساعة، ولونه يتناوب بين الأزرق والأحمر.",
  ),
];

// =====================================================================
// 4) خانة ناقصة في الوسط: الشكل المركّب يدور ربع دورة، والطبقة العليا تتبدّل
// =====================================================================

type Front = "a" | "b";
interface Layered {
  a: Shape; // الشكل الملوّن
  b: Shape; // الشكل الأبيض
  aName: string;
  bName: string;
}

const LAYERS: Layered[] = [
  {
    a: { t: "poly", pts: [20, 22, 54, 22, 64, 40, 54, 58, 20, 58, 10, 40], fill: "red" },
    b: { t: "ellipse", cx: 60, cy: 64, rx: 30, ry: 18, fill: "white" },
    aName: "السداسي الأحمر",
    bName: "الشكل البيضوي",
  },
  {
    a: { t: "rect", x: 14, y: 14, w: 42, h: 42, fill: "blue" },
    b: { t: "poly", pts: [44, 34, 88, 60, 44, 86], fill: "yellow" },
    aName: "المربع الأزرق",
    bName: "المثلث الأصفر",
  },
  {
    a: { t: "circle", cx: 36, cy: 38, r: 24, fill: "green" },
    b: { t: "rect", x: 44, y: 46, w: 44, h: 26, fill: "pink" },
    aName: "الدائرة الخضراء",
    bName: "المستطيل الوردي",
  },
];

const ROT_NAME: Record<number, string> = { 0: "في وضعه الأصلي", 90: "بعد ربع دورة", 180: "بعد نصف دورة", 270: "بعد ثلاثة أرباع دورة" };

function layeredGlyph(L: Layered, rot: number, front: Front): Glyph {
  return { shapes: front === "a" ? [L.b, L.a] : [L.a, L.b], rotate: norm(rot) || undefined };
}
const layeredLabel = (L: Layered, rot: number, front: Front) =>
  `${ROT_NAME[norm(rot)]}، و${front === "a" ? L.aName : L.bName} في الأعلى`;

function layeredQuestion(
  id: string,
  difficulty: 1 | 2 | 3,
  L: Layered,
  step: number,
  count: number,
  missing: number,
  alternate: boolean,
  answer: number,
): Q {
  const front = (k: number): Front => (alternate && k % 2 ? "b" : "a");
  const cells = Array.from({ length: count }, (_, k) => (k === missing ? null : layeredGlyph(L, step * k, front(k))));
  const rot = step * missing;
  const f = front(missing);
  const flip: Front = f === "a" ? "b" : "a";
  const wrong: [Glyph, string][] = [
    [layeredGlyph(L, rot, flip), layeredLabel(L, rot, flip)],
    [layeredGlyph(L, rot + step, f), layeredLabel(L, rot + step, f)],
    [layeredGlyph(L, rot - step, flip), layeredLabel(L, rot - step, flip)],
  ];
  const dir = step > 0 ? "مع عقارب الساعة" : "عكس عقارب الساعة";
  const layerText = alternate
    ? `والشكلان يتبادلان الطبقة العليا في كل خطوة (مرة ${L.aName} فوق، ومرة ${L.bName} فوق).`
    : `و${L.aName} يبقى دائمًا فوق ${L.bName}.`;
  return {
    id,
    difficulty,
    prompt: SEQ,
    visual: { layout: "sequence", cells },
    ...options([layeredGlyph(L, rot, f), layeredLabel(L, rot, f)], wrong, answer),
    explanation:
      `الشكل كله يدور ربع دورة ${dir} في كل خطوة، ${layerText} ` +
      `الخانة الناقصة رقم ${missing + 1}، فنعدّ من الخانة الأولى: ${layeredLabel(L, rot, f)}. وتحقّق أنها تناسب الخانة التي بعدها أيضًا.`,
  };
}

const layeredQuestions: Q[] = [
  layeredQuestion("pat-k20", 1, LAYERS[1], 90, 5, 2, false, 0),
  layeredQuestion("pat-k21", 2, LAYERS[0], 90, 5, 2, true, 2),
  layeredQuestion("pat-k22", 2, LAYERS[2], -90, 5, 1, true, 1),
  layeredQuestion("pat-k23", 3, LAYERS[0], -90, 5, 3, true, 3),
  layeredQuestion("pat-k24", 3, LAYERS[1], 90, 6, 4, true, 0),
];

// =====================================================================
// 5) انتقال صفة بين الخانات: رمز الزاوية في كل خانة هو نقش الخانة التالية
// =====================================================================

interface Icon {
  draw: Shape[]; // مرسوم في مربع 100×100
  name: string; // للنقش (جمع)
  one: string; // لرمز الزاوية (مفرد)
}

const ICONS = {
  dot: { draw: [{ t: "circle", cx: 50, cy: 50, r: 34, fill: "red" }], name: "نقاط حمراء", one: "نقطة حمراء" },
  tri: { draw: [{ t: "poly", pts: [50, 12, 90, 84, 10, 84], fill: "blue" }], name: "مثلثات زرقاء", one: "مثلث أزرق" },
  sq: { draw: [{ t: "rect", x: 16, y: 16, w: 68, h: 68, fill: "green" }], name: "مربعات خضراء", one: "مربع أخضر" },
  star: { draw: [star(5, "yellow", 46, 20)], name: "نجوم صفراء", one: "نجمة صفراء" },
  plus: {
    draw: [
      { t: "rect", x: 38, y: 10, w: 24, h: 80, fill: "purple", bare: true },
      { t: "rect", x: 10, y: 38, w: 80, h: 24, fill: "purple", bare: true },
    ],
    name: "إشارات زائد بنفسجية",
    one: "إشارة زائد بنفسجية",
  },
} satisfies Record<string, Icon>;

const arrowIcon = (deg: number): Icon => ({
  draw: [place(arrow(0).shapes, 50, 50, 1, deg)],
  name: `أسهم إلى ${DIR_NAME[norm(deg)]}`,
  one: `سهم إلى ${DIR_NAME[norm(deg)]}`,
});

type Frame = "tri" | "circle" | "hex";
const FRAME_NAME: Record<Frame, string> = { tri: "مثلث", circle: "دائرة", hex: "سداسي" };
const HEX = [50, 12, 84, 31, 84, 69, 50, 88, 16, 69, 16, 31];

function inside(frame: Frame, x: number, y: number) {
  const m = 6; // هامش داخلي حتى لا تلامس الرموز الحدود
  if (frame === "circle") return Math.hypot(x - 50, y - 52) <= 38 - m;
  const pts = frame === "tri" ? [50, 12, 90, 90, 10, 90] : HEX;
  // داخل المضلع المحدّب وعلى بعد m من كل ضلع
  const n = pts.length / 2;
  for (let i = 0; i < n; i++) {
    const [x1, y1, x2, y2] = [pts[2 * i], pts[2 * i + 1], pts[(2 * i + 2) % pts.length], pts[(2 * i + 3) % pts.length]];
    const cross = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);
    if (cross / Math.hypot(x2 - x1, y2 - y1) < m) return false;
  }
  return true;
}

function frameShape(frame: Frame): Shape {
  if (frame === "circle") return { t: "circle", cx: 50, cy: 52, r: 38, fill: "white" };
  return { t: "poly", pts: frame === "tri" ? [50, 12, 90, 90, 10, 90] : HEX, fill: "white" };
}

function patternGlyph(frame: Frame, fill: Icon, badge: Icon): Glyph {
  const shapes: Shape[] = [frameShape(frame)];
  for (let y = 22; y <= 86; y += 12) for (let x = 14; x <= 86; x += 12) if (inside(frame, x, y)) shapes.push(place(fill.draw, x, y, 0.08));
  shapes.push(place(badge.draw, 10, 10, 0.15));
  return glyph(...shapes);
}
const patternLabel = (frame: Frame, fill: Icon, badge: Icon) => `${FRAME_NAME[frame]} فيه ${fill.name}، وفي الزاوية ${badge.one}`;

function transferQuestion(
  id: string,
  difficulty: 1 | 2 | 3,
  frame: Frame,
  cycle: Icon[],
  count: number,
  missing: number,
  answer: number,
  cycleText: string,
): Q {
  const at = (k: number) => cycle[((k % cycle.length) + cycle.length) % cycle.length];
  const cells = Array.from({ length: count }, (_, k) => (k === missing ? null : patternGlyph(frame, at(k), at(k + 1))));
  const k = missing;
  const candidates: [Icon, Icon][] = [
    [at(k + 1), at(k)],
    [at(k), at(k)],
    [at(k - 1), at(k + 1)],
    [at(k + 1), at(k + 1)],
    [at(k), at(k - 1)],
  ];
  const seen = new Set([JSON.stringify(patternGlyph(frame, at(k), at(k + 1)))]);
  const wrong: [Glyph, string][] = [];
  for (const [f, b] of candidates) {
    const g = patternGlyph(frame, f, b);
    const key = JSON.stringify(g);
    if (!seen.has(key) && wrong.length < 3) {
      seen.add(key);
      wrong.push([g, patternLabel(frame, f, b)]);
    }
  }
  return {
    id,
    difficulty,
    prompt: SEQ,
    visual: { layout: "sequence", cells },
    ...options([patternGlyph(frame, at(k), at(k + 1)), patternLabel(frame, at(k), at(k + 1))], wrong, answer),
    explanation:
      `الرمز الصغير في زاوية كل خانة يخبرنا بنقش الخانة التالية: نقش كل خانة هو رمز زاوية الخانة التي قبلها. ${cycleText} ` +
      `إذن الخانة الناقصة: ${patternLabel(frame, at(k), at(k + 1))}.`,
  };
}

const transferQuestions: Q[] = [
  transferQuestion("pat-k25", 1, "tri", [ICONS.dot, ICONS.tri], 5, 4, 2, "والرموز تتناوب: نقاط ثم مثلثات ثم نقاط..."),
  transferQuestion("pat-k26", 2, "circle", [ICONS.sq, ICONS.star, ICONS.dot], 5, 4, 0, "والرموز تتكرر كل ثلاث خانات: مربعات، نجوم، نقاط."),
  transferQuestion("pat-k27", 2, "hex", [ICONS.plus, ICONS.dot, ICONS.tri], 5, 2, 3, "والرموز تتكرر كل ثلاث خانات: زائد، نقاط، مثلثات. الخانة الناقصة في الوسط: نقشها رمز زاوية الخانة الثانية، ورمز زاويتها نقش الخانة الرابعة."),
  transferQuestion(
    "pat-k28",
    3,
    "tri",
    [arrowIcon(0), arrowIcon(90), arrowIcon(180), arrowIcon(270)],
    5,
    3,
    1,
    "والأسهم تدور ربع دورة مع عقارب الساعة من خانة إلى التي بعدها.",
  ),
  transferQuestion(
    "pat-k29",
    3,
    "circle",
    [arrowIcon(0), ICONS.star, arrowIcon(270), ICONS.star, arrowIcon(180), ICONS.star, arrowIcon(90), ICONS.star],
    5,
    4,
    3,
    "والنقش يتناوب بين الأسهم والنجوم، والسهم يدور ربع دورة عكس عقارب الساعة في كل مرة يظهر فيها.",
  ),
  transferQuestion("pat-k30", 2, "hex", [ICONS.tri, ICONS.sq], 6, 1, 1, "والرموز تتناوب بين المثلثات والمربعات. الخانة الناقصة هي الثانية."),
];

export const patternShapeQuestions6 = defineOriginalQuestions("patterns", [
  ...fusionQuestions,
  ...sizeQuestions,
  ...orbitQuestions,
  ...layeredQuestions,
  ...transferQuestions,
]);

/** للاختبارات */
export const BATCH6_DATA = { part, thingGlyph, orbitGlyph, layeredGlyph, patternGlyph, LAYERS, ICONS };
