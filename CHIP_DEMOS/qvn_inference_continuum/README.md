# ⚙️ QSAFP — Chip Demos

**Quantum-Secured AI Fail-Safe Protocol**  
*Demonstrating runtime safety and quorum-voted lifecycle control at the silicon layer.*

---

## 📘 Overview

<!-- 🔮 Cosmic Rendering Preview -->
<p align="center" style="background: radial-gradient(circle at center, #0a0f1f 0%, #000510 100%); padding: 12px; border-radius: 12px;">
  <a href="qvn_inference_continuum/index.html">
    <img src="../ASSETS/Gif-QVN_Inference_Oversight_Continuum.gif"
         alt="Validator Consensus: TRUE (6/6) — Inference layer live – outputs in motion."
         width="760"
         style="border: 2px solid rgba(0,255,255,0.25); border-radius: 8px; box-shadow: 0 0 12px rgba(0,255,255,0.3);">
  </a>
  <br>
  <em>"Validator Consensus: TRUE (6/6)" – "Inference layer live – outputs in motion."</em>
</p>

The **CHIP_DEMOS** directory showcases *browser-ready live simulations* of how QSAFP enforces AI safety directly at the hardware and firmware levels. Each demo is **self-contained** — no build steps, compilers, or dependencies required.

- 🔐 **Node Layer** — chip-enforced runtime safeguards and lease expiration logic
- 🧠 **Inference Layer** — validator oversight via quorum consensus
- 🌐 **Human Quorum** — gold-ring authorization for re-activation

---

## 📂 Available Demos

### [QVN Inference Continuum](qvn_inference_continuum/)

Visual simulation of **dual-layer AI validation**.  
Observe *lease expiration → validation → re-authorization* in real time, illustrating QSAFP's rhythmic, quorum-voted lifecycle enforcement.

- ⚙️ **Core**: AI inference engine simulation
- 🌀 **Orbiting Dots**: active validator nodes
- 💫 **Gold Ring**: human quorum in consensus

---

## 🧪 Quick Run

```bash
git clone https://github.com/QSAFP-Core/qsafp-open-core.git
cd qsafp-open-core/CHIP_DEMOS/qvn_inference_continuum
python3 -m http.server 8080
```

Then open [http://localhost:8080](http://localhost:8080) and click **index.html** to launch the demo.

---

## 🧠 Why It Matters

While competitors rely on static firmware sign-offs or compliance checklists, QSAFP introduces **living, quorum-voted lifecycles etched in silicon**. It's the first open-core framework where AI safety is both verifiable and rhythmic — a *heartbeat of trust* between chips, validators, and humanity.

---

## 🪪 License

These chip demos are released under the **MIT License** for non-commercial research, education, and evaluation. Embedding QSAFP lease logic, quorum controls, or cryptographic audit trails into commercial silicon or firmware requires a **Premium License** from:

**DigiPie International PBC**  
*in association with BWRCI (Better World Regulatory Coalition Inc.)*

---

<p align="center">
  🧩 <em>"While others verify, QSAFP expires — quorum-voted lifecycles etched in silicon."</em>
</p>
