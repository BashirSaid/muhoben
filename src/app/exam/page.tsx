import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { ExamCenter } from "./ExamCenter";

export const metadata: Metadata = { title: "الاختبارات الشاملة" };

export default function ExamPage() {
  return (
    <>
      <PageTitle
        title="الاختبارات الشاملة"
        subtitle="اختبارات بمؤقت تضم أسئلة من كل المجالات، لتتعوّد على أجواء الاختبار وتنظيم الوقت."
      />
      <ExamCenter />
    </>
  );
}
