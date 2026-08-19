"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import type { NavTree } from "@/app/lib/content";

function normalize(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

export default function Sidebar({ nav }: { nav: NavTree }) {
  const pathname = normalize(usePathname());
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  /* Collapsing is a desktop-only affordance — on a phone the rack is already
     behind the top bar. It persists because the reason to collapse it (the
     simulator wants the width) outlives a single navigation. */
  const [collapsed, setCollapsed] = useLocalStorage<boolean>("sd_nav_collapsed", false);

  const [userToggles, setUserToggles] = useState<Record<string, boolean>>({});
  const [roadmapOpen, setRoadmapOpen] = useState(true);
  const [workbookOpen, setWorkbookOpen] = useState(true);

  // Active part and chapter keys for the current pathname
  const activeKeys = useMemo(() => {
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

  function isSectionOpen(key: string): boolean {
    if (isSearching) return true;
    if (userToggles[key] !== undefined) {
      return userToggles[key];
    }
    return activeKeys.has(key);
  }

  function toggleOpen(key: string) {
    const current = isSectionOpen(key);
    setUserToggles((prev) => ({
      ...prev,
      [key]: !current,
    }));
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

  const simulationActive = pathname === "/simulation" || pathname.startsWith("/simulation/");

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden shrink-0 surface-panel seam-b-heavy flex items-center justify-between px-4 py-2.5">
        <Link href="/" className="t-title text-sm">
          System Design
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="control px-3 py-1.5 text-xs"
          aria-expanded={mobileOpen}
          aria-controls="site-sidebar"
        >
          {mobileOpen ? <X size={14} /> : <Menu size={14} />}
          {mobileOpen ? "বন্ধ" : "সূচিপত্র"}
        </button>
      </div>

      {/* Collapsed rail — the only way back to the rack on a wide screen */}
      {collapsed && (
        <div className="hidden md:flex shrink-0 flex-col items-center gap-2 surface-panel px-2 py-3">
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="control control--quiet p-1.5"
            aria-label="সূচিপত্র খুলুন"
            aria-expanded={false}
          >
            <PanelLeftOpen size={16} />
          </button>
        </div>
      )}

      {/* The index rack */}
      <nav
        id="site-sidebar"
        className={`${mobileOpen ? "flex" : "hidden"} ${
          collapsed ? "md:hidden" : "md:flex"
        } shrink-0 min-h-0 flex-1 md:flex-none flex-col md:w-80 surface-panel overflow-y-auto`}
      >
        <div className="p-4 flex flex-col gap-4">
          {/* Brand */}
          <div className="flex items-start justify-between gap-2">
            <Link href="/" onClick={() => setMobileOpen(false)} className="block min-w-0">
              <div className="t-title text-base">System Design</div>
            </Link>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href="/progress/"
                onClick={() => setMobileOpen(false)}
                className={`control px-2.5 py-1 text-[11px] ${
                  pathname === "/progress" ? "control--primary" : ""
                }`}
              >
                Progress
              </Link>

              <button
                type="button"
                onClick={() => setCollapsed(true)}
                className="control control--quiet hidden md:inline-flex p-1.5"
                aria-label="সূচিপত্র লুকান"
                aria-expanded
              >
                <PanelLeftClose size={16} />
              </button>
            </div>
          </div>

          {/* The simulator — the one destination here that is not a document */}
          <Link
            href="/simulation/"
            onClick={() => setMobileOpen(false)}
            className={`control w-full justify-start px-3 py-2 text-xs ${
              simulationActive ? "control--primary" : ""
            }`}
          >
            <Activity size={14} />
            সিমুলেশন
          </Link>

          {/* Quick search */}
          <div className="relative">
            <input
              id="sidebar-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="টপিক বা অধ্যায় খুঁজুন..."
              aria-label="টপিক বা অধ্যায় খুঁজুন"
              className="surface-well t-body w-full px-3 py-2 text-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="control control--quiet absolute right-1.5 top-1.5 px-1.5 py-1"
                aria-label="খোঁজা বাতিল"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Empty search state */}
          {isSearching && filteredRoadmap.length === 0 && filteredWorkbookParts.length === 0 && (
            <div className="surface-well t-caption p-4 text-center">
              &ldquo;{search}&rdquo; দিয়ে কোনো অধ্যায় বা রোডম্যাপ পাওয়া যায়নি।
            </div>
          )}

          {/* Section 1 — Roadmap */}
          {(!isSearching || filteredRoadmap.length > 0) && (
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setRoadmapOpen((v) => !v)}
                aria-expanded={roadmapOpen}
                aria-controls="roadmap-list"
                className="t-label flex w-full items-center justify-between py-1"
              >
                <span>
                  {nav.roadmap.title} ({filteredRoadmap.length})
                </span>
                {roadmapOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              {roadmapOpen && (
                <ul id="roadmap-list" className="flex flex-col gap-0.5 pl-2">
                  {filteredRoadmap.map((item) => {
                    const active = normalize(item.route) === pathname;
                    return (
                      <li key={item.route}>
                        <Link
                          href={item.route}
                          onClick={() => setMobileOpen(false)}
                          aria-current={active ? "true" : undefined}
                          className="row block px-2.5 py-1.5 text-xs leading-snug"
                        >
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Section 2 — Workbook */}
          {(!isSearching || filteredWorkbookParts.length > 0) && (
            <div className="flex flex-col gap-2 pt-2 seam-t">
              <button
                type="button"
                onClick={() => setWorkbookOpen((v) => !v)}
                aria-expanded={workbookOpen}
                aria-controls="workbook-tree"
                className="t-label flex w-full items-center justify-between py-1"
              >
                <span>{nav.workbook.title}</span>
                {workbookOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              {workbookOpen && (
                <div id="workbook-tree" className="flex flex-col gap-3">
                  {filteredWorkbookParts.map((part) => {
                    const partOpen = isSectionOpen(part.key);
                    const partContentId = `part-content-${part.key}`;

                    return (
                      <div key={part.key} className="flex flex-col gap-1">
                        <button
                          type="button"
                          onClick={() => toggleOpen(part.key)}
                          aria-expanded={partOpen}
                          aria-controls={partContentId}
                          className="row flex w-full items-center justify-between px-2 py-1 text-left text-xs"
                        >
                          <span className="truncate">{part.title}</span>
                          {partOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                        </button>

                        {partOpen && (
                          <div id={partContentId} className="ml-2 flex flex-col gap-2 pl-2">
                            {part.chapters.map((ch) => {
                              const chKey = `${part.key}:${ch.key}`;
                              const chOpen = isSectionOpen(chKey);
                              const chContentId = `ch-content-${chKey}`;

                              return (
                                <div key={ch.key} className="flex flex-col gap-1">
                                  <button
                                    type="button"
                                    onClick={() => toggleOpen(chKey)}
                                    aria-expanded={chOpen}
                                    aria-controls={chContentId}
                                    className="row flex w-full items-center justify-between px-2 py-1 text-left text-[11px]"
                                  >
                                    <span className="truncate">{ch.title}</span>
                                    {chOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
                                  </button>

                                  {chOpen && (
                                    <ul id={chContentId} className="ml-1 flex flex-col gap-0.5 pl-2">
                                      {ch.items.map((item) => {
                                        const active = normalize(item.route) === pathname;
                                        return (
                                          <li key={item.route}>
                                            <Link
                                              href={item.route}
                                              onClick={() => setMobileOpen(false)}
                                              aria-current={active ? "true" : undefined}
                                              className="row block px-2 py-1 text-[11px] leading-snug"
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
          )}
        </div>
      </nav>
    </>
  );
}
