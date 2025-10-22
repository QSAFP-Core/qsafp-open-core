> **License Notice:**  
> This integration guide is provided under the GNU AGPL-3.0 open-core license.  
> Commercial or closed-source implementations require a Premium License from DigiPie International PBC / BWRCI.
\# QSAFP Integration Guide



\## Firmware Stub → Validator Alerts



In Day 2, the firmware stub produced simple heartbeat ticks with audible beeps and log lines.  

In Day 3, we’ve extended it to also emit \*\*structured JSON events\*\* that validators can ingest.



\### Example Firmware Output

When you compile and run the v2.0 stub:



```powershell

gcc -o qsafp\_firmware\_stub.exe qsafp\_firmware\_stub.c

.\\qsafp\_firmware\_stub.exe



\[BOOT] QSAFP Firmware Stub starting up...

\[TICK] Runtime tick 0 (total ticks: 1)

{"event":"heartbeat","tick":1,"status":"ok"}

\[TICK] Runtime tick 1 (total ticks: 2)

{"event":"heartbeat","tick":2,"status":"ok"}

\[TICK] Runtime tick 2 (total ticks: 3)

{"event":"heartbeat","tick":3,"status":"ok"}

\[TICK] Runtime tick 3 (total ticks: 4)

{"event":"heartbeat","tick":4,"status":"ok"}

\[TICK] Runtime tick 4 (total ticks: 5)

{"event":"heartbeat","tick":5,"status":"ok"}

\[SHUTDOWN] QSAFP Firmware Stub shutting down.

{"event":"shutdown","tick":5,"status":"completed"}



---



\### Python Demo: Parsing JSON

We extended the Python demo (`demo/simple\_loop\_demo.py`) to support a `--json` mode.



From the repo root:



```powershell

python demo/simple\_loop\_demo.py --json



\[LOG passthrough] \[BOOT] QSAFP Firmware Stub starting up...

\[Validator] Event: heartbeat | Tick: 1 | Status: ok

\[Validator] Event: heartbeat | Tick: 2 | Status: ok

\[Validator] Event: heartbeat | Tick: 3 | Status: ok

\[Validator] Event: heartbeat | Tick: 4 | Status: ok

\[Validator] Event: heartbeat | Tick: 5 | Status: ok

\[Validator] Event: shutdown | Tick: 5 | Status: completed

[Validator] Event: shutdown | Tick: 5 | Status: completed
```)  
scroll **one line below that**, hit **Enter**, and then **paste this Markdown block**:  

```markdown
---
### Implementation Note
> This integration stub demonstrates QSAFP’s heartbeat and validation event flow.  
> In live deployments, QVN operates under a dual-track renewal model:
> - **Track A (Machine Attestation):** Executes locally in <1 second for continuous runtime safety.  
> - **Track B (Validator Consensus):** Completes asynchronously (typically within ~60 seconds) with optional human validation windows (5–30 minutes).  
> 
> The firmware and validator examples provided here illustrate Track A behavior; Track B consensus runs in parallel without interrupting inference workloads.



