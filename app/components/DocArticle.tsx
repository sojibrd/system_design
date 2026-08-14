import Link from "next/link";
import type { Doc } from "@/app/lib/content";
import { parseDocContent } from "@/app/lib/content";
import Markdown from "./Markdown";
import DocTracker from "./DocTracker";

export default function DocArticle({
  doc,
  content,
  prev,
  next,
}: {
  doc: Doc;
  content: string;
  prev?: Doc;
  next?: Doc;
}) {
  const { title, source, body } = parseDocContent(content);
  const displayTitle = doc.isIndex ? doc.title : title || doc.title;
  const isWorkbook = doc.section === "workbook";

  return (
    <article className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-8 sm:py-12">
      {/* Header section */}
      <header className="mb-8 border-b border-[var(--border)] pb-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)] mb-3">
          <span className="inline-flex items-center rounded-md bg-[var(--surface-hover)] border border-[var(--border)] px-2.5 py-0.5 font-medium text-[var(--foreground)]">
            {isWorkbook ? "Workbook • ল্যাব ও প্র্যাকটিস" : "Roadmap • কোর আর্কিটেকচার"}
          </span>
          {doc.group && (
            <>
              <span>/</span>
              <span className="font-medium text-[var(--muted)]">{doc.group}</span>
            </>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          {displayTitle}
        </h1>

        {source && (
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent-soft)] px-3 py-1 text-xs text-[var(--accent)]">
            <span className="font-semibold">উৎস:</span>
            <span>{source}</span>
          </div>
        )}
      </header>

      {/* Main Markdown Body */}
      <Markdown content={body} dir={doc.dir} />

      {/* Study Tracker */}
      {!doc.isIndex && <DocTracker route={doc.route} title={displayTitle} />}

      {/* Prev / Next Navigation */}
      {(prev || next) && (
        <nav className="mt-12 flex flex-col gap-4 border-t border-[var(--border)] pt-8 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={prev.route}
              className="group flex flex-1 flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-sm"
            >
              <span className="text-xs text-[var(--muted)]">← পূর্ববর্তী অধ্যায়</span>
              <span className="mt-1 text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {prev.title}
              </span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next && (
            <Link
              href={next.route}
              className="group flex flex-1 flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 text-right transition-all hover:border-[var(--accent)] hover:shadow-sm"
            >
              <span className="text-xs text-[var(--muted)]">পরবর্তী অধ্যায় →</span>
              <span className="mt-1 text-sm font-semibold text-[var(--foreground)] group-hover:text-[var(--accent)]">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
