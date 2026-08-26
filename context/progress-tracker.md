# Progress Tracker — System Design Prep Tracker

_সর্বশেষ আপডেট: ২০২৬-০৭-৩০_

---

## ✅ সম্পন্ন কাজ

### ফেজ ০ — ভিত্তি (সম্পূর্ণ)
- [x] Next.js **16.2.11** + React 19.2 + TypeScript + Tailwind v4 scaffold (Turbopack)
- [x] Geist Sans + Geist Mono (`next/font/google`)
- [x] `app/globals.css` — সব design token, `@custom-variant dark`, `.glass-panel`, `.glass-glow`, `animate-slide-in-left`, scrollbar
- [x] `app/layout.tsx` — metadata ("System Design Workbook"), `lang="bn"`, dark-mode FOUC script
- [x] `app/hooks/useLocalStorage.ts` — SSR-safe, hydration mismatch এড়ায়
- [x] `app/utils/workbookParser.ts` — nested directory walk, numeric sort, per-file error skip
- [x] `app/page.tsx` (Server) + `app/TrackerClient.tsx` (Client)
- [x] `npx next build` পাস — ৩৫টা ডক পার্স হয়েছে, ১৭টা চ্যাপ্টার sidebar-এ রেন্ডার হয়
- [x] `npx eslint app` clean (Next 16-এর নতুন react-hooks rule দুবার ধরেছিল, দুটোই ঠিক করা)

### Markdown রেন্ডারিং (সম্পূর্ণ)
- [x] `react-markdown` ^10.1.0 + `remark-gfm` ^4.0.1 ইনস্টল
- [x] `app/DocContent.tsx` — সব element নিজেদের টোকেন দিয়ে স্টাইল করা (prose প্লাগইন নয়)
- [x] টেবিল `overflow-x-auto` wrapper-এ — চওড়া টেবিল পেজ scroll করায় না
- [x] SSR render টেস্টে যাচাই — `<table>`, `<th>`, `<li>` ঠিকমতো তৈরি হয়

### Mermaid ডায়াগ্রাম — ধাপ ১ (রেন্ডারার + ২টা নমুনা)
- [x] `mermaid` ^11.16.0 ইনস্টল; `jsdom` devDependency (শুধু ডায়াগ্রাম যাচাইয়ের জন্য)
- [x] `app/MermaidDiagram.tsx` — dynamic import, dark-mode aware, per-diagram error isolation
- [x] `DocContent.tsx`-এর `pre` handler ```mermaid fence ধরে
- [x] `scripts/check-diagrams.mjs` + `npm run check:diagrams` — সব mermaid ব্লক পার্স করে দেখে
- [x] `6.2.3 Facebook Like Button HLD.md` — HLD flowchart + LLD sequence + ER (৩টা)
- [x] `3.1.1 8 Types of Caching.md` — concept flowchart (১টা)
- [x] `next build`, `tsc --noEmit`, `eslint app`, `check:diagrams` — চারটাই clean (৪/৪ ডায়াগ্রাম পার্স হয়)
- [ ] **ব্রাউজারে চোখে দেখে যাচাই** — ডায়াগ্রাম রেন্ডার, dark mode toggle, মোবাইলে scroll

### Mermaid ডায়াগ্রাম — ধাপ ২ (পার্ট ৬, ১১টা case study) ✅ সম্পূর্ণ
- [x] 6.1.1 WhatsApp Works — HLD flow + sequence (message lifecycle)
- [x] 6.1.2 WhatsApp Architecture — HLD component + sequence (online/offline alt)
- [x] 6.1.3 Coffee Shop — HLD + ER + state diagram
- [x] 6.2.1 YouTube — HLD (upload/playback split) + sequence (async transcode)
- [x] 6.2.2 Instagram — HLD (read/write split) + flowchart (fan-out write vs read)
- [x] 6.2.3 Facebook Like Button — HLD + sequence + ER (ধাপ ১-এ)
- [x] 6.3.1 Google Drive — HLD (pre-signed URL) + ER
- [x] 6.3.2 Twitter Search — HLD (hot/warm/cold) + sequence (CDC double-write)
- [x] 6.3.3 URL Shortener — HLD (read-heavy) + flowchart (cache hit/miss)
- [x] 6.4.1 24 Companies — mindmap (domain→company), roundup তাই HLD/LLD নয়
- [x] 6.4.2 12 Companies — mindmap (pattern→company), roundup তাই HLD/LLD নয়
- [x] ২৩টা ডায়াগ্রাম `check:diagrams` পাস, `next build` clean

### Mermaid ডায়াগ্রাম — ধাপ ৩ (পার্ট ১-৫, ২২টা concept ডক) ✅ সম্পূর্ণ
- [x] পার্ট ১ Networking (৬): URL parts, browser flow, protocol layers, SSH sequence, comm styles, concurrency
- [x] পার্ট ২ Architecture (৯): mono/micro/serverless, blast radius, patterns mindmap, scaling flow, 1K/1M/10M, scale ladder, tech stack, HLD/LLD, LLD roadmap
- [x] পার্ট ৩ Databases (২): DB decision tree, sharding mindmap (3.1.1 ধাপ ১-এ)
- [x] পার্ট ৪ Security (৩): password attacks (2 দল), cyber attacks mindmap, CI/CD gates
- [x] পার্ট ৫ Advanced (৩): ML lifecycle (retrain loop), roadmap phases, key concepts mindmap
- [x] **মোট ৪৬টা ডায়াগ্রাম** `check:diagrams` পাস, `next build` clean — ৩৫টা ডকের সবকটিতে অন্তত একটি ডায়াগ্রাম

**নিয়ম যেগুলো ধাপ ২/৩-এ মানতে হবে:** case study ডকে `## High-Level Design` + `## Low-Level Design`; concept ডকে উপরের দিকে একটা diagram; প্রতিটার নিচে ২-৪ লাইন বাংলা ব্যাখ্যা; সর্বোচ্চ ~১২ নোড; প্রতিটা যোগ করা ডায়াগ্রামে `> 📐 ডায়াগ্রাম — নিজের বোঝার জন্য যোগ করা` মার্কার; বিদ্যমান ASCII ফ্লো ছোঁয়া হবে না।

