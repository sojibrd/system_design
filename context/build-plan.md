# Build Plan — System Design Prep Tracker

## বর্তমান অবস্থা

**ফেজ ০ ও ফেজ ১ সম্পূর্ণ।** `next build` পাস করে, ৩৫টা ডক পার্স হয়।
বিস্তারিত ও বাকি কাজের তালিকা `progress-tracker.md`-এ।

Markdown রেন্ডারিংও হয়ে গেছে (`react-markdown` + `remark-gfm`)।
`next build` ও `eslint` দুটোই clean।

পরের ধাপ: ব্রাউজারে চোখে দেখে যাচাই, তারপর ফেজ ২ — search/filter ও interview drill mode।

---

## ফেজ ০ — ভিত্তি ✅ সম্পূর্ণ

| # | কাজ | বিস্তারিত |
|---|-----|----------|
| 1 | **Next.js scaffold** | ⚠️ পরিকল্পনা ছিল Next 15, বাস্তবে **Next 16.2.11** + React 19.2 (Turbopack)। App Router, TypeScript, Tailwind v4, Geist font |
| 2 | **`globals.css` টোকেন** | `ui-tokens.md`-এর CSS custom properties + `.glass-panel` |
| 3 | **`useLocalStorage.ts`** | DSA Prep-এর হুবহু একই hook |
| 4 | **`workbookParser.ts`** | Directory walk → `Part[]`; index ফাইলের লিংক পার্স করবে **না** |
| 5 | **`page.tsx` + `TrackerClient.tsx`** | Server/Client বিভাজন |

### `workbookParser.ts` — পার্সিং কৌশল

index ফাইলের লিংকগুলো ভাঙা ও absolute path (দেখুন `project-overview.md`), তাই:

1. `context/system_design_workbook/` ফোল্ডারে `readdirSync` করুন
2. `N. Name.md` প্যাটার্নের ফাইল → **Part**; তার heading থেকে বাংলা `title` নিন
3. একই নামের ফোল্ডারে ঢুকে `N.M Name.md` → **Chapter**; heading থেকে `title`
4. একই নামের ফোল্ডারে ঢুকে `N.M.K Name.md` → **Doc**; পুরো body হলো কনটেন্ট
5. Sort করুন numeric prefix ধরে (`1.10` যেন `1.2`-এর আগে না আসে)

---

## ফেজ ১ — MVP ✅ সম্পূর্ণ (Markdown রেন্ডারিং বাদে)

| # | ফিচার | বিস্তারিত |
|---|-------|----------|
| 6 | **Navbar** | Logo + overall progress pill + dark mode toggle |
| 7 | **Sidebar** | Part list → Chapter buttons + per-part progress counter |
| 8 | **Doc Panel** | Selected chapter-এর docs — Markdown রেন্ডার |
| 9 | **Read checkbox** | পড়া হয়েছে toggle → localStorage persist |
| 10 | **Notes** | Per-doc expandable — "নিজের ভাষায় সারাংশ" + "যেটা এখনো পরিষ্কার নয়" |
| 11 | **Dark/Light mode** | localStorage persist |
| 12 | **Progress bar** | Overall + per-part |
| 13 | **Mobile drawer** | Hamburger + slide-in sidebar (DSA Prep-এ যেভাবে হয়েছে) |

---

## ফেজ ২ — উন্নতি

### ২.১ পড়াশোনার ফিচার (Priority: High)

| # | ফিচার | বিস্তারিত |
|---|-------|----------|
| 14 | **🔄 রিভাইজ দরকার flag** | পড়া হলেও "আবার দেখতে হবে" মার্ক; আলাদা filter |
| 15 | **Search / Filter** | Doc বা chapter নাম দিয়ে search |
| 16 | **Filter by status** | "শুধু unread" / "শুধু রিভাইজ দরকার" toggle |
| 17 | **Interview drill mode** | রিভাইজ-মার্ক করা ডকগুলো একটার পর একটা দেখানো |
| 18 | **Keyboard navigation** | `j/k` দিয়ে chapter switch, `Enter` দিয়ে expand |

### ২.২ Data ফিচার (Priority: Medium)

| # | ফিচার | বিস্তারিত |
|---|-------|----------|
| 19 | **Export/Import progress** | JSON ডাউনলোড ও রিস্টোর |
| 20 | **Read date tracking** | কোন ডক কবে পড়া হয়েছিল |
| 21 | **Spaced repetition** | X দিন পর revisit suggest |

### ২.৩ UI Polish (Priority: Low)

| # | ফিচার | বিস্তারিত |
|---|-------|----------|
| ~~22~~ | ~~**Markdown রেন্ডারিং**~~ | ✅ সম্পূর্ণ — `react-markdown` + `remark-gfm`, `app/DocContent.tsx` |
| 23 | **Syntax highlighting** | code block-এ Prism.js বা Shiki |
| 24 | **Confetti** | কোনো part 100% পড়া হলে |
| 25 | **Metadata** | Title ("System Design Workbook"), favicon, og:image |

---

## ফেজ ৩ — ভবিষ্যৎ (Optional)

- ~~**Diagram রেন্ডারিং** — Mermaid দিয়ে আর্কিটেকচার ডায়াগ্রাম~~ ✅ রেন্ডারার সম্পূর্ণ (`app/MermaidDiagram.tsx`)। কনটেন্ট কাজ চলছে — ধাপ ২: পার্ট ৬-এর ১১টা case study, ধাপ ৩: বাকি ২২টা concept ডক
- **নিজের কেস স্টাডি যোগ** — workbook-এর বাইরে custom doc
- **Reading timer** — কোন ডকে কত সময় গেল

---

## ⚠️ ডেটা পরিচ্ছন্নতা (কোড লেখার সমান্তরালে)

| # | কাজ | কেন |
|---|-----|-----|
| A | `system_design_workbook.md` ঠিক করা | লাইন ৫ ও ১২ corrupt, পার্ট ১-এর লিংক নেই |
| B | absolute path → relative | সব index ফাইলে `file:///c:/Users/Sojib Rd/...` এই মেশিনে ভাঙা |

> parser এই লিংকগুলোর উপর নির্ভর করে না, তাই এটা app-কে ব্লক করে না — কিন্তু ফাইলগুলো এডিটরে সরাসরি পড়ার সময় বিরক্তিকর।

---

## কাজের নিয়ম

### নতুন ফিচার যোগ করার আগে:
1. `progress-tracker.md` দেখুন — কী বাকি আছে
2. `ui-registry.md` দেখুন — বিদ্যমান কম্পোনেন্ট কী কী আছে
3. `ui-tokens.md` দেখুন — কোন color/spacing ব্যবহার করতে হবে
4. `ui-rules.md` দেখুন — কোন প্যাটার্ন ফলো করতে হবে

### কোড পরিবর্তনের পর:
- `progress-tracker.md` আপডেট করুন
- `ui-registry.md` আপডেট করুন (নতুন component যোগ হলে)
