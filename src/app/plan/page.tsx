import type { Metadata } from "next";
import { PlanGrid } from "./PlanGrid";
import { PageTitle } from "@/components/ui";

export const metadata: Metadata = { title: "الخطة التدريبية" };

export default function PlanPage() {
  return (
    <>
      <PageTitle
        title="الخطة التدريبية: 30 يومًا"
        subtitle="كل يوم: درس قصير، وأمثلة محلولة، وأسئلة تدريبية مع شرح. يمكنك فتح أي يوم في أي وقت، والخطة تقترح عليك الترتيب."
      />
      <PlanGrid />
    </>
  );
}
