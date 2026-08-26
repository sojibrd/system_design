# Theme Contract — এক-ফাইল থিমিং

`system_design`-এর সব ভিজ্যুয়াল সিদ্ধান্ত CSS-এ থাকে, কম্পোনেন্টে নয়।
রোডম্যাপ, প্রোগ্রেস ড্যাশবোর্ড ও সিমুলেটর — তিনটিই একই কনট্র্যাক্ট মেনে চলে।

## থিম বদলানো

```css
/* app/globals.css — লাইন ৯ */
@import "./themes/control-room.css";
```

**এই একটা লাইনই** পুরো সাইটের চেহারা ঠিক করে। বর্তমান থিম: `control-room.css` (একমাত্র থিম)।

**নতুন থিম লিখতে:** `app/themes/<name>.css`-এ একটা `:root {}` ব্লক, নিচের সব `--t-*` ভেরিয়েবল সেট করে। তারপর উপরের লাইনটা বদলান। **কম্পোনেন্টে কখনো হাত দেবেন না।**

> সাইট **dark-only**। control-room-এ light mode নেই, `.dark` ক্লাস বা `prefers-color-scheme` toggle নেই। light চাইলে সেটা একটা নতুন থিম ফাইল, কোড পরিবর্তন নয়।

---

## অলঙ্ঘনীয় নিয়ম

1. **কম্পোনেন্টে কোনো ভিজ্যুয়াল সিদ্ধান্ত নয়।** রঙ তো নয়ই — `rounded-*`, `shadow-*`, `border-2`, `uppercase`, `tracking-*`, `font-bold` কোনোটাই না। এগুলো role class-এ থাকে।
2. **Tailwind শুধু লেআউটের জন্য** — `flex`, `grid`, `gap`, `w-`, `min-h-`, `truncate`, `overflow-*`। চেহারার জন্য নয়।
3. **কম্পোনেন্ট বলে *কী*, থিম বলে *কেমন*।** `data-active`, `aria-selected`, `aria-pressed`, `data-state` — অবস্থা জানায়; সেটা দেখতে কেমন হবে তা CSS ঠিক করে।
4. **ডেটা ফাইলে রঙ নেই।** `lib/simulations/*` শুধু অর্থ বলে (`particleColor: "success"`)।
5. **নতুন ভিজ্যুয়াল দরকার হলে আগে কনট্র্যাক্টে টোকেন যোগ করুন**, তারপর সব থিম ফাইলে ভ্যালু দিন।

**একমাত্র ব্যতিক্রম — `.doc-prose`।** Markdown সরাসরি `<h2>`, `<td>`, `<blockquote>` হয়ে DOM-এ আসে; role class বসানোর মতো কম্পোনেন্ট নেই। তাই কনট্র্যাক্টের এই একটি ব্লক raw element স্টাইল করে — কিন্তু `.doc-prose`-এর ভেতরে scoped, আর সব মান `--t-doc-*` থেকে পড়ে।

---

## Role classes (`app/globals.css`)

| শ্রেণি | ক্লাস |
|---|---|
| Surface | `surface-app` `surface-panel` `surface-raised` `surface-well` |
| Text | `t-title` `t-label` `t-body` `t-caption` `t-mono` `t-strong` `t-accent` `t-muted` `t-ok` `t-quote` |
| Seam | `seam` `seam-b` `seam-b-heavy` `seam-t` |
| Control | `control` + `control--primary` `control--alert` `control--quiet`; `segment-group` / `segment` |
| Chip | `chip` + `chip--accent` `chip--alert` `chip--ok` |
| Callout | `callout` + `callout--accent` `callout--alert`; `option` |
| Canvas | `unit` `backplane` `ornament-mark` `lamp` `terminal` `edge-tag` `wire` `packet-core` `packet-halo` |
| Nav | `tab` `row` `progress-mark` `overlay` |
| **Doc** | **`doc-prose`** — লম্বা Markdown কলাম (heading, table, code, quote, list) |
| **Gauge** | **`gauge` / `gauge-fill`** (+ `data-tone="ok"`) — অনুপাত দেখানো বার |

> `progress-mark` বনাম `gauge`: `progress-mark` বলে **কোথায়** (ধাপের ক্রমে অবস্থান), `gauge` বলে **কতটুকু** (অনুপাত)।

### State attributes

