import fs from "node:fs";
import path from "node:path";
import { slugify } from "./slug";

export { slugify };

const ROOT = process.cwd();

const IGNORED_DIRS = new Set([
  "node_modules",
  ".next",
  "out",
  ".git",
  ".github",
  "app",
  "public",
  "designs",
  "context",
  "scripts",
]);

export type Doc = {
  /** URL segments, e.g. ["docs", "01-introduction"] or ["workbook", "1-networking-basics", "1-1-url-and-browser", "1-1-1-parts-of-a-url"] */
  slug: string[];
  /** trailing slash সহ সাইট-route, e.g. "/docs/01-introduction/" */
  route: string;
  /** রিপো-রিলেটিভ posix path, e.g. "docs/01-introduction.md" */
  file: string;
  /** ফাইলটা যে ফোল্ডারে আছে, e.g. "docs" */
  dir: string;
  /** টপ-লেভেল সেকশন: "docs" (Roadmap) বা "workbook" (Workbook) */
  section: "docs" | "workbook" | string;
  /** সরাসরি parent ফোল্ডারের নাম */
  group: string;
  /** প্রথম `# heading` অথবা ফাইলনাম থেকে */
  title: string;
  /** README বা ফোল্ডার index */
  isIndex: boolean;
};

export type NavItem = {
  title: string;
  route: string;
  file: string;
};

export type NavChapter = {
  title: string;
  key: string;
  items: NavItem[];
};

export type NavPart = {
  title: string;
  key: string;
  chapters: NavChapter[];
  items?: NavItem[];
};

export type NavTree = {
  roadmap: {
    title: string;
    items: NavItem[];
  };
  workbook: {
    title: string;
    parts: NavPart[];
  };
};

function walk(dir: string, out: string[] = []): string[] {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue;
      walk(full, out);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

/** প্রথম `# heading` থেকে টাইটেল; না পেলে ফাইলের নাম থেকে বানানো */
export function readTitle(content: string, file: string): string {
  for (const line of content.split(/\r?\n/)) {
    const match = /^#\s+(.+?)\s*$/.exec(line);
    if (match) return match[1];
  }
  return path
    .basename(file, ".md")
    .replace(/^\d+[-_.]\s*/, "")
    .replace(/[-_]/g, " ");
}

let docsCache: Doc[] | null = null;
let indexTitlesCache: Map<string, string> | null = null;

function scanAll(): { docs: Doc[]; indexTitles: Map<string, string> } {
  if (docsCache && indexTitlesCache) {
    return { docs: docsCache, indexTitles: indexTitlesCache };
  }

  const allMdFiles = walk(ROOT);
  const indexTitles = new Map<string, string>();
  const docs: Doc[] = [];
  const routeSet = new Set<string>();

  // ১ম পাস: Index ফাইল সনাক্তকরণ এবং টাইটেল স্টোর করা
  for (const absolute of allMdFiles) {
    const relFile = path.relative(ROOT, absolute).split(path.sep).join("/");
    const segments = relFile.replace(/\.md$/i, "").split("/");
    if (segments.length < 2) continue; // Root files like README.md

    const baseName = path.basename(relFile, ".md");
    const dirName = path.dirname(relFile).split(path.sep).join("/");
    const matchingFolder = path.join(ROOT, dirName === "." ? baseName : `${dirName}/${baseName}`);

    const isReadme = baseName.toLowerCase() === "readme";
    const hasMatchingFolder = fs.existsSync(matchingFolder) && fs.statSync(matchingFolder).isDirectory();

    if (isReadme || hasMatchingFolder) {
      const content = fs.readFileSync(absolute, "utf8");
      const title = readTitle(content, relFile);
      // matching folder path or directory path
      const keyPath = isReadme ? dirName : (dirName === "." ? baseName : `${dirName}/${baseName}`);
      indexTitles.set(keyPath, title);
    }
  }

  // ২য় পাস: Leaf ডক এবং রুট তৈরি
  for (const absolute of allMdFiles) {
    const relFile = path.relative(ROOT, absolute).split(path.sep).join("/");
    const rawSegments = relFile.replace(/\.md$/i, "").split("/");
    if (rawSegments.length < 2) continue;

    const baseName = path.basename(relFile, ".md");
    const dirName = path.dirname(relFile).split(path.sep).join("/");
    const matchingFolder = path.join(ROOT, dirName === "." ? baseName : `${dirName}/${baseName}`);

    const isReadme = baseName.toLowerCase() === "readme";
    const hasMatchingFolder = fs.existsSync(matchingFolder) && fs.statSync(matchingFolder).isDirectory();
    const isIndex = isReadme || hasMatchingFolder;

    const content = fs.readFileSync(absolute, "utf8");
    const title = readTitle(content, relFile);

    const slugSegments = rawSegments.map((s) => slugify(s));
    // Index file gets folder route if needed, leaf file gets full slug route
    const slug = isReadme ? slugSegments.slice(0, -1) : slugSegments;
    const route = isIndex && isReadme && slug.length === 1 && slug[0] === "docs"
      ? "/"
      : `/${slug.join("/")}/`;

    if (!isIndex) {
      if (routeSet.has(route)) {
        throw new Error(`Route collision detected: "${route}" from file "${relFile}"`);
      }
      routeSet.add(route);
    }

    docs.push({
      slug,
      route,
      file: relFile,
      dir: dirName,
      section: rawSegments[0],
      group: rawSegments.length > 2 ? rawSegments.at(-2)! : rawSegments[0],
      title,
      isIndex,
    });
  }

  docs.sort((a, b) => a.file.localeCompare(b.file, "en", { numeric: true }));

  docsCache = docs;
  indexTitlesCache = indexTitles;
  return { docs, indexTitles };
}

export function getDocs(): Doc[] {
  return scanAll().docs;
}

/** index (README বা folder index) বাদে যে ডকগুলো নিজস্ব route পায় (মোট ৬০টি পাতা) */
export function getPages(): Doc[] {
  return getDocs().filter((doc) => !doc.isIndex);
}

export function getDocBySlug(slug: string[]): Doc | undefined {
  const key = slug.join("/");
  return getDocs().find((doc) => doc.slug.join("/") === key);
}

/** সাইটের হোমপেজ ডক (docs/README.md) */
export function getIndexDoc(): Doc | undefined {
  return getDocs().find((doc) => doc.file.toLowerCase() === "docs/readme.md");
}

export function readDoc(doc: Doc): string {
  return fs.readFileSync(path.join(ROOT, doc.file), "utf8");
}

export function parseDocContent(raw: string): { title: string; source?: string; body: string } {
  const lines = raw.split(/\r?\n/);
  let title = "";
  let source: string | undefined;
  const bodyLines: string[] = [];
  let foundH1 = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const h1Match = /^#\s+(.+)$/.exec(line);
    if (!foundH1 && h1Match) {
      title = h1Match[1];
      foundH1 = true;
      continue;
    }
    const sourceMatch =
      /^\*?(?:Source|উৎস):\s*(.+?)\*?$/i.exec(line) ||
      /^\*\*(?:Source|উৎস):\*\*\s*(.+)$/i.exec(line);
    if (!source && sourceMatch) {
      source = sourceMatch[1];
      continue;
    }
    bodyLines.push(line);
  }

  return {
    title: title || "ডকুমেন্টেশন",
    source,
    body: bodyLines.join("\n").trim(),
  };
}

