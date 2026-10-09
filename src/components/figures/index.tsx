import type { FigureId } from "@/lib/types";

/**
 * رسوم توضيحية بسيطة (SVG) للأسئلة المكانية.
 * الرسوم أصلية ومرسومة برمجيًا، وتحتوي وصفًا نصيًا لقارئات الشاشة.
 */
const STROKE = "#334155";

function Svg({ viewBox, title, children }: { viewBox: string; title: string; children: React.ReactNode }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className="mx-auto h-auto w-full max-w-xs" direction="ltr">
      <title>{title}</title>
      {children}
    </svg>
  );
}

function TriangleSplit() {
  const apex = [150, 20];
  const base = [30, 110, 190, 270];
  return (
    <Svg viewBox="0 0 300 200" title="مثلث كبير قُسّم بخطين من الرأس إلى القاعدة">
      <g fill="none" stroke={STROKE} strokeWidth="3" strokeLinejoin="round">
        <line x1={base[0]} y1="180" x2={base[3]} y2="180" />
        {base.map((x) => (
          <line key={x} x1={apex[0]} y1={apex[1]} x2={x} y2="180" />
        ))}
      </g>
    </Svg>
  );
}

function Strip4() {
  return (
    <Svg viewBox="0 0 340 100" title="شريط مكوّن من أربعة مربعات متجاورة">
      <g fill="#e0e7ff" stroke={STROKE} strokeWidth="3">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={10 + i * 80} y="10" width="80" height="80" />
        ))}
      </g>
    </Svg>
  );
}

function CubeNet() {
  const s = 60;
  const cells: { x: number; y: number; n: number }[] = [
    { x: 120, y: 10, n: 1 },
    { x: 120, y: 70, n: 2 },
    { x: 120, y: 130, n: 3 },
    { x: 120, y: 190, n: 4 },
    { x: 60, y: 70, n: 5 },
    { x: 180, y: 70, n: 6 },
  ];
  return (
    <Svg viewBox="0 0 300 260" title="شبكة مكعب: عمود من الأوجه 1 و2 و3 و4، والوجهان 5 و6 على جانبي الوجه 2">
      {cells.map((c) => (
        <g key={c.n}>
          <rect x={c.x} y={c.y} width={s} height={s} fill="#fef3c7" stroke={STROKE} strokeWidth="3" />
          <text x={c.x + s / 2} y={c.y + s / 2 + 9} textAnchor="middle" fontSize="26" fontWeight="700" fill="#1e293b">
            {c.n}
          </text>
        </g>
      ))}
    </Svg>
  );
}

function ShadedGrid() {
  const shaded = new Set(["0-0", "0-1", "1-0", "2-2", "3-1", "3-3"]);
  return (
    <Svg viewBox="0 0 260 260" title="شبكة 4 في 4 فيها 6 مربعات مظللة">
      {Array.from({ length: 16 }, (_, k) => {
        const r = Math.floor(k / 4);
        const c = k % 4;
        return (
          <rect
            key={k}
            x={10 + c * 60}
            y={10 + r * 60}
            width="60"
            height="60"
            fill={shaded.has(`${r}-${c}`) ? "#6366f1" : "#ffffff"}
            stroke={STROKE}
            strokeWidth="3"
          />
        );
      })}
    </Svg>
  );
}

function Grid3x3() {
  return (
    <Svg viewBox="0 0 220 220" title="شبكة مربعات 3 في 3">
      {Array.from({ length: 9 }, (_, k) => (
        <rect
          key={k}
          x={10 + (k % 3) * 66}
          y={10 + Math.floor(k / 3) * 66}
          width="66"
          height="66"
          fill="#ecfeff"
          stroke={STROKE}
          strokeWidth="3"
        />
      ))}
    </Svg>
  );
}

function PlusShape() {
  const s = 60;
  const cells = [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
  ];
  return (
    <Svg viewBox="0 0 200 200" title="شكل على هيئة علامة زائد مكوّن من 5 مربعات متطابقة">
      {cells.map(([c, r]) => (
        <rect key={`${c}-${r}`} x={10 + c * s} y={10 + r * s} width={s} height={s} fill="#ffe4e6" stroke={STROKE} strokeWidth="3" />
      ))}
    </Svg>
  );
}

function DotRotation() {
  // الإطار 1 على اليمين (اتجاه القراءة العربية)، والإطار 4 على اليسار
  const corners = [
    [18, 18], // علوية يسرى
    [62, 18], // علوية يمنى
    [62, 62], // سفلية يمنى
  ];
  const frames = [0, 1, 2, 3];
  return (
    <Svg viewBox="0 0 380 120" title="أربعة مربعات مرقّمة من اليمين إلى اليسار: النقطة في الزاوية العلوية اليسرى، ثم العلوية اليمنى، ثم السفلية اليمنى، والمربع الرابع مجهول">
      {frames.map((f) => {
        const x = 290 - f * 92;
        return (
          <g key={f} transform={`translate(${x} 10)`}>
            <rect width="80" height="80" fill="#fff" stroke={STROKE} strokeWidth="3" rx="6" />
            {f < 3 ? (
              <circle cx={corners[f][0]} cy={corners[f][1]} r="9" fill="#e11d48" />
            ) : (
              <text x="40" y="52" textAnchor="middle" fontSize="34" fontWeight="700" fill="#64748b">
                ؟
              </text>
            )}
            <text x="40" y="108" textAnchor="middle" fontSize="16" fill="#475569">
              {f + 1}
            </text>
          </g>
        );
      })}
    </Svg>
  );
}

const FIGURES: Record<FigureId, () => React.JSX.Element> = {
  "triangle-split": TriangleSplit,
  "strip-4": Strip4,
  "cube-net": CubeNet,
  "shaded-grid": ShadedGrid,
  "grid-3x3": Grid3x3,
  "plus-shape": PlusShape,
  "dot-rotation": DotRotation,
};

export function Figure({ id }: { id: FigureId }) {
  const Component = FIGURES[id];
  return (
    <figure className="my-4 rounded-xl bg-slate-50 p-4 ring-1 ring-slate-200">
      <Component />
    </figure>
  );
}
