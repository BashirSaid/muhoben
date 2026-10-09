import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTitle, LoadingCard } from "@/components/ui";
import { PracticeBuilder } from "./PracticeBuilder";

export const metadata: Metadata = { title: "تدريب حر" };

export default function PracticePage() {
  return (
    <>
      <PageTitle
        title="تدريب حر"
        subtitle="اختر المجالات والمستوى وعدد الأسئلة، وتدرّب بالطريقة التي تناسبك."
      />
      <Suspense fallback={<LoadingCard />}>
        <PracticeBuilder />
      </Suspense>
    </>
  );
}
