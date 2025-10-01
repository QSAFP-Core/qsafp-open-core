# simple_loop_demo.py
import subprocess
from integration_kit_v1_0.validator.validator_emulator import run_validator

print("[Demo] Launching QSAFP simple loop...")

# Run validator first
ok = run_validator()

if ok:
    print("[Demo] Validator check passed, simulating firmware...")
    # For now we just echo firmware output instead of compiling C
    print("[Firmware] Boot sequence start...")
    print("[Firmware] Temporal boundary handshake: OK")
    for i in range(3):
        print(f"[Firmware] Runtime tick {i+1}")
    print("[Firmware] Runtime status: SAFE")
else:
    print("[Demo] Validator failed, aborting firmware startup.")

print("[Demo] QSAFP simple loop complete.")
