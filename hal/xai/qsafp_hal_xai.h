#ifndef QSAFP_HAL_XAI_H
#define QSAFP_HAL_XAI_H

#include <stdint.h>
#include <stdbool.h>

bool xai_hal_init(void);
bool xai_hal_entropy(uint8_t *buf, size_t len);
uint64_t xai_hal_timestamp(void);

#endif // QSAFP_HAL_XAI_H

