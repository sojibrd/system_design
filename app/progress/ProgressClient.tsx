"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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

  const [activeFilter, setActiveFilter] = useState<"all" | "revise" | "unread" | "notes">("all");
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

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          📊 স্টাডি প্রোগ্রেস ও রিভিশন ড্যাশবোর্ড
        </h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          আপনার পড়ার অগ্রগতি ট্র্যাক করুন, রিভিশন তালিকা তৈরি করুন এবং ইন্টারভিউয়ের আগে দ্রুত প্রস্তুতি নিন।
        </p>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <span className="text-xs font-semibold text-[var(--muted)]">মোট অধ্যায়</span>
          <div className="mt-2 text-2xl font-bold text-[var(--foreground)]">{total}</div>
          <span className="text-[11px] text-[var(--muted)]">৬০টি বিস্তারিত টপিক</span>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 shadow-sm">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">পঠিত সম্পন্ন</span>
          <div className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {readCount} <span className="text-sm font-normal text-[var(--muted)]">({percentage}%)</span>
          </div>
          <span className="text-[11px] text-[var(--muted)]">{total - readCount} টি বাকি</span>
        </div>

        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 shadow-sm">
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">রিভাইজ প্রয়োজন</span>
          <div className="mt-2 text-2xl font-bold text-amber-600 dark:text-amber-400">{reviseCount}</div>
          <span className="text-[11px] text-[var(--muted)]">পুনরালোচনার জন্য চিহ্নিত</span>
        </div>

        <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/5 p-5 shadow-sm">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">সংরক্ষিত নোট</span>
          <div className="mt-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">{notesCount}</div>
          <span className="text-[11px] text-[var(--muted)]">ব্যক্তিগত নোট যুক্ত</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-[var(--foreground)]">সার্বিক সম্পূর্ণতা</span>
          <span className="text-[var(--accent)] font-bold">{percentage}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-hover)] border border-[var(--border)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Section breakdown bars */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[var(--border)]">
          {sections.map((sec) => {
            const secRead = sec.docs.filter((d) => readRoutes.includes(d.route)).length;
            const secTotal = sec.docs.length;
            const secPct = secTotal > 0 ? Math.round((secRead / secTotal) * 100) : 0;

            return (
              <div key={sec.title} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[var(--foreground)]">{sec.title}</span>
                  <span className="text-[var(--muted)]">{secRead}/{secTotal} ({secPct}%)</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--surface-hover)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)] transition-all duration-300"
                    style={{ width: `${secPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            সব অধ্যায় ({allDocs.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("revise")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === "revise"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            🔄 রিভাইজ দরকার ({reviseCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("unread")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === "unread"
                ? "bg-slate-600 text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            ⏳ অপঠিত ({total - readCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("notes")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeFilter === "notes"
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            📝 নোটযুক্ত ({notesCount})
          </button>
        </div>

        {/* Section selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--muted)]">সেকশন:</span>
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          >
            <option value="all">সব সেকশন</option>
            <option value="docs">Roadmap (২৫)</option>
            <option value="workbook">Workbook (৩৫)</option>
          </select>
        </div>
      </div>

      {/* Doc List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-12 text-center text-sm text-[var(--muted)]">
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
                className="group flex flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 transition-all hover:border-[var(--accent)]/50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex rounded-md bg-[var(--surface-hover)] border border-[var(--border)] px-2 py-0.5 text-[10px] font-medium text-[var(--muted)]">
                      {doc.section === "docs" ? "Roadmap" : "Workbook"}
                    </span>
                    {doc.group && (
                      <span className="text-[11px] text-[var(--muted)] truncate">
                        {doc.group}
                      </span>
                    )}
                  </div>
                  <Link
                    href={doc.route}
                    className="block text-sm font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors truncate"
                  >
                    {doc.title}
                  </Link>

                  {hasNote && (
                    <div className="mt-2 text-xs text-[var(--muted)] bg-[var(--surface-hover)] p-2 rounded-lg border border-[var(--border)] line-clamp-2">
                      <span className="font-semibold text-[var(--foreground)]">নোট: </span>
                      {note?.summary || note?.unclear}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleRead(doc.route)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      isRead
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                        : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)]"
                    }`}
                  >
                    {isRead ? "✓ পঠিত" : "○ অপঠিত"}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleRevise(doc.route)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                      isRevise
                        ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                        : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)]"
                    }`}
                  >
                    🔄 {isRevise ? "রিভাইজ" : "রিভাইজ?"}
                  </button>

                  <Link
                    href={doc.route}
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1 text-xs font-medium text-[var(--foreground)] hover:bg-[var(--accent)] hover:text-white transition-colors"
                  >
                    পড়ুন →
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
