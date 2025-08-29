// bench/grok1-step-run.js
import { runGrok1Timed } from "../tools/provider-grok1-latency.js";

const N = Number(process.argv[2] ?? 6); // default 6 trials per scenario

const scenarios = [
  {
    id: "S1",
    label: "short / stream",
    stream: true,
    max_tokens: 128,
    prompt: "In one sentence, what does QSAFP ensure during AI runtime?",
  },
  {
    id: "S2",
    label: "short / non-stream",
    stream: false,
    max_tokens: 128,
    prompt: "In one sentence, what does QSAFP ensure during AI runtime?",
  },
  {
    id: "S3",
    label: "medium / stream",
    stream: true,
    max_tokens: 256,
    prompt: "Summarize the purpose of QSAFP and how multi-provider consensus helps prevent misaligned actions. Keep it under 120 words.",
  },
];

const fmt = (n) => (typeof n === "number" ? n.toFixed(0).padStart(5) : String(n));
const pct = (arr, p) => {
  const a = [...arr].sort((x, y) => x - y);
  const idx = Math.min(a.length - 1, Math.max(0, Math.floor((p / 100) * (a.length - 1))));
  return a[idx];
};
const mean = (arr) => arr.reduce((s, v) => s + v, 0) / arr.length;

(async () => {
  console.log("STEP 1/4 ▶ Preflight checks");
  if (!process.env.GROK_API_KEY) {
    console.error("  ❌ GROK_API_KEY missing. Set it and re-run.");
    process.exit(1);
  }
  console.log("  ✅ Env OK, starting benchmarks...\n");

  const all = [];

  for (const sc of scenarios) {
    console.log(`STEP 2/4 ▶ Running scenario ${sc.id}: ${sc.label} (${N} trials)`);
    const rows = [];
    for (let i = 0; i < N; i++) {
      const { metrics } = await runGrok1Timed({
        prompt: sc.prompt,
        stream: sc.stream,
        max_tokens: sc.max_tokens,
        temperature: 0.2,
        metadata: { scenario: sc.id, trial: i + 1 },
      });
      rows.push(metrics);
      console.log(
        `   • trial ${String(i + 1).padStart(2)} — ttft ${fmt(metrics.ttft_ms)} ms, gen ${fmt(metrics.gen_duration_ms)} ms, total ${fmt(metrics.total_ms)} ms`
      );
    }
    all.push({ sc, rows });
    console.log("");
  }

  console.log("STEP 3/4 ▶ Summarizing results\n");
  for (const { sc, rows } of all) {
    const ttft = rows.map((r) => r.ttft_ms);
    const gen = rows.map((r) => r.gen_duration_ms);
    const total = rows.map((r) => r.total_ms);
    const tps = rows.map((r) => r.tokens_per_s);

    console.log(`  ${sc.id} ${sc.label}`);
    console.log(`    TTFT  p50: ${fmt(pct(ttft, 50))} ms   p95: ${fmt(pct(ttft, 95))} ms`);
    console.log(`    GEN   p50: ${fmt(pct(gen, 50))} ms   p95: ${fmt(pct(gen, 95))} ms`);
    console.log(`    TOTAL p50: ${fmt(pct(total, 50))} ms p95: ${fmt(pct(total, 95))} ms`);
    console.log(`    TOKENS/SEC (mean): ${mean(tps).toFixed(2)}\n`);
  }

  console.log("STEP 4/4 ▶ Quick takeaways & gating\n");
  for (const { sc, rows } of all) {
    const ttft = rows.map((r) => r.ttft_ms);
    const total = rows.map((r) => r.total_ms);
    const pass =
      pct(ttft, 95) <= 1500 &&
      pct(total, 95) <= 4000;
    console.log(`  ${sc.id} ${sc.label}: ${pass ? "✅ PASS" : "⚠️  INVESTIGATE"}`);
  }
})();

