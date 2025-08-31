# 🔁 QSAFP Interactive Demo

Ready to experience provable AI fail-safes in action?

👉 **[Launch the Interactive Demo](https://qsafp-core.github.io/qsafp-open-core/)**

This hands-on walkthrough demonstrates key QSAFP mechanisms in real-time:

- 🔐 Quantum-generated session keys  
- ⛓️ Immutable checkpoint sealing  
- 🛑 Provable runtime expiration  
- 🧭 Multi-party biometric consensus  

It's a must-see for developers, AI governance advocates, and cyber-physical architects alike.

---

🌐 Prefer a short link? Go straight to: [https://qsafp.org](https://qsafp.org)

---

## ⚡ Quickstart (CLI)

Run local benchmarks to reproduce QSAFP performance:

```bash
node scripts/qsafp_v21_upgrade.js --providers all --runs 10 --out artifacts/demo
node scripts/aggregate-metrics.js artifacts/demo > artifacts/demo/summary.json
```

**Expected results:**
* Safety p50 ~ sub-ms, p99 ≤ 5 ms
* Consensus p50 ≤ 1 s, p99 ≤ 2 s

![Demo Summary](demo-summary.png)

Run the aggregator to see overall latencies:

```bash
node scripts/aggregate-metrics.js artifacts/2025-08-31
```

Example output:

![Demo Consensus](demo-consensus.png)

Single run with multiple providers:

```bash
node scripts/qsafp_v21_upgrade.js --providers openai,anthropic,msft --runs 1
```

Look for the consensus timing line:

![Demo Verbose](demo-verbose.png)

Single provider, verbose output:

```bash
node scripts/qsafp_v21_upgrade.js --providers openai --runs 1 --verbose
```

Shows per-provider analysis logs:
