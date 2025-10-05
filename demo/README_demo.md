# QSAFP Demo Guide

This folder contains demonstration scripts for running the **QSAFP Firmware Stub** in both **mock mode** and **binary mode**.  
These demos simulate and validate the core runtime loop of the fail-safe system.
---
## 🔧 Prerequisites

- **Python 3.8+**
- **GCC/MinGW (WinLibs build)** added to your system PATH
- Verified that `gcc --version` runs successfully in your terminal
- Built the firmware stub from source
---
 Build the Firmware Stub

From the project root:

```powershell
gcc -I firmware/include firmware/src/qsafp_firmware_stub.c -o firmware/bin/qsafp_firmware_stub.exe
---
 JSON Output Section**  
```markdown
---
 📊 JSON Output Mode

In addition to audible beeps, the firmware stub can emit **structured JSON events**.  
This allows validators to ingest runtime signals programmatically.

Run the firmware stub:

```powershell
.\qsafp_firmware_stub.exe

[BOOT] QSAFP Firmware Stub starting up...
[TICK] Runtime tick 0 (total ticks: 1)
{"event":"heartbeat","tick":1,"status":"ok"}
[TICK] Runtime tick 1 (total ticks: 2)
{"event":"heartbeat","tick":2,"status":"ok"}
[TICK] Runtime tick 2 (total ticks: 3)
{"event":"heartbeat","tick":3,"status":"ok"}
[TICK] Runtime tick 3 (total ticks: 4)
{"event":"heartbeat","tick":4,"status":"ok"}
[TICK] Runtime tick 4 (total ticks: 5)
{"event":"heartbeat","tick":5,"status":"ok"}
[SHUTDOWN] QSAFP Firmware Stub shutting down.
{"event":"shutdown","tick":5,"status":"completed"}
---
Validator Emulator Section + Wrap-Up**  
```markdown
---

🖥️ Validator Emulator

We also provide a simple **validator emulator** to show how nodes ingest JSON events and confirm runtime health.

From the repo root:

```powershell
python demo/validator_emulator.py

[ValidatorEmu] Starting validator emulator...
[ValidatorEmu] ✅ Node alive | Tick: 1
[ValidatorEmu] ✅ Node alive | Tick: 2
[ValidatorEmu] ✅ Node alive | Tick: 3
[ValidatorEmu] ✅ Node alive | Tick: 4
[ValidatorEmu] ✅ Node alive | Tick: 5
[ValidatorEmu] ❌ Node shutdown | Final Tick: 5

[ValidatorEmu] Emulator finished.


