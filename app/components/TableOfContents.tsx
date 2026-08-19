"use client";

import { useEffect, useState } from "react";
import type { HeadingItem } from "@/app/lib/content";
import { ListFilter } from "lucide-react";

export default function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    const elements = headings
      .map((h) => document.getElementById(h.id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, [headings]);

  if (!headings || headings.length < 2) {
    return null;
  }

  return (
    <aside
      aria-label="এই পৃষ্ঠার সূচিপত্র"
      className="hidden xl:block w-64 shrink-0"
    >
      <div className="sticky top-8 flex flex-col gap-3">
        <div className="flex items-center gap-1.5 pb-2 seam-b">
          <ListFilter size={13} className="t-muted" />
          <span className="t-label">এই পৃষ্ঠায়</span>
        </div>

        <nav className="flex flex-col gap-0.5 max-h-[calc(100vh-10rem)] overflow-y-auto pr-2">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <a
                key={heading.id}
                href={`#${heading.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  const target = document.getElementById(heading.id);
                  if (target) {
                    target.scrollIntoView({ behavior: "smooth" });
                    setActiveId(heading.id);
                    window.history.pushState(null, "", `#${heading.id}`);
                  }
                }}
                className={`row block py-1 text-xs leading-snug truncate transition-colors ${
                  heading.level === 3 ? "pl-3 text-[11px]" : "pl-1 font-medium"
                } ${isActive ? "t-accent t-strong font-semibold" : ""}`}
                aria-current={isActive ? "true" : undefined}
                title={heading.text}
              >
                {heading.text}
              </a>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
