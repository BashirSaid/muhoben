import type { Topic, TopicId } from "@/lib/types";

export const TOPICS: Topic[] = [
  {
    id: "logic",
    name: "التفكير المنطقي والاستدلال",
    shortName: "المنطق",
    description: "استنتاج نتائج صحيحة من المعطيات، والترتيب، والصدق والكذب.",
    icon: "🧩",
    color: "violet",
  },
  {
    id: "patterns",
    name: "الأنماط والمتتاليات العددية",
    shortName: "الأنماط",
    description: "اكتشاف القاعدة في متتاليات الأعداد والحروف والأشكال.",
    icon: "🔢",
    color: "sky",
  },
  {
    id: "verbal",
    name: "العلاقات اللفظية وفهم النصوص",
    shortName: "اللغة",
    description: "التناظر اللفظي، ومعاني الكلمات، وفهم المقروء والاستنتاج منه.",
    icon: "📖",
    color: "emerald",
  },
  {
    id: "quantitative",
    name: "التفكير الكمي والمسائل الرياضية",
    shortName: "الكمّي",
    description: "العمليات، والكسور، والنسب المئوية، والتناسب، والمسائل الكلامية.",
    icon: "➗",
    color: "amber",
  },
  {
    id: "spatial",
    name: "الأشكال والعلاقات المكانية",
    shortName: "المكاني",
    description: "التماثل، والدوران، والمكعبات، وعدّ الأشكال، والاتجاهات.",
    icon: "🔷",
    color: "rose",
  },
  {
    id: "problem-solving",
    name: "حل المشكلات والاستنتاج",
    shortName: "حل المشكلات",
    description: "استراتيجيات الحل: العمل العكسي، والجداول، والتخمين والتحقق.",
    icon: "💡",
    color: "teal",
  },
];

export const TOPIC_IDS: TopicId[] = TOPICS.map((t) => t.id);

const byId = new Map(TOPICS.map((t) => [t.id, t]));

export function getTopic(id: TopicId): Topic {
  const topic = byId.get(id);
  if (!topic) throw new Error(`Unknown topic: ${id}`);
  return topic;
}

export const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: "سهل",
  2: "متوسط",
  3: "متقدّم",
};