### ফেজ ১ — MVP (সম্পূর্ণ, Markdown রেন্ডারিং বাদে)
- [x] Navbar — logo + gradient title + progress pill + dark mode toggle + hamburger
- [x] Sidebar — Part list, chapter buttons, per-part ও per-chapter counter
- [x] Mobile drawer — slide-in, overlay, body scroll lock, select করলে auto-close
- [x] Mobile progress dashboard
- [x] ChapterPanel — breadcrumb + বাংলা title + doc list
- [x] DocCard — read checkbox, doc ID, source, status badge (✅/🔄/⚪), revise toggle, expand
- [x] "পড়া হয়েছে" → `sd_read_ids`; unread করলে revise flag-ও মুছে যায়
- [x] "🔄 রিভাইজ দরকার" → `sd_revise_ids`; না-পড়া ডকে বাটন disabled
- [x] Per-doc notes (সারাংশ + অস্পষ্ট বিষয়) → `sd_doc_notes`
- [x] Dark/Light mode → `sd_dark_mode`
- [x] Overall + per-part + per-chapter progress

### Content / ডেটা সোর্স
- [x] `context/system_design_workbook/` — ৬ পার্ট, ১৭ চ্যাপ্টার, ৩৫ ডক
- [x] প্রতিটা পার্ট ও চ্যাপ্টারের index ফাইল (বাংলা heading সহ)
- [x] `AGENTS.md` — এজেন্ট নিয়মাবলী

### Mobile Responsive Polish & UX Audit (সম্পূর্ণ)
- [x] `Sidebar drawer` — মোবাইলে split লেআউট বদলে ফিক্সড স্লাইড-ওভার ড্রয়ার (`fixed inset-y-0 left-0 z-50 w-[85%] max-w-sm`) + ব্যাকড্রপ ওভারলে + `Escape` কি ও ক্লিক-আউটসাইড ডিসমিসাল
- [x] `Sidebar search & links` — সার্চ ইনপুটে iOS Safari auto-zoom রোধে `text-sm sm:text-xs` এবং সূচিপত্রের সব আইটেমে টাচ টার্গেট বাড়ানো (`py-2 sm:py-1.5`)
- [x] `DocTracker` — অ্যাকশন বাটনগুলোতে আরামদায়ক টাচ টার্গেট (`min-h-10 sm:min-h-0`) এবং টেক্সটএরিয়ায় রেসপনসিভ ফন্ট সাইজ
- [x] `ProgressClient` — সেগমেন্ট গ্রুপে মসৃণ হরাইজন্টাল স্ক্রলিং (`flex-nowrap overflow-x-auto`), অ্যাকশন বাটনে `flex-wrap sm:flex-nowrap` ও মিনিমাম টাচ হাইট

