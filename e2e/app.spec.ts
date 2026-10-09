import { expect, test, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
}

test("الصفحات الرئيسية عربية باتجاه RTL وبلا تمرير أفقي", async ({ page }) => {
  for (const path of ["./", "plan/", "day/1/", "day/19/", "practice/", "exam/", "results/", "about/"]) {
    await page.goto(path);
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("h1").first()).toBeVisible();
    await expectNoHorizontalOverflow(page);
  }
});

test("إكمال أسئلة اليوم الأول يحدّث لوحة الطالب", async ({ page }) => {
  await page.goto("day/1/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("التفكير المنطقي");
  await page.getByRole("button", { name: "ابدأ الأسئلة" }).click();

  for (let i = 0; i < 6; i++) {
    await page.getByRole("radio").first().click();
    await page.getByRole("button", { name: "تحقّق من الإجابة" }).click();
    await expect(page.getByText("الإجابة الصحيحة:").first()).toBeVisible();
    const finish = page.getByRole("button", { name: /إنهاء وعرض النتيجة/ });
    if (await finish.isVisible()) {
      await finish.click();
      break;
    }
    await page.getByRole("button", { name: /السؤال التالي/ }).click();
  }

  await expect(page.getByText("الأداء حسب المجال")).toBeVisible();
  await expect(page.getByText(/الإجابات الصحيحة:/)).toBeVisible();

  await page.goto("./");
  await expect(page.getByText("أنجزت 1 من 30 يومًا")).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("اليوم 2 من 30");
  await expect(page.getByText("آخر النتائج")).toBeVisible();
});

test("اختبار شامل قصير بمؤقت وتسليم وتقرير", async ({ page }) => {
  await page.goto("exam/");
  await page.getByRole("button", { name: "ابدأ الاختبار" }).first().click();
  await expect(page.getByRole("timer")).toBeVisible();
  // أجب عن أول 3 أسئلة فقط
  for (let i = 0; i < 3; i++) {
    await page.getByRole("radio").nth(1).click();
    await page.getByRole("button", { name: /^التالي/ }).click();
  }
  await page.getByRole("button", { name: "تسليم الاختبار" }).click();
  await expect(page.getByText(/بقي 15 سؤالًا بلا إجابة/)).toBeVisible();
  await page.getByRole("button", { name: "نعم، سلّم الاختبار" }).click();
  await expect(page.getByText("مراجعة الإجابات")).toBeVisible();
  await expect(page.getByText(/بلا إجابة: 15 سؤالًا/)).toBeVisible();

  await page.goto("results/");
  await expect(page.getByText("سجل الاختبارات (1)")).toBeVisible();
  await page.getByRole("button", { name: /عرض التقرير/ }).click();
  await expect(page.getByText("الأداء حسب المجال")).toBeVisible();
});

test("التدريب الحر يحترم المجال المختار من الرابط", async ({ page }) => {
  await page.goto("practice/?topic=spatial");
  await expect(page.getByRole("checkbox", { name: /الأشكال والعلاقات المكانية/ })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: /التفكير المنطقي/ })).not.toBeChecked();
  await page.getByRole("button", { name: "ابدأ التدريب" }).click();
  await expect(page.getByText("السؤال 1 من 10")).toBeVisible();
  await expect(page.getByText("المكاني").first()).toBeVisible();
});

test("الصفحة غير الموجودة تعرض رسالة عربية", async ({ page }) => {
  await page.goto("no-such-page/");
  await expect(page.getByText("الصفحة غير موجودة")).toBeVisible();
});
