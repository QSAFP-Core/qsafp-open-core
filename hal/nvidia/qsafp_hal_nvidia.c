#include <stdio.h>
#include "qsafp_hal_nvidia.h"

// Explicit stub implementation for biometric quorum
void run_biometric_quorum(void) {
    printf("[[NVIDIA HAL] Biometric quorum stub invoked.\n");
    fflush(stdout); // force output flush (Windows sometimes buffers)
}
