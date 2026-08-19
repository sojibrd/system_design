"use client";

import { useEffect, useId, useRef } from "react";

/**
 * Mermaid draws its own SVG and takes its palette as JS values, not CSS — so
 * this is the one component that reads the theme back out of the document
 * instead of leaving it to a role class. The values still belong to the theme
 * (`--t-diagram-*`); only the reading happens here.
 */
function readThemeVars() {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string, fallback: string) =>
    style.getPropertyValue(name).trim() || fallback;

  return {
    nodeBg: read("--t-diagram-node-bg", "#2b251f"),
    nodeBorder: read("--t-diagram-node-border", "#4d4238"),
    line: read("--t-diagram-line", "#5f5245"),
    text: read("--t-diagram-text", "#c9bda9"),
    accent: read("--t-accent", "#ffb020"),
    canvas: read("--t-well-bg", "#100e0b"),
  };
}

export default function MermaidDiagram({ chart }: { chart: string }) {
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
        const t = readThemeVars();

        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: "var(--t-font-mono), monospace",
          themeVariables: {
            background: t.canvas,
            primaryColor: t.nodeBg,
            primaryBorderColor: t.nodeBorder,
            primaryTextColor: t.text,
            secondaryColor: t.nodeBg,
            tertiaryColor: t.canvas,
            lineColor: t.line,
            textColor: t.text,
            mainBkg: t.nodeBg,
            nodeBorder: t.nodeBorder,
            clusterBkg: t.canvas,
            clusterBorder: t.nodeBorder,
            titleColor: t.accent,
            edgeLabelBackground: t.canvas,
            actorBkg: t.nodeBg,
            actorBorder: t.nodeBorder,
            actorTextColor: t.text,
            signalColor: t.line,
            signalTextColor: t.text,
              labelBoxBkgColor: t.nodeBg,
            labelBoxBorderColor: t.nodeBorder,
            labelTextColor: t.text,
            noteBkgColor: t.canvas,
            noteBorderColor: t.nodeBorder,
            noteTextColor: t.text,
          },
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
  }, [chart, diagramId]);

  return (
    <div className="surface-well my-6 overflow-x-auto p-4">
      <div
        ref={containerRef}
        role="img"
        aria-label="সিস্টেম ডিজাইন ডায়াগ্রাম"
        className="t-caption flex min-h-20 items-center justify-start [&_svg]:mx-auto"
      >
        ডায়াগ্রাম লোড হচ্ছে…
      </div>
    </div>
  );
}
