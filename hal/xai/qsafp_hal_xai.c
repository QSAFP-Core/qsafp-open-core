#include "qsafp_hal_xai.h"
#include <string.h>
#include <time.h>

bool xai_hal_init(void) {
    return true; // xAI HAL init stub
}

bool xai_hal_entropy(uint8_t *buf, size_t len) {
    // stub: fill with zeros (safe default, upgrade later)
    memset(buf, 0, len);
    return true;
}

uint64_t xai_hal_timestamp(void) {
    return (uint64_t) time(NULL);
}

