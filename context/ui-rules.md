# UI Rules — System Design Prep Tracker

এই ফাইলে প্রজেক্টের UI/UX নিয়মাবলী এবং কম্পোনেন্ট তৈরির নির্দেশিকা আছে।
নতুন কম্পোনেন্ট বা ফিচার যোগ করার আগে এই নিয়মগুলো মেনে চলুন।

> **স্ট্যাটাস: target spec.** app এখনো তৈরি হয়নি — এগুলো কোড লেখার সময় মানার নিয়ম, বিদ্যমান কোডের বর্ণনা নয়।

---

## ১. স্থাপত্য নিয়ম (Architecture Rules)

### Server vs Client
- **Server Component** (`page.tsx`) — শুধু ডেটা ফেচ করবে (`parseWorkbook()`)
- **Client Component** (`TrackerClient.tsx`) — সব UI লজিক, state, event handler
- নতুন ফিচার যোগ করলে: Client state থাকলে Client Component-এ, pure display হলে Server-এ

### State Management
- **UI state** (selected chapter, expanded doc): `useState`
- **Persistent state** (read, revise, notes, dark mode): `useLocalStorage` hook
- Global state management (Redux, Zustand) ব্যবহার করবেন **না** — এই প্রজেক্টে দরকার নেই

### React Compiler (Next 16)
Next 16-এ React Compiler চালু, তাই:
- **হাতে `useMemo` / `useCallback` লিখবেন না** — কম্পাইলার নিজেই memoize করে। হাতে লিখলে `react-hooks/preserve-manual-memoization` lint error দেয়
- **`useEffect`-এর ভেতর `setState` করবেন না** — `react-hooks/set-state-in-effect` error দেয়। external system (localStorage ইত্যাদি) পড়তে `useSyncExternalStore` ব্যবহার করুন
- কোড লেখার পর `npx eslint app` চালান — build পাস করলেও lint ধরতে পারে

### Data Flow
- Props শুধু নিচের দিকে যাবে: `page.tsx → TrackerClient → (sub-components)`
- Sub-component থেকে parent-এ callback prop দিয়ে communicate করুন
- Context API ব্যবহার করার আগে ভাবুন — সত্যিই দরকার?

### ডেটা সোর্স নিয়ম (এই প্রজেক্টের নিজস্ব)
- Workbook ফাইল **read-only** — app থেকে কখনো `.md` লিখবেন না
- Parser **index ফাইলের লিংক পার্স করবে না** — লিংকগুলো ভাঙা ও absolute path (দেখুন `project-overview.md`)। structure আসবে ফোল্ডার/ফাইল নাম থেকে
- Sort সবসময় **numeric prefix** ধরে, alphabetical নয় (`1.10` যেন `1.2`-এর আগে না আসে)
- কোনো ফাইল পার্স করতে ব্যর্থ হলে পুরো build ভাঙবে না — সেই ডক skip করে console-এ warn দিন

---

## ২. ডিজাইন নিয়ম (Design Rules)

সাইটের সব ভিজ্যুয়াল সিদ্ধান্ত **theme contract**-এ। পূর্ণ তালিকা `ui-tokens.md`-এ; এখানে শুধু নিয়ম।

### অলঙ্ঘনীয়
- কম্পোনেন্টে **কোনো** ভিজ্যুয়াল ক্লাস নয় — রঙ, `rounded-*`, `shadow-*`, `border-*`, `uppercase`, `tracking-*`, `font-bold` কিছুই না
- Tailwind **শুধু লেআউট** — `flex`, `grid`, `gap`, `w-`, `min-h-`, `truncate`, `overflow-*`
- hardcoded hex/rgb কোথাও নয় — `--t-*` টোকেন ছাড়া রঙের কোনো উৎস নেই
- নতুন ভিজ্যুয়াল দরকার হলে **আগে** কনট্র্যাক্টে role class + টোকেন, **তারপর** থিম ফাইলে মান

### Dark mode
সাইট **dark-only**। `dark:` variant, `.dark` ক্লাস বা theme toggle **নেই** — লিখবেন না। light চাইলে সেটা একটা নতুন থিম ফাইল।

