"use client";

import { useState } from "react";
import { Check, ChevronDown, ChevronUp, Circle, NotebookPen, RotateCcw } from "lucide-react";
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
    <div className="surface-panel mt-12 p-5 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="t-title text-sm">অগ্রগতি ও ব্যক্তিগত স্টাডি ট্র্যাকার</h3>
          <p className="t-caption mt-1">
            এই অধ্যায়ের অবস্থা পরিবর্তন ও নোট সংরক্ষণ করুন
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* The state a button reports is carried by `aria-pressed`; what
              "on" looks like stays with the theme. */}
          <button
            type="button"
            onClick={toggleRead}
            aria-pressed={isRead}
            className={`control px-3.5 py-2.5 sm:py-2 text-xs min-h-10 sm:min-h-0 ${
              isRead ? "control--primary" : ""
            }`}
          >
            {isRead ? <Check size={13} /> : <Circle size={13} />}
            {isRead ? "পঠিত" : "পড়া হয়নি"}
          </button>

          <button
            type="button"
            onClick={toggleRevise}
            aria-pressed={isRevise}
            className={`control px-3.5 py-2.5 sm:py-2 text-xs min-h-10 sm:min-h-0 ${
              isRevise ? "control--alert" : ""
            }`}
          >
            <RotateCcw size={13} />
            {isRevise ? "রিভাইজ তালিকাভুক্ত" : "রিভাইজ দরকার"}
          </button>

          <button
            type="button"
            onClick={() => setNotesOpen((prev) => !prev)}
            aria-expanded={notesOpen}
            className="control px-3.5 py-2.5 sm:py-2 text-xs min-h-10 sm:min-h-0"
          >
            <NotebookPen size={13} />
            {hasNote ? "নোট সংরক্ষিত" : "নোট যুক্ত করুন"}
            {notesOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>
      </div>

      {notesOpen && (
        <div className="mt-5 flex flex-col gap-4 seam-t pt-5">
          <div>
            <label htmlFor="doc-summary-input" className="t-label mb-1.5 block">
              মূল শিক্ষণীয় বিষয় (Key Takeaways)
            </label>
            <textarea
              id="doc-summary-input"
              rows={3}
              value={currentNote.summary || ""}
              onChange={(e) => updateNoteField("summary", e.target.value)}
              placeholder="এই ডক থেকে শেখা প্রধান ৩-৪টি পয়েন্ট সংক্ষেপে লিখুন..."
              className="surface-well t-body w-full px-3.5 py-2.5 text-sm sm:text-xs"
            />
          </div>

          <div>
            <label htmlFor="doc-unclear-input" className="t-label mb-1.5 block">
              অস্পষ্ট বিষয় বা ইন্টারভিউ পয়েন্ট (Doubts / Follow-ups)
            </label>
            <textarea
              id="doc-unclear-input"
              rows={2}
              value={currentNote.unclear || ""}
              onChange={(e) => updateNoteField("unclear", e.target.value)}
              placeholder="যে বিষয়গুলো পরবর্তীতে আরো গবেষণা করা দরকার..."
              className="surface-well t-body w-full px-3.5 py-2.5 text-sm sm:text-xs"
            />
          </div>
        </div>
      )}
    </div>
  );
}
