#include <stdio.h>
#include <windows.h>   // For Beep

// Runtime tick: now emits both log + JSON event
void qsafp_hal_runtime_tick(unsigned int tick) {
    // Human-readable log
    printf("[TICK] Runtime tick %u (total ticks: %u)\n", tick, tick + 1);

    // Audible signal
    Beep(750, 150); // frequency 750 Hz, duration 150 ms

    // JSON heartbeat event (validator-friendly)
    printf("{\"event\":\"heartbeat\",\"tick\":%u,\"status\":\"ok\"}\n", tick + 1);
}

// Shutdown event
void qsafp_hal_shutdown(unsigned int final_tick) {
    printf("[SHUTDOWN] QSAFP Firmware Stub shutting down.\n");
    Beep(400, 500); // deeper tone for shutdown

    // JSON shutdown event
    printf("{\"event\":\"shutdown\",\"tick\":%u,\"status\":\"completed\"}\n", final_tick);
}

int main() {
    printf("[BOOT] QSAFP Firmware Stub starting up...\n");
    Beep(1000, 200); // higher tone for boot

    unsigned int max_ticks = 5;

    for (unsigned int i = 0; i < max_ticks; i++) {
        qsafp_hal_runtime_tick(i);
        Sleep(500); // 0.5s pause between ticks
    }

    qsafp_hal_shutdown(max_ticks);
    return 0;
}
