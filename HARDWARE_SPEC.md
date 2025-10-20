# QSAFP Hardware Integration Specification
## Firmware-Level Requirements for Chip Manufacturers

**Version:** 1.0  
**Last Updated:** October 2025  
**Target Architectures:** ARM (v7-A/v8-A), x86-64, RISC-V

---

## 📋 Overview

This document specifies the hardware and firmware requirements for integrating QSAFP into inference accelerators. QSAFP requires **no silicon modifications** but does require specific firmware capabilities and interfaces.

---

## ⚙️ Minimum Hardware Requirements

### Required Components

| Component | Requirement | Purpose |
|-----------|-------------|---------|
| **Secure Boot** | UEFI Secure Boot, ARM Trusted Boot, or equivalent | Verify QSAFP firmware integrity at power-on |
| **Hardware Timer** | Programmable interval timer with interrupt capability | Trigger periodic lease expiration checks |
| **Persistent Storage** | 256KB flash, EEPROM, or TPM NVRAM | Store cryptographic audit logs |
| **Secure Memory** | 128KB isolated RAM (TEE/TrustZone) or protected region | Cache active leases and validator responses |
| **Cryptographic Accelerator** | Ed25519 or Dilithium-3 signature verification (optional but recommended) | Accelerate PQC signature checks |

### Optional but Recommended

| Component | Benefit |
|-----------|---------|
| **Trusted Execution Environment (TEE)** | Isolates QSAFP from untrusted OS/applications |
| **Hardware Root of Trust** | TPM 2.0, Secure Element, or PUF | Stores master key material |
| **Network Interface** | Ethernet, Wi-Fi, or cellular | External validator network connectivity |
| **Real-Time Clock (RTC)** | Battery-backed RTC | Accurate lease expiration timestamps |

---

## 🔌 Firmware Integration Points

### 1. Secure Boot Chain Integration

QSAFP must be verified and loaded during the secure boot process.

**Required Modifications:**

```c
// In your bootloader (U-Boot, UEFI, ARM TF-A)

// Step 1: Verify QSAFP firmware signature
status = verify_signature(
    qsafp_firmware_blob,
    qsafp_signature,
    manufacturer_public_key
);
if (status != VERIFY_OK) {
    halt_boot("QSAFP signature verification failed");
}

// Step 2: Load QSAFP into secure memory
load_to_secure_region(
    qsafp_firmware_blob,
    QSAFP_BASE_ADDRESS,
    QSAFP_SIZE
);

// Step 3: Initialize QSAFP before OS boot
qsafp_early_init(hardware_id, tee_context);
```

**Memory Layout:**

```
┌─────────────────────────────────────┐
│  0x00000000 - Bootloader            │
├─────────────────────────────────────┤
│  0x00100000 - QSAFP Firmware (47KB) │ ← Locked, read-only
├─────────────────────────────────────┤
│  0x00200000 - QSAFP Secure RAM      │ ← TEE-protected
│                (128KB)              │
├─────────────────────────────────────┤
│  0x01000000 - OS Kernel             │
└─────────────────────────────────────┘
```

---

### 2. Timer Interrupt Handler

QSAFP requires a periodic timer interrupt to check lease expiration.

**Configuration:**

- **Frequency:** Configurable (default: 10Hz, i.e., every 100ms)
- **Priority:** High (must preempt inference workloads)
- **Latency:** <10μs from timer fire to ISR entry

**Implementation Example (ARM):**

```c
// In your HAL timer configuration

void setup_qsafp_timer(void) {
    // Use a dedicated hardware timer (e.g., Timer 2)
    TIMER2->LOAD = SYSTEM_CLOCK / 10;  // 10 Hz
    TIMER2->CONTROL = TIMER_ENABLE | TIMER_INTERRUPT | TIMER_PERIODIC;
    
    // Register ISR
    register_irq_handler(TIMER2_IRQ, qsafp_timer_isr);
    set_irq_priority(TIMER2_IRQ, IRQ_PRIORITY_HIGH);
}

void qsafp_timer_isr(void) {
    // Called every 100ms
    qsafp_check_lease_expiry();
    clear_timer_interrupt(TIMER2_IRQ);
}
```

**x86-64 Implementation:**

```c
// Using HPET or APIC timer

void setup_qsafp_timer(void) {
    // Configure HPET Timer 0
    hpet_write(HPET_T0_CONFIG, HPET_TN_ENABLE | HPET_TN_PERIODIC | HPET_TN_INT);
    hpet_write(HPET_T0_COMPARATOR, hpet_freq / 10);
    
    register_interrupt(HPET_IRQ, qsafp_timer_isr);
}
```

---

### 3. Pre-Inference Hook

Every inference batch must pass through QSAFP lease validation.

**Integration Point:**

