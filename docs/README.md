# System Design Roadmap

[roadmap.sh/system-design](https://roadmap.sh/system-design) এর কাঠামো অনুসরণ করে তৈরি একটি সম্পূর্ণ বাংলা ডকুমেন্টেশন। রোডম্যাপের প্রতিটি main topic-এর জন্য একটি করে ফাইল, প্রতিটিতে সেই টপিকের সব subtopic ব্যাখ্যাসহ।

কারিগরি টার্মগুলো ইংরেজিতেই রাখা হয়েছে — কারণ বাস্তব কাজে, ডকুমেন্টেশনে ও ইন্টারভিউতে আপনি এই শব্দগুলোই ব্যবহার করবেন।

> **নোট**: roadmap.sh-এর অফিসিয়াল API কেবল রোডম্যাপের নোড ও তাদের ক্রম সরবরাহ করে; প্রতিটি টপিকের ব্যাখ্যামূলক লেখা সেখানে নেই। তাই **কাঠামোটি roadmap.sh থেকে হুবহু নেওয়া, আর ব্যাখ্যাগুলো এই ডকুমেন্টের জন্য আলাদাভাবে লেখা**।

---

## Fundamentals

সিস্টেম ডিজাইনের মৌলিক ধারণা ও trade-off গুলো। এই ছয়টি অধ্যায় পরের সব কিছুর ভিত্তি — এগুলো এড়িয়ে গেলে বাকিটা মুখস্থবিদ্যা হয়ে দাঁড়াবে।

| # | টপিক | যা কভার করে |
|---|---|---|
| 01 | [Introduction](01-introduction.md) | What is System Design?, How to approach System Design? |
| 02 | [Performance vs Scalability](02-performance-vs-scalability.md) | পার্থক্য, vertical vs horizontal scaling, Amdahl's Law |
| 03 | [Latency vs Throughput](03-latency-vs-throughput.md) | Little's Law, percentile, tail latency, latency-র বাস্তব সংখ্যা |
| 04 | [Availability vs Consistency](04-availability-vs-consistency.md) | CAP Theorem, AP, CP, PACELC |
| 05 | [Consistency Patterns](05-consistency-patterns.md) | Weak, Eventual, Strong Consistency, Quorum |
| 06 | [Availability Patterns](06-availability-patterns.md) | Fail-Over (Active-Active/Passive), Replication (Master-Slave/Master-Master), Availability in Numbers |

## Core Components

একটি বাস্তব সিস্টেমের প্রধান উপাদানগুলো — request যে পথে যায় সেই ক্রমে সাজানো।

| # | টপিক | যা কভার করে |
|---|---|---|
| 07 | [Background Jobs](07-background-jobs.md) | Event-Driven, Schedule Driven, Returning Results |
| 08 | [Domain Name System](08-domain-name-system.md) | Lookup, TTL, record types, DNS routing, DNSSEC |
| 09 | [Content Delivery Networks](09-content-delivery-networks.md) | Push CDN, Pull CDN, invalidation, cache header |
| 10 | [Application Layer](10-application-layer.md) | Microservices, Service Discovery, health check |
| 11 | [Load Balancers](11-load-balancers.md) | LB vs Reverse Proxy, Layer 4, Layer 7, algorithms, Horizontal Scaling |
| 12 | [Databases](12-databases.md) | SQL vs NoSQL, Replication, Sharding, Federation, Denormalization, SQL Tuning, Key-Value/Document/Wide Column/Graph |
| 13 | [Caching](13-caching.md) | Client/CDN/Web Server/Database/Application caching, Cache Aside, Write-through, Write-behind, Refresh Ahead |

## Communication & Behavior

Component গুলো কীভাবে কথা বলে, এবং কোথায় সেই যোগাযোগ ভেঙে পড়ে।

| # | টপিক | যা কভার করে |
|---|---|---|
| 14 | [Asynchronism](14-asynchronism.md) | Message Queues, Task Queues, Back Pressure |
| 15 | [Communication](15-communication.md) | TCP, UDP, HTTP, REST, GraphQL, RPC, gRPC |
| 16 | [Idempotent Operations](16-idempotent-operations.md) | Idempotency key, HTTP method, retry-র নিয়ম |
| 17 | [Performance Antipatterns](17-performance-antipatterns.md) | Busy Database, Busy Frontend, Chatty I/O, Retry Storm, No Caching, Improper Instantiation, Monolithic Persistence, Noisy Neighbor, Synchronous I/O, Extraneous Fetching |

## Operations

| # | টপিক | যা কভার করে |
|---|---|---|
| 18 | [Monitoring](18-monitoring.md) | Health, Availability, Performance, Security, Usage Monitoring, Instrumentation, Visualization & Alerts |

## Cloud Design Patterns

> এই তিনটি অধ্যায়ের প্যাটার্নগুলোর গুরুত্ব সমান নয়। সবগুলো আয়ত্ত করার দরকার নেই — কোনটা কী সমস্যার সমাধান করে সেটা চেনা থাকলেই যথেষ্ট।

| # | টপিক | যা কভার করে |
|---|---|---|
| 19 | [Design & Implementation](19-design-and-implementation-patterns.md) | Ambassador, Anti-Corruption Layer, Backends for Frontend, Compute Resource Consolidation, External Config Store, Gateway Aggregation/Offloading/Routing, Leader Election, Pipes & Filters, Sidecar, Static Content Hosting, Strangler Fig, CQRS |
| 20 | [Data Management](20-data-management-patterns.md) | Cache-Aside, Event Sourcing, CQRS, Index Table, Materialized View, Sharding, Static Content Hosting, Valet Key |
| 21 | [Messaging](21-messaging-patterns.md) | Async Request Reply, Claim Check, Choreography, Competing Consumers, Pipes and Filters, Priority Queue, Publisher/Subscriber, Queue-Based Load Leveling, Scheduling Agent Supervisor, Sequential Convoy |

## Reliability Patterns

| # | টপিক | যা কভার করে |
|---|---|---|
| 22 | [Availability](22-availability.md) | Deployment Stamps, Geodes, Health Endpoint Monitoring, Queue-Based Load Leveling |
| 23 | [High Availability](23-high-availability.md) | Deployment Stamps, Geodes, Health Endpoint Monitoring, Circuit Breaker, Throttling |
| 24 | [Resiliency](24-resiliency.md) | Bulkhead, Circuit Breaker, Compensating Transaction, Health Endpoint Monitoring, Leader Election, Queue-Based Load Leveling, Retry, Scheduler Agent Supervisor |
| 25 | [Security](25-security.md) | Federated Identity, Gatekeeper, Valet Key |

---

## কীভাবে পড়বেন

**প্রথমবার শিখছেন**: ০১ থেকে ১৮ পর্যন্ত ক্রমানুসারে পড়ুন। ১৯–২৫ অধ্যায়ের প্যাটার্নগুলো তখনই অর্থবহ হবে যখন আপনি ভিত্তিগুলো বুঝেছেন — সেগুলো আপাতত দ্রুত চোখ বুলিয়ে যান, বিস্তারিত পড়ুন যখন সেই সমস্যার মুখোমুখি হবেন।

**ইন্টারভিউ প্রস্তুতি**: ০১–০৬ (trade-off গুলো ভালোভাবে), তারপর ১১–১৪ (LB, DB, Cache, Queue — এই চারটিই বেশিরভাগ ডিজাইন প্রশ্নের কঙ্কাল), তারপর ১৭ ও ২৩–২৪।

**কোনো নির্দিষ্ট সমস্যায় আটকে আছেন**: উপরের টেবিলে subtopic খুঁজে সরাসরি সেই অধ্যায়ে যান। প্রতিটি ফাইলের শেষে আগের ও পরের অধ্যায়ের লিংক আছে।

## যে সূত্রগুলো বারবার লাগবে

```
Availability (sequence)  = A × B                  ← dependency যত বেশি, availability তত কম
Availability (parallel)  = 1 − (1 − A) × (1 − B)  ← redundancy availability বাড়ায়
Little's Law             = L = λ × W              ← concurrency = আগমনের হার × সময়
Quorum (strong)          = W + R > N              ← read ও write-এ অন্তত একটা common node
```

## মূল কথা

System design-এ কোনো "সঠিক উত্তর" নেই, আছে **trade-off**। এই ডকুমেন্টের প্রতিটি প্যাটার্নের সাথে তার খরচও লেখা আছে — সেটাই আসল অংশ। যে সমাধান একটা সিস্টেমে চমৎকার, সেটাই অন্যটায় অপ্রয়োজনীয় জটিলতা।
