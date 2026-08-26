/**
 * Roadmap docs-এর সব ```mermaid ব্লক পার্স করে দেখে — ভাঙা সিনট্যাক্স আছে কি না।
 *
 * কেন দরকার: mermaid ক্লায়েন্টে রেন্ডার হয়, তাই ভাঙা ডায়াগ্রাম `next build`
 * ধরতে পারে না — শুধু ব্রাউজারে ডক খুললে চোখে পড়ে। ৫০+ ডায়াগ্রামের জন্য
 * এটা ভরসা করার মতো নয়।
 *
 *   node scripts/check-diagrams.mjs
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";

const DIRS = ["docs"];

// mermaid ব্রাউজার API ধরে নেয়, তাই jsdom দিয়ে একটা DOM বসানো হচ্ছে
const dom = new JSDOM("<!doctype html><html><body></body></html>");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
// Node 24-এ globalThis.navigator শুধু getter — তাই defineProperty
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});

const { default: mermaid } = await import("mermaid");
mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return full.endsWith(".md") ? [full] : [];
  });
}

// \r?\n — ডক ফাইলগুলো CRLF হতে পারে, তাই \n একা যথেষ্ট নয়
const FENCE = /```mermaid\r?\n([\s\S]*?)```/g;
let total = 0;
let failed = 0;

const allFiles = DIRS.flatMap((d) => (statSync(d, { throwIfNoEntry: false })?.isDirectory() ? walk(d) : []));

for (const file of allFiles) {
  const source = readFileSync(file, "utf8");
  let match;
  let index = 0;
  while ((match = FENCE.exec(source)) !== null) {
    index += 1;
    total += 1;
    try {
      await mermaid.parse(match[1]);
    } catch (error) {
      failed += 1;
      console.error(`\n❌ ${file} — ডায়াগ্রাম #${index}`);
      console.error(`   ${error.message?.split("\n")[0] ?? error}`);
    }
  }
}

console.log(`\n${total} টি ডায়াগ্রাম যাচাই — ${total - failed} ঠিক, ${failed} ভাঙা`);
process.exit(failed > 0 ? 1 : 0);