### Context ফাইল
- [x] `project-overview.md` — লক্ষ্য, স্ট্যাক, ডেটা কাঠামো, ডেটা মডেল
- [x] `build-plan.md` — ফেজ ০–৩ রোডম্যাপ
- [x] `progress-tracker.md` — (এই ফাইল)
- [x] `ui-tokens.md` — target ডিজাইন টোকেন
- [x] `ui-rules.md` — target UI/UX নিয়ম
- [x] `ui-registry.md` — কম্পোনেন্ট রেজিস্ট্রি (এখনো ফাঁকা, app হলে ভরবে)

---

## 🔄 বর্তমানে চলমান

_কিছু নেই — ফেজ ০ ও ফেজ ১ সম্পূর্ণ। `next build` পাস, `next dev` চলে (Ready in 359ms, `GET / 200`, log-এ কোনো error/warning নেই)।
ব্রাউজারে **চোখে দেখে** যাচাই এখনো বাকি — dark mode toggle, mobile drawer, localStorage persist, hydration warning।_

---

## ⏳ বাকি কাজ

### সবচেয়ে জরুরি
- [ ] **ব্রাউজারে চোখে দেখে যাচাই** — dark mode toggle, mobile drawer, localStorage persist, hydration warning। সার্ভার-সাইড সব clean, কিন্তু আসল ব্রাউজারে দেখা হয়নি

### ফেজ ২ — High Priority
- [ ] Revise-only / unread-only filter (flag নিজে হয়ে গেছে, filter বাকি)
- [ ] Search / Filter
- [ ] Filter by status (unread / রিভাইজ দরকার)
- [ ] Interview drill mode
- [ ] Keyboard navigation

### ফেজ ২ — Medium / Low
- [ ] Export / Import progress (JSON)
- [ ] Read date tracking
- [ ] Spaced repetition
- [ ] Syntax highlighting
- [ ] Confetti
- [x] App metadata (title + description) ✅
- [ ] Favicon (এখনো Next.js-এর default)

---

## 🐛 পরিচিত সমস্যা / টেকনিক্যাল ঋণ

| সমস্যা | প্রভাব | সমাধানের পথ |
|--------|--------|------------|
| `system_design_workbook.md` লাইন ৫ ও ১২ corrupt — বাক্য মাঝপথে কেটে গেছে | root index ফাইলটা পড়ার অযোগ্য; পার্ট ১-এর লিংক নেই | ফাইলটা নতুন করে লিখুন (৬ পার্টের পরিষ্কার তালিকা) |
| সব index ফাইলে `file:///c:/Users/Sojib Rd/Documents/Projects/...` absolute path | এই মেশিনে (`d:/document-files/...`) লিংক ভাঙা | relative path-এ রূপান্তর |
| root index-এ পুরনো `context/docs/` ফোল্ডারের লিংক | সেই ফোল্ডার আর নেই — সব `system_design_workbook/`-এ সরানো হয়েছে | পুরনো লিংক মুছুন |
| `AGENTS.md`-এর context লিংক `DSA_Prep/`-এ পয়েন্ট করত | এজেন্ট ভুল প্রজেক্টের context পড়ত | ✅ সমাধান হয়েছে — এই প্রজেক্টের পাথে আপডেট |
| ~~ডকের নাম চেকবক্সের `<label>`-এর ভেতরে ছিল~~ | ~~নামে ক্লিক করলেই "পড়া হয়েছে" toggle হতো — নীরবে progress ডেটা নষ্ট~~ | ✅ সমাধান হয়েছে — নাম এখন আলাদা `<button>`, ক্লিকে ডক খোলে। নিয়ম `ui-rules.md` §৪-এ |

---

## 📊 System Design পড়াশোনার অগ্রগতি

