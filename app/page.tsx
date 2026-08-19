import DocArticle from "./components/DocArticle";
import { getIndexDoc, getPages, readDoc, parseDocContent } from "./lib/content";

export default function Home() {
  const doc = getIndexDoc();
  const pages = getPages();

  if (!doc) {
    return (
      <div className="mx-auto w-full max-w-4xl px-6 py-12">
        <h1 className="t-title text-3xl">System Design Roadmap &amp; Workbook</h1>
        <p className="t-body mt-2 text-sm">
          {pages.length} টি বিস্তারিত অধ্যায় — বাঁ পাশের সূচিপত্র থেকে শুরু করুন।
        </p>
      </div>
    );
  }

  const { title, source, body, headings } = parseDocContent(readDoc(doc));
  const displayTitle = doc.title || title;

  return (
    <DocArticle
      doc={doc}
      displayTitle={displayTitle}
      source={source}
      body={body}
      headings={headings}
      next={pages[0]}
    />
  );
}
