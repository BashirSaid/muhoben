import type { Glyph, Paint, Shape } from "@/lib/types";

/**
 * أدوات لبناء أسئلة الأشكال كبيانات.
 * كل الرسوم داخل مربع 100×100 مركزه (50، 50).
 * القواعد (الدوران، والانعكاس، والتراكب...) تُحسب برمجيًا، فتكون الإجابة الصحيحة صحيحة بالبناء.
 */

const round = (n: number) => Math.round(n * 10) / 10;

export const glyph = (...shapes: Shape[]): Glyph => ({ shapes });

/** تدوير مع عقارب الساعة بالدرجات */
export const rotate = (g: Glyph, deg: number): Glyph => ({
  ...g,
  rotate: ((((g.rotate ?? 0) + deg) % 360) + 360) % 360,
});

export const combine = (...gs: Glyph[]): Glyph => ({ shapes: gs.flatMap((g) => g.shapes) });

// ---------- أشكال أساسية ----------

export function ngon(n: number, r = 34, fill: Paint = "white", offsetDeg = -90, cx = 50, cy = 50): Shape {
  const pts: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = ((offsetDeg + (360 * i) / n) * Math.PI) / 180;
    pts.push(round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a)));
  }
  return { t: "poly", pts, fill };
}

export const circle = (r = 32, fill: Paint = "white", cx = 50, cy = 50): Shape => ({ t: "circle", cx, cy, r, fill });
export const triangle = (r = 36, fill: Paint = "white", cx = 50, cy = 52) => ngon(3, r, fill, -90, cx, cy);
export const square = (r = 36, fill: Paint = "white", cx = 50, cy = 50) => ngon(4, r, fill, -45, cx, cy);
export const diamond = (r = 36, fill: Paint = "white", cx = 50, cy = 50) => ngon(4, r, fill, -90, cx, cy);
export const pentagon = (r = 36, fill: Paint = "white") => ngon(5, r, fill);
export const hexagon = (r = 36, fill: Paint = "white") => ngon(6, r, fill);
export const heptagon = (r = 36, fill: Paint = "white") => ngon(7, r, fill);
export const rectangle = (fill: Paint = "white"): Shape => ({ t: "rect", x: 12, y: 30, w: 76, h: 40, fill });
export const dot = (cx: number, cy: number, r = 6, fill: Paint = "black"): Shape => ({ t: "circle", cx, cy, r, fill });

/** سهم يشير إلى الأعلى، ويُدار بالدرجات (90 = إلى اليمين) */
export const arrow = (deg = 0): Glyph =>
  rotate(glyph({ t: "poly", pts: [44, 86, 56, 86, 56, 44, 72, 44, 50, 14, 28, 44, 44, 44], fill: "black" }), deg);

/** خط يمر بالمركز؛ 0 = عمودي، 90 = أفقي */
export function lineThrough(deg: number, len = 38): Shape {
  const a = (deg * Math.PI) / 180;
  const dx = round(len * Math.sin(a));
  const dy = round(len * Math.cos(a));
  return { t: "line", x1: 50 - dx, y1: 50 - dy, x2: 50 + dx, y2: 50 + dy };
}

const DICE: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 30], [70, 70]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[30, 26], [70, 26], [30, 50], [70, 50], [30, 74], [70, 74]],
};

/** نقاط بترتيب حجر النرد */
export const dots = (n: number, fill: Paint = "black"): Glyph => glyph(...DICE[n].map(([x, y]) => dot(x, y, 8, fill)));

// ---------- الشبكات ----------

/** شبكة cols×rows، والخانات المختارة ملوّنة (الترقيم صفًّا صفًّا من الأعلى يسارًا). */
export function grid(cells: readonly number[], cols = 3, rows = 3, fill: Paint = "black", size = 80): Glyph {
  const set = new Set(cells);
  const cell = size / Math.max(cols, rows);
  const ox = 50 - (cell * cols) / 2;
  const oy = 50 - (cell * rows) / 2;
  const shapes: Shape[] = [];
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      shapes.push({
        t: "rect",
        x: round(ox + c * cell),
        y: round(oy + r * cell),
        w: round(cell),
        h: round(cell),
        fill: set.has(r * cols + c) ? fill : "white",
      });
  return { shapes };
}

