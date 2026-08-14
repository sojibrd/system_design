# Project Overview — System Design Prep Tracker

## প্রজেক্টের লক্ষ্য

একটা **ব্যক্তিগত System Design পড়াশোনার ট্র্যাকার** ওয়েব অ্যাপ তৈরি করা যা:

- `context/system_design_workbook/` ফোল্ডারের nested Markdown ফাইলগুলো পার্স করে UI-তে দেখাবে
- প্রতিটা ডকুমেন্ট পড়া হলে চেকবক্সে টিক দেওয়া যাবে (progress localStorage-এ সেভ)
- প্রতিটা ডকের জন্য নোট (নিজের ভাষায় সারাংশ + যেটা এখনো পরিষ্কার নয়) লেখা যাবে
- "রিভাইজ দরকার" মার্ক করা যাবে — ইন্টারভিউয়ের আগে দ্রুত ঝালিয়ে নেওয়ার জন্য
- সামগ্রিক অগ্রগতি (কতটা পড়া হলো) দেখা যাবে

> **এটা reading tracker, practice tracker নয়।** DSA Prep Tracker-এ "solved/unsolved" ছিল, এখানে "পড়া হয়েছে / রিভাইজ দরকার"।

## টেকনোলজি স্ট্যাক

| লেয়ার | টেকনোলজি |
|--------|----------|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Font | Geist Sans + Geist Mono (next/font) |
| Data Source | `context/system_design_workbook/**/*.md` (nested Markdown, server-side পার্স) |
| State | React `useState` + `useLocalStorage` hook |
| Storage | Browser `localStorage` (progress, notes, revise flags, dark mode) |
| Rendering | Server Component (`page.tsx`) + Client Component (`TrackerClient.tsx`) |

> সচেতন সিদ্ধান্ত: DSA Prep Tracker-এর সাথে একই স্ট্যাক ও একই ডিজাইন ভাষা। দুটো অ্যাপ পাশাপাশি ব্যবহার করলে যেন একই জিনিস মনে হয়।
>
> ⚠️ **Next 15 নয়, Next 16।** পরিকল্পনায় Next 15 লেখা ছিল, কিন্তু `create-next-app@latest` এখন Next 16.2.11 + React 19.2 দেয়। Next 16-এ breaking change আছে — কোড লেখার আগে `node_modules/next/dist/docs/` পড়ুন (`AGENTS.md`-এও এই নিয়ম আছে)। DSA Prep Tracker Next 15-এ, তাই দুই প্রজেক্টের API হুবহু এক নয়।

## ডেটা সোর্সের কাঠামো (গুরুত্বপূর্ণ পার্থক্য)

DSA Prep Tracker-এ ডেটা ছিল **একটামাত্র** `dsa-workbook.md` ফাইল। এখানে ডেটা **multi-file ও nested** — ৪ স্তরের:

```
context/system_design_workbook.md              ← Level 0: সম্পূর্ণ index (⚠️ corrupt, নিচে দেখুন)
context/system_design_workbook/
├── 1. Networking basics.md                    ← Level 1: Part index
├── 1. Networking basics/
│   ├── 1.1 URL and Browser.md                 ← Level 2: Chapter index
│   ├── 1.1 URL and Browser/
│   │   ├── 1.1.1 Parts of a URL.md            ← Level 3: Doc (আসল কনটেন্ট)
│   │   └── 1.1.2 What Happens When You Type URL in Browser.md
│   ├── 1.2 Network Protocols and SSH.md
│   └── 1.2 Network Protocols and SSH/ ...
├── 2. System Architecture & Scaling.md
└── ... (৬টা পার্ট)
```

**পরিসংখ্যান:** ৬টা Part → ১৭টা Chapter → ৩৫টা Doc (মোট ৫৮টা `.md` ফাইল)

### তিন স্তরের পরিভাষা (DSA-র সাথে ম্যাপিং)

| System Design Prep | DSA Prep-এর সমতুল্য | উদাহরণ |
|--------------------|---------------------|---------|
| **Part** | Topic | `1. Networking basics` |
| **Chapter** | Pattern | `1.1 URL and Browser` |
| **Doc** | Problem | `1.1.1 Parts of a URL` |

