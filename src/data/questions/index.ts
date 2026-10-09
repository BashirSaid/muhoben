import type { Question, TopicId } from "@/lib/types";
import { logicQuestions } from "./logic";
import { patternQuestions } from "./patterns";
import { verbalQuestions } from "./verbal";
import { quantitativeQuestions } from "./quantitative";
import { spatialQuestions } from "./spatial";
import { problemSolvingQuestions } from "./problem-solving";

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
];

const byId = new Map(QUESTION_BANK.map((q) => [q.id, q]));

export function getQuestion(id: string): Question | undefined {
  return byId.get(id);
}

export function questionsByTopic(topic: TopicId): Question[] {
  return QUESTION_BANK.filter((q) => q.topic === topic);
}
