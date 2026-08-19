/**
 * প্রতিটি সিমুলেশনের ভেতরের রেফারেন্স যাচাই করে।
 *
 * একটা step যে node বা edge-কে "active" বলছে, সেটা সত্যিই ওই লেভেলে আছে কিনা —
 * TypeScript এটা ধরতে পারে না, কারণ সবই স্ট্রিং। ভুল আইডি লিখলে build পাস করে,
 * কিন্তু ক্যানভাসে ওই ধাপে কিছুই জ্বলে না। এই স্ক্রিপ্ট সেটাই ধরে।
 *
 * চালান: npm run check:simulations
 */
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const MODULES = [
  "app/lib/simulations/url-shortener/index.ts",
  "app/lib/simulations/rate-limiter/index.ts",
];

let broken = 0;
let warnings = 0;

const fail = (msg) => {
  console.log(`✗ ${msg}`);
  broken++;
};

for (const relative of MODULES) {
  const mod = await import(pathToFileURL(resolve(relative)).href);
  const sim = Object.values(mod).find((value) => value && value.levels);

  if (!sim) {
    fail(`${relative}: কোনো SimulationConfig export পাওয়া যায়নি`);
    continue;
  }

  for (const level of sim.levels) {
    const nodeIds = new Set(level.nodes.map((node) => node.id));
    const edgeIds = new Set(level.edges.map((edge) => edge.id));
    const where = `${sim.id}/${level.id}`;

    for (const edge of level.edges) {
      for (const end of ["source", "target"]) {
        if (!nodeIds.has(edge[end])) {
          fail(`${where} edge ${edge.id}: ${end} "${edge[end]}" নামে কোনো node নেই`);
        }
      }
    }

    for (const flow of level.flows) {
      for (const step of flow.steps) {
        const at = `${where}/${step.id}`;

        if (step.flowType !== flow.id) {
          fail(`${at}: flowType "${step.flowType}" ≠ flow "${flow.id}"`);
        }
        for (const id of step.activeNodeIds ?? []) {
          if (!nodeIds.has(id)) fail(`${at}: activeNode "${id}" নেই`);
        }
        for (const id of step.activeEdgeIds ?? []) {
          if (!edgeIds.has(id)) fail(`${at}: activeEdge "${id}" নেই`);
        }
        for (const id of Object.keys(step.edgeOverrides ?? {})) {
          if (!edgeIds.has(id)) fail(`${at}: edgeOverride "${id}" নেই`);
        }
        for (const id of Object.keys(step.nodeStatusMessages ?? {})) {
          if (!nodeIds.has(id)) fail(`${at}: nodeStatusMessage "${id}" নেই`);
        }
      }
    }

    // ভুল হলে build ভাঙার মতো নয়, কিন্তু ডিজাইন নোটে ভুল সংখ্যা দেখায়।
    if (level.componentCount !== level.nodes.length) {
      console.log(
        `⚠ ${where}: componentCount ${level.componentCount}, কিন্তু node আছে ${level.nodes.length}টি`
      );
      warnings++;
    }
  }

  const steps = sim.levels.reduce(
    (total, level) =>
      total + level.flows.reduce((sum, flow) => sum + flow.steps.length, 0),
    0
  );
  console.log(`${sim.id}: ${sim.levels.length} লেভেল, ${steps} ধাপ যাচাই করা হলো`);
}

console.log(
  broken === 0
    ? `✓ সব রেফারেন্স ঠিক${warnings ? ` (${warnings}টি সতর্কতা)` : ""}`
    : `✗ ${broken}টি ভাঙা রেফারেন্স`
);

process.exit(broken === 0 ? 0 : 1);
