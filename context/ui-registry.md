# UI Registry — System Design Roadmap, Workbook & Simulator

বিদ্যমান সমস্ত UI কম্পোনেন্ট ও আর্কিটেকচারের রেজিস্ট্রি।

---

## ফাইল ম্যাপ — সাইট শেল ও ডক

| ফাইল | উদ্দেশ্য | টাইপ |
|------|---------|------|
| `app/layout.tsx` | Root layout, ৫-family ফন্ট শেল্ফ, sidebar shell (`h-dvh`, বাঁয়ে র‍্যাক + ডানে scrollable main) | Server Component |
| `app/page.tsx` | Root home page (`docs/README.md` index renderer) | Server Component |
| `app/[...slug]/page.tsx` | ৬০টি ডকের স্ট্যাটিক রুট জেনারেটর ও পেজ রেন্ডারার | Server Component |
| `app/progress/page.tsx` | প্রোগ্রেস পেজ ডাটা লোডার | Server Component |
| `app/progress/ProgressClient.tsx` | প্রোগ্রেস ও রিভিশন ড্যাশবোর্ড (readout, `gauge`, `segment-group` ফিল্টার) | Client Component |
| `app/components/Sidebar.tsx` | মাল্টি-লেভেল নেস্টেড অ্যাকর্ডিয়ন সাইডবার, সার্চ, সিমুলেশন লিংক | Client Component |
| `app/components/DocArticle.tsx` | আর্টিকেল হেডার, সোর্স মেটা, বডি, ট্র্যাকার ও পেজিনেশন | Server/Client Composite |
| `app/components/Markdown.tsx` | ReactMarkdown, রিলেটিভ লিংক ও Mermaid হ্যান্ডলিং — **কোনো স্টাইল নেই**, শুধু `.doc-prose` র‍্যাপার | Client Component |
| `app/components/MermaidDiagram.tsx` | Mermaid SVG রেন্ডারার; `--t-diagram-*` পড়ে `themeVariables` বানায় | Client Component |
| `app/components/DocTracker.tsx` | পার-ডক রিড/রিভাইজ/নোট ট্র্যাকার কন্ট্রোল | Client Component |
| `app/hooks/useLocalStorage.ts` | SSR-safe `useSyncExternalStore` ভিত্তিক লোকাল স্টোরেজ হুক | Custom Hook |
| `app/lib/content.ts` | **Server-only** recursive scanner, index detector, slugifier, nav generator | Server Utility |
| `app/lib/slug.ts` | শেয়ার্ড স্লাগিফিকেশন হেল্পার | Shared Utility |
| `app/globals.css` | Theme contract — role class, `.doc-prose`, `.gauge`, React Flow chrome | CSS |
| `app/themes/control-room.css` | সক্রিয় থিম — সব `--t-*` মান ও keyframes | CSS |

## ফাইল ম্যাপ — সিমুলেটর (`/simulation/`)

