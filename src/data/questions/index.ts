import type { Question, TopicId } from "@/lib/types";
import { logicQuestions } from "./logic";
import { logicQuestions2 } from "./logic-2";
import { patternQuestions } from "./patterns";
import { verbalQuestions } from "./verbal";
import { verbalQuestions2 } from "./verbal-2";
import { quantitativeQuestions } from "./quantitative";
import { quantitativeQuestions2 } from "./quantitative-2";
import { spatialQuestions } from "./spatial";
import { problemSolvingQuestions } from "./problem-solving";
import { problemSolvingQuestions2 } from "./problem-solving-2";
import { patternShapeQuestions, spatialShapeQuestions } from "./shapes";
import {
  logicShapeQuestions,
  patternShapeQuestions2,
  problemShapeQuestions,
  spatialShapeQuestions2,
} from "./shapes/batch2";
import {
  logicShapeQuestions3,
  patternShapeQuestions3,
  problemShapeQuestions3,
  spatialShapeQuestions3,
} from "./shapes/batch3";
import { patternShapeQuestions4, spatialShapeQuestions4 } from "./shapes/batch4";
import { patternShapeQuestions5, problemShapeQuestions5, spatialShapeQuestions5 } from "./shapes/batch5";

/**
 * بنك الأسئلة الكامل. جميع الأسئلة أصلية من إعداد المنصة
 * (source.kind === "original") ولا تمثّل أسئلة رسمية لأي امتحان.
 */
export const QUESTION_BANK: Question[] = [
  ...logicQuestions,
  ...logicQuestions2,
  ...patternQuestions,
  ...verbalQuestions,
  ...verbalQuestions2,
  ...quantitativeQuestions,
  ...quantitativeQuestions2,
  ...spatialQuestions,
  ...problemSolvingQuestions,
  ...problemSolvingQuestions2,
  ...patternShapeQuestions,
  ...spatialShapeQuestions,
  ...patternShapeQuestions2,
  ...spatialShapeQuestions2,
  ...logicShapeQuestions,
  ...problemShapeQuestions,
  ...patternShapeQuestions3,
  ...spatialShapeQuestions3,
  ...logicShapeQuestions3,
  ...problemShapeQuestions3,
  ...patternShapeQuestions4,
  ...spatialShapeQuestions4,
  ...patternShapeQuestions5,
  ...spatialShapeQuestions5,
  ...problemShapeQuestions5,
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
