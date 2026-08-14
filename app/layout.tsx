import type { Metadata } from "next";
import { Noto_Sans_Bengali, Geist_Mono } from "next/font/google";
import Sidebar from "./components/Sidebar";
import { getNav } from "./lib/content";
import "./globals.css";

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "System Design — বাংলা রোডম্যাপ ও ওয়ার্কবুক",
    template: "%s — System Design",
  },
  description:
    "সিস্টেম ডিজাইন শেখা ও ইন্টারভিউ প্রস্তুতির সম্পূর্ণ বাংলা রোডম্যাপ এবং ইন্টারঅ্যাকটিভ ওয়ার্কবুক।",
};

const themeScript = `
try {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = getNav();

  return (
    <html
      lang="bn"
      className={`${bengali.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-[var(--background)] text-[var(--foreground)]">
        <div className="md:flex min-h-screen">
          <Sidebar nav={nav} />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
