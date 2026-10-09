import type { Metadata } from "next";
import { PageTitle } from "@/components/ui";
import { ResultsView } from "./ResultsView";

export const metadata: Metadata = { title: "التقارير والنتائج" };

export default function ResultsPage() {
  return (
    <>
      <PageTitle title="التقارير والنتائج" subtitle="تقرير شامل عن تقدّمك، ونتائج كل الاختبارات مع مراجعة الأخطاء." />
      <ResultsView />
    </>
  );
}
