import type { Metadata } from "next";
import { getPages } from "@/app/lib/content";
import ProgressClient, { type ProgressDocItem } from "./ProgressClient";

export const metadata: Metadata = {
  title: "স্টাডি প্রোগ্রেস ও রিভিশন",
  description: "সিস্টেম ডিজাইন অধ্যায়গুলোর সমাপ্তি অগ্রগতি এবং রিভিশন ট্র্যাকার।",
};

export default function ProgressPage() {
  const pages = getPages();

  const allDocs: ProgressDocItem[] = pages
    .filter((p) => p.section === "docs")
    .map((p) => ({
      title: p.title,
      route: p.route,
      group: p.group,
    }));

  return <ProgressClient allDocs={allDocs} />;
}
