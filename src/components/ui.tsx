import Link from "next/link";
import { getTopic, DIFFICULTY_LABELS } from "@/data/topics";
import type { Difficulty, TopicId } from "@/lib/types";
import { formatNumber } from "@/lib/format";
import { TOPIC_STYLES } from "./topicStyles";

export function Card({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div" | "article";
}) {
  return (
    <Tag className={`rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>
      {children}
    </Tag>
  );
}

export function PageTitle({ title, subtitle }: { title: string; subtitle?: React.ReactNode }) {
  return (
    <header className="mb-6">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-slate-600">{subtitle}</p>}
    </header>
  );
}

export function ProgressBar({
  value,
  className = "",
  barClass = "bg-blue-500",
  label,
}: {
  value: number;
  className?: string;
  barClass?: string;
  label?: string;
}) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-3 w-full overflow-hidden rounded-full bg-slate-100 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      {/* في اتجاه RTL يبدأ الشريط من اليمين تلقائيًا */}
      <div className={`h-full rounded-full transition-all ${barClass}`} style={{ width: `${v}%` }} />
    </div>
  );
}

export function ProgressRing({ value, size = 120, label }: { value: number; size?: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden="true">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="#1d6fd8"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (v / 100) * c}
          transform="rotate(-90 60 60)"
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-extrabold text-slate-900">{formatNumber(Math.round(v))}%</div>
        {label && <div className="text-xs text-slate-500">{label}</div>}
      </div>
    </div>
  );
}

export function StatCard({ label, value, icon }: { label: string; value: React.ReactNode; icon: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-xl" aria-hidden="true">
        {icon}
      </span>
      <div>
        <div className="text-xl font-extrabold text-slate-900">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
    </div>
  );
}

export function TopicBadge({ topic, short = false }: { topic: TopicId; short?: boolean }) {
  const t = getTopic(topic);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${TOPIC_STYLES[t.color].badge}`}>
      <span aria-hidden="true">{t.icon}</span>
      {short ? t.shortName : t.name}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const cls =
    difficulty === 1
      ? "bg-green-100 text-green-800"
      : difficulty === 2
        ? "bg-yellow-100 text-yellow-900"
        : "bg-orange-100 text-orange-900";
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>
      <span aria-hidden="true">{"★".repeat(difficulty)}</span>
      {DIFFICULTY_LABELS[difficulty]}
    </span>
  );
}

const BUTTON_VARIANTS = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
  secondary: "bg-white text-slate-800 ring-1 ring-slate-300 hover:bg-slate-50",
  success: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  danger: "bg-white text-rose-700 ring-1 ring-rose-300 hover:bg-rose-50",
  ghost: "text-blue-700 hover:bg-blue-50",
};
type Variant = keyof typeof BUTTON_VARIANTS;
const BUTTON_BASE =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-base font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-50";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button type="button" className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`} {...props} />;
}

export function LinkButton({
  href,
  variant = "primary",
  className = "",
  children,
}: {
  href: string;
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className={`${BUTTON_BASE} ${BUTTON_VARIANTS[variant]} ${className}`}>
      {children}
    </Link>
  );
}

export function LoadingCard() {
  return (
    <div className="animate-pulse space-y-3 rounded-2xl bg-white p-6 ring-1 ring-slate-200" aria-busy="true" aria-label="جارٍ التحميل">
      <div className="h-5 w-1/3 rounded bg-slate-200" />
      <div className="h-4 w-2/3 rounded bg-slate-100" />
      <div className="h-4 w-1/2 rounded bg-slate-100" />
    </div>
  );
}

export function Notice({ children, tone = "info" }: { children: React.ReactNode; tone?: "info" | "warn" }) {
  const cls = tone === "info" ? "bg-sky-50 text-sky-900 ring-sky-200" : "bg-amber-50 text-amber-900 ring-amber-200";
  return <div className={`rounded-xl p-4 text-sm leading-7 ring-1 ${cls}`}>{children}</div>;
}