| পার্ট | চ্যাপ্টার | ডক | পড়া | অবস্থা |
|------|----------|-----|------|--------|
| 1. Networking basics | 4 | 6 | 0 | 🔴 শুরু হয়নি |
| 2. System Architecture & Scaling | 3 | 6 | 0 | 🔴 শুরু হয়নি |
| 3. Data & Speed Up | 2 | 3 | 0 | 🔴 শুরু হয়নি |
| 4. Security & Pipelines | 2 | 3 | 0 | 🔴 শুরু হয়নি |
| 5. Advanced & AI | 2 | 3 | 0 | 🔴 শুরু হয়নি |
| 6. Case Studies | 4 | 11 | 0 | 🔴 শুরু হয়নি |
| **মোট** | **17** | **35** | **0** | **0%** |

> এই টেবিল ম্যানুয়ালি আপডেট করুন অথবা app তৈরি হলে UI থেকে দেখুন।

---

## সিমুলেটর merge + control-room রূপান্তর (২০২৬-০৮-১৯)

`system_design_simulation` প্রজেক্ট এই রিপোতে মিশিয়ে দেওয়া হয়েছে, এবং পুরো সাইট control-room design system-এ রূপান্তরিত।

### কী হয়েছে
- [x] সিমুলেটরের সব কোড কপি — `app/simulation/`, `app/components/simulation/`, `app/components/ui/`, `app/lib/simulations/`, `app/lib/types.ts`, `useSimulation` / `useThemeNumber` / `useMediaQuery`
- [x] `@xyflow/react` + `lucide-react` যোগ; `@tailwindcss/typography` বাদ (আর ব্যবহার হয় না)
- [x] `app/globals.css` = theme contract (role class) + নতুন `.doc-prose` ও `.gauge` ব্লক
- [x] `app/themes/control-room.css` — নতুন `--t-doc-*`, `--t-gauge-*`, `--t-diagram-*` টোকেন; `--t-font-sans`-এ Bengali fallback
- [x] ফন্ট শেল্ফ ৫ family (Archivo, Archivo Black, Barlow Semi Condensed, JetBrains Mono, Noto Sans Bengali)
- [x] শেল পুনর্গঠন — `h-dvh overflow-hidden`, sidebar ও main আলাদা scroll; `/simulation/` `h-full` নেয়
- [x] সব SD কম্পোনেন্ট role class-এ: `Sidebar`, `DocArticle`, `Markdown`, `MermaidDiagram`, `DocTracker`, `ProgressClient`, `page.tsx`, `layout.tsx`
- [x] সাইডবার desktop-এ collapse করা যায় (`sd_nav_collapsed`)
- [x] `MermaidDiagram` — dark-mode observer বাদ, এখন `--t-diagram-*` পড়ে `themeVariables` বানায়
- [x] `npm run build` (৬৫ রুট), `npm run lint`, `npm run check:diagrams` (৪৬/৪৬) — তিনটাই পাস

### সচেতন সিদ্ধান্ত
- সাইট **dark-only** — control-room-এ light mode নেই; `dark:` variant ও theme script সম্পূর্ণ বাদ
- পুরো সাইট control-room টাইপোগ্রাফিতে, doc body-সহ (ডেভেলপারের সিদ্ধান্ত)
- `.doc-prose` কনট্র্যাক্টের একমাত্র raw-element ব্যতিক্রম — Markdown-এ role class বসানোর কম্পোনেন্ট নেই

### বাকি
- [ ] `system_design_simulation` রিপো ও তার GitHub Pages সাইট অবসর দেওয়া (কোড কপি হয়েছে, git history আসেনি)

### সিমুলেটর রাউটিং (২০২৬-০৮-১৯, পরের ধাপ)

- [x] `app/simulation/[sim]/page.tsx` — `generateStaticParams`, `dynamicParams = false`, per-route metadata
- [x] `app/simulation/page.tsx` — ডিফল্ট সিমুলেশন (static export-এ redirect সম্ভব নয়, তাই মেনু নয়, সরাসরি প্রথমটি)
- [x] UI `app/components/simulation/SimulationView.tsx`-এ সরানো; সিমুলেশন নির্বাচন এখন `router.push`, `useState` নয়
- [x] `SimulationSummary` টাইপ + `simulationIndex` / `loadSimulation` — picker নাম পায়, রুট শুধু নিজের ডেটা লোড করে (per-sim chunk)
- [x] মোবাইলে সিমুলেটরের ident লুকানো; picker থাকে
- [x] build ৬৬ রুট, lint clean

