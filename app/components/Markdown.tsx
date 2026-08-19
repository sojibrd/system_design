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

/**
 * Long-form markdown carries no component to hang a role class on, so every
 * visual decision for it lives in the `.doc-prose` block of the theme
 * contract. Nothing here styles anything — it only routes links and swaps
 * mermaid fences for a rendered diagram.
 */
export default function Markdown({ content, dir }: { content: string; dir: string }) {
  return (
    <div className="doc-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            const resolved = resolveHref(href ?? "", dir);
            if (resolved.startsWith("/")) {
              return (
                <Link href={resolved} {...props}>
                  {children}
                </Link>
              );
            }
            return (
              <a href={resolved} target="_blank" rel="noreferrer noopener" {...props}>
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
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
