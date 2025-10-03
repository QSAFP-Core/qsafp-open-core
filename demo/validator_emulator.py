import subprocess
import json

def run_emulator():
    # Launch firmware stub
    process = subprocess.Popen(
        ["./qsafp_firmware_stub.exe"],  # compiled firmware binary
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    print("[ValidatorEmu] Starting validator emulator...\n")

    for line in process.stdout:
        line = line.strip()
        if not line:
            continue

        # Only care about JSON lines
        if line.startswith("{") and line.endswith("}"):
            try:
                event = json.loads(line)
                if event["event"] == "heartbeat":
                    print(f"[ValidatorEmu] ✅ Node alive | Tick: {event['tick']}")
                elif event["event"] == "shutdown":
                    print(f"[ValidatorEmu] ❌ Node shutdown | Final Tick: {event['tick']}")
            except json.JSONDecodeError:
                print(f"[ValidatorEmu] (non-JSON passthrough): {line}")
        else:
            # Ignore or show passthrough logs
            print(f"[ValidatorEmu] (log): {line}")

    process.wait()
    print("\n[ValidatorEmu] Emulator finished.")

if __name__ == "__main__":
    run_emulator()
