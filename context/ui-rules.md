# UI Rules — System Design Prep Tracker & Simulator

এই ফাইলে প্রজেক্টের UI/UX নিয়মাবলী, আর্কিটেকচারাল কনভেনশন এবং কম্পোনেন্ট ব্যবহারের নির্দেশিকা আছে।

> **স্ট্যাটাস:** বর্তমান আর্কিটেকচার স্পেসিফিকেশন (Next.js 16.2 App Router, SSG ৬৭ রুট, Turbopack, React 19, `@xyflow/react`, Theme Contract / `control-room.css` dark-only)।

---

## ১. স্থাপত্য নিয়ম (Architecture Rules)

### Server vs Client বিভাজন
- **Server Components** (`app/layout.tsx`, `app/page.tsx`, `app/[...slug]/page.tsx`, `app/progress/page.tsx`, `app/simulation/page.tsx`, `app/simulation/[sim]/page.tsx`):
  - ডেটা লোড ও স্ট্যাটিক জেনারেশন পরিচালনা করে (`app/lib/content.ts`, `generateStaticParams`)।
  - `app/lib/content.ts` সম্পূর্ণ **Server-only** — ক্লায়েন্ট কম্পোনেন্ট থেকে কখনো ইম্পোর্ট করবেন না।
- **Client Components** (`Sidebar.tsx`, `DocTracker.tsx`, `ProgressClient.tsx`, `Markdown.tsx`, `MermaidDiagram.tsx`, `SimulationView.tsx` ইত্যাদি):
  - ইন্টারঅ্যাকটিভ স্টেট, লোকাল স্টোরেজ সিঙ্ক, অ্যানিমেশন এবং React Flow ক্যানভাস পরিচালনা করে।

### State Management
- **UI State** (অ্যাকর্ডিয়ন ওপেন/ক্লোজ, ড্রপডাউন, ফিল্টার, সক্রিয় প্যানেল): `useState`।
- **Persistent State** (পঠিত ডক, রিভাইজ ফ্ল্যাগ, নোট, সাইডবার কল্যাপস): `useLocalStorage` (`useSyncExternalStore` ভিত্তিক SSR-safe কাস্টম হুক)।
- **গ্লোবাল স্টেট লাইব্রেরি** (Redux, Zustand) প্রজেক্টে নিষিদ্ধ — সাইটের শেল ও লোকাল স্টোরেজ হুকই যথেষ্ট।

### Data Flow
- ডেটা ফ্লো একমুখী: `Server Page → Client Component → Sub-components`।
- ডক কনটেন্ট সার্ভার-সাইডে পার্স হয়ে per-route স্ট্যাটিকভাবে সরবরাহ হয় (SSG)।
- সিমুলেটর ডেটা `app/lib/simulations/` থেকে প্রতি রুটের জন্য dynamic import (`loadSimulation`) দিয়ে লোড হয়।

### React 19 & Next.js 16 কনভেনশন
- `useEffect`-এর ভেতর সরাসরি স্টেট সেট করা এড়িয়ে চলুন — লোকাল স্টোরেজের জন্য `useSyncExternalStore` ব্যবহার করুন।
- টাইপ ইম্পোর্টের ক্ষেত্রে সবসময় `import type { ... }` ব্যবহার করুন।

---

## ২. ডিজাইন নিয়ম ও Theme Contract

সাইটের সমস্ত ভিজ্যুয়াল সিদ্ধান্ত **Theme Contract** (`app/globals.css` ও `app/themes/control-room.css`)-এ সংরক্ষিত।

### অলঙ্ঘনীয় কনট্র্যাক্ট
1. **কম্পোনেন্টে কোনো ভিজ্যুয়াল ক্লাস নয়:**
   - কোনো রঙ (`text-zinc-*`, `bg-indigo-*`), কোনো কোণা (`rounded-*`), কোনো শ্যাডো (`shadow-*`), কোনো বর্ডার উইডথ (`border-2`), কোনো কেস (`uppercase`), ট্র্যাকিং (`tracking-*`) বা ফন্ট ওয়েট (`font-bold`) কম্পোনেন্টে বসবে না।
   - এগুলো থিম রোলে (`surface-panel`, `surface-well`, `t-title`, `t-label`, `t-body`, `t-caption`, `t-mono`, `t-strong`, `t-accent`, `t-ok`, `control`, `segment`, `tab`, `chip`, `callout` ইত্যাদি) থাকবে।