| অ্যাট্রিবিউট | কোথায় | অর্থ |
|---|---|---|
| `data-active` / `data-animated` | `.unit` | এই ধাপে সক্রিয় / চলমান |
| `data-selected` | `.unit` | ইউজার সিলেক্ট করেছে |
| `data-category` | `.unit` | ক্লায়েন্ট / কম্পিউট / স্টোরেজ … (spine-এর রং) |
| `data-lit` / `data-blink` | `.lamp` | জ্বলছে / জ্বলে-নেভে |
| `data-state` + `data-live` | `.progress-mark` | ধাপের অগ্রগতি |
| `data-tone` | `.gauge-fill` | `ok` হলে সাফল্যের রঙে |
| `aria-selected` | `.tab` | নির্বাচিত ফেজ |
| `aria-pressed` | `.segment`, `.control` | নির্বাচিত / চালু অবস্থা |
| `aria-current` | `.row` | বর্তমান লিস্ট আইটেম |
| `data-corner` | `.ornament-mark` | কোন কোণা |

---

## থিম টোকেন (`--t-*`)

নতুন থিম ফাইলে এগুলো সব সেট করতে হবে। রেফারেন্স: `app/themes/control-room.css`।

- **Type:** `font-sans` `font-mono` `title-family|weight|tracking|transform` `label-family|size|weight|tracking|transform` `control-family|weight|tracking|transform` `quote-style`
- **App:** `app-bg` `app-bg-image|size` `select-bg|fg` `overlay-bg|filter` `disabled-opacity` `hover-fill` `selected-bg|fg` `accent` `ok` `ok-soft`
- **Text:** `text-title` `text-body` `text-label` `text-muted` `text-faint` `payload-fg`
- **Surface:** `panel-*` `raised-*` `well-*` `seam` `seam-heavy`
- **Control:** `control-*` `primary-*` `alert-*`
- **Chip / Callout:** `chip-*` `callout-*`
- **Canvas:** `unit-*` `unit-spine-*` `cat-*` `signal-*` `ornament-*` `lamp-*` `terminal-*` `wire-*` `packet-*` `edge-tag-bg` `canvas-*`
- **Nav:** `tab-*` `progress-*` `scrollbar-*`
- **Doc prose:** `doc-family` `doc-size` `doc-leading` `doc-flow` `doc-flow-tight` `doc-heading-lead` `doc-body` `doc-heading` `doc-strong` `doc-link` `doc-link-hover` `doc-marker` `doc-bullet` `doc-heading-family|weight|tracking|transform` `doc-h1|h2|h3|h4-size` `doc-code-fg|bg|border` `doc-pre-fg`
- **Gauge:** `gauge-track` `gauge-border` `gauge-border-width` `gauge-radius` `gauge-fill` `gauge-fill-glow`
- **Diagram (Mermaid):** `diagram-node-bg` `diagram-node-border` `diagram-line` `diagram-text`

---

## ফন্ট শেল্ফ (`app/layout.tsx`)

পাঁচটি family একবারই লোড হয়; থিম ঠিক করে কোন role কোনটি পায়।

| ভেরিয়েবল | ফন্ট | control-room-এ ভূমিকা |
|---|---|---|
| `--font-condensed` | Barlow Semi Condensed | `--t-font-sans` — title, label, control |
| `--font-mono-family` | JetBrains Mono | `--t-font-mono` — readout, payload, কোড |
| `--font-bengali` | Noto Sans Bengali | `--t-doc-family` — পড়ার কলাম; `--t-font-sans`-এর fallback |
| `--font-grotesk` | Archivo | রিজার্ভ |
| `--font-display` | Archivo Black | রিজার্ভ |

> Latin ফেসগুলোতে বাংলা glyph নেই। `--t-font-sans`-এর স্ট্যাকে Noto Sans Bengali **দ্বিতীয়** — তাই latin লেবেল condensed চরিত্র রাখে, বাংলা নির্দিষ্টভাবে Noto-তে পড়ে, ব্রাউজারের এলোমেলো fallback-এ নয়।
>
> নতুন family যোগ করাই `layout.tsx` এডিট করার **একমাত্র** কারণ।

---

## Mermaid ডায়াগ্রাম

Mermaid নিজের SVG আঁকে এবং প্যালেট JS মান হিসেবে নেয়, CSS হিসেবে নয়। তাই `MermaidDiagram.tsx` একমাত্র কম্পোনেন্ট যেটি `getComputedStyle` দিয়ে `--t-diagram-*` ও `--t-accent` পড়ে `themeVariables`-এ পাঠায়। মানগুলো তবুও থিমেরই — শুধু পড়াটা ওখানে হয়।
