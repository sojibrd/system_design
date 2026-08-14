# url-shortener — System Design

> তৈরি: 2026-08-14 · স্তর: medium
> **সারাংশ**: স্কেলেবল ও উচ্চ গতিসম্পন্ন URL Shortener সার্ভিস যা দীর্ঘ URL-কে ৭-অক্ষরের Unique Short Code-এ রূপান্তর করে এবং < 50ms Latency-তে রিডাইরেক্ট করে।
> **Stack**: PostgreSQL, Redis (Cache & Queue), Decoupled Microservices, NGINX Load Balancer
> **বাদ দেওয়া হয়েছে**: CDN, Database Sharding, Circuit Breaker

---

## ১. কী বানাচ্ছি

একটি ডিস্ট্রিবিউটেড URL Shortener সার্ভিস যা বিশাল সংখ্যার লং ইউআরএল ছোট করতে পারে এবং শর্ট ইউআরএলে হিট করা মাত্র অত্যন্ত দ্রুত মূল ইউআরএলে রিডাইরেক্ট করে।

**Functional Requirements:**
- Long URL দিলে ৭-অক্ষরের unique short code তৈরি করবে।
- Short URL-এ ক্লিক করলে মূল long URL-এ HTTP 302 রিডাইরেক্ট করবে।
- ব্যাকগ্রাউন্ডে ক্লিক কাউন্ট ও অ্যানালিটিক্স প্রসেসিং করবে।
- অপশনাল লিংক এক্সপায়ারি (Expiration/TTL) সাপোর্ট করবে।

**Non-functional Requirements:**
- **Latency Target (p95):** Redirect < 50ms, Link Generation < 200ms
- **Availability Target:** 99.9% (মাসে সর্বোচ্চ ~৪৩ মিনিট ডাউনটাইম মেনে নেওয়া হবে)
- **Data Loss Tolerance:** Short URL ম্যাপিং হারানো অগ্রহণযোগ্য। ক্লিক অ্যানালিটিক্স ১-২টি মিস হলে সমস্যা নেই।

---

## ২. স্কেল (অনুমান — সব সিদ্ধান্ত এখান থেকে)

- **DAU:** ~১,০০,০০০
- **Write Target:** ১০০,০০০ নতুন লিংক / দিন (~১.২ Write QPS)
- **Read Target:** ১০,০০,০০,০০০ রিডাইরেক্ট ক্লিক / দিন (~১১৬ Read QPS, Read:Write = 100:1)
- **Peak QPS:** **~৫০০ QPS** (Read + Write peak)
- **রেকর্ডের আকার:** ~৫০০ Bytes
- **৫ বছরে মোট ডেটা:** **~৯১.২৫ GB** (৫০০ bytes × ১০০,০০০ × ১৮২৫ দিন)
- **স্তরের ঘোষণা (Tier):** **মাঝারি (Medium)** (Peak < 1,000 QPS, Data < 1 TB)

---

## ৩. সিদ্ধান্তসমূহ

