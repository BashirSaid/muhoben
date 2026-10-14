import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card, LinkButton, TopicBadge } from "@/components/ui";
import { RichText } from "@/components/RichText";
import { GlyphSvg, VisualStem } from "@/components/visual/ShapeVisual";
import { GUIDES, getGuide } from "@/data/guides";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: getGuide(slug)?.title ?? "الدليل غير موجود" };
}

function Section({ title, icon, items, tone }: { title: string; icon: string; items: string[]; tone: string }) {
  return (
    <Card>
      <h2 className={`mb-3 text-lg font-extrabold ${tone}`}>
        <span aria-hidden="true">{icon}</span> {title}
      </h2>
      <ul className="list-disc space-y-2 ps-5 leading-8 text-slate-800">
        {items.map((item, i) => (
          <li key={i}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) notFound();

  const index = GUIDES.indexOf(guide);
  const prev = GUIDES[index - 1];
  const next = GUIDES[index + 1];
  const practiceHref =
    guide.practice === "shapes"
      ? "/practice/?type=shapes"
      : guide.topic
        ? `/practice/?topic=${guide.topic}`
        : "/practice/";
  const { example } = guide;

  return (
    <article className="space-y-5">
      <nav aria-label="مسار التنقل" className="text-sm text-slate-500">
        <Link href="/guide/" className="font-bold text-blue-700 hover:underline">
          الشروحات
        </Link>{" "}
        / {guide.title}
      </nav>

      <header>
        {guide.topic && <TopicBadge topic={guide.topic} />}
        <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
          <span aria-hidden="true">{guide.icon}</span> {guide.title}
        </h1>
        <p className="mt-2 text-slate-600">{guide.summary}</p>
      </header>

      <Section title="كيف تتعرّف على هذا النوع؟" icon="🔍" items={guide.recognize} tone="text-slate-800" />
      <Card>
        <h2 className="mb-3 text-lg font-extrabold text-blue-800">
          <span aria-hidden="true">🪜</span> خطوات الحل
        </h2>
        <ol className="list-decimal space-y-2 ps-5 leading-8 text-slate-800">
          {guide.steps.map((s, i) => (
            <li key={i}>
              <RichText text={s} />
            </li>
          ))}
        </ol>
      </Card>
      <Section title="طرق سريعة وذكية" icon="⚡" items={guide.tricks} tone="text-emerald-700" />
      <Section title="فخاخ شائعة: انتبه!" icon="⚠️" items={guide.traps} tone="text-rose-700" />

      <Card className="bg-amber-50 ring-amber-200">
        <h2 className="mb-3 text-lg font-extrabold text-amber-900">
          <span aria-hidden="true">✏️</span> مثال محلول
        </h2>
        <p className="font-bold leading-8 text-slate-900">
          <RichText text={example.problem} />
        </p>
        {example.visual && <VisualStem visual={example.visual} />}
        <ol className="mt-3 list-decimal space-y-1 ps-5 leading-8 text-slate-800">
          {example.steps.map((s, i) => (
            <li key={i}>
              <RichText text={s} />
            </li>
          ))}
        </ol>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white p-3 ring-1 ring-amber-200">
          {example.answerGlyph && (
            <div className="h-16 w-16 shrink-0">
              <GlyphSvg glyph={example.answerGlyph} label="الإجابة" />
            </div>
          )}
          <p className="font-extrabold text-emerald-700">
            الإجابة: <RichText text={example.answer} />
          </p>
        </div>
      </Card>

      <div className="flex flex-wrap gap-3">
        <LinkButton href={practiceHref}>🎯 تدرّب على هذا النوع</LinkButton>
        <LinkButton href="/guide/" variant="secondary">
          كل الشروحات
        </LinkButton>
      </div>

      <nav aria-label="شروحات أخرى" className="grid gap-3 border-t border-slate-200 pt-4 sm:grid-cols-2">
        {prev ? (
          <Link href={`/guide/${prev.slug}/`} className="rounded-xl bg-white p-3 text-sm ring-1 ring-slate-200 hover:shadow">
            <span className="block text-slate-500">→ السابق</span>
            <span className="font-bold text-slate-800">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/guide/${next.slug}/`} className="rounded-xl bg-white p-3 text-end text-sm ring-1 ring-slate-200 hover:shadow">
            <span className="block text-slate-500">التالي ←</span>
            <span className="font-bold text-slate-800">{next.title}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
