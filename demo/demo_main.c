#include <stdio.h>
#include "hal/xai/qsafp_hal_xai.h"

// QSAFP Demo entrypoint
int main(void) {
    printf("Running QSAFP demo...\n");

    // Call into the partner-specific HAL (xAI stub for now)
    run_biometric_quorum();

    printf("QSAFP demo finished.\n");
    return 0;
}
