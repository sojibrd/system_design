"use client";

import { useState } from "react";
import useLocalStorage from "@/app/hooks/useLocalStorage";

export interface DocNote {
  summary?: string;
  unclear?: string;
}

export default function DocTracker({ route }: { route: string; title?: string }) {
  const [readRoutes, setReadRoutes] = useLocalStorage<string[]>("sd_read_routes", []);
  const [reviseRoutes, setReviseRoutes] = useLocalStorage<string[]>("sd_revise_routes", []);
  const [notesMap, setNotesMap] = useLocalStorage<Record<string, DocNote>>("sd_doc_notes", {});

  const [notesOpen, setNotesOpen] = useState(false);

  const isRead = readRoutes.includes(route);
  const isRevise = reviseRoutes.includes(route);
  const currentNote = notesMap[route] || {};
  const hasNote = Boolean(currentNote.summary?.trim() || currentNote.unclear?.trim());

  function toggleRead() {
    setReadRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route]
    );
  }

  function toggleRevise() {
    setReviseRoutes((prev) =>
      prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route]
    );
  }

  function updateNoteField(field: "summary" | "unclear", val: string) {
    setNotesMap((prev) => ({
      ...prev,
      [route]: {
        ...prev[route],
        [field]: val,
      },
    }));
  }

  return (
    <div className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--foreground)]">
            অগ্রগতি ও ব্যক্তিগত স্টাডি ট্র্যাকার
          </h3>
          <p className="mt-0.5 text-xs text-[var(--muted)]">
            এই অধ্যায়ের অবস্থা পরিবর্তন ও নোট সংরক্ষণ করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={toggleRead}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isRead
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>{isRead ? "✓" : "○"}</span>
            <span>{isRead ? "পঠিত" : "পড়া হয়নি"}</span>
          </button>

          <button
            type="button"
            onClick={toggleRevise}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              isRevise
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
                : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>🔄</span>
            <span>{isRevise ? "রিভাইজ তালিকাভুক্ত" : "রিভাইজ দরকার"}</span>
          </button>

          <button
            type="button"
            onClick={() => setNotesOpen((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
              hasNote
                ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30"
                : "border border-[var(--border)] bg-[var(--surface-hover)] text-[var(--muted)] hover:text-[var(--foreground)]"
            }`}
          >
            <span>📝</span>
            <span>{hasNote ? "নোট সংরক্ষিত" : "নোট যুক্ত করুন"}</span>
            <span className="text-[10px] opacity-70">{notesOpen ? "▲" : "▼"}</span>
          </button>
        </div>
      </div>

      {notesOpen && (
        <div className="mt-5 space-y-4 border-t border-[var(--border)] pt-5 animate-in fade-in duration-200">
          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">
              📌 মূল শিক্ষণীয় বিষয় (Key Takeaways):
            </label>
            <textarea
              rows={3}
              value={currentNote.summary || ""}
              onChange={(e) => updateNoteField("summary", e.target.value)}
              placeholder="এই ডক থেকে শেখা প্রধান ৩-৪টি পয়েন্ট সংক্ষেপে লিখুন..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--foreground)] mb-1.5">
              ❓ অস্পষ্ট বিষয় বা ইন্টারভিউ পয়েন্ট (Doubts / Follow-ups):
            </label>
            <textarea
              rows={2}
              value={currentNote.unclear || ""}
              onChange={(e) => updateNoteField("unclear", e.target.value)}
              placeholder="যে বিষয়গুলো পরবর্তীতে আরো গবেষণা করা দরকার..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-xs text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
