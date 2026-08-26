import type { Metadata } from "next";
import {
  Archivo,
  Archivo_Black,
  Barlow_Semi_Condensed,
  JetBrains_Mono,
  Noto_Sans_Bengali,
} from "next/font/google";
import Sidebar from "./components/Sidebar";
import { getNav } from "./lib/content";
import "./globals.css";

/**
 * The font shelf. Five families are declared once, each on its own variable;
 * the theme picks which role gets which family via `--t-font-sans` /
 * `--t-font-mono` / `--t-doc-family`.
 *
 * Bengali is on the shelf because the Latin faces carry no Bengali glyphs —
 * without it the browser falls back silently and the roadmap loses the theme's
 * typography exactly where most of the reading happens.
 *
 * Adding a family no theme uses yet is the ONLY reason to edit this file.
 */
const grotesk = Archivo({
  variable: "--font-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const display = Archivo_Black({
  variable: "--font-display",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const condensed = Barlow_Semi_Condensed({
  variable: "--font-condensed",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  display: "swap",
});

const bengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "System Design — বাংলা রোডম্যাপ ও সিমুলেটর",
    template: "%s — System Design",
  },
  description:
    "সিস্টেম ডিজাইন শেখা ও ইন্টারভিউ প্রস্তুতির সম্পূর্ণ বাংলা রোডম্যাপ এবং ইন্টারঅ্যাকটিভ আর্কিটেকচার সিমুলেটর।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = getNav();

  return (
    <html
      lang="bn"
      className={`${grotesk.variable} ${display.variable} ${condensed.variable} ${mono.variable} ${bengali.variable} h-full antialiased`}
    >
      {/* `h-dvh` + `overflow-hidden`: the sidebar and the main column scroll
          independently, and the simulator needs a bounded height to fill. */}
      <body className="surface-app h-dvh overflow-hidden flex flex-col md:flex-row">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 control control--primary px-3 py-1.5 text-xs shadow-lg"
        >
          মূল কনটেন্টে যান
        </a>
        <Sidebar nav={nav} />
        <main id="main-content" className="min-w-0 flex-1 overflow-y-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