| # | সিদ্ধান্ত | কী ঠিক হলো | কেন | Trade-off | অধ্যায় |
|---|---|---|---|---|---|
| ১ | CP / AP | **AP for Reads + Strong Write** | রিডাইরেক্টের জন্য হাই এভেইল্যাবিলিটি ও ক্যাশিং জরুরি, কিন্তু কোড তৈরির জন্য স্ট্রং কনসিস্টেন্সি দরকার। | ১-২ সে. ক্যাশ রিফ্রেশ ল্যাগ থাকতে পারে। | [০৪](https://sojibrd.github.io/system_design_roadmap/docs/04-availability-vs-consistency/) |
| ২ | Data Model | **PostgreSQL + Redis** | ৯১ GB ডেটার জন্য Postgres পারফেক্ট। সামনে Redis ক্যাশ থাকলে latency < 10ms। | NoSQL-এর মতো বিশাল স্কেলে অটো-শার্ডিং নেই। | [১২](https://sojibrd.github.io/system_design_roadmap/docs/12-databases/) |
| ৩ | Architecture | **Decoupled Services** | Read Service ও Write Service আলাদা রাখা হয়েছে যাতে ৯৯% রিড ট্র্যাফিক আলাদা স্কেল করে। | ডিপ্লয়মেন্ট জটিলতা কিছুটা বাড়ে। | [১০](https://sojibrd.github.io/system_design_roadmap/docs/10-application-layer/) |
| ৪ | API Protocol | **REST (HTTP 302 Found)** | ৩০২ ব্যবহারে ব্রাউজার ক্যাশ করে না, ফলে প্রতিটি ক্লিক এনালিটিক্স নির্ভুলভাবে রেকর্ড হয়। | সার্ভারে প্রতিটি ক্লিকে হিট আসে। | [১৫](https://sojibrd.github.io/system_design_roadmap/docs/15-communication/) |
| ৫ | Auth | **Hybrid Auth** | পাবলিক অ্যানোনিমাস লিংক তৈরি + রেজিস্টার্ড ইউজারদের জন্য JWT ভিত্তিক এনালিটিক্স। | IP-based Rate Limiting প্রয়োজন। | [২৫](https://sojibrd.github.io/system_design_roadmap/docs/25-security/) |
| ৬ | Monitoring | **Prometheus + Grafana** | Latency p95, Error rate 5xx ও Cache Hit ratio রিয়েলটাইমে পর্যবেক্ষণ ও অ্যালার্ট করা। | ইনফ্রাস্ট্রাকচার কস্ট সামান্য বাড়ে। | [১৮](https://sojibrd.github.io/system_design_roadmap/docs/18-monitoring/) |
| ৭ | Cache | **Redis Cache-Aside** | Read:Write ১০০:১ হওয়ায় ক্যাশ ব্যবহারে DB লোড ৯৫% কমে যায়। | Redis নোড ফেইল করলে DB-তে লোড পড়বে। | [১৩](https://sojibrd.github.io/system_design_roadmap/docs/13-caching/) |
| ৮ | Queue | **Redis Stream / RabbitMQ** | রিডাইরেক্ট রেসপন্স টাইম দ্রুত রাখতে ক্লিক এনালিটিক্স প্রসেসিং ব্যাকগ্রাউন্ডে নেওয়া। | Eventual consistency in Analytics. | [০৭](https://sojibrd.github.io/system_design_roadmap/docs/07-background-jobs/) |
| ৯ | Short Code Algorithm | **Base62 Encoding** | 0-9, a-z, A-Z (৬২ চিহ্ন) দিয়ে ৭-অক্ষরের $62^7 \approx 3.5 \text{ Trillion}$ জিরো-কলিশন ইউনিক কোড জেনারেট। | সুনির্দিষ্ট সিকোয়েন্স অনুমান এড়াতে সল্ট/হ্যাশ। | [১৬](https://sojibrd.github.io/system_design_roadmap/docs/16-idempotent-operations/) |
| ১০ | Replication | **Primary-Replica DB** | Availability 99.9% নিশ্চিত করতে Read Replicas ও Auto-failover। | র্যাপ্লিকেশন গ্যাপে ২-১ সে. স্টেল রিড হতে পারে। | [০৬](https://sojibrd.github.io/system_design_roadmap/docs/06-availability-patterns/) |
| ১১ | Load Balancer | **NGINX Load Balancer** | Peak ৫০০ QPS একাধিক এপ্লিকেশন সার্ভারে ব্যালেন্স করতে। | Single LB নোদ হলে SPOF ঝুঁকি থাকে। | [১১](https://sojibrd.github.io/system_design_roadmap/docs/11-load-balancers/) |

---

## ৪. যা ইচ্ছাকৃতভাবে বাদ দিলাম

| বাদ দেওয়া বিষয় | কেন বাদ দেওয়া হলো | কখন ফিরে আসবেন |
|---|---|---|
| **CDN (Content Delivery Network)** | কোনো স্ট্যাটিক মিডিয়া asset বা ভারী ফাইল নেই, সার্ভিসটি পুরোটাই ডাইনামিক HTTP Redirect। | যদি কোনো ব্র্যান্ড কাস্টম ডোমেইন বা স্ট্যাটিক ল্যান্ডিং পেজ যোগ হয়। |
| **Database Sharding** | ৫ বছরের মোট ডেটা মাত্র ৯১ GB, যা একক PostgreSQL সার্ভারেই স্বাচ্ছন্দে ধরে। | ডেটা > ১ TB অতিক্রম করলে বা Write QPS > ১০,০০০ হলে। |
| **Resiliency / Circuit Breaker** | বাইরের কোনো থার্ড-পার্টি পেমেন্ট বা থার্ড-পার্টি API-র ওপর সিস্টেমটি নির্ভরশীল নয়। | যদি বাইরের কোনো API (যেমন Google SafeBrowsing API) যোগ করা হয়। |

---

## ৫. আর্কিটেকচার

```
                           ┌──────────────────────────┐
                           │          Client          │
                           │    (Browser / Mobile)    │
                           └────────────┬─────────────┘
                                        │
                                        ▼
                           ┌──────────────────────────┐
                           │      Load Balancer       │
                           │         (NGINX)          │
                           └────────────┬─────────────┘
                                        │
                 ┌──────────────────────┴──────────────────────┐
                 │                                             │
                 ▼ (Read: 99%)                                 ▼ (Write: 1%)
    ┌──────────────────────────┐                  ┌──────────────────────────┐
    │     Redirect Service     │                  │    Shortener Service     │
    │      (Read Service)      │                  │     (Write Service)      │
    └────────────┬─────────────┘                  └────────────┬─────────────┘
                 │                                             │
      ┌──────────┴──────────┐                                  │
      ▼                     ▼                                  ▼
┌───────────┐         ┌───────────┐                      ┌───────────┐
│   Redis   │         │   Redis   │                      │ PostgreSQL│
│   Cache   │         │   Stream  │                      │ (Primary) │
└───────────┘         │  (Queue)  │                      └─────┬─────┘
                      └─────┬─────┘                            │
                            │                                  ▼
                            ▼                            ┌───────────┐
                  ┌──────────────────┐                   │ PostgreSQL│
                  │ Analytics Worker │                   │ (Replica) │
                  └──────────────────┘                   └─────────┬─┘
```

---

## ৬. যেখানে ভাঙবে

- **Redis Cache ডাউন হওয়া:** 
  - *ফলাফল:* ৫০০ Peak QPS সরাসরি Postgres DB-তে যাবে।
  - *প্রতিরোধ:* Redis High Availability (Sentinel Mode) এবং Postgres-এ PgBouncer Connection Pooling।
- **Postgres Primary DB মারা যাওয়া:** 
  - *ফলাফল:* নতুন লিংক তৈরি বন্ধ হবে, তবে ক্যাশে থাকা লিংকের রিডাইরেক্ট সচল থাকবে।
  - *প্রতিরোধ:* Primary-Replica Auto-failover configuration।
- **SPOF (Single Point of Failure):**
  - Primary Postgres Database (Write path-এর জন্য)
  - Single NGINX Load Balancer (প্রতিরোধ: Keepalived Virtual IP সহ Dual NGINX)।
