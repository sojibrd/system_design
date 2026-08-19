import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "আর্কিটেকচার সিমুলেটর",
  description:
    "URL Shortener-এর আর্কিটেকচার তিনটি স্তরে — ধাপে ধাপে অ্যানিমেটেড সিমুলেশন ও ব্যাখ্যা।",
};

export default function SimulationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