export function getNav(): NavTree {
  const { indexTitles } = scanAll();
  const pages = getPages();

  // 1. Roadmap (docs/)
  const roadmapPages = pages.filter((p) => p.section === "docs");
  const roadmapItems: NavItem[] = roadmapPages.map((p) => ({
    title: p.title,
    route: p.route,
    file: p.file,
  }));

  // 2. Workbook (workbook/)
  const workbookPages = pages.filter((p) => p.section === "workbook");
  const partMap = new Map<string, { partTitle: string; chapterMap: Map<string, { chapterTitle: string; items: NavItem[] }> }>();

  for (const page of workbookPages) {
    const parts = page.file.split("/");
    // e.g. ["workbook", "1. Networking basics", "1.1 URL and Browser", "1.1.1 Parts of a URL.md"]
    const partFolder = parts[1] || "";
    const chapterFolder = parts[2] || "";

    const partPath = `workbook/${partFolder}`;
    const chapterPath = `workbook/${partFolder}/${chapterFolder}`;

    const partTitle = indexTitles.get(partPath) || partFolder.replace(/^\d+[-_.]\s*/, "");
    const chapterTitle = indexTitles.get(chapterPath) || chapterFolder.replace(/^\d+(\.\d+)?[-_.]\s*/, "");

    if (!partMap.has(partFolder)) {
      partMap.set(partFolder, {
        partTitle,
        chapterMap: new Map(),
      });
    }

    const partEntry = partMap.get(partFolder)!;
    if (!partEntry.chapterMap.has(chapterFolder)) {
      partEntry.chapterMap.set(chapterFolder, {
        chapterTitle,
        items: [],
      });
    }

    partEntry.chapterMap.get(chapterFolder)!.items.push({
      title: page.title,
      route: page.route,
      file: page.file,
    });
  }

  const workbookParts: NavPart[] = [];
  for (const [partKey, partData] of partMap) {
    const chapters: NavChapter[] = [];
    for (const [chapterKey, chapterData] of partData.chapterMap) {
      chapters.push({
        title: chapterData.chapterTitle,
        key: chapterKey,
        items: chapterData.items,
      });
    }
    workbookParts.push({
      title: partData.partTitle,
      key: partKey,
      chapters,
    });
  }

  return {
    roadmap: {
      title: "System Design Roadmap",
      items: roadmapItems,
    },
    workbook: {
      title: "System Design Workbook",
      parts: workbookParts,
    },
  };
}

/** prev/next — nav-এর ক্রম অনুযায়ী সমতল তালিকা */
export function getSiblings(doc: Doc): { prev?: Doc; next?: Doc } {
  const pages = getPages();
  const index = pages.findIndex((page) => page.route === doc.route);
  if (index === -1) return {};
  return { prev: pages[index - 1], next: pages[index + 1] };
}
