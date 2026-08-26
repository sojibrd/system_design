"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Doc, HeadingItem } from "@/app/lib/content";
import Markdown from "./Markdown";
import DocTracker from "./DocTracker";
import TableOfContents from "./TableOfContents";

export default function DocArticle({
  doc,
  displayTitle,
  source,
  body,
  headings,
  prev,
  next,
}: {
  doc: Doc;
  displayTitle: string;
  source?: string;
  body: string;
  headings: HeadingItem[];
  prev?: Doc;
  next?: Doc;
}) {
  const router = useRouter();

  // Keyboard navigation shortcuts: `[` for prev, `]` for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (isInput) return;

      if (e.key === "[" && prev) {
        e.preventDefault();
        router.push(prev.route);
      } else if (e.key === "]" && next) {
        e.preventDefault();
        router.push(next.route);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [prev, next, router]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-12 flex justify-center gap-8 xl:gap-12">
      <article className="w-full max-w-3xl min-w-0">
        {/* Header plate */}
        <header className="mb-8 seam-b pb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="chip">
              Roadmap · কোর আর্কিটেকচার
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
                  <kbd className="hidden sm:inline t-mono text-[10px] opacity-60 ml-1">[</kbd>
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
                  পরবর্তী অধ্যায়
                  <kbd className="hidden sm:inline t-mono text-[10px] opacity-60 mr-1">]</kbd>
                  <ArrowRight size={11} />
                </span>
                <span className="t-strong text-sm truncate">{next.title}</span>
              </Link>
            )}
          </nav>
        )}
      </article>

      {/* On this page TOC for widescreen */}
      {!doc.isIndex && <TableOfContents headings={headings} />}
    </div>
  );
}