/** شبكة مكعّب: تُرسم الخانات المختارة فقط */
export function net(cells: readonly number[], cols: number, rows: number): Glyph {
  const cell = 84 / Math.max(cols, rows);
  const ox = 50 - (cell * cols) / 2;
  const oy = 50 - (cell * rows) / 2;
  return {
    shapes: cells.map((i) => ({
      t: "rect" as const,
      x: round(ox + (i % cols) * cell),
      y: round(oy + Math.floor(i / cols) * cell),
      w: round(cell),
      h: round(cell),
      fill: "light" as const,
    })),
  };
}

// ---------- عمليات على خانات شبكة 3×3 ----------

const sorted = (a: Iterable<number>) => [...new Set(a)].sort((x, y) => x - y);

export const union = (a: readonly number[], b: readonly number[]) => sorted([...a, ...b]);
export const intersect = (a: readonly number[], b: readonly number[]) => sorted(a.filter((x) => b.includes(x)));
export const xor = (a: readonly number[], b: readonly number[]) =>
  sorted([...a.filter((x) => !b.includes(x)), ...b.filter((x) => !a.includes(x))]);
export const complement = (a: readonly number[]) => sorted([0, 1, 2, 3, 4, 5, 6, 7, 8].filter((x) => !a.includes(x)));

/** تدوير ربع دورة مع عقارب الساعة: (صف، عمود) ← (عمود، 2 − صف) */
export const rot90 = (a: readonly number[]) => sorted(a.map((i) => (i % 3) * 3 + (2 - Math.floor(i / 3))));
export const rot180 = (a: readonly number[]) => rot90(rot90(a));
export const rot270 = (a: readonly number[]) => rot90(rot180(a));
/** انعكاس في مرآة عمودية (اليمين ↔ اليسار) */
export const mirror = (a: readonly number[]) => sorted(a.map((i) => Math.floor(i / 3) * 3 + (2 - (i % 3))));

/** الإطار الخارجي لشبكة 3×3 مع عقارب الساعة بدءًا من الزاوية العلوية اليسرى */
export const BORDER_CW = [0, 1, 2, 5, 8, 7, 6, 3];

// ---------- مسنّنات ----------

export function gear(cx: number, cy: number, r = 12, teeth = 8): Shape {
  const pts: number[] = [];
  const steps = teeth * 4;
  for (let i = 0; i < steps; i++) {
    const a = (2 * Math.PI * i) / steps;
    const rr = i % 4 < 2 ? r + 3 : r;
    pts.push(round(cx + rr * Math.cos(a)), round(cy + rr * Math.sin(a)));
  }
  return { t: "poly", pts, fill: "light" };
}

/** سهم دائري حول نقطة: clockwise = مع عقارب الساعة */
export function curvedArrow(cx: number, cy: number, r: number, clockwise = true): Shape[] {
  const a1 = (-150 * Math.PI) / 180;
  const a2 = (-30 * Math.PI) / 180;
  const [s, e] = clockwise ? [a1, a2] : [a2, a1];
  const p = (a: number) => [round(cx + r * Math.cos(a)), round(cy + r * Math.sin(a))];
  const [sx, sy] = p(s);
  const [ex, ey] = p(e);
  // اتجاه المماس عند نهاية القوس
  const dir = clockwise ? 1 : -1;
  const tx = -Math.sin(e) * dir;
  const ty = Math.cos(e) * dir;
  const nx = Math.cos(e);
  const ny = Math.sin(e);
  return [
    { t: "path", d: `M ${sx} ${sy} A ${r} ${r} 0 0 ${clockwise ? 1 : 0} ${ex} ${ey}`, fill: "none" },
    {
      t: "poly",
      fill: "black",
      pts: [
        round(ex + 6 * tx), round(ey + 6 * ty),
        round(ex + 4 * nx), round(ey + 4 * ny),
        round(ex - 4 * nx), round(ey - 4 * ny),
      ],
    },
  ];
}

// =====================================================================
// إضافات الدفعة الثانية
// =====================================================================

export const difference = (a: readonly number[], b: readonly number[]) => sorted(a.filter((x) => !b.includes(x)));
/** انعكاس في مرآة أفقية (الأعلى ↔ الأسفل) */
export const flipV = (a: readonly number[]) => sorted(a.map((i) => (2 - Math.floor(i / 3)) * 3 + (i % 3)));

