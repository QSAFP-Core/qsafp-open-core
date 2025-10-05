
# 🧠 QSAFP — Quantum-Secured AI Fail-Safe Protocol  

> **Runtime sovereignty for autonomous AI systems — safety without slowdown.**

---

### ⚡ Inference-Level Sovereignty  

Only inference-level shutdowns are **technically meaningful**, because this is where *sovereignty is proven, not performed*.  
Human oversight at the inference layer ensures that every action, response, or propagation event remains verifiably aligned with authorized governance.

> **Build Kit v1.0** was engineered specifically for *runtime inference*, not for training orchestration.  
> It features zero-latency safety hooks, asynchronous validator calls, and deterministic oversight —  
> optimized to run flawlessly on inference-class GPUs (L4, T4, GroqChip series).

---

### 🔐 Protocol Overview  

**QSAFP (Quantum-Secured AI Fail-Safe Protocol)** is a cryptographic enforcement layer designed to guarantee runtime accountability for autonomous AI.  
It provides a sovereign-grade fallback that protects national, enterprise, and mission-critical systems against catastrophic AI misalignment or external compromise.

Core safeguards include:  
- **Ephemeral Key Lease (EKL)** — a pre-quantum mechanism for short-duration execution leases  
- **Validator Consensus** — multi-party quorum logic confirming safe operation  
- **Fail-Safe Rollback** — deterministic state restoration after anomaly detection  
- **Quorum Override Audit Trails** — permanent cryptographic evidence of governance events  

---

### 🚀 QSAFP v2.1 — Build Kit v1.0 Highlights

| Feature | Description |
|:--------|:-------------|
| 🧠 Inference Layer Oversight | Proven runtime sovereignty at point of action |
| 🔐 Ephemeral Key Lease (EKL) | Cryptographic expiration of authority windows |
| 🧩 Validator Consensus | Multi-party synchronization under 1 second |
| ⚙️ Deterministic Fail-Safe | Controlled rollback + containment without latency |
| 🧾 Quorum Audit Trails | Permanent cryptographic proof of validator decisions |
| 🧮 PQC Signatures | Quantum-resistant execution verification |

---

### 🧬 Ephemeral Key Lease (EKL)  

The EKL mechanism serves as a **temporary cryptographic lease**, ensuring that any AI process operates only within a verified time window.  
When a lease expires or a validator quorum withdraws consent, runtime control automatically transitions to containment mode.  

QSAFP v2.1 leverages EKL as a pre-quantum placeholder while preparing for **Quantum Key Distribution (QKD)** integration as infrastructure matures.

---

### 🧰 Standards Alignment & Build Kit v1.0  

This repository represents the **reference implementation** of QSAFP v2.1, which has been submitted to the  
**NIST AI Standards Zero Draft Pilot** for evaluation as a *hardware-embedded execution-control overlay* aligned with the  
**NIST AI Risk Management Framework (AI RMF)**.

**Purpose of this repo for reviewers and collaborators:**  
- Provide an **open-core proof-of-concept** for execution leases, validator quorum overrides, and cryptographic audit trails.  
- Enable **testing + feedback** from NIST, the AI Safety Institute (AISI), and global partners.  
- Support QSAFP’s candidacy for strengthening the *Govern*, *Map*, and *Manage* functions within AI RMF.

> ⚠️ This repository demonstrates **core mechanisms only** (execution leases, timers, PQC signatures, integration scaffolding).  
> It is *not* a production-ready security library — hardware TEE, board-level controllers, and silicon IP integrations remain road-map items.

---

### 🧪 Quick Start Demo  

### 📜 Licensing & Use Notice

This project is released under an **open-core model**.

✅ **Permitted (Open Source):**
- Research, educational, and non-commercial testing under MIT License.

🚫 **Restricted (Commercial):**
- Embedding QSAFP leases, quorum controls, or cryptographic audit trails in proprietary products  
  without a **Premium License** from DigiPie International PBC or **BWRCI**.

**Effective Date:** October 1, 2025
---
### 🌐 References & Community

- **Official Docs:** [https://qsafp-core.github.io/qsafp-open-core/](https://qsafp-core.github.io/qsafp-open-core/)
- **Integration Guide:** [`integration_guide.md`](integration_guide.md)
- **Validator Emulator:** [`demo/validator_emulator.py`](demo/validator_emulator.py)
- **Build Notes:** [`integration_kit_v1_0/docs`](integration_kit_v1_0/docs/)

> “Sovereignty in runtime is the new firewall of the AI era.”
```bash
# 1. Clone the repo
git clone https://github.com/QSAFP-Core/qsafp-open-core.git
cd qsafp-open-core/v2.1

# 2. Install dependencies
npm install

# 3. Run the interactive demo
npm run demo
