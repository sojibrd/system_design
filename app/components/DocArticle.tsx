import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
      {/* Header plate */}
      <header className="mb-8 seam-b pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="chip">
            {isWorkbook ? "Workbook · ল্যাব ও প্র্যাকটিস" : "Roadmap · কোর আর্কিটেকচার"}
          </span>
          {doc.group && <span className="t-label truncate">{doc.group}</span>}
        </div>

        <h1 className="t-title text-2xl sm:text-3xl">{displayTitle}</h1>

        {source && (
          <div className="mt-3 flex items-center gap-1.5">
            <span className="chip chip--accent">উৎস</span>
            <span className="t-caption">{source}</span>
          </div>
        )}
      </header>

      {/* Main Markdown body */}
      <Markdown content={body} dir={doc.dir} />

      {/* Study tracker */}
      {!doc.isIndex && <DocTracker route={doc.route} title={displayTitle} />}

      {/* Prev / next */}
      {(prev || next) && (
        <nav className="mt-12 flex flex-col gap-3 seam-t pt-8 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              href={prev.route}
              className="surface-raised flex flex-1 flex-col gap-1 p-4 min-w-0"
            >
              <span className="t-label flex items-center gap-1.5">
                <ArrowLeft size={11} /> পূর্ববর্তী অধ্যায়
              </span>
              <span className="t-strong text-sm truncate">{prev.title}</span>
            </Link>
          ) : (
            <div className="flex-1" />
          )}

          {next && (
            <Link
              href={next.route}
              className="surface-raised flex flex-1 flex-col gap-1 p-4 text-right min-w-0"
            >
              <span className="t-label flex items-center justify-end gap-1.5">
                পরবর্তী অধ্যায় <ArrowRight size={11} />
              </span>
              <span className="t-strong text-sm truncate">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