```c
// In your inference runtime (TensorFlow Lite, ONNX Runtime, custom)

int run_inference(model_t *model, tensor_t *input, tensor_t *output) {
    // QSAFP pre-flight check
    qsafp_lease_status_t status = qsafp_validate_lease();
    
    switch (status) {
        case QSAFP_LEASE_VALID:
            // Proceed with inference
            break;
            
        case QSAFP_LEASE_EXPIRED:
            qsafp_log_event(EVENT_LEASE_EXPIRED, model->id);
            return ERROR_LEASE_EXPIRED;
            
        case QSAFP_LEASE_DENIED:
            qsafp_trigger_failsafe(model->checkpoint);
            return ERROR_VALIDATOR_DENIED;
            
        default:
            return ERROR_UNKNOWN;
    }
    
    // Execute inference
    return model->forward(input, output);
}
```

**Performance Consideration:**

- Lease check should be amortized over batches (e.g., check every 1,000 inferences)
- Cache lease status in L1/L2 cache to minimize DRAM access

---

### 4. Validator Network Interface

QSAFP queries external validators asynchronously to avoid blocking inference.

**Network Requirements:**

- **Protocol:** gRPC (preferred) or REST over TLS 1.3
- **Latency Budget:** <1 second for validator consensus
- **Bandwidth:** ~2KB per query (50 bytes request, ~1.5KB response with signatures)
- **Availability:** Validators must be reachable; airgapped deployments use on-chip validators

**API Call Flow:**

```c
// Asynchronous validator query (non-blocking)

void qsafp_query_validators_async(inference_context_t *ctx) {
    // Construct query
    validator_query_t query = {
        .model_hash = ctx->model_hash,
        .input_hash = hash(ctx->input_tensor),
        .timestamp = get_rtc_time(),
        .lease_id = ctx->current_lease_id
    };
    
    // Sign query with chip's private key
    sign_request(&query, chip_private_key);
    
    // Send to validator quorum (non-blocking)
    async_http_post(
        VALIDATOR_ENDPOINTS,
        &query,
        sizeof(query),
        qsafp_validator_response_callback
    );
}

void qsafp_validator_response_callback(validator_response_t *resp) {
    // Verify quorum signatures
    if (!verify_quorum_signatures(resp)) {
        qsafp_trigger_failsafe(REASON_INVALID_SIGNATURES);
        return;
    }
    
    // Check consensus (e.g., 4 of 6 validators approved)
    if (resp->approvals >= QUORUM_THRESHOLD) {
        qsafp_renew_lease(resp->new_lease);
    } else {
        qsafp_deny_lease(resp->denial_reason);
    }
    
    // Log to audit trail
    qsafp_log_validator_response(resp);
}
```

---

### 5. Audit Log Persistence

All QSAFP events must be cryptographically logged to tamper-proof storage.

**Storage Interface:**

```c
// Append-only audit log

typedef struct {
    uint64_t timestamp;
    uint32_t event_type;
    uint8_t  model_hash[32];
    uint8_t  validator_signatures[6][64];  // Dilithium-3 signatures
    uint8_t  event_data[128];
} qsafp_audit_entry_t;

int qsafp_log_event(uint32_t event_type, void *event_data) {
    qsafp_audit_entry_t entry = {0};
    entry.timestamp = get_rtc_time();
    entry.event_type = event_type;
    memcpy(entry.event_data, event_data, sizeof(entry.event_data));
    
    // Append to persistent storage
    if (tpm_available()) {
        return tpm_nvram_append(TPM_QSAFP_INDEX, &entry, sizeof(entry));
    } else {
        return flash_append(QSAFP_LOG_PARTITION, &entry, sizeof(entry));
    }
}
```

**Storage Requirements:**

| Parameter | Value |
|-----------|-------|
| **Entry Size** | 256 bytes |
| **Log Capacity** | 1,000 entries (256KB) |
| **Write Endurance** | 100,000 cycles (flash) or unlimited (TPM) |
| **Read Speed** | >1MB/s for audit retrieval |

---

## 🔐 Cryptographic Requirements

### Key Material Storage

QSAFP requires the chip to store:

1. **Chip Private Key** (Ed25519 or Dilithium-3)
   - Stored in: TPM, Secure Element, or OTP fuses
   - Usage: Sign validator queries
   
2. **Validator Public Keys** (6 keys for quorum)
   - Stored in: Firmware or secure flash
   - Usage: Verify validator signatures

3. **Manufacturer Root Key**
   - Stored in: OTP fuses or ROM
   - Usage: Verify QSAFP firmware updates

### Signature Verification Performance

**Target Latency:**

- Ed25519 verify: <50μs (with hardware accelerator)
- Dilithium-3 verify: <500μs (software), <100μs (accelerator)

**Hardware Acceleration:**

If your chip has a crypto accelerator, expose these operations:

```c
// Crypto HAL interface

int crypto_verify_signature(
    const uint8_t *message,
    size_t message_len,
    const uint8_t *signature,
    const uint8_t *public_key,
    crypto_algorithm_t algo  // CRYPTO_ED25519 or CRYPTO_DILITHIUM3
);

int crypto_sign_message(
    const uint8_t *message,
    size_t message_len,
    uint8_t *signature_out,
    const uint8_t *private_key,
    crypto_algorithm_t algo
);
```

