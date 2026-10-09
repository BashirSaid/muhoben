import { Fragment } from "react";

/**
 * يعرض نصًا عربيًا، والمقاطع المحصورة بين $...$ تُعرض كتعابير رياضية
 * من اليسار إلى اليمين ومعزولة عن اتجاه النص العربي.
 */
export function RichText({ text, className }: { text: string; className?: string }) {
  const parts = text.split("$");
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <bdi key={i} dir="ltr" className="math">
            {part}
          </bdi>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </span>
  );
}
