# 🗺️ System Design Roadmap & Workbook

সিস্টেম ডিজাইন শেখা ও ইন্টারভিউ প্রস্তুতির সম্পূর্ণ বাংলা রোডম্যাপ এবং ইন্টারঅ্যাকটিভ ওয়ার্কবুক।

**লাইভ:** https://sojibrd.github.io/system_design/

---

## 🌟 কী আছে এই প্রজেক্টে

- **System Design Roadmap (২৫টি অধ্যায়):** `docs/` ফোল্ডারের আর্কিটেকচার ফান্ডামেন্টালস (Scalability, Caching, Databases, Load Balancing, Resiliency, Security ইত্যাদি)।
- **System Design Workbook (৩৫টি টপিক):** `workbook/` ফোল্ডারের ৬টি পার্ট ও ১৭টি চ্যাপ্টারের প্র্যাকটিক্যাল ল্যাব ও কনসেপ্ট।
- **ব্যক্তিগত ট্র্যাকার:** প্রতিটি অধ্যায়ে "পড়া হয়েছে" (Read ✓), "রিভাইজ দরকার" (Revise 🔄), এবং নিজস্ব নোট (Notes 📝) সংরক্ষণ সুবিধা।
- **স্টাডি প্রোগ্রেস ড্যাশবোর্ড (`/progress`):** সম্পূর্ণ অগ্রগতি, সেকশনভিত্তিক পার্সেন্টেজ এবং ফিল্টার (রিভাইজ/অপঠিত/নোটযুক্ত)।
- **Mermaid আর্কিটেকচার ডায়াগ্রাম:** ক্লায়েন্ট-সাইড ডায়নামিক রেন্ডারিং ও ডার্ক মোড সাপোর্ট।
- **কোনো ব্যাকএন্ড নেই:** সকল ট্র্যাকার ডেটা ব্রাউজারের `localStorage`-এ সুরক্ষিত থাকে।

---

## 🛠️ টেক স্ট্যাক

- **Framework:** Next.js 16 (App Router, Static Export `output: "export"`)
- **Library:** React 19, TypeScript
- **Styling:** Tailwind CSS v4, `@tailwindcss/typography`
- **Diagrams:** Mermaid (`^11.16.0`)
- **Content:** `react-markdown` + `remark-gfm`
- **Testing:** `scripts/check-diagrams.mjs` (jsdom)

---

## 🚀 লোকালি চালানো

```bash
npm install
npm run dev
```

ব্রাউজারে http://localhost:3000 ওপেন করুন।

### ডায়াগ্রাম সিনট্যাক্স টেস্ট:
```bash
npm run check:diagrams
```

### বিল্ড ও স্ট্যাটিক এক্সপোর্ট:
```bash
npm run build
```

---

## 📦 ডিপ্লয়মেন্ট

GitHub repository-তে push করলে GitHub Actions স্বয়ংক্রিয়ভাবে বিল্ড করে GitHub Pages-এ ডিপ্লয় করে (`.github/workflows/deploy.yml`)।

> [!NOTE]
> GitHub Repo Settings → Pages → **Source: GitHub Actions** নিশ্চিত করুন।