---

## 📊 Performance Specifications

### Latency Budgets

| Operation | Target | Critical Path? |
|-----------|--------|----------------|
| Lease validation check | <100μs | Yes (per batch) |
| Signature verification | <500μs | Yes (per lease renewal) |
| Audit log write | <50μs | No (async) |
| Validator query | <1s | No (async) |
| Fail-safe trigger | <10ms | Yes (safety-critical) |

### Memory Footprint

| Component | RAM | Flash/ROM |
|-----------|-----|-----------|
| QSAFP firmware | - | 47KB (ARM), 52KB (x86) |
| Lease cache | 32KB | - |
| Validator response buffer | 16KB | - |
| Audit log buffer | 80KB | - |
| **Total** | **128KB** | **~50KB** |

### Power Consumption

- **Idle overhead:** <5mW (timer interrupt only)
- **Active overhead:** <100mW (during lease validation)
- **Peak overhead:** <500mW (during validator query + signature verification)

---

## 🧪 Test Points for Integration Validation

### Required Tests

1. **Secure Boot Verification**
   - [ ] QSAFP loads before OS
   - [ ] Invalid QSAFP signature blocks boot
   - [ ] QSAFP memory region is read-only from OS

2. **Lease Enforcement**
   - [ ] Expired lease halts inference
   - [ ] Lease renewal extends execution window
   - [ ] Denied lease triggers fail-safe

3. **Timer Interrupt**
   - [ ] ISR fires at configured frequency (±5%)
   - [ ] Lease expiry detected within 1 interrupt period
   - [ ] Timer preempts inference workload

4. **Validator Communication**
   - [ ] Query sent asynchronously (doesn't block inference)
   - [ ] Signatures verified correctly
   - [ ] Quorum logic enforced (e.g., 4/6 threshold)

5. **Audit Logging**
   - [ ] Events persist across power cycles
   - [ ] Log is tamper-evident (hash chain)
   - [ ] Log retrieval works

6. **Fail-Safe Mechanism**
   - [ ] Rollback restores previous state
   - [ ] Containment mode prevents further inference
   - [ ] Fail-safe triggers within 10ms of violation

---

## 🛠 Reference Implementations

### ARM TrustZone Example

```c
// Minimal QSAFP integration for ARM Cortex-A

#include "qsafp.h"
#include "trustzone.h"

void trustzone_init(void) {
    // Allocate secure world memory for QSAFP
    tz_allocate_secure_region(
        QSAFP_BASE_ADDRESS,
        QSAFP_SIZE,
        TZ_PERM_READ | TZ_PERM_EXECUTE
    );
    
    // Initialize QSAFP
    qsafp_init_params_t params = {
        .hardware_id = get_chip_unique_id(),
        .tee_context = tz_get_secure_context(),
        .timer_freq_hz = 10,
        .validator_endpoints = VALIDATOR_URLS,
        .audit_log_storage = STORAGE_TPM
    };
    
    qsafp_init(&params);
}
```

### x86-64 with Intel SGX

```c
// QSAFP enclave integration

sgx_status_t ecall_qsafp_validate(sgx_enclave_id_t eid, inference_t *inf) {
    sgx_status_t ret;
    qsafp_lease_status_t status;
    
    // Call into QSAFP enclave
    ret = sgx_ecall(
        eid,
        ECALL_VALIDATE_LEASE,
        &status,
        sizeof(status)
    );
    
    if (ret != SGX_SUCCESS || status != QSAFP_LEASE_VALID) {
        return SGX_ERROR_INVALID_STATE;
    }
    
    return SGX_SUCCESS;
}
```

---

## 📞 Support for Integration

**Questions during integration?**

- **Email:** [engineering@bwrci.org](mailto:engineering@bwrci.org)
- **Slack:** Join #qsafp-chip-partners (invite via pilot agreement)
- **Office Hours:** Weekly video calls during pilot phase

**Required from your team:**

- Architecture reference manual
- Firmware source access (under NDA)
- Dev board or remote lab access
- 2-3 firmware engineers (part-time)

---

## 📄 Appendix: Pin-Level Signals (Optional)

For chips with dedicated security co-processors, QSAFP can integrate via GPIO or SPI:

### GPIO Interface (Simple)

| Pin | Direction | Purpose |
|-----|-----------|---------|
| LEASE_VALID | Output | High when lease is valid |
| FAILSAFE_TRIGGER | Output | Pulsed high on fail-safe event |
| VALIDATOR_REQ | Output | Toggles when validator query sent |
| LEASE_RENEW | Input | External lease renewal signal |

### SPI Interface (Advanced)

- **Clock:** Up to 10MHz
- **Mode:** SPI Mode 0 (CPOL=0, CPHA=0)
- **Chip Select:** Active low
- **Commands:**
  - `0x01` - Query lease status
  - `0x02` - Renew lease
  - `0x03` - Read audit log
  - `0x04` - Trigger fail-safe

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Maintained by:** DigiPie International PBC / BWRCI