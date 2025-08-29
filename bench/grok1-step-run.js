'use strict';
const { runGrok1Timed } = require('../tools/provider-grok1-latency.js');
const fs = require('node:fs/promises');

const N = Number(process.argv[2] ?? 12);

const scenarios = [
  { id: 'S1', label: 'short / stream',      stream: true,  max_tokens: 128, prompt: 'In one sentence, what does QSAFP ensure during AI runtime?' },
  { id: 'S2', label: 'short / non-stream',  stream: false, max_tokens: 128, prompt: 'In one sentence, what does QSAFP ensure during AI runtime?' },
  { id: 'S3', label: 'medium / stream',     stream: true,  max_tokens: 256, prompt: 'Summarize the purpose of QSAFP and how multi-provider consensus helps prevent misaligned actions. Keep it under 120 words.' },
];

const fmt  = (n) => (typeof n === 'number' ? String(Math.round(n)).padStart(5) : String(n));
const pct  = (arr, p) => { const a=[...arr].sort((x,y)=>x-y); const i=Math.min(a.length-1, Math.max(0, Math.floor((p/100)*(a.length-1)))); return a[i]; };
const mean = (arr) => arr.reduce((s,v)=>s+v,0)/arr.length;

(async () => {
  console.log('STEP 1/4 ▶ Preflight checks');
  if (!process.env.GROK_API_KEY) { console.error('  ❌ GROK_API_KEY missing. (Windows cmd) set GROK_API_KEY=xxxxx'); process.exit(1); }
  console.log('  ✅ Env OK, starting benchmarks...\n');

  const all = [];
  for (const sc of scenarios) {
    console.log(`STEP 2/4 ▶ Running scenario ${sc.id}: ${sc.label} (${N} trials)`);
    const rows = [];
    for (let i = 0; i < N; i++) {
      const { metrics } = await runGrok1Timed({
        prompt: sc.prompt, stream: sc.stream, max_tokens: sc.max_tokens, temperature: 0.2,
        metadata: { scenario: sc.id, trial: i + 1 },
      });
      rows.push(metrics);
      console.log(`   • trial ${String(i+1).padStart(2)} — ttft ${fmt(metrics.ttft_ms)} ms, gen ${fmt(metrics.gen_duration_ms)} ms, total ${fmt(metrics.total_ms)} ms`);
    }
    all.push({ sc, rows });
    console.log('');
  }

  console.log('STEP 3/4 ▶ Summarizing results\n');
  for (const { sc, rows } of all) {
    const ttft = rows.map(r=>r.ttft_ms), gen = rows.map(r=>r.gen_duration_ms), total = rows.map(r=>r.total_ms), tps = rows.map(r=>r.tokens_per_s);
    console.log(`  ${sc.id} ${sc.label}`);
    console.log(`    TTFT  p50: ${fmt(pct(ttft,50))} ms   p95: ${fmt(pct(ttft,95))} ms`);
    console.log(`    GEN   p50: ${fmt(pct(gen,50))} ms   p95: ${fmt(pct(gen,95))} ms`);
    console.log(`    TOTAL p50: ${fmt(pct(total,50))} ms p95: ${fmt(pct(total,95))} ms`);
    console.log(`    TOKENS/SEC (mean): ${mean(tps).toFixed(2)}\n`);
  }

  console.log('STEP 4/4 ▶ Quick takeaways & gating\n');
  for (const { sc, rows } of all) {
    const ttft = rows.map(r=>r.ttft_ms), total = rows.map(r=>r.total_ms);
    const pass = pct(ttft,95) <= 1500 && pct(total,95) <= 4000;
    console.log(`  ${sc.id} ${sc.label}: ${pass ? '✅ PASS' : '⚠️  INVESTIGATE'}`);
  }

  // Optional CSV
  const flat = all.flatMap(({rows})=>rows);
  if (flat.length) {
    const header = Object.keys(flat[0]).join(',');
    const csv = [header, ...flat.map(r=>Object.values(r).join(','))].join('\n');
    await fs.writeFile('grok1_latency.csv', csv, 'utf8');
    console.log('\nWrote grok1_latency.csv');
  }
})();
