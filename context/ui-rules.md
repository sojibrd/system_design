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

### রং ব্যবহার
- `ui-tokens.md`-এর বাইরে **hardcoded hex/rgb ব্যবহার করবেন না**
- CSS custom property বা Tailwind utility class ব্যবহার করুন
- নতুন রং দরকার হলে প্রথমে `ui-tokens.md` আপডেট করুন

### Dark Mode
- **সব** নতুন UI element-এ `dark:` variant দিতে হবে
- Pattern: `bg-zinc-100 dark:bg-zinc-900`, `text-zinc-800 dark:text-zinc-200`
- Dark mode class `.dark` root `<html>` element-এ toggle হয়
- CSS custom property (`--card-bg` ইত্যাদি) স্বয়ংক্রিয়ভাবে switch করে

### Glassmorphism
- Card/panel তৈরিতে `.glass-panel` class ব্যবহার করুন (inline style নয়)
- Navbar, sidebar, main panel — সব `glass-panel` ব্যবহার করবে
- নতুন modal/dropdown-এও `glass-panel` ব্যবহার করুন

### Responsive Design
- **Mobile first নয়, Desktop first** — কিন্তু responsive breakdown দিতে হবে
- Tailwind breakpoints: `sm:`, `md:`, `lg:` ব্যবহার করুন
- Sidebar: mobile-এ hamburger + slide-in drawer, desktop-এ `w-[360px] lg:shrink-0`
- Font size: `text-2xl md:text-3xl` pattern অনুসরণ করুন

### পড়ার আরাম (Reading Ergonomics)
এই অ্যাপের মূল কাজ **লম্বা টেক্সট পড়া** — DSA Prep-এর মতো ছোট problem card নয়। তাই:
- ~~Doc কনটেন্ট প্যারাগ্রাফে `max-w-[72ch]`~~ — সরানো হয়েছে। ডায়াগ্রাম (Mermaid) যোগ হওয়ার পর ৭২ch কলাম চওড়া ডায়াগ্রামের জন্য খুব সরু ছিল; ডেভেলপার সচেতনভাবে কনটেন্ট বক্স কার্ডের পুরো প্রস্থে নিতে বলেছেন। টেক্সটও এখন full-width — লম্বা লাইনের ট্রেড-অফ মেনে নেওয়া হয়েছে
- `text-base leading-relaxed` — `text-sm` নয়
- প্যারাগ্রাফের মাঝে `space-y-4`, heading-এর আগে বেশি gap

---

## ৩. কম্পোনেন্ট নিয়ম (Component Rules)

### Card/Panel তৈরি
```tsx
// ✅ সঠিক
<div className="glass-panel p-6 rounded-2xl">...</div>

// ❌ ভুল
<div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: '16px' }}>...</div>
```

### Status Badge

```tsx
// ✅ পড়া হয়েছে
<span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/10">
  ✅ পড়া হয়েছে
</span>

// ✅ রিভাইজ দরকার
<span className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/10">
  🔄 রিভাইজ দরকার
</span>

// ✅ এখনো পড়া হয়নি
<span className="text-[10px] font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full">
  ⚪ বাকি
</span>
```

### Selected/Active state
```tsx
// ✅ Active chapter button
className={isSelected
  ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-l-2 border-indigo-500'
  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
}
```

### Info/Highlight box
```tsx
// ✅ Cyan info box
<div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 text-sm">

// ✅ Neutral box
<div className="bg-zinc-100/50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50">
```

### Doc ID ও Source
```tsx
// ✅ Doc ID — mono, muted
<span className="font-mono text-[10px] text-zinc-400">1.1.1</span>

// ✅ Source attribution
<span className="text-xs italic text-zinc-400 dark:text-zinc-500">Source: Anup Panwar</span>
```

### নামকরণ
- Component file: PascalCase (`TrackerClient.tsx`, `DocCard.tsx`)
- Function/hook: camelCase (`useLocalStorage`, `getPartProgress`)
- CSS class: lowercase kebab (`.glass-panel`, `.glass-glow`)
- Prop: camelCase (`isRead`, `needsRevise`, `chapterName`)

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
