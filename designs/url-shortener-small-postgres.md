# URL Shortener — System Design

> তৈরি: 2026-08-14 · স্তর: small
> **সারাংশ**: ব্যক্তিগত/ছোট টিমের জন্য সাধারণ URL shortener, যেখানে 302 redirect p95 < 100ms লক্ষ্য।
> **Stack**: Monolith (Single Process) + PostgreSQL.
> **বাদ দেওয়া হয়েছে**: Cache (Redis), Queue, Load Balancer, Auth, Replication (দৈনিক backup যথেষ্ট)।

## ১. কী বানাচ্ছি

একটা URL shortener। User একটা লম্বা URL পাঠাবে, সিস্টেম একটা ছোট কোড ফেরত দেবে; কেউ ওই ছোট লিংকে গেলে মূল URL-এ redirect হবে। ব্যক্তিগত/ছোট টিমের ব্যবহার, কিন্তু API খোলা — লগইন নেই।

**Functional**
- `POST /` — লম্বা URL → ছোট কোড
- `GET /<code>` — মূল URL-এ 302 redirect
- ব্যস। analytics নেই, custom alias নেই, expiry নেই।

**Non-functional**
- latency: **redirect p95 < ১০০ms** (লিংক তৈরিতে ৩০০ms চলবে)
- availability: **99.9%** (মাসে ~৪৩ মিনিট ডাউন — মেনে নেওয়া হলো)
- ডেটা হারানো: **অগ্রহণযোগ্য** — হারানো লিংক মানে চিরতরে ভাঙা লিংক। তবে সমাধান replication নয়, **যাচাই করা backup** (ধারা ৩ দেখুন)

## ২. স্কেল (অনুমান — সব সিদ্ধান্ত এখান থেকে)

| | হিসাব | ফল |
|---|---|---|
| দৈনিক নতুন লিংক | অনুমান | ২০০ |
| দৈনিক redirect | ২০০ × ~১০০ ক্লিক | ২০,০০০ |
| Write QPS | 200 ÷ 86,400 | ০.০০২ |
| Read QPS | 20,000 ÷ 86,400 | ০.২৩ |
| **Peak QPS** | ০.২৩ × ১০ | **~২.৩** |
| **৫ বছরে ডেটা** | ৫০০ B × ২০০ × ১৮২৫ | **~১৮২ MB** |

read:write ≈ ১০০:১ — খুব read-heavy, কিন্তু **পরম সংখ্যাটা এত ছোট যে সেটা কোনো সিদ্ধান্ত বদলায় না**।

> এই অনুমান ভুল প্রমাণিত হলে ধারা ৩ আবার দেখতে হবে।
> **থ্রেশহোল্ড: peak > ১০ QPS বা ডেটা > ১০ GB হলে এই ডকুমেন্ট অচল।**

## ৩. সিদ্ধান্ত