| ফাইল | উদ্দেশ্য | টাইপ |
|------|---------|------|
| `app/simulation/page.tsx` | ডিফল্ট সিমুলেশন লোড করে (`/simulation/`) | Server Component |
| `app/simulation/[sim]/page.tsx` | প্রতি সিমুলেশনের নিজস্ব রুট — `generateStaticParams`, per-route metadata | Server Component |
| `app/components/simulation/SimulationView.tsx` | একটি সিমুলেশনের সম্পূর্ণ UI অর্কেস্ট্রেশন (`h-full`, সাইট শেলের ভেতরে) | Client Component |
| `app/components/simulation/FlowDiagram.tsx` | React Flow ক্যানভাস, backplane, fitView | Client Component |
| `app/components/simulation/AnimatedEdge.tsx` | চলমান প্যাকেট ও লাইভ ওয়্যার | Client Component |
| `app/components/simulation/SimulationNode.tsx` | একটি আর্কিটেকচার unit (`data-category`, lamp, ornament) | Client Component |
| `app/components/simulation/Header.tsx` | সিমুলেটর হেডার প্লেট + `SimulationPicker` | Client Component |
| `app/components/simulation/LevelTabs.tsx` | functional / reliable / scalable ট্যাব | Client Component |
| `app/components/simulation/ControlsBar.tsx` | play/pause/step/speed/flow ও প্রোগ্রেস রুলার | Client Component |
| `app/components/simulation/WalkthroughPanel.tsx` | ধাপে ধাপে ব্যাখ্যা প্যানেল | Client Component |
| `app/components/simulation/DesignNotes.tsx` | লেভেলের ডিজাইন নোট | Client Component |
| `app/components/ui/*` | `Badge` `Button` `Callout` `Lamp` `Panel` `Rule` `Sheet` — role class-এর পাতলা মোড়ক | Client Components |
| `app/hooks/useSimulation.ts` | ধাপ, প্লেব্যাক, node/edge derive | Custom Hook |
| `app/hooks/useThemeNumber.ts` | থিম থেকে সংখ্যা পড়ে (SVG geometry, grid gap) | Custom Hook |
| `app/hooks/useMediaQuery.ts` | `usePrefersReducedMotion` — অ্যানিমেশন বন্ধ করার অনুরোধ মানে | Custom Hook |
| `app/lib/simulations/index.ts` | `simulationIndex` (হালকা সারাংশ) + `loadSimulation` (per-sim dynamic import) | Registry |
| `app/lib/simulations/<sim>/` | সিমুলেশন ডেটা (URL Shortener × ৩ লেভেল) — **রঙ নেই, শুধু অর্থ** | Data |
| `app/lib/types.ts` | `SimulationConfig`, `LevelId`, `SignalKind` ইত্যাদি | Types |

---

## রুট

| রুট | কী |
|---|---|
| `/` | `docs/README.md` |
| `/docs/<slug>/` | ২৫টি রোডম্যাপ ডক |
| `/workbook/.../<slug>/` | ৩৫টি ওয়ার্কবুক টপিক |
| `/progress/` | স্টাডি প্রোগ্রেস ড্যাশবোর্ড |
| `/simulation/` | ডিফল্ট সিমুলেশন (তালিকার প্রথমটি) |
| `/simulation/<sim>/` | নির্দিষ্ট সিমুলেশন — লিংকযোগ্য, নিজস্ব title |

> `[...slug]`-এ `dynamicParams = false`, তাই static `/simulation/` রুট নিরাপদে catch-all-এর আগে মেলে।

---

## LocalStorage Key স্কিম

| Key | টাইপ | উদ্দেশ্য |
|---|---|---|
| `sd_read_routes` | `string[]` | পঠিত ডকের route |
| `sd_revise_routes` | `string[]` | রিভাইজ দরকার এমন route |
| `sd_doc_notes` | `Record<string, DocNote>` | per-doc সারাংশ ও প্রশ্ন |
| `sd_nav_collapsed` | `boolean` | ডেস্কটপে সাইডবার লুকানো আছে কিনা |

---

## নতুন সিমুলেশন যোগ করা

১. `app/lib/simulations/<slug>/` — level ফাইল লিখুন, `<slug>/index.ts`-এ `SimulationConfig` এক্সপোর্ট করুন
২. `app/lib/simulations/index.ts`-এ দুটো লাইন — `simulationIndex`-এ সারাংশ, `loaders`-এ dynamic import

এর বেশি কিছু লাগে না: রুট (`/simulation/<slug>/`) `generateStaticParams` থেকে নিজেই তৈরি হয়, এবং `SimulationPicker` দুই বা তার বেশি এন্ট্রি দেখলে স্থির প্লেট থেকে dropdown-এ বদলে যায়।

> **কেন দুটো তালিকা:** picker একটা client component, তাকে **সব** সিমুলেশনের নাম জানতে হয়; পেজ রেন্ডার করে **একটা**। একটা সিমুলেশনের পূর্ণ ডেটা ১৫০KB+ — তাই নাম যায় `simulationIndex`-এ, ডেটা আসে সেই রুটের নিজস্ব dynamic import থেকে। দশম সিমুলেশন যোগ করলে বাকি নয়টার খরচ প্রথম লোডে পড়বে না।