### দ্বিতীয় সিমুলেশন — Rate Limiter (২০২৬-০৮-২০)

- [x] `app/lib/simulations/rate-limiter/` — ৩ লেভেল, ২৭ ধাপ, ১২টি trade-off (প্রতি লেভেলে ৪টি)
  - functional: fixed window, in-memory counter, 429 + Retry-After (৩ node)
  - scalable: LB + ৩ সার্ভার + Redis, atomic INCR/Lua, sliding window counter (৭ node)
  - reliable: token bucket lease, Redis replica + Sentinel, fail-open নীতি, hot key sharding (৮ node)
- [x] নতুন flow: `allowed`, `throttled`, `limiter-down` — `FlowKind`/`FlowIcon` union, `flowIcons`, `flowBadge` map-এ যোগ
- [x] রেজিস্ট্রিতে দুই লাইন — রুট `/simulation/rate-limiter/` নিজে থেকেই তৈরি, picker স্বয়ংক্রিয়ভাবে dropdown হয়ে গেছে
- [x] `scripts/check-simulations.mjs` + `npm run check:simulations` — step-এর node/edge রেফারেন্স, flowType মিল ও `componentCount` যাচাই করে (এটাই `componentCount` ভুল ধরেছিল)
- [x] ডেটা ফাইলগুলো `import type`-এ — Node-এর type stripping দিয়ে স্ক্রিপ্ট চালানোর জন্য দরকারি, এবং এটাই সঠিক রূপ

### Workbook অপসারণ (২০২৬-০৮-২৬)

- [x] `workbook/` ফোল্ডার (৬ Part → ১৭ Chapter → ৩৫ টপিক) ডিস্ক থেকে ডিলিট
- [x] `app/lib/content.ts` — workbook nav-বিল্ড, `NavTree.workbook`, `NavPart`/`NavChapter` টাইপ বাদ; `Doc.section` ফিল্ড রাখা (রুট ডেরাইভেশনে ব্যবহৃত)
- [x] `Sidebar.tsx` — Workbook সেকশন, `workbookOpen`/`userToggles` state, `activeKeys`/`isSectionOpen`/`toggleOpen`, part/chapter ফিল্টার সরানো; সাইডবারে এখন শুধু Roadmap তালিকা
- [x] `DocArticle.tsx` — `isWorkbook` ব্যাজ সরিয়ে স্থির "Roadmap · কোর আর্কিটেকচার"
- [x] `progress/` — Workbook সেকশন ও filter option বাদ, একটাই সেকশন
- [x] `scripts/check-diagrams.mjs` — `DIRS` থেকে `workbook` বাদ
- [x] README, AGENTS.md (প্রজেক্ট ও root), ui-registry, ui-rules আপডেট
- [x] build ৩২ রুট (২৫ docs + / + /progress + /simulation ×৩ + 404), lint ও tsc clean
- ⚠️ localStorage-এ পুরনো workbook progress/notes key orphan থেকে গেছে — মাইগ্রেট করা হয়নি
- [x] রিভিউ-পরবর্তী ফলো-আপ: `layout.tsx` metadata (title/description) থেকে "ওয়ার্কবুক" সরানো, `ui-tokens.md` ও `ui-registry.md`-এর বাসি বর্ণনা ঠিক করা
- [x] `/progress` — মৃত সেকশন-ফিল্টার dropdown, এক-সেকশনের per-section breakdown, ধ্রুবক "Roadmap" chip ও `ProgressSectionData` টাইপ সরানো; `page.tsx` এখন শুধু `allDocs` পাঠায়
- [x] `ProgressClient` — মাউন্টে একবার orphan localStorage রুট prune (ছাঁটার মতো কিছু না থাকলে storage-এ লেখা হয় না)
- [x] `Doc.section` টাইপ `"docs" | string` → `string` (আগের union কার্যত `string`-এই widen হতো)
- [x] সাইডবার অ্যাকর্ডিয়ন সরানো — হেডার বাটন, chevron ও `roadmapOpen` state বাদ; রোডম্যাপ তালিকা এখন সবসময় দৃশ্যমান। সাথে অব্যবহৃত `NavTree.roadmap.title` ফিল্ডও বাদ

