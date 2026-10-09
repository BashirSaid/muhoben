import type { Question, TopicId } from "@/lib/types";

type QuestionInput = Omit<Question, "topic" | "source">;

/**
 * يضيف المجال ومصدر السؤال لكل سؤال في القائمة.
 * جميع الأسئلة المعرّفة بهذه الدالة أسئلة أصلية من إعداد المنصة.
 */
export function defineOriginalQuestions(topic: TopicId, list: QuestionInput[]): Question[] {
  return list.map((q) => ({ ...q, topic, source: { kind: "original" } }));
}
