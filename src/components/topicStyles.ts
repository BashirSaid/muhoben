import type { Topic } from "@/lib/types";

// أسماء أصناف Tailwind مكتوبة بالكامل حتى يلتقطها Tailwind عند البناء
export const TOPIC_STYLES: Record<
  Topic["color"],
  { badge: string; bar: string; soft: string; ring: string; text: string }
> = {
  violet: { badge: "bg-violet-100 text-violet-800", bar: "bg-violet-500", soft: "bg-violet-50", ring: "ring-violet-200", text: "text-violet-700" },
  sky: { badge: "bg-sky-100 text-sky-800", bar: "bg-sky-500", soft: "bg-sky-50", ring: "ring-sky-200", text: "text-sky-700" },
  emerald: { badge: "bg-emerald-100 text-emerald-800", bar: "bg-emerald-500", soft: "bg-emerald-50", ring: "ring-emerald-200", text: "text-emerald-700" },
  amber: { badge: "bg-amber-100 text-amber-900", bar: "bg-amber-500", soft: "bg-amber-50", ring: "ring-amber-200", text: "text-amber-800" },
  rose: { badge: "bg-rose-100 text-rose-800", bar: "bg-rose-500", soft: "bg-rose-50", ring: "ring-rose-200", text: "text-rose-700" },
  teal: { badge: "bg-teal-100 text-teal-800", bar: "bg-teal-500", soft: "bg-teal-50", ring: "ring-teal-200", text: "text-teal-700" },
};
