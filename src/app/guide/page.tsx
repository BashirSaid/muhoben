import type { Metadata } from "next";
import Link from "next/link";
import { Card, PageTitle } from "@/components/ui";
import { TOPIC_STYLES } from "@/components/topicStyles";
import { GUIDES, guidesForTopic, type Guide } from "@/data/guides";
import { TOPICS } from "@/data/topics";

export const metadata: Metadata = { title: "الشروحات: دليل أنواع الأسئلة" };

function GuideLink({ guide, tone }: { guide: Guide; tone: string }) {
  return (
    <li>
      <Link
        href={`/guide/${guide.slug}/`}
        className={`flex h-full items-start gap-3 rounded-xl bg-white p-4 ring-1 transition hover:shadow-md ${tone}`}
      >
        <span className="text-2xl" aria-hidden="true">
          {guide.icon}
        </span>
        <span>
          <span className="block font-extrabold text-slate-900">{guide.title}</span>
          <span className="mt-1 block text-sm leading-6 text-slate-600">{guide.summary}</span>
        </span>
      </Link>
    </li>
  );
}

export default function GuideIndexPage() {
  const general = GUIDES.filter((g) => g.topic === null);
  return (
    <>
      <PageTitle
        title="الشروحات"
        subtitle="دليل لكل نوع من أنواع الأسئلة: كيف تتعرّف عليه، وخطوات حلّه، وطرق سريعة وذكية، والفخاخ التي يجب أن تنتبه لها."
      />

      <ul className="mb-8 grid gap-3">
        {general.map((g) => (
          <GuideLink key={g.slug} guide={g} tone="ring-blue-200" />
        ))}
      </ul>

      <nav aria-label="المجالات" className="mb-6 flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <a
            key={t.id}
            href={`#${t.id}`}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${TOPIC_STYLES[t.color].badge}`}
          >
            {t.icon} {t.shortName}
          </a>
        ))}
      </nav>

      <div className="space-y-8">
        {TOPICS.map((t) => {
          const style = TOPIC_STYLES[t.color];
          return (
            <Card key={t.id} className={style.soft}>
              <h2 id={t.id} className={`mb-4 text-xl font-extrabold ${style.text}`}>
                {t.icon} {t.name}
              </h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {guidesForTopic(t.id).map((g) => (
                  <GuideLink key={g.slug} guide={g} tone={style.ring} />
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </>
  );
}