/** نقطة على دائرة: الزاوية بالدرجات من الأعلى مع عقارب الساعة */
const onCircle = (cx: number, cy: number, r: number, deg: number): [number, number] => {
  const a = (deg * Math.PI) / 180;
  return [round(cx + r * Math.sin(a)), round(cy - r * Math.cos(a))];
};

/** نجمة بعدد رؤوس n */
export function star(n: number, fill: Paint = "yellow", ro = 38, ri = 17): Shape {
  const pts: number[] = [];
  for (let i = 0; i < 2 * n; i++) pts.push(...onCircle(50, 52, i % 2 === 0 ? ro : ri, (180 * i) / n));
  return { t: "poly", pts, fill };
}

/** دائرة مقسومة إلى n قطاعات، والقطاعات المختارة ملوّنة (القطاع 0 يبدأ من الأعلى مع عقارب الساعة) */
export function pie(n: number, filled: readonly number[], fill: Paint = "blue", r = 36): Glyph {
  const shapes: Shape[] = [circle(r)];
  for (const k of filled) {
    const [x1, y1] = onCircle(50, 50, r, (360 * k) / n);
    const [x2, y2] = onCircle(50, 50, r, (360 * (k + 1)) / n);
    shapes.push({ t: "path", d: `M 50 50 L ${x1} ${y1} A ${r} ${r} 0 ${360 / n > 180 ? 1 : 0} 1 ${x2} ${y2} Z`, fill });
  }
  for (let k = 0; k < n; k++) {
    const [x, y] = onCircle(50, 50, r, (360 * k) / n);
    shapes.push({ t: "line", x1: 50, y1: 50, x2: x, y2: y });
  }
  return { shapes };
}

/** عدد من الأشكال المتماثلة موزّعة داخل الخانة */
const SPREAD: Record<number, [number, number][]> = {
  1: [[50, 50]],
  2: [[30, 50], [70, 50]],
  3: [[50, 28], [28, 68], [72, 68]],
  4: [[30, 30], [70, 30], [30, 70], [70, 70]],
};
export const spread = (n: number, make: (cx: number, cy: number) => Shape): Glyph =>
  ({ shapes: SPREAD[n].map(([x, y]) => make(x, y)) });

/** نقاط حتى 9 (نرد حتى 6، ثم شبكة 3×3) */
export function manyDots(n: number): Glyph {
  if (n <= 6) return dots(n);
  const pts: [number, number][] = [];
  for (let i = 0; i < n; i++) pts.push([25 + (i % 3) * 25, 25 + Math.floor(i / 3) * 25]);
  return { shapes: pts.map(([x, y]) => dot(x, y, 7)) };
}

/** شبكة بألوان متعددة: map = {رقم الخانة: اللون} */
export function colorGrid(map: Readonly<Record<number, Paint>>, cols = 3, rows = 3): Glyph {
  const g = grid([], cols, rows);
  return {
    shapes: g.shapes.map((s, i) => (s.t === "rect" && map[i] ? { ...s, fill: map[i] } : s)),
  };
}

type CellMap = Readonly<Record<number, Paint>>;
const remap = (m: CellMap, f: (i: number) => number): Record<number, Paint> =>
  Object.fromEntries(Object.entries(m).map(([k, v]) => [f(Number(k)), v]));
export const mapRot90 = (m: CellMap) => remap(m, (i) => (i % 3) * 3 + (2 - Math.floor(i / 3)));
export const mapRot180 = (m: CellMap) => mapRot90(mapRot90(m));
export const mapRot270 = (m: CellMap) => mapRot90(mapRot180(m));
export const mapMirror = (m: CellMap) => remap(m, (i) => Math.floor(i / 3) * 3 + (2 - (i % 3)));
export const mapFlipV = (m: CellMap) => remap(m, (i) => (2 - Math.floor(i / 3)) * 3 + (i % 3));
export const mapSwap = (m: CellMap, a: Paint, b: Paint): Record<number, Paint> =>
  Object.fromEntries(Object.entries(m).map(([k, v]) => [k, v === a ? b : v === b ? a : v]));

/** عقرب ساعة على شكل مستطيل رفيع */
function hand(deg: number, len: number, w: number, fill: Paint): Shape {
  const a = (deg * Math.PI) / 180;
  const dx = Math.sin(a), dy = -Math.cos(a);
  const px = Math.cos(a) * (w / 2), py = Math.sin(a) * (w / 2);
  const tx = 50 + dx * len, ty = 50 + dy * len;
  return { t: "poly", fill, pts: [50 + px, 50 + py, tx + px, ty + py, tx - px, ty - py, 50 - px, 50 - py].map(round) };
}