2. **Tailwind শুধু লেআউটের জন্য:**
   - `flex`, `grid`, `gap`, `w-`, `h-`, `min-w-`, `min-h-`, `truncate`, `overflow-*`, `p-*`, `m-*` অনুমোদিত।
3. **Hardcoded রঙ কোথাও নয়:**
   - সব রঙ `--t-*` ভেরিয়েবল দ্বারা নিয়ন্ত্রিত।
4. **Dark-only সাইট:**
   - সাইট সম্পূর্ণ Dark-only। `dark:` ভ্যারিয়েন্ট বা `.dark` ক্লাস ব্যবহার করবেন না।

### ফন্ট শেল্ফ (৫ Family)
`app/layout.tsx`-এ লোড হওয়া ৫টি ফন্ট:
- `Barlow Semi Condensed` (`--t-font-sans` — title, label, control)
- `JetBrains Mono` (`--t-font-mono` — readout, code, payload)
- `Noto Sans Bengali` (`--t-doc-family` — reading column, `--t-font-sans` fallback)
- `Archivo` & `Archivo Black` (রিজার্ভ)

---

## ৩. কম্পোনেন্ট ও লেআউট নিয়ম

### Card ও Panel
```tsx
// ✅ সঠিক
<div className="surface-panel p-5 sm:p-6">...</div>
<div className="surface-well p-3">...</div>

// ❌ ভুল — সরাসরি টেইলউইন্ড ভিজ্যুয়াল ক্লাস
<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">...</div>
```

### কন্ট্রোল ও বাটন
```tsx
// ✅ সঠিক — অবস্থা aria attribute-এ, চেহারা থিমে
<button
  type="button"
  aria-pressed={isRead}
  className={`control px-3.5 py-2 text-xs ${isRead ? "control--primary" : ""}`}
>
  {isRead ? <Check size={13} /> : <Circle size={13} />}
  {isRead ? "পঠিত" : "পড়া হয়নি"}
</button>
```

### প্রোগ্রেস অনুপাত (Gauge)
```tsx
// ✅ সঠিক — gauge কতটুকু এবং এর অ্যাক্সেসিবিলিটি
<div
  role="progressbar"
  aria-valuenow={percentage}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-label="সার্বিক সম্পূর্ণতা"
  className="gauge h-3 w-full"
>
  <div className="gauge-fill" style={{ width: `${percentage}%` }} />
</div>
```

---

## ৪. ইন্টারঅ্যাকশন ও ফর্ম নিয়ম

### Form Inputs & Textarea
ইনপুট ও টেক্সটএরিয়াতে সঠিক সেমান্টিক লেবেল এবং `.surface-well` ব্যবহার করুন:
```tsx
// ✅ সঠিক
<div>
  <label htmlFor="doc-summary-input" className="t-label mb-1.5 block">
    মূল শিক্ষণীয় বিষয়
  </label>
  <textarea
    id="doc-summary-input"
    rows={3}
    value={summary}
    onChange={(e) => setSummary(e.target.value)}
    placeholder="প্রধান পয়েন্টগুলো লিখুন..."
    className="surface-well t-body w-full px-3.5 py-2.5 text-xs"
  />
</div>
```

### Empty States
```tsx
// ✅ সঠিক
<div className="surface-panel t-caption p-12 text-center">
  কোনো অধ্যায় এই ফিল্টারে পাওয়া যায়নি।
</div>
```

### Read vs Revise স্টেট
- **Read** (`sd_read_routes`): ডক পড়া হয়েছে কি না তা নির্দেশ করে।
- **Revise** (`sd_revise_routes`): ডকটি পুনরায় রিভিশন তালিকায় রাখা হয়েছে কি না তা নির্দেশ করে।
- দুটো স্বাধীন স্টেট — অপঠিত জটিল টপিকও আগে থেকে রিভিশন/অগ্রাধিকার তালিকায় রাখা যেতে পারে।

