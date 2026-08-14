"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";

function subscribeToTheme(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function getIsDark() {
  if (typeof window === "undefined") return false;
  return document.documentElement.classList.contains("dark");
}

function getIsDarkOnServer() {
  return false;
}

export default function MermaidDiagram({ chart }: { chart: string }) {
  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getIsDark,
    getIsDarkOnServer,
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const reactId = useId();
  const diagramId = `mermaid-${reactId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    let cancelled = false;

    async function render() {
      const container = containerRef.current;
      if (!container) return;

      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: isDark ? "dark" : "default",
          fontFamily: "var(--font-geist-mono), monospace, system-ui, sans-serif",
        });

        const { svg } = await mermaid.render(diagramId, chart);
        if (cancelled) return;
        container.innerHTML = svg;

        const rendered = container.querySelector("svg");
        if (rendered) {
          const viewBox = rendered.getAttribute("viewBox")?.split(/[\s,]+/);
          const naturalWidth = viewBox ? Number(viewBox[2]) : 0;
          rendered.style.maxWidth = "none";
          if (naturalWidth > 0) {
            rendered.style.width = `${naturalWidth}px`;
            rendered.style.height = "auto";
          }
        }
      } catch (error) {
        if (cancelled) return;
        console.warn(`Mermaid render failed (${diagramId}):`, error);
        container.textContent = "⚠️ এই ডায়াগ্রামটি রেন্ডার করা যায়নি।";
      }
    }

    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, isDark, diagramId]);

  return (
    <div className="my-6 overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm">
      <div
        ref={containerRef}
        role="img"
        aria-label="সিস্টেম ডিজাইন ডায়াগ্রাম"
        className="flex min-h-20 items-center justify-start text-sm text-[var(--muted)] [&_svg]:mx-auto"
      >
        ডায়াগ্রাম লোড হচ্ছে…
      </div>
    </div>
  );
}
