
# 🛡️ QSAFP — Safety Layer Overview

**License Notice**  
This directory and its contents are governed by the **GNU Affero General Public License (AGPL-3.0)**.  
Commercial or closed-source implementations require a **Premium License** from **DigiPie International PBC / BWRCI**.  
Contact: licensing@bwrci.org

---

### ⚙️ Purpose
The **SAFETY** layer implements the foundational runtime defense logic for the QSAFP ecosystem.  
These modules demonstrate how quantum-secured safety hooks, lease expirations, and validator handoffs protect inference-class GPUs and runtime engines.

### 📂 Files
| File | Description |
|------|--------------|
| **basic-threat-detection.js** | Minimal safety test for detecting rogue AI process signatures. |
| **perf-test.js** | Benchmark tool to profile safety enforcement latency and throughput. |
| **qsafp_v21_upgrade.js** | QSAFP v2.1 upgrade safety hooks for validator ingestion. |

---

### 🧩 Integration Notes
These components are included in **Build Kit v1.0** and demonstrate modular safety enforcement  
across inference GPUs (L4, T4, GroqChip series).  

Developers may freely **inspect, extend, or replicate** these examples under the AGPL-3.0 terms,  
provided that derivative works remain open-source and reference QSAFP’s attribution.

---

### 🪪 License Summary
- **Open-core license:** AGPL-3.0  
- **Commercial licensing:** Premium License (DigiPie International PBC / BWRCI)  
- **Effective date:** October 1, 2025  
