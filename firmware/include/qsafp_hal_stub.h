#ifndef QSAFP_HAL_STUB_H
#define QSAFP_HAL_STUB_H

#include <stdint.h>
#include <stdbool.h>

// Boot the firmware
void qsafp_hal_boot(void);

// Boundary check (returns true if safe, false if out-of-bounds)
bool qsafp_hal_boundary_check(int value, int min, int max);

// Runtime tick handler
void qsafp_hal_runtime_tick(uint32_t tick);

// Shutdown routine
void qsafp_hal_shutdown(void);

#endif // QSAFP_HAL_STUB_H
