import type { Metadata } from "next";
import { getPages } from "@/app/lib/content";
import ProgressClient, { type ProgressDocItem, type ProgressSectionData } from "./ProgressClient";

export const metadata: Metadata = {
  title: "স্টাডি প্রোগ্রেস ও রিভিশন",
  description: "সিস্টেম ডিজাইন অধ্যায়গুলোর সমাপ্তি অগ্রগতি এবং রিভিশন ট্র্যাকার।",
};

export default function ProgressPage() {
  const pages = getPages();

  const allDocs: ProgressDocItem[] = pages.map((p) => ({
    title: p.title,
    route: p.route,
    section: p.section,
    group: p.group,
  }));

  const roadmapDocs = allDocs.filter((d) => d.section === "docs");
  const workbookDocs = allDocs.filter((d) => d.section === "workbook");

  const sections: ProgressSectionData[] = [
    {
      title: "System Design Roadmap (২৫টি অধ্যায়)",
      docs: roadmapDocs,
    },
    {
      title: "System Design Workbook (৩৫টি টপিক)",
      docs: workbookDocs,
    },
  ];

  return <ProgressClient sections={sections} allDocs={allDocs} />;
}
