"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Circle, RotateCcw } from "lucide-react";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import type { DocNote } from "@/app/components/DocTracker";

export interface ProgressDocItem {
  title: string;
  route: string;
  group: string;
}

type Filter = "all" | "revise" | "unread" | "notes";

export default function ProgressClient({ allDocs }: { allDocs: ProgressDocItem[] }) {
  const [readRoutes, setReadRoutes] = useLocalStorage<string[]>("sd_read_routes", []);
  const [reviseRoutes, setReviseRoutes] = useLocalStorage<string[]>("sd_revise_routes", []);
  const [notesMap] = useLocalStorage<Record<string, DocNote>>("sd_doc_notes", {});

  const [activeFilter, setActiveFilter] = useState<Filter>("all");

  /* Workbook চলে যাওয়ায় ব্যবহারকারীর localStorage-এ মুছে যাওয়া রুটের এন্ট্রি
     রয়ে যেতে পারে। গণনা `allDocs` থেকে হয় বলে সংখ্যা ভুল হয় না, কিন্তু ডেটা
     অনির্দিষ্টকাল জমে থাকার কারণ নেই — একবার ছেঁটে দেওয়া হয়। ছাঁটার মতো কিছু
     না থাকলে কোনো লেখা হয় না, তাই এটি প্রতি মাউন্টে storage স্পর্শ করে না। */
  useEffect(() => {
    const live = new Set(allDocs.map((d) => d.route));
    const hasOrphan = (routes: string[]) => routes.some((r) => !live.has(r));
    if (hasOrphan(readRoutes)) {
      setReadRoutes((prev) => prev.filter((r) => live.has(r)));
    }
    if (hasOrphan(reviseRoutes)) {
      setReviseRoutes((prev) => prev.filter((r) => live.has(r)));
    }
  }, [allDocs, readRoutes, reviseRoutes, setReadRoutes, setReviseRoutes]);

  const total = allDocs.length;
  const readCount = allDocs.filter((d) => readRoutes.includes(d.route)).length;
  const reviseCount = allDocs.filter((d) => reviseRoutes.includes(d.route)).length;
  const notesCount = allDocs.filter((d) => {
    const n = notesMap[d.route];
    return Boolean(n?.summary?.trim() || n?.unclear?.trim());
  }).length;

  const percentage = total > 0 ? Math.round((readCount / total) * 100) : 0;

  function toggleRead(route: string) {
    setReadRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route]
    );
  }

  function toggleRevise(route: string) {
    setReviseRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route]
    );
  }

  const filteredDocs = useMemo(() => {
    return allDocs.filter((doc) => {
      const isRead = readRoutes.includes(doc.route);
      const isRevise = reviseRoutes.includes(doc.route);
      const hasNote = Boolean(
        notesMap[doc.route]?.summary?.trim() || notesMap[doc.route]?.unclear?.trim()
      );

      if (activeFilter === "revise") return isRevise;
      if (activeFilter === "unread") return !isRead;
      if (activeFilter === "notes") return hasNote;
      return true;
    });
  }, [allDocs, activeFilter, readRoutes, reviseRoutes, notesMap]);

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "সব অধ্যায়", count: total },
    { id: "revise", label: "রিভাইজ দরকার", count: reviseCount },
    { id: "unread", label: "অপঠিত", count: total - readCount },
    { id: "notes", label: "নোটযুক্ত", count: notesCount },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="t-title text-2xl sm:text-3xl">স্টাডি প্রোগ্রেস ও রিভিশন ড্যাশবোর্ড</h1>
        <p className="t-body mt-2 text-sm">
          আপনার পড়ার অগ্রগতি ট্র্যাক করুন, রিভিশন তালিকা তৈরি করুন এবং ইন্টারভিউয়ের আগে দ্রুত
          প্রস্তুতি নিন।
        </p>
      </div>

      {/* Readouts */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-8">
        <div className="surface-panel p-4">
          <span className="t-label">মোট অধ্যায়</span>
          <div className="t-mono t-strong mt-2 text-2xl">{total}</div>
          <span className="t-caption">বিস্তারিত টপিক</span>
        </div>

        <div className="surface-panel p-4">
          <span className="t-label">পঠিত সম্পন্ন</span>
          <div className="t-mono mt-2 text-2xl t-ok">
            {readCount} <span className="t-muted text-sm">({percentage}%)</span>
          </div>
          <span className="t-caption">{total - readCount} টি বাকি</span>
        </div>

        <div className="surface-panel p-4">
          <span className="t-label">রিভাইজ প্রয়োজন</span>
          <div className="t-mono t-accent mt-2 text-2xl">{reviseCount}</div>
          <span className="t-caption">পুনরালোচনার জন্য চিহ্নিত</span>
        </div>

        <div className="surface-panel p-4">
          <span className="t-label">সংরক্ষিত নোট</span>
          <div className="t-mono t-strong mt-2 text-2xl">{notesCount}</div>
          <span className="t-caption">ব্যক্তিগত নোট যুক্ত</span>
        </div>
      </div>

      {/* Overall gauge */}
      <div className="surface-panel mb-10 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="t-label">সার্বিক সম্পূর্ণতা</span>
          <span className="t-mono t-accent text-sm">{percentage}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="সার্বিক সম্পূর্ণতা"
          className="gauge h-3 w-full"
        >
          <div className="gauge-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="segment-group max-w-full overflow-x-auto flex-nowrap">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActiveFilter(f.id)}
              aria-pressed={activeFilter === f.id}
              className="segment text-xs shrink-0 whitespace-nowrap min-h-10 sm:min-h-0"
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
      </div>

      {/* Doc list */}
      <div className="flex flex-col gap-3">
        {filteredDocs.length === 0 ? (
          <div className="surface-panel t-caption p-12 text-center">
            কোনো অধ্যায় এই ফিল্টারে পাওয়া যায়নি।
          </div>
        ) : (
          filteredDocs.map((doc) => {
            const isRead = readRoutes.includes(doc.route);
            const isRevise = reviseRoutes.includes(doc.route);
            const note = notesMap[doc.route];
            const hasNote = Boolean(note?.summary?.trim() || note?.unclear?.trim());

            return (
              <div
                key={doc.route}
                className="surface-panel flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 min-w-0">
                  {doc.group && <span className="t-label mb-1 block truncate">{doc.group}</span>}
                  <Link href={doc.route} className="t-strong block text-sm truncate">
                    {doc.title}
                  </Link>

                  {hasNote && (
                    <div className="surface-well t-caption mt-2 p-2 line-clamp-2">
                      <span className="t-label">নোট </span>
                      {note?.summary || note?.unclear}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleRead(doc.route)}
                    aria-pressed={isRead}
                    className={`control px-2.5 py-1.5 sm:py-1 text-xs min-h-9 sm:min-h-0 ${
                      isRead ? "control--primary" : ""
                    }`}
                  >
                    {isRead ? <Check size={12} /> : <Circle size={12} />}
                    {isRead ? "পঠিত" : "অপঠিত"}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleRevise(doc.route)}
                    aria-pressed={isRevise}
                    className={`control px-2.5 py-1.5 sm:py-1 text-xs min-h-9 sm:min-h-0 ${
                      isRevise ? "control--alert" : ""
                    }`}
                  >
                    <RotateCcw size={12} />
                    {isRevise ? "রিভাইজ" : "রিভাইজ?"}
                  </button>

                  <Link
                    href={doc.route}
                    className="control px-3 py-1.5 sm:py-1 text-xs min-h-9 sm:min-h-0"
                  >
                    পড়ুন <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