- Level 0/1/2 ফাইলগুলো শুধু **index** — এদের কাজ নিচের স্তরের লিংক ধরে রাখা, নিজেদের পড়ার মতো কনটেন্ট নেই
- Level 3 ফাইলগুলোই **আসল কনটেন্ট** — এগুলোই ট্র্যাক করা হবে (৩৫টা)

## ৬টা পার্ট

| # | Part | Chapters | Docs |
|---|------|----------|------|
| 1 | Networking basics | 4 | 6 |
| 2 | System Architecture & Scaling | 3 | 6 |
| 3 | Data & Speed Up | 2 | 3 |
| 4 | Security & Pipelines | 2 | 3 |
| 5 | Advanced & AI | 2 | 3 |
| 6 | Case Studies | 4 | 11 |
| | **মোট** | **17** | **35** |

## প্রস্তাবিত ফাইল স্ট্রাকচার

```
system_design_prep/
├── app/
│   ├── layout.tsx              # Root layout, Geist font, metadata
│   ├── page.tsx                # Server component — workbook পার্স করে
│   ├── TrackerClient.tsx       # Client component — সম্পূর্ণ UI লজিক
│   ├── globals.css             # CSS variables (tokens), glassmorphism, scrollbar
│   ├── hooks/
│   │   └── useLocalStorage.ts  # Custom hook — localStorage state management
│   └── utils/
│       └── workbookParser.ts   # nested workbook পার্স করার ইউটিলিটি
├── context/
│   ├── system_design_workbook/ # মূল ডেটা সোর্স (nested .md)
│   ├── system_design_workbook.md
│   ├── project-overview.md     # (এই ফাইল)
│   ├── build-plan.md
│   ├── progress-tracker.md
│   ├── ui-tokens.md
│   ├── ui-rules.md
│   └── ui-registry.md
├── AGENTS.md
├── next.config.ts
├── package.json
└── tsconfig.json
```

## কীভাবে কাজ করবে (Data Flow)

```
context/system_design_workbook/**/*.md
      ↓ (server-side fs.readdirSync — directory walk, index ফাইল পার্স নয়)
workbookParser.ts → parseWorkbook() → Part[]
      ↓ (props)
page.tsx (Server Component)
      ↓ (props: parts)
TrackerClient.tsx (Client Component)
      ↓
UI: Sidebar (parts/chapters) + Main Panel (doc কনটেন্ট + নোট)
      ↓ (user interaction)
localStorage: readIds, reviseIds, notes, darkMode
```

## প্রস্তাবিত ডেটা মডেল

```typescript
interface Doc {
  id: string;          // e.g. "1.1.1"
  name: string;        // e.g. "Parts of a URL"
  filePath: string;    // context-relative path
  source?: string;     // "*Source: Anup Panwar*" লাইন থেকে
  content: string;     // Markdown body (heading ও source লাইন বাদে)
}

interface Chapter {
  id: string;          // e.g. "1.1"
  name: string;        // e.g. "URL and Browser"
  title?: string;      // index ফাইলের বাংলা heading, e.g. "০১. ব্রাউজারে লিংক লিখলে কী হয়?"
  docs: Doc[];
}

interface Part {
  id: number;          // e.g. 1
  name: string;        // e.g. "Networking basics"
  title?: string;      // index ফাইলের বাংলা heading
  chapters: Chapter[];
}
```

## পরিচিত ডেটা সমস্যা

| সমস্যা | বিস্তারিত |
|--------|----------|
| `system_design_workbook.md` corrupt | লাইন ৫ ও ১২-এ বাক্য মাঝপথে কেটে গেছে, পার্ট ১-এর লিংক নেই, পুরনো `docs/` ফোল্ডারের লিংক মিশে আছে |
| Absolute path লিংক | সব index ফাইলে `file:///c:/Users/Sojib Rd/Documents/Projects/...` — এই মেশিনে (`d:/document-files/...`) কাজ করে না |
| index ফাইলের লিংক অনির্ভরযোগ্য | তাই parser লিংক পার্স করবে **না** — সরাসরি ফোল্ডার/ফাইল নাম থেকে structure বানাবে |

## সীমাবদ্ধতা / স্কোপ বাইরে

- Backend/Database নেই — সব localStorage-এ
- Authentication নেই
- Multi-user নয়
- Markdown ফাইল app থেকে **এডিট** করা যাবে না (read-only ডেটা সোর্স)
- Mobile-first নয় (responsive কিন্তু desktop-optimized)
