"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Check, Circle, RotateCcw } from "lucide-react";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import type { DocNote } from "@/app/components/DocTracker";

export interface ProgressDocItem {
  title: string;
  route: string;
  section: string;
  group: string;
}

export interface ProgressSectionData {
  title: string;
  docs: ProgressDocItem[];
}

type Filter = "all" | "revise" | "unread" | "notes";

export default function ProgressClient({
  sections,
  allDocs,
}: {
  sections: ProgressSectionData[];
  allDocs: ProgressDocItem[];
}) {
  const [readRoutes, setReadRoutes] = useLocalStorage<string[]>("sd_read_routes", []);
  const [reviseRoutes, setReviseRoutes] = useLocalStorage<string[]>("sd_revise_routes", []);
  const [notesMap] = useLocalStorage<Record<string, DocNote>>("sd_doc_notes", {});

  const [activeFilter, setActiveFilter] = useState<Filter>("all");
  const [activeSection, setActiveSection] = useState<string>("all");

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
      // Section filter
      if (activeSection !== "all" && doc.section !== activeSection) {
        return false;
      }
      // Status filter
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
  }, [allDocs, activeSection, activeFilter, readRoutes, reviseRoutes, notesMap]);

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

        {/* Per-section breakdown */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 seam-t">
          {sections.map((sec) => {
            const secRead = sec.docs.filter((d) => readRoutes.includes(d.route)).length;
            const secTotal = sec.docs.length;
            const secPct = secTotal > 0 ? Math.round((secRead / secTotal) * 100) : 0;

            return (
              <div key={sec.title} className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="t-body text-xs truncate">{sec.title}</span>
                  <span className="t-mono t-muted text-xs shrink-0">
                    {secRead}/{secTotal} ({secPct}%)
                  </span>
                </div>
                <div
                  role="progressbar"
                  aria-valuenow={secPct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${sec.title} সম্পূর্ণতা`}
                  className="gauge h-2 w-full"
                >
                  <div className="gauge-fill" data-tone="ok" style={{ width: `${secPct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="segment-group max-w-full overflow-x-auto flex-nowrap shrink-0">
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

        <div className="flex items-center gap-2">
          <label htmlFor="progress-section-filter" className="t-label shrink-0">
            সেকশন
          </label>
          <select
            id="progress-section-filter"
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="control px-3 py-1.5 text-xs min-h-10 sm:min-h-0"
          >
            <option value="all">সব সেকশন</option>
            <option value="docs">Roadmap</option>
            <option value="workbook">Workbook</option>
          </select>
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="chip">
                      {doc.section === "docs" ? "Roadmap" : "Workbook"}
                    </span>
                    {doc.group && <span className="t-label truncate">{doc.group}</span>}
                  </div>
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