### Long-form কনটেন্ট
- Markdown-এর জন্য একমাত্র র‍্যাপার `.doc-prose` — `Markdown.tsx` কোনো element স্টাইল করে না
- heading/table/code/quote-এর চেহারা `--t-doc-*` টোকেনে; বদলাতে হলে থিম ফাইল এডিট করুন, কম্পোনেন্ট নয়
- পড়ার কলাম বাংলায় Noto Sans Bengali-তে, স্বাভাবিক case ও `1.85` leading — instrument chrome-এর uppercase/condensed ভাষা লেবেল ও কন্ট্রোলের জন্য, বডি টেক্সটের জন্য নয়

### Responsive
- Desktop first, তবে `sm:` `md:` `lg:` breakdown বাধ্যতামূলক
- Sidebar: mobile-এ top bar + toggle, desktop-এ `md:w-80` স্থায়ী র‍্যাক
- শেল `h-dvh overflow-hidden` — sidebar ও main আলাদা scroll করে; `/simulation/` তাই `h-full` নেয়

---

## ৩. কম্পোনেন্ট নিয়ম (Component Rules)

### Card / Panel
```tsx
// ✅ সঠিক
<div className="surface-panel p-6">...</div>

// ❌ ভুল
<div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">...</div>
```

### Status — অবস্থা attribute-এ, চেহারা থিমে
```tsx
// ✅ সঠিক
<button aria-pressed={isRead} className={`control px-3 py-2 text-xs ${isRead ? "control--primary" : ""}`}>
  {isRead ? <Check size={13} /> : <Circle size={13} />}
  {isRead ? "পঠিত" : "পড়া হয়নি"}
</button>

// ❌ ভুল — কম্পোনেন্ট ঠিক করছে "on" দেখতে কেমন
<button className={isRead ? "bg-emerald-500/15 text-emerald-400" : "bg-zinc-800"}>
```

### লিস্ট আইটেম ও ট্যাব
```tsx
<Link aria-current={active ? "true" : undefined} className="row block px-2.5 py-1.5 text-xs">…</Link>
<button aria-selected={selected} className="tab px-3 py-2">…</button>
<button aria-pressed={selected} className="segment text-xs">…</button>
```

### অনুপাত দেখানো
```tsx
// ✅ gauge — "কতটুকু"
<div className="gauge h-3 w-full"><div className="gauge-fill" style={{ width: `${pct}%` }} /></div>

// progress-mark — "কোথায়" (ধাপের ক্রমে); দুটো এক জিনিস নয়
```

### আইকন
`lucide-react` ব্যবহার করুন, ইমোজি নয় — ইমোজি নিজের রঙ নিয়ে আসে, যা থিমের নিয়ন্ত্রণের বাইরে।
---

## ৪. ইন্টারঅ্যাকশন নিয়ম (Interaction Rules)

### Hover Effects
- সব ক্লিকযোগ্য element-এ `transition-colors` বা `transition-all`
- Link/button hover: color shift বা subtle background change
- Scale effect শুধু icon/badge-এ: `hover:scale-105`

### ⚠️ চেকবক্সের `<label>` কখনো অন্য ক্লিকযোগ্য কনটেন্ট ঘিরবে না

একবার এই বাগ হয়ে গেছে — ডকের নাম চেকবক্সের `<label>`-এর ভেতরে ছিল, তাই নামে
ক্লিক করলেই "পড়া হয়েছে" toggle হয়ে যেত। ব্যবহারকারী পড়তে চেয়ে ক্লিক করে
নীরবে নিজের progress ডেটা নষ্ট করত।

```tsx
// ❌ ভুল — নামে ক্লিক করলেই চেকবক্স toggle হয়
<label>
  <input type="checkbox" ... />
  <span>{doc.name}</span>
</label>

// ✅ সঠিক — আলাদা ক্লিক-এলাকা, নাম নিজেই একটা button
<div className="flex items-start gap-3">
  <input type="checkbox" aria-label={`${doc.name} — পড়া হয়েছে`} ... />
  <button type="button" onClick={onToggleExpand} aria-expanded={isExpanded}>
    {doc.name}
  </button>
</div>
```

**সাধারণ নিয়ম:** ধ্বংসাত্মক বা persist-হওয়া action-এর ক্লিক-টার্গেট **ছোট ও
নির্দিষ্ট** হবে; নিরাপদ action-এর (expand/collapse) টার্গেট বড় হতে পারে।
ভুল ক্লিকের শাস্তি যেন হালকা হয়।

