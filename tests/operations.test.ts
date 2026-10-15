import { describe, expect, it } from "vitest";
import { operationQuestions } from "@/data/questions/operations";

describe("أسئلة العملية الجديدة", () => {
  it("40 سؤالًا في التفكير الكمي، بأربعة خيارات مختلفة وإجابات غير سالبة", () => {
    expect(operationQuestions.length).toBe(40);
    for (const q of operationQuestions) {
      expect(q.topic).toBe("quantitative");
      expect(q.options.length, q.id).toBe(4);
      expect(new Set(q.options).size, q.id).toBe(4);
      const v = Number(q.options[q.answer]);
      if (!Number.isNaN(v)) expect(v, q.id).toBeGreaterThanOrEqual(0);
      expect(q.explanation, q.id).toContain(q.options[q.answer].replace(/\$/g, "").split(" ")[0]);
    }
  });
  it("مواضع الإجابات الصحيحة موزعة، والمستويات الثلاثة موجودة", () => {
    expect(new Set(operationQuestions.map((q) => q.answer)).size).toBe(4);
    expect(new Set(operationQuestions.map((q) => q.difficulty)).size).toBe(3);
  });
});
