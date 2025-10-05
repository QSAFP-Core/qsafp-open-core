import argparse
import subprocess
import json
import sys

def run_firmware(json_mode=False):
    # Launch the compiled firmware stub as a subprocess
    process = subprocess.Popen(
        ["./qsafp_firmware_stub.exe"],  # Windows executable
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )

    for line in process.stdout:
        line = line.strip()
        if not line:
            continue

        if json_mode:
            # Try to parse JSON lines
            if line.startswith("{") and line.endswith("}"):
                try:
                    event = json.loads(line)
                    print(f"[Validator] Event: {event['event']} | Tick: {event.get('tick')} | Status: {event['status']}")
                except json.JSONDecodeError:
                    # If not valid JSON, skip or log as raw
                    print(f"[Validator] Non-JSON line: {line}")
            else:
                # Non-JSON log lines
                print(f"[LOG passthrough] {line}")
        else:
            # Default mode: just print everything
            print(line)

    process.wait()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="QSAFP Firmware Demo")
    parser.add_argument("--json", action="store_true", help="Enable JSON validator mode")
    args = parser.parse_args()

    run_firmware(json_mode=args.json)