**ক্লিকযোগ্য টেক্সট সবসময় `<button>` বা `<a>`** — `<div onClick>` নয়, নাহলে
কীবোর্ড ও স্ক্রিন রিডারে কাজ করে না (§৬)।

### Expand/Collapse
- Notes section: `expandedDocId === doc.id` pattern
- একটাই expand হবে একসাথে (single expand)
- খোলা যায় দুই জায়গা থেকে: ডকের নাম, আর ডান পাশের toggle বাটন
- Toggle label পরিবর্তন: expanded হলে "Collapse ▲", না হলে "পড়ুন / নোট ▼"
- **ডক খোলা মানে "পড়া হয়েছে" নয়** — auto-mark করবেন না। তাহলে ঠিক সেই
  অনিচ্ছাকৃত-মার্কিং সমস্যাই নতুন মোড়কে ফিরে আসে। টিক দেওয়া সচেতন সিদ্ধান্ত।

### Read vs Revise (দুটো আলাদা state)
- **Read** — checkbox, একবার পড়া হলেই টিক
- **Revise** — আলাদা 🔄 বাটন, "পড়েছি কিন্তু আবার দেখতে হবে"
- দুটো একসাথে true হতে পারে — এটা ভুল নয়, ইন্টারভিউয়ের আগে এটাই কাজের তথ্য
- Read false হলে Revise বাটন disabled — না পড়া জিনিস রিভাইজ করার প্রশ্ন নেই

### Loading/Empty States
- Chapter সিলেক্ট না থাকলে: `"কোনো চ্যাপ্টার সিলেক্ট করা নেই।"` message
- Empty state pattern: `glass-panel p-8 rounded-3xl text-center text-zinc-500`

### Form Inputs (Textarea)
```tsx
className="w-full text-sm p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 
           bg-white dark:bg-black focus:ring-1 focus:ring-indigo-500 
           focus:border-indigo-500 focus:outline-none transition-all resize-y"
```

---

## ৫. পারফরম্যান্স নিয়ম

- `parseWorkbook()` শুধু Server Component-এ call করবেন (build-time-এ হয়)
- Client-এ filesystem access নেই — সব data props দিয়ে pass করুন
- ৩৫টা ডকের পুরো কনটেন্ট একসাথে client-এ পাঠানো হবে (~কয়েকশ KB) — গ্রহণযোগ্য। ভবিষ্যতে বড় হলে selected chapter-ভিত্তিক lazy load ভাবুন
- `useLocalStorage` hook-এ initial value দেওয়া বাধ্যতামূলক
- `localStorage` directly access করবেন না — সবসময় hook ব্যবহার করুন

---

## ৬. Accessibility নিয়ম

- সব button-এ `title` অথবা readable text দিন
- Interactive element-এ keyboard focus style থাকতে হবে (`focus:ring-*`)
- Color alone দিয়ে information বোঝাবেন না — icon বা text ও দিন (✅ / 🔄 / ⚪)
- `<a>` tag-এ external link-এ `target="_blank" rel="noopener noreferrer"` দিন
- Doc কনটেন্টে proper heading hierarchy রাখুন (`h1` → `h2` → `h3`, লাফ দেবেন না)

---

## ৭. কী করবেন না (Anti-patterns)

| ❌ করবেন না | ✅ করুন |
|------------|--------|
| Hardcoded hex color | CSS token বা Tailwind class |
| `style={{ }}` inline style | Tailwind utility class |
| `localStorage.getItem()` directly | `useLocalStorage` hook |
| index ফাইলের `file:///` লিংক পার্স | ফোল্ডার/ফাইল নাম থেকে structure |
| Alphabetical sort | Numeric prefix sort |
| Workbook `.md` ফাইলে লেখা | Read-only — নোট যায় localStorage-এ |
| Multiple `useState` for related state | একটা object state বা reducer |
| New font import | শুধু Geist Sans/Mono (next/font) |
| TailwindCSS `@apply` in CSS | Utility class সরাসরি JSX-এ |
| Dark mode ছাড়া কম্পোনেন্ট | সব element-এ `dark:` variant |
| `dangerouslySetInnerHTML` দিয়ে Markdown | `react-markdown` বা নিরাপদ renderer |
