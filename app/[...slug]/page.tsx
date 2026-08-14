import { notFound } from "next/navigation";
import DocArticle from "@/app/components/DocArticle";
import { getDocBySlug, getPages, getSiblings, readDoc } from "@/app/lib/content";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPages().map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  return {
    title: doc?.title,
  };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);

  if (!doc || doc.isIndex) {
    notFound();
  }

  const { prev, next } = getSiblings(doc);
  return <DocArticle doc={doc} content={readDoc(doc)} prev={prev} next={next} />;
}
