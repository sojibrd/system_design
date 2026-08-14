"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import type { NavTree } from "@/app/lib/content";

function normalize(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

export default function Sidebar({ nav }: { nav: NavTree }) {
  const pathname = normalize(usePathname());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Determine which sections/parts should be open initially
  const initialOpenParts = useMemo(() => {
    const set = new Set<string>();
    for (const part of nav.workbook.parts) {
      for (const ch of part.chapters) {
        if (ch.items.some((it) => normalize(it.route) === pathname)) {
          set.add(part.key);
          set.add(`${part.key}:${ch.key}`);
        }
      }
    }
    // Default open first part if nothing matched
    if (set.size === 0 && nav.workbook.parts.length > 0) {
      set.add(nav.workbook.parts[0].key);
    }
    return set;
  }, [nav, pathname]);

  const [openMap, setOpenMap] = useState<Set<string>>(initialOpenParts);
  const [roadmapOpen, setRoadmapOpen] = useState(true);
  const [workbookOpen, setWorkbookOpen] = useState(true);

  function toggleOpen(key: string) {
    setOpenMap((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  // Filter items if search is active
  const isSearching = search.trim().length > 0;
  const query = search.toLowerCase().trim();

  const filteredRoadmap = useMemo(() => {
    if (!isSearching) return nav.roadmap.items;
    return nav.roadmap.items.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [nav.roadmap.items, query, isSearching]);

  const filteredWorkbookParts = useMemo(() => {
    if (!isSearching) return nav.workbook.parts;
    return nav.workbook.parts
      .map((part) => {
        const filteredChapters = part.chapters
          .map((ch) => ({
            ...ch,
            items: ch.items.filter((it) => it.title.toLowerCase().includes(query)),
          }))
          .filter((ch) => ch.items.length > 0);

        return {
          ...part,
          chapters: filteredChapters,
        };
      })
      .filter((part) => part.chapters.length > 0);
  }, [nav.workbook.parts, query, isSearching]);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden sticky top-0 z-30 flex items-center justify-between border-b border-[var(--border)] bg-[var(--surface)] px-4 py-3">
        <Link href="/" className="text-sm font-bold tracking-tight text-[var(--foreground)]">
          System Design
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="rounded-lg border border-[var(--border)] bg-[var(--surface-hover)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)]"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? "✕ মেনু বন্ধ" : "☰ সূচিপত্র"}
        </button>
      </div>

      {/* Sidebar Container */}
      <nav
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:block shrink-0 border-b md:border-b-0 md:border-r border-[var(--border)] bg-[var(--surface)] md:w-80 md:sticky md:top-0 md:h-screen md:overflow-y-auto z-20`}
      >
        <div className="p-5 flex flex-col gap-5">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="group block"
            >
              <div className="text-base font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                System Design
              </div>
              <p className="text-xs text-[var(--muted)]">রোডম্যাপ ও ল্যাবস গাইড</p>
            </Link>

            <Link
              href="/progress/"
              onClick={() => setMobileOpen(false)}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                pathname === "/progress"
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              📊 প্রোগ্রেস
            </Link>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="টপিক বা অধ্যায় খুঁজুন..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-xs text-[var(--foreground)] placeholder-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Section 1: System Design Roadmap */}
          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setRoadmapOpen((v) => !v)}
              className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <span>{nav.roadmap.title} ({filteredRoadmap.length})</span>
              <span>{roadmapOpen ? "−" : "+"}</span>
            </button>

            {roadmapOpen && (
              <ul className="mt-1.5 space-y-0.5 border-l border-[var(--border)] pl-2">
                {filteredRoadmap.map((item) => {
                  const active = normalize(item.route) === pathname;
                  return (
                    <li key={item.route}>
                      <Link
                        href={item.route}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-lg px-2.5 py-1.5 text-xs leading-snug transition-colors ${
                          active
                            ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)]"
                            : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                        }`}
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Section 2: System Design Workbook */}
          <div className="space-y-2 pt-2 border-t border-[var(--border)]">
            <button
              type="button"
              onClick={() => setWorkbookOpen((v) => !v)}
              className="flex w-full items-center justify-between py-1 text-xs font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--foreground)]"
            >
              <span>{nav.workbook.title}</span>
              <span>{workbookOpen ? "−" : "+"}</span>
            </button>

            {workbookOpen && (
              <div className="space-y-3">
                {filteredWorkbookParts.map((part) => {
                  const partOpen = isSearching || openMap.has(part.key);
                  return (
                    <div key={part.key} className="space-y-1">
                      <button
                        type="button"
                        onClick={() => toggleOpen(part.key)}
                        className="flex w-full items-center justify-between rounded-lg px-2 py-1 text-left text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                      >
                        <span className="truncate">{part.title}</span>
                        <span className="text-[10px] text-[var(--muted)] ml-1">
                          {partOpen ? "▼" : "▶"}
                        </span>
                      </button>

                      {partOpen && (
                        <div className="ml-2 space-y-2 border-l border-[var(--border)] pl-2">
                          {part.chapters.map((ch) => {
                            const chKey = `${part.key}:${ch.key}`;
                            const chOpen = isSearching || openMap.has(chKey);

                            return (
                              <div key={ch.key} className="space-y-1">
                                <button
                                  type="button"
                                  onClick={() => toggleOpen(chKey)}
                                  className="flex w-full items-center justify-between rounded-md px-2 py-1 text-left text-[11px] font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-colors"
                                >
                                  <span className="truncate">{ch.title}</span>
                                  <span className="text-[9px] ml-1">{chOpen ? "▾" : "▸"}</span>
                                </button>

                                {chOpen && (
                                  <ul className="ml-1 space-y-0.5 border-l border-[var(--border)]/70 pl-2">
                                    {ch.items.map((item) => {
                                      const active = normalize(item.route) === pathname;
                                      return (
                                        <li key={item.route}>
                                          <Link
                                            href={item.route}
                                            onClick={() => setMobileOpen(false)}
                                            aria-current={active ? "page" : undefined}
                                            className={`block rounded-md px-2 py-1 text-[11px] leading-snug transition-colors ${
                                              active
                                                ? "bg-[var(--accent-soft)] font-semibold text-[var(--accent)]"
                                                : "text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
                                            }`}
                                          >
                                            {item.title}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
