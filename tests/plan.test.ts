import { describe, expect, it } from "vitest";
import { PLAN, TOTAL_DAYS } from "@/data/plan";
import { QUESTION_BANK } from "@/data/questions";
import { TOPIC_IDS } from "@/data/topics";

describe("الخطة التدريبية", () => {
  it("تتكون من 30 يومًا مرقّمة بالترتيب", () => {
    expect(TOTAL_DAYS).toBe(30);
    PLAN.forEach((d, i) => expect(d.day).toBe(i + 1));
  });

  it("كل يوم فيه عنوان وأهداف ودرس ونصيحة", () => {
    for (const d of PLAN) {
      expect(d.title.length, `day ${d.day}`).toBeGreaterThan(3);
      expect(d.goals.length, `day ${d.day}`).toBeGreaterThan(0);
      expect(d.lessons.length, `day ${d.day}`).toBeGreaterThan(0);
      expect(d.tip.length, `day ${d.day}`).toBeGreaterThan(3);
      for (const t of d.topics) expect(TOPIC_IDS).toContain(t);
    }
  });

  it("أيام الدروس تحتوي أمثلة محلولة", () => {
    for (const d of PLAN.filter((p) => p.kind === "lesson")) {
      expect(d.examples.length, `day ${d.day}`).toBeGreaterThanOrEqual(1);
      for (const ex of d.examples) {
        expect(ex.steps.length).toBeGreaterThan(0);
        expect(ex.answer.length).toBeGreaterThan(0);
      }
    }
  });

  it("يغطي كل مجال في 4 أيام دروس على الأقل", () => {
    for (const t of TOPIC_IDS) {
      const days = PLAN.filter((d) => d.kind === "lesson" && d.topics.includes(t));
      expect(days.length, t).toBeGreaterThanOrEqual(4);
    }
  });

  it("بنك الأسئلة يكفي لاختبار كل يوم دون تكرار", () => {
    for (const d of PLAN) {
      const pool = QUESTION_BANK.filter((q) => d.topics.includes(q.topic));
      expect(pool.length, `day ${d.day}`).toBeGreaterThanOrEqual(d.quiz.count);
      const preferred = pool.filter((q) => d.quiz.difficulties.includes(q.difficulty));
      expect(preferred.length, `day ${d.day} preferred`).toBeGreaterThanOrEqual(Math.min(d.quiz.count, 6));
    }
  });

  it("كل تدريب يومي يتكون من 30 سؤالًا", () => {
    for (const d of PLAN) expect(d.quiz.count, `day ${d.day}`).toBe(30);
  });

  it("اليوم الأخير اختبار شامل بمؤقت", () => {
    const last = PLAN[PLAN.length - 1];
    expect(last.kind).toBe("exam");
    expect(last.quiz.timeLimitMinutes).toBeGreaterThan(0);
    expect(last.topics.length).toBe(TOPIC_IDS.length);
  });
});
