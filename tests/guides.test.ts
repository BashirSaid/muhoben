import { describe, expect, it } from "vitest";
import { GUIDES, guidesForTopic } from "@/data/guides";
import { TOPIC_IDS } from "@/data/topics";

describe("الشروحات", () => {
  it("لكل مجال أربعة شروحات على الأقل، ويوجد دليل عام", () => {
    for (const t of TOPIC_IDS) expect(guidesForTopic(t).length, t).toBeGreaterThanOrEqual(4);
    expect(GUIDES.some((g) => g.topic === null)).toBe(true);
  });

  it("المعرّفات فريدة وصالحة للروابط", () => {
    const slugs = GUIDES.map((g) => g.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const s of slugs) expect(s).toMatch(/^[a-z0-9-]+$/);
  });

  it("كل دليل مكتمل: تعرّف وخطوات وطرق سريعة وفخاخ ومثال محلول", () => {
    for (const g of GUIDES) {
      expect(g.recognize.length, g.slug).toBeGreaterThan(0);
      expect(g.steps.length, g.slug).toBeGreaterThanOrEqual(2);
      expect(g.tricks.length, g.slug).toBeGreaterThanOrEqual(2);
      expect(g.traps.length, g.slug).toBeGreaterThan(0);
      expect(g.example.steps.length, g.slug).toBeGreaterThan(0);
      expect(g.example.answer.trim(), g.slug).not.toBe("");
    }
  });

  it("علامات $ متوازنة ولا نسبة إلى جهة رسمية ولا تنسيق markdown", () => {
    for (const g of GUIDES) {
      const texts = [g.title, g.summary, ...g.recognize, ...g.steps, ...g.tricks, ...g.traps, g.example.problem, ...g.example.steps, g.example.answer];
      for (const t of texts) {
        expect((t.match(/\$/g) ?? []).length % 2, `${g.slug}: ${t}`).toBe(0);
        expect(t, g.slug).not.toMatch(/وزارة|رسمي|\*\*/);
      }
    }
  });
});
