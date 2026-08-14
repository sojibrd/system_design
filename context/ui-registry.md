# UI Registry — System Design Roadmap & Workbook

বিদ্যমান সমস্ত UI কম্পোনেন্ট ও আর্কিটেকচারের রেজিস্ট্রি।

---

## ফাইল ম্যাপ

| ফাইল | উদ্দেশ্য | টাইপ |
|------|---------|------|
| `app/layout.tsx` | Root layout, Bengali font, dark mode script, Sidebar shell | Server Component |
| `app/page.tsx` | Root home page (`docs/README.md` index renderer) | Server Component |
| `app/[...slug]/page.tsx` | ৬০টি ডকের স্ট্যাটিক রুট জেনারেটর ও পেজ রেন্ডারার | Server Component |
| `app/progress/page.tsx` | প্রোগ্রেস পেজ ডাটা লোডার | Server Component |
| `app/progress/ProgressClient.tsx` | সম্পূর্ণ প্রোগ্রেস ও রিভিশন ড্যাশবোর্ড UI | Client Component |
| `app/components/Sidebar.tsx` | মাল্টি-লেভেল নেস্টেড অ্যাকর্ডিয়ন সাইডবার ও সার্চ | Client Component |
| `app/components/DocArticle.tsx` | আর্টিকেল হেডার, সোর্স মেটা, বডি, ট্র্যাকার ও পেজিনেশন | Server/Client Composite |
| `app/components/Markdown.tsx` | ReactMarkdown, রিলেটিভ লিংক ও Mermaid হ্যান্ডলিং | Client Component |
| `app/components/MermaidDiagram.tsx` | Mermaid SVG ক্লায়েন্ট রেন্ডারার ও ডার্ক মোড সিন্ক | Client Component |
| `app/components/DocTracker.tsx` | পার-ডক রিড/রিভাইজ/নোট ট্র্যাকার কন্ট্রোল | Client Component |
| `app/hooks/useLocalStorage.ts` | SSR-safe `useSyncExternalStore` ভিত্তিক লোকাল স্টোরেজ হুক | Custom Hook |
| `app/lib/content.ts` | Server-only recursive scanner, index detector, slugifier, nav generator | Server Utility |
| `app/lib/slug.ts` | শেয়ার্ড স্লাগিফিকেশন হেল্পার | Shared Utility |
| `app/globals.css` | Design tokens, Tailwind v4, glassmorphism, typography | CSS |

---

## LocalStorage Key স্কিম

| Key | টাইপ | উদ্দেশ্য |
|-----|------|---------|
| `sd_read_routes` | `string[]` | পঠিত সম্পন্ন হওয়া ডক রুট সমূহের তালিকা |
| `sd_revise_routes` | `string[]` | রিভাইজ করার জন্য চিহ্নিত ডক রুট সমূহের তালিকা |
| `sd_doc_notes` | `Record<string, { summary?: string; unclear?: string }>` | প্রতিটি রুটের ব্যক্তিগত সারাংশ ও নোট |
