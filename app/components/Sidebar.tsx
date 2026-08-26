"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Activity,
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

  // Filter items if search is active
  const isSearching = search.trim().length > 0;
  const query = search.toLowerCase().trim();

  const filteredRoadmap = useMemo(() => {
    if (!isSearching) return nav.roadmap.items;
    return nav.roadmap.items.filter((item) =>
      item.title.toLowerCase().includes(query)
    );
  }, [nav.roadmap.items, query, isSearching]);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close on Escape key on mobile
  useEffect(() => {
    if (!mobileOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  // Desktop keyboard shortcuts: `/` or `Ctrl+K` / `Cmd+K` focuses search
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);

      if (
        (e.key === "/" && !isInput) ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k")
      ) {
        e.preventDefault();
        if (collapsed) setCollapsed(false);
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [collapsed, setCollapsed]);

  const simulationActive = pathname === "/simulation" || pathname.startsWith("/simulation/");

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden shrink-0 surface-panel seam-b-heavy flex items-center justify-between px-4 py-2.5 z-30">
        <Link href="/" className="t-title text-sm">
          System Design
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="control px-3 py-1.5 text-xs min-h-10"
          aria-expanded={mobileOpen}
          aria-controls="site-sidebar"
        >
          {mobileOpen ? <X size={14} /> : <Menu size={14} />}
          {mobileOpen ? "বন্ধ" : "সূচিপত্র"}
        </button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/65 backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

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

      {/* The index rack — fixed slide-over drawer on phone, static column on desktop */}
      <nav
        id="site-sidebar"
        className={`${
          mobileOpen
            ? "fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm shadow-2xl flex"
            : "hidden"
        } ${
          collapsed ? "md:hidden" : "md:flex"
        } shrink-0 min-h-0 md:static flex-col md:w-80 surface-panel overflow-y-auto`}
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
              ref={searchInputRef}
              id="sidebar-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  if (search) {
                    setSearch("");
                  } else {
                    searchInputRef.current?.blur();
                  }
                }
              }}
              placeholder="টপিক বা অধ্যায় খুঁজুন..."
              aria-label="টপিক বা অধ্যায় খুঁজুন (শর্টকাট: / বা Ctrl+K)"
              className="surface-well t-body w-full pl-3 pr-8 py-2 text-sm sm:text-xs"
            />
            {search ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  searchInputRef.current?.focus();
                }}
                className="control control--quiet absolute right-1.5 top-1.5 px-1.5 py-1"
                aria-label="খোঁজা বাতিল"
              >
                <X size={12} />
              </button>
            ) : (
              <span
                className="hidden md:inline-flex absolute right-2.5 top-2.5 t-caption t-mono opacity-50 pointer-events-none select-none text-[11px]"
                title="শর্টকাট: / অথবা Ctrl+K"
              >
                /
              </span>
            )}
          </div>

          {/* Empty search state */}
          {isSearching && filteredRoadmap.length === 0 && (
            <div className="surface-well t-caption p-4 text-center">
              &ldquo;{search}&rdquo; দিয়ে কোনো অধ্যায় বা রোডম্যাপ পাওয়া যায়নি।
            </div>
          )}

          {/* Roadmap — একটাই সেকশন, তাই তালিকা সবসময় খোলা */}
          {filteredRoadmap.length > 0 && (
            <ul className="flex flex-col gap-0.5">
              {filteredRoadmap.map((item) => {
                const active = normalize(item.route) === pathname;
                return (
                  <li key={item.route}>
                    <Link
                      href={item.route}
                      onClick={() => setMobileOpen(false)}
                      aria-current={active ? "true" : undefined}
                      className="row block px-2.5 py-2 sm:py-1.5 text-xs leading-snug"
                    >
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </nav>
    </>
  );
}