### চেকবক্স ও ক্লিক এরিয়া
- চেকবক্স বা অ্যাকশন বাটনের ক্লিক এরিয়া নির্দিষ্ট রাখুন।
- ডক লিংক ও নেভিগেশনে সবসময় `<a>` বা `<button>` ব্যবহার করুন, `<div onClick>` নয়।

---

## ৫. পারফরম্যান্স ও ডেটা লোডিং

1. **Per-Route Static Generation (SSG):** সাইটের ৬৭টি রুট (রোডম্যাপ, ওয়ার্কবুক ও সিমুলেশন) বিল্ড-টাইমে স্ট্যাটিকভাবে জেনারেট হয়।
2. **Chunk Splitting:** প্রতিটি সিমুলেশনের পূর্ণ ডেটা (~১৫০KB+) আলাদা চাঙ্ক হিসেবে dynamic import-এর মাধ্যমে লোড হয়।
3. **Read-Only Data:** `docs/` ও `workbook/` ফাইলগুলো সম্পূর্ণ read-only।

---

## ৬. Accessibility (a11y) নির্দেশিকা

- **Main Landmark:** পেজে কেবল একটিমাত্র `<main id="main-content">` থাকবে (রুট লেআউটে)। সাবভিউ বা সিমুলেটরে `<div role="region">` ব্যবহার করুন।
- **Skip-to-Content:** কীবোর্ড ব্যবহারকারীদের জন্য শুরুতে "মূল কনটেন্টে যান" স্কিপ লিংক থাকবে।
- **Form Controls:** প্রতিটি ইনপুট, টেক্সটএরিয়া ও সিলেক্টে দৃশ্যমান `<label htmlFor="...">` অথবা স্পষ্ট `aria-label` থাকতে হবে।
- **Collapsibles & Accordions:** সেকশন/টপিক টগল বাটনে `aria-expanded` এবং `aria-controls` থাকতে হবে।
- **Progressbars:** প্রতিটি `.gauge`-এ `role="progressbar"`, `aria-valuenow`, `aria-valuemin={0}`, `aria-valuemax={100}`, `aria-label` থাকতে হবে।
- **বাংলা লেবেলিং:** ডকুমেন্টের `lang="bn"` অনুসারে স্ক্রিন রিডার ও কন্ট্রোলের সমস্ত aria-label ও অ্যাকশন টেক্সট বাংলায় হবে।
- **Keyboard Navigation:** সিমুলেশন প্লেব্যাকে কীবোর্ড শর্টকাট (ArrowLeft: পূর্ববর্তী ধাপ, ArrowRight: পরবর্তী ধাপ, Space: প্লে/পজ) কার্যকর থাকতে হবে।

---

## ৭. কী করবেন না (Anti-patterns)

| ❌ করবেন না | ✅ করুন |
|------------|--------|
| Hardcoded hex/rgb color | CSS token (`--t-*`) ও role class |
| ভিজ্যুয়াল স্টাইলিংয়ের জন্য inline `style={{ }}` | Role class (ব্যতিক্রম: SVG অ্যানিমেশন, dynamic gauge width, Mermaid CSS ভেরিয়েবল পাসিং) |
| সরাসরি `localStorage` এক্সেস | `useLocalStorage` কাস্টম হুক |
| অনিবন্ধিত নতুন ফন্ট ইম্পোর্ট | লেআউটে সংজ্ঞায়িত ৫-ফন্ট শেল্ফ |
| `dark:` ভ্যারিয়েন্ট বা `.dark` ক্লাস | Dark-only theme contract (`control-room.css`) |
| Nested `<main>` landmark | ডকুমেন্টে একটাই `<main>`, ভেতরে `role="region"` |
| লেবেল ছাড়া ইনপুট/সিলেক্ট | `htmlFor` + `id` অথবা `aria-label` যুক্ত কন্ট্রোল |
