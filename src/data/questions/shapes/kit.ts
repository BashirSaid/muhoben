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
