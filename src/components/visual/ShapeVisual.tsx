import type { Glyph, Paint, Shape, Visual } from "@/lib/types";

/** رسم أسئلة الأشكال من البيانات (src/data/questions/shapes). */

const PAINT: Record<Paint, string> = {
  black: "#1e293b",
  white: "#ffffff",
  gray: "#94a3b8",
  blue: "#1d6fd8",
  light: "#dbeafe",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#facc15",
  pink: "#ec4899",
  orange: "#fb923c",
  purple: "#a855f7",
  none: "none",
};
const STROKE = "#1e293b";

function ShapeEl({ s }: { s: Shape }) {
  const bare = "bare" in s && s.bare;
  const common = bare
    ? { stroke: "none" }
    : { stroke: STROKE, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };
  switch (s.t) {
    case "g":
      return (
        <g transform={`translate(${s.cx ?? 50} ${s.cy ?? 50}) rotate(${s.r ?? 0}) scale(${s.s ?? 1}) translate(-50 -50)`}>
          {s.shapes.map((c, i) => (
            <ShapeEl key={i} s={c} />
          ))}
        </g>
      );
    case "ellipse":
      return <ellipse cx={s.cx} cy={s.cy} rx={s.rx} ry={s.ry} fill={PAINT[s.fill ?? "white"]} {...common} />;
    case "circle":
      return <circle cx={s.cx} cy={s.cy} r={s.r} fill={PAINT[s.fill ?? "white"]} strokeDasharray={s.dash ? "6 5" : undefined} {...common} />;
    case "rect":
      return (
        <rect x={s.x} y={s.y} width={s.w} height={s.h} fill={PAINT[s.fill ?? "white"]} strokeDasharray={s.dash ? "6 5" : undefined} {...common} />
      );
    case "poly":
      return <polygon points={s.pts.join(" ")} fill={PAINT[s.fill ?? "white"]} {...common} />;
    case "line":
      return <line x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} strokeDasharray={s.dash ? "6 5" : undefined} {...common} />;
    case "path":
      return <path d={s.d} fill={PAINT[s.fill ?? "none"]} {...common} />;
  }
}

export function GlyphSvg({ glyph, label, className = "h-full w-full" }: { glyph: Glyph; label?: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      direction="ltr"
    >
      <g transform={glyph.rotate ? `rotate(${glyph.rotate} 50 50)` : undefined}>
        {glyph.shapes.map((s, i) => (
          <ShapeEl key={i} s={s} />
        ))}
      </g>
    </svg>
  );
}

function Cell({ glyph, caption, size }: { glyph: Glyph | null; caption?: string; size: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className={`grid aspect-square place-items-center rounded-lg ring-1 ${
          glyph ? "bg-white p-1 ring-slate-300" : "border-2 border-dashed border-blue-300 bg-blue-50 ring-0"
        }`}
        style={{ width: size }}
      >
        {glyph ? <GlyphSvg glyph={glyph} /> : <span className="text-3xl font-extrabold text-blue-600">؟</span>}
      </div>
      {caption && <span className="text-xs font-bold text-slate-500">{caption}</span>}
    </div>
  );
}

// عرض الشاشة ناقص الهوامش والمسافات بين الخانات، حتى لا تخرج الخانات عن الإطار على الهاتف
const sizeFor = (perRow: number) => `min(calc((100vw - 9rem) / ${perRow}), 104px)`;

export function VisualStem({ visual }: { visual: Visual }) {
  const wrap = "my-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200";
  switch (visual.layout) {
    case "sequence": {
      const size = sizeFor(visual.cells.length);
      return (
        <figure className={wrap} aria-label="سلسلة أشكال تُقرأ من اليسار إلى اليمين">
          <div dir="ltr" className="flex items-start justify-center gap-2">
            {visual.cells.map((c, i) => (
              <Cell key={i} glyph={c} caption={String(i + 1)} size={size} />
            ))}
          </div>
        </figure>
      );
    }
    case "matrix": {
      const size = sizeFor(visual.cols + 0.5);
      return (
        <figure className={wrap} aria-label="جدول أشكال، يُقرأ كل صف من اليسار إلى اليمين">
          <div dir="ltr" className="mx-auto grid w-fit gap-2" style={{ gridTemplateColumns: `repeat(${visual.cols}, auto)` }}>
            {visual.cells.map((c, i) => (
              <Cell key={i} glyph={c} size={size} />
            ))}
          </div>
        </figure>
      );
    }
    case "analogy": {
      const size = sizeFor(5);
      const [a, b, c] = visual.cells;
      const sep = (t: string) => (
        <span className="self-center text-2xl font-extrabold text-slate-400" aria-hidden="true">
          {t}
        </span>
      );
      return (
        <figure className={wrap} aria-label="تناظر أشكال يُقرأ من اليسار إلى اليمين: الأول بالنسبة إلى الثاني كالثالث بالنسبة إلى المجهول">
          <div dir="ltr" className="flex items-center justify-center gap-1.5 sm:gap-3">
            <Cell glyph={a} size={size} />
            {sep(":")}
            <Cell glyph={b} size={size} />
            {sep("::")}
            <Cell glyph={c} size={size} />
            {sep(":")}
            <Cell glyph={null} size={size} />
          </div>
        </figure>
      );
    }
    case "mirror": {
      const size = sizeFor(3);
      if (visual.axis === "horizontal")
        return (
          <figure className={wrap} aria-label="شكل ومرآة أفقية تحته">
            <div className="flex flex-col items-center gap-3">
              <Cell glyph={visual.glyph} size={size} />
              <div className="w-32 border-t-4 border-dashed border-sky-500" aria-hidden="true" />
              <Cell glyph={null} size={size} />
            </div>
          </figure>
        );
      return (
        <figure className={wrap} aria-label="شكل ومرآة عمودية">
          <div dir="ltr" className="flex items-center justify-center gap-3">
            <Cell glyph={visual.glyph} size={size} />
            <div className="h-28 border-s-4 border-dashed border-sky-500" aria-hidden="true" />
            <Cell glyph={null} size={size} />
          </div>
        </figure>
      );
    }
    case "group": {
      // خانات أكبر عندما تكون قليلة (مثل الموازين)
      const size = visual.cells.length <= 2 ? "min(40vw, 170px)" : sizeFor(Math.max(visual.cells.length, 3));
      return (
        <figure className={wrap}>
          {visual.caption && <figcaption className="mb-3 text-center text-sm font-bold text-slate-600">{visual.caption}</figcaption>}
          <div className="flex flex-wrap items-start justify-center gap-3">
            {visual.cells.map((c, i) => (
              <Cell key={i} glyph={c} size={size} />
            ))}
          </div>
        </figure>
      );
    }
    case "single":
      return (
        <figure className={wrap}>
          <div className="mx-auto w-full max-w-60">
            <GlyphSvg glyph={visual.glyph} />
          </div>
        </figure>
      );
  }
}
