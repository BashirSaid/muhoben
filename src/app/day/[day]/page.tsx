import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PLAN, getDay } from "@/data/plan";
import { DayView } from "./DayView";

export const dynamicParams = false;

export function generateStaticParams() {
  return PLAN.map((d) => ({ day: String(d.day) }));
}

export async function generateMetadata({ params }: { params: Promise<{ day: string }> }): Promise<Metadata> {
  const { day } = await params;
  const plan = getDay(Number(day));
  return { title: plan ? `اليوم ${plan.day}: ${plan.title}` : "اليوم غير موجود" };
}

export default async function DayPage({ params }: { params: Promise<{ day: string }> }) {
  const { day } = await params;
  const plan = getDay(Number(day));
  if (!plan) notFound();
  return <DayView day={plan.day} />;
}