| সিদ্ধান্ত | কী ঠিক হলো | কেন | খরচ / trade-off | অধ্যায় |
|---|---|---|---|---|
| Consistency (CP/AP) | একটা Postgres, তাই CP | একটাই node — partition-এর প্রশ্নই নেই | আলোচনার কিছু নেই | [০৪](https://sojibrd.github.io/system_design_roadmap/docs/04-availability-vs-consistency/) |
| Data model | একটা টেবিল: `links(id, code, long_url, created_at)`, `code`-এ unique index | ১৮২ MB-তে relational-ই সরলতম | কোনোটাই না | [১২](https://sojibrd.github.io/system_design_roadmap/docs/12-databases/) |
| SQL/NoSQL | **Postgres** | scale-এর প্রশ্ন নেই, তাই সরলতাই জেতে | নেই | [১২](https://sojibrd.github.io/system_design_roadmap/docs/12-databases/) |
| Key generation | auto-increment `id` → **base62** | সংঘর্ষ অসম্ভব, কোড ছোট (৩–৪ অক্ষর), retry লাগে না | **কোড অনুমানযোগ্য** — যে কেউ গুনে সব লিংক পড়তে পারবে | [১২](https://sojibrd.github.io/system_design_roadmap/docs/12-databases/) |
| Application layer | **Monolith**, একটা process | দুটো endpoint ভাগ করার কারণ নেই | write আর redirect একই process-এ — একটা ক্র্যাশে দুটোই যায় | [১০](https://sojibrd.github.io/system_design_roadmap/docs/10-application-layer/) |
| API | REST/JSON; redirect-এ **302**, 301 নয় | 301 ব্রাউজার চিরকাল ক্যাশ করে — লিংক বদলানো/মোছার ক্ষমতা চিরতরে যায় | প্রতিটা ক্লিক সার্ভারে আসে (২ QPS-এ সমস্যা নয়) | [১৫](https://sojibrd.github.io/system_design_roadmap/docs/15-communication/) |
| Auth / abuse | auth নেই। **IP-প্রতি rate limit** শুধু write API-তে; redirect খোলা। কাউন্টার in-process মেমোরিতে | খোলা API-তে আসল ঝুঁকি "কে ঢুকবে" নয়, "কে ভরিয়ে দেবে" | একটা middleware; সার্ভার restart-এ কাউন্টার রিসেট (গ্রহণযোগ্য) | [২৫](https://sojibrd.github.io/system_design_roadmap/docs/25-security/) |
| Monitoring | বাইরের uptime ping + 5xx হলে ইমেইল alert | মিনিটের সেটআপ; ছাড়া দিলে ডাউনটাইম জানবেন user-এর কাছ থেকে | কার্যত শূন্য | [১৮](https://sojibrd.github.io/system_design_roadmap/docs/18-monitoring/) |
| Backup | দৈনিক `pg_dump` আলাদা জায়গায় + **অন্তত একবার restore করে যাচাই** | ডেটা হারানো অগ্রহণযোগ্য; replica এই সমস্যার সমাধান নয় | **RPO ২৪ ঘণ্টা** — একদিনের লিংক হারাতে পারে | [২২](https://sojibrd.github.io/system_design_roadmap/docs/22-availability/) |

## ৪. যা ইচ্ছাকৃতভাবে বাদ দিলাম

| বাদ | কেন | কখন ফিরে আসবেন |
|---|---|---|
| **Cache** (১৩) | read QPS ০.২৩; Postgres-এর indexed lookup ~1ms, p95 লক্ষ্য ১০০ms | read QPS > ৫০০, বা p95 ৫০ms ছাড়ালে |
| **Queue / async** (০৭, ১৪) | কোনো কাজই ১ সেকেন্ডের বেশি নয়; বাইরের কোনো API নেই | click analytics বা email/webhook যোগ হলে |
| **Idempotency** (১৬) | পেমেন্ট নেই; একই URL দুবার এলে দুটো কোড — কোনো ক্ষতি নেই | পেমেন্ট, webhook বা billing এলে |
| **Replication / failover** (০৬, ২২) | 99.9% এক নোডেই সম্ভব; ডেটা-নিরাপত্তা backup দিয়ে হচ্ছে | availability লক্ষ্য 99.95%+ হলে, বা RPO ২৪ ঘণ্টা অসহনীয় হলে |
| **Load balancer / horizontal scaling** (১১) | peak ২.৩ QPS — একটা সার্ভারের ~১% | peak QPS > ~১০০, বা একাধিক app server লাগলে |
| **CDN** (০৯) | কোনো ছবি/asset নেই; redirect dynamic, CDN-এ যায় না | static ল্যান্ডিং পেজ/asset যোগ হলে |
| **Sharding / partitioning** (১২) | ১৮২ MB — ১ TB-র ৫৫০০ ভাগের এক ভাগ | ডেটা > ১ TB, বা write একটা মেশিনে না আঁটলে |
| **Resiliency: circuit breaker, retry, bulkhead** (২৪) | বাইরের কোনো সার্ভিসের ওপর নির্ভরতা নেই | malware-scan API, analytics বা payment যুক্ত হলে |
| **URL blocklist / malware scan** | এই মুহূর্তে ব্যবহারকারীর বৃত্ত ছোট | ডোমেইন প্রকাশ্য হলে, বা প্রথম abuse রিপোর্ট এলে (তখন #১৪-ও ফিরবে) |
| **Redis** (rate-limit store) | একটাই সার্ভার — in-process কাউন্টারই যথেষ্ট | একাধিক app server হলে |

## ৫. আর্কিটেকচার

```
Client → App (rate limit → handler) → Postgres
                                          ↓
                                   দৈনিক pg_dump → offsite
```

তিনটে বাক্স। এটাই সৎ উত্তর।

## ৬. যেখানে ভাঙবে

- **App server মরল** → সব redirect ও লিংক তৈরি বন্ধ। uptime ping alert দেবে, ম্যানুয়ালি restart → **মেনে নেওয়া হলো** (99.9%-এর বাজেটে আঁটে)
- **Postgres মরল** → একই ফল। restore থেকে ফিরতে হবে
- **ডিস্ক হারাল** → শেষ backup পর্যন্ত ফিরবে; **২৪ ঘণ্টার লিংক হারাবে** → মেনে নেওয়া হলো। *কিন্তু restore অন্তত একবার সত্যিই করে দেখতে হবে — না-পরীক্ষা করা backup আসলে backup নয়*
- **একই request দুবার এল** → দুটো আলাদা কোড, একই গন্তব্য। ক্ষতি নেই
- **`INSERT`-এর পর network timeout** → client জানে না কোড কী; আবার পাঠাবে, আরেকটা কোড হবে। অনাথ row থেকে যাবে — গ্রহণযোগ্য
- **কেউ স্ক্রিপ্ট চালিয়ে ভরিয়ে দিল** → rate limit ঠেকাবে; সার্ভার restart-এ কাউন্টার রিসেট হয় বলে ফাঁক আছে → **জানা দুর্বলতা**
- **কেউ কোড গুনে সব লিংক পড়ল** → base62 ক্রমিক, ঠেকানোর উপায় নেই → **শর্ট লিংককে কখনো গোপনীয়তার আবরণ ভাববেন না**

**SPOF**: (১) একমাত্র app server, (২) একমাত্র Postgres instance। দুটোই সচেতনভাবে মেনে নেওয়া — 99.9% লক্ষ্যে এরা আঁটে।

**Antipattern যাচাই** ([১৭](https://sojibrd.github.io/system_design_roadmap/docs/17-performance-antipatterns/)):
- *Chatty I/O* — redirect-এ ঠিক একটা query। ✅
- *Extraneous Fetching* — `SELECT long_url WHERE code = ?`, `SELECT *` নয়। ✅
- *Busy Database* — কোনো logic DB-তে নেই। ✅
- *Retry Storm* — কোনো retry নেই, বাইরের নির্ভরতাও নেই। ✅
