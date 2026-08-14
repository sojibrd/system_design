"use client";

import { isValidElement, type ReactNode } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MermaidDiagram from "./MermaidDiagram";
import { slugify } from "@/app/lib/slug";

/**
 * markdown-এর ভেতরের রিলেটিভ লিংক (`01-introduction.md`, `../foo/`, `1.1.1 Parts of a URL.md`)
 * সাইট-route-এ রূপান্তর করে।
 */
export function resolveHref(href: string, dir: string): string {
  if (!href) return href;

  // External, anchor, mailto
  if (/^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith("#") || href.startsWith("//")) {
    return href;
  }

  const [pathPart, hash] = href.split("#");
  if (!pathPart) return href;

  // Decode URI component if encoded
  const decodedPath = decodeURIComponent(pathPart);

  const segments = href.startsWith("/") ? [] : dir.split("/").filter(Boolean);
  for (const segment of decodedPath.split("/")) {
    if (!segment || segment === ".") continue;
    if (segment === "..") segments.pop();
    else segments.push(segment);
  }

  let last = segments.pop() ?? "";
  last = last.replace(/\.md$/i, "");
  if (last.toLowerCase() !== "readme" && last) {
    segments.push(last);
  }

  // Slugify each segment for the final route
  const slugSegments = segments.map((s) => slugify(s));
  const route = slugSegments.length ? `/${slugSegments.join("/")}/` : "/";
  return hash ? `${route}#${hash}` : route;
}

function extractMermaidSource(children: ReactNode): string | null {
  if (!isValidElement<{ className?: string; children?: ReactNode }>(children)) {
    return null;
  }
  const { className, children: code } = children.props;
  if (!className?.includes("language-mermaid")) return null;
  return typeof code === "string" ? code.trim() : null;
}

export default function Markdown({ content, dir }: { content: string; dir: string }) {
  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-p:leading-relaxed prose-li:leading-relaxed prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:text-zinc-100 prose-table:block prose-table:overflow-x-auto">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const resolved = resolveHref(href ?? "", dir);
            if (resolved.startsWith("/")) {
              return (
                <Link
                  href={resolved}
                  className="font-medium text-[var(--accent)] underline underline-offset-4 hover:opacity-80 transition-opacity"
                  {...props}
                >
                  {children}
                </Link>
              );
            }
            return (
              <a
                href={resolved}
                target="_blank"
                rel="noreferrer noopener"
                className="font-medium text-[var(--accent)] underline underline-offset-4 hover:opacity-80 transition-opacity"
                {...props}
              >
                {children}
              </a>
            );
          },
          pre({ children, ...props }) {
            const mermaidSource = extractMermaidSource(children);
            if (mermaidSource) {
              return <MermaidDiagram chart={mermaidSource} />;
            }
            return <pre {...props}>{children}</pre>;
          },
          code({ className, children, ...props }) {
            const isBlock = Boolean(className);
            if (isBlock) {
              return (
                <code className={`${className} font-mono text-sm leading-relaxed`} {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code
                className="font-mono text-[0.875em] bg-[var(--surface-hover)] border border-[var(--border)] px-1.5 py-0.5 rounded text-[var(--foreground)]"
                {...props}
              >
                {children}
              </code>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="my-4 border-l-4 border-[var(--accent)] bg-[var(--accent-soft)] px-4 py-2 rounded-r-lg not-italic text-sm">
                {children}
              </blockquote>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