/** ساعة: hourDeg للعقرب القصير، minuteDeg للعقرب الطويل */
export function clock(hourDeg: number, minuteDeg: number): Glyph {
  const ticks: Shape[] = [];
  for (let k = 0; k < 12; k++) {
    const [x1, y1] = onCircle(50, 50, 33, k * 30);
    const [x2, y2] = onCircle(50, 50, k % 3 === 0 ? 26 : 29, k * 30);
    ticks.push({ t: "line", x1, y1, x2, y2 });
  }
  return { shapes: [circle(38), ...ticks, hand(minuteDeg, 30, 4, "blue"), hand(hourDeg, 19, 7, "black"), dot(50, 50, 4)] };
}

/** مكعبات بمنظور متساوي القياس؛ كل مكعب [x, y, z] */
export function isoCubes(cubes: readonly [number, number, number][]): Glyph {
  const A = 13, B = 7.5, H = 15;
  const P = (x: number, y: number, z: number): [number, number] => [(x - y) * A, (x + y) * B - z * H];
  const faces: { pts: [number, number][]; fill: Paint }[] = [];
  const order = [...cubes].sort((p, q) => p[0] + p[1] - (q[0] + q[1]) || p[2] - q[2]);
  for (const [x, y, z] of order) {
    faces.push({ fill: "light", pts: [P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)] });
    faces.push({ fill: "gray", pts: [P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)] });
    faces.push({ fill: "white", pts: [P(x, y + 1, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)] });
  }
  const all = faces.flatMap((f) => f.pts);
  const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
  const ox = 50 - (Math.min(...xs) + Math.max(...xs)) / 2;
  const oy = 50 - (Math.min(...ys) + Math.max(...ys)) / 2;
  return { shapes: faces.map((f) => ({ t: "poly" as const, fill: f.fill, pts: f.pts.flatMap(([x, y]) => [round(x + ox), round(y + oy)]) })) };
}

export type BalanceItem = "circle" | "square" | "triangle";
/** ميزان متوازن: أشكال في الكفة اليمنى وأخرى في اليسرى */
export function balance(right: readonly BalanceItem[], left: readonly BalanceItem[]): Glyph {
  const item = (k: BalanceItem, cx: number, cy: number): Shape =>
    k === "circle" ? circle(5.5, "red", cx, cy) : k === "square" ? square(7.5, "blue", cx, cy) : triangle(7.5, "green", cx, cy + 1);
  // ثلاثة أشكال في كل صف كحد أقصى؛ الصف الثاني فوق الأول
  const place = (items: readonly BalanceItem[], center: number) =>
    items.map((k, i) => {
      const row = Math.floor(i / 3);
      const inRow = Math.min(3, items.length - row * 3);
      const col = i % 3;
      return item(k, round(center + (col - (inRow - 1) / 2) * 12), 44 - row * 12);
    });
  return {
    shapes: [
      { t: "poly", pts: [50, 52, 41, 86, 59, 86], fill: "gray" },
      { t: "line", x1: 10, y1: 52, x2: 90, y2: 52 },
      { t: "path", d: "M 10 52 Q 28 64 46 52", fill: "light" },
      { t: "path", d: "M 54 52 Q 72 64 90 52", fill: "light" },
      ...place(left, 28),
      ...place(right, 72),
    ],
  };
}

/** ثلاث بكرات: الحزام بين الأولى (يمين) والثانية متقاطع، وبين الثانية والثالثة مستقيم */
export function pulleys(): Glyph {
  const xs = [86, 50, 14], y = 52, r = 8;
  return {
    shapes: [
      { t: "line", x1: xs[0], y1: y - r, x2: xs[1], y2: y + r },
      { t: "line", x1: xs[0], y1: y + r, x2: xs[1], y2: y - r },
      { t: "line", x1: xs[1], y1: y - r, x2: xs[2], y2: y - r },
      { t: "line", x1: xs[1], y1: y + r, x2: xs[2], y2: y + r },
      ...xs.map((x) => circle(r, "light", x, y)),
      ...xs.map((x) => dot(x, y, 2.5)),
      ...curvedArrow(xs[0], y, 13, true),
    ],
  };
}
