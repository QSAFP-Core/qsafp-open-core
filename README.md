# 🔐 QSAFP – Quantum-Secured AI Fail-Safe Protocol
[![Commercial Use Requires License](https://img.shields.io/badge/Commercial%20Use-Requires%20License-red)](#-commercial-use-notice)

QSAFP (Quantum-Secured AI Fail-Safe Protocol) is a cryptographic enforcement system designed to ensure runtime accountability for autonomous AI systems.  
It offers a robust, sovereign-grade fallback that safeguards national and enterprise infrastructure against catastrophic AI misalignment or external compromise.

Currently leveraging Ephemeral Key Lease (EKL) as a pre-quantum placeholder, with QKD integration planned as infrastructure matures.
---

## 📜 Standards Submission Note (September 2025)

This repository includes the **reference implementation** of **QSAFP v2.1**, which has been submitted to the **NIST AI Standards Zero Draft Pilot** for consideration as a **hardware-embedded execution control overlay** aligned with the NIST AI Risk Management Framework (AI RMF).

**Purpose of this repo for standards reviewers:**
- Provide an **open-core proof-of-concept** for execution leases, quorum overrides, and cryptographic audit trails.  
- Enable **testing and feedback** from NIST, the AI Safety Institute (AISI), and global collaborators.  
- Support evaluation of QSAFP as a candidate overlay to strengthen the *Govern*, *Map*, and *Manage* functions in the AI RMF.  

**Important notes:**
- This repo demonstrates **core mechanisms only** (execution leases, timers, PQC signatures, integration scaffolding).  
- It is **not a production-ready security library**; hardware TEE, board-level controllers, and silicon IP integrations are roadmap items.  
- Contributions, issues, and test feedback are welcome.
- ### 🔬 Quick Test (5 Minutes)

For reviewers who want to see QSAFP in action:

```bash
# 1. Clone the repo
git clone https://github.com/[your-org]/qsafp-core.git
cd qsafp-core/v2.1

# 2. Install dependencies
npm install

# 3. Run the demo (opens browser showcase)
npm run demo

---
## 🚀 QSAFP v2.1 – Released August 25, 2025

### What’s new for the community (non-premium):
- ✅ Model lifecycle auditing  
- ✅ Open A/B benchmarks (v2.0 vs v2.1)  
- ✅ Demo kill-switch stubs (safe to test)  
- ✅ BYO API scaffolding for integrations  
- ✅ Academic & nonprofit pilot readiness  

### Premium features remain enterprise-only:
- 🔒 Quantum enforcement of model shutdowns  
- 🔒 Federated trust + expiration chains  
- 🔒 FinCEN-aligned tamper-proof logging APIs  
- 🔒 Sovereign ID dashboards and governance  

---

## ⚙️ Integration Kits

We provide versioned integration kits so developers can test, benchmark, and adopt QSAFP at different maturity levels.

### 📊 v2.0 – Stable Integration Kit
- ⚡ ~800ms AI safety analysis
- 🤝 ~1.8s multi-provider consensus
- 🛡️ Proven stability in production

📂 [Go to v2.0](./v2.0)

### 🚀 v2.1 – High Performance Integration Kit
- ⚡ <400ms AI safety analysis
- 🤝 <1s multi-provider consensus
- 🛡️ >95% threat detection accuracy
- 🎯 ~2× faster than v2.0

📂 [Go to v2.1](./v2.1)  

**Demo:** Open [`/v2.1/demo-v21.html`](./v2.1/demo-v21.html) in a modern browser to run the performance showcase.

---

## 📈 QSAFP v2.1 Performance & Observability

QSAFP v2.1 achieves **partnership-level performance targets** and now includes **granular per-provider latency logging** for transparent, verifiable benchmarks.

### ✅ Baseline Results (v2.1.0)
- **Safety Analysis:** <1ms average (deterministic pre-filter, regex/DFA triage)  
- **Multi-Provider Consensus:** ~660ms average (target: <1000ms)  
- **Threat Detection Accuracy:** 100% on baseline suite (9/9 prompts)  

### 🔍 New Observability Features
- **Per-Provider Timings:** Each provider call is individually timed and logged  
- **Consensus Elapsed Time:** Total consensus latency measured inside the engine  
- **Failure Diagnostics:** Rejected/errored providers are logged with error codes and response times  
- **Console Tables:** Results printed as clear, auditable tables during benchmarks

---

## 🛡️ Commercial Use Notice

QSAFP is released under an **open-core model**.  

- ✅ **Permitted Uses (Open Source):**  
  Free for research, educational, and non-commercial testing under the MIT License.  

- 🚫 **Prohibited Without Authorization (Commercial):**  
  Any commercial use of this software — including but not limited to:  
  • Embedding QSAFP execution leases, quorum overrides, or cryptographic audit trails into commercial products or services  
  • Offering derivative monitoring or test modules as part of a commercial product or managed service  
  • Monetizing derivative works that rely on QSAFP core logic, specifications, or patent-covered methods  
requires a **Premium Services License** from **DigiPie International PBC** or **BWRCI**.  

**Effective Date:** October 1, 2025  


**Example Output:**
