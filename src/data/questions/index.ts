import type { Question, TopicId } from "@/lib/types";
import { logicQuestions } from "./logic";
import { patternQuestions } from "./patterns";
import { verbalQuestions } from "./verbal";
import { quantitativeQuestions } from "./quantitative";
import { spatialQuestions } from "./spatial";
import { problemSolvingQuestions } from "./problem-solving";
import { patternShapeQuestions, spatialShapeQuestions } from "./shapes";

/**
 * بنك الأسئلة الكامل. جميع الأسئلة أصلية من إعداد المنصة
 * (source.kind === "original") ولا تمثّل أسئلة رسمية لأي امتحان.
 */
export const QUESTION_BANK: Question[] = [
  ...logicQuestions,
  ...patternQuestions,
  ...verbalQuestions,
  ...quantitativeQuestions,
  ...spatialQuestions,
  ...problemSolvingQuestions,
  ...patternShapeQuestions,
  ...spatialShapeQuestions,
];

const byId = new Map(QUESTION_BANK.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return byId.get(id);
}

/** سؤال أشكال مرسوم (رسم في نص السؤال أو خيارات مرسومة، أو رسم توضيحي) */
export function isShapeQuestion(q: Question): boolean {
  return Boolean(q.visual || q.optionVisuals || q.figure);
}

/** كل أسئلة الأشكال المرسومة — للتدريب والاختبارات الخاصة بالأشكال */
export const SHAPE_QUESTIONS: Question[] = QUESTION_BANK.filter(isShapeQuestion);

export function questionsByTopic(topic: TopicId): Question[] {
  return QUESTION_BANK.filter((q) => q.topic === topic);
}
