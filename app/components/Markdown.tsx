"use client";

import { isValidElement, useState, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy } from "lucide-react";
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

function CodeBlock({ children }: { children: ReactNode }) {
  const [copied, setCopied] = useState(false);

  let codeText = "";
  let language = "";

  if (isValidElement<{ className?: string; children?: ReactNode }>(children)) {
    const { className, children: rawCode } = children.props;
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
      language = match[1];
    }
    if (typeof rawCode === "string") {
      codeText = rawCode;
    } else if (Array.isArray(rawCode)) {
      codeText = rawCode.map((c) => (typeof c === "string" ? c : "")).join("");
    }
  }

  const handleCopy = async () => {
    if (!codeText) return;
    try {
      await navigator.clipboard.writeText(codeText.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore clipboard error
    }
  };

  return (
    <div className="relative surface-well overflow-hidden my-4 group">
      <div className="flex items-center justify-between px-3 py-1.5 seam-b text-[11px]">
        <span className="t-mono t-label lowercase">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label={copied ? "কোড কপি করা হয়েছে" : "কোড কপি করুন"}
          className="control control--quiet px-2 py-0.5 text-[11px] flex items-center gap-1"
        >
          {copied ? (
            <>
              <Check size={12} className="t-ok" />
              <span className="t-ok">কপি হয়েছে</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>কপি</span>
            </>
          )}
        </button>
      </div>

      <pre className="!border-0 !shadow-none !bg-transparent !m-0 !p-3.5 overflow-x-auto">
        {children}
      </pre>
    </div>
  );
}

function getNodeText(children: ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(getNodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getNodeText(children.props.children);
  }
  return "";
}

/**
 * Long-form markdown carries no component to hang a role class on, so every
 * visual decision for it lives in the `.doc-prose` block of the theme
 * contract.
 */
export default function Markdown({ content, dir }: { content: string; dir: string }) {
  return (
    <div className="doc-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2({ children, ...props }) {
            const raw = getNodeText(children).trim();
            const id = slugify(raw.replace(/[*_`]/g, ""));
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3({ children, ...props }) {
            const raw = getNodeText(children).trim();
            const id = slugify(raw.replace(/[*_`]/g, ""));
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
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
            return <CodeBlock {...props}>{children}</CodeBlock>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
