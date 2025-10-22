# QSAFP API Reference
## Function Signatures for Firmware Integration

**Version:** 1.0  
**Language:** C99  
**Thread Safety:** Noted per function  
**Architectures:** ARM, x86-64, RISC-V

---

## 📚 Table of Contents

1. [Initialization](#initialization)
2. [Lease Management](#lease-management)
3. [Validator Interface](#validator-interface)
4. [Audit Logging](#audit-logging)
5. [Fail-Safe Control](#fail-safe-control)
6. [Cryptographic Operations](#cryptographic-operations)
7. [Configuration](#configuration)
8. [Error Codes](#error-codes)

---

## Initialization

### `qsafp_init()`

Initialize the QSAFP runtime with chip-specific configuration.

```c
qsafp_status_t qsafp_init(const qsafp_init_params_t *params);
```

**Parameters:**

```c
typedef struct {
    uint8_t  hardware_id[32];           // Unique chip identifier (e.g., CPU serial)
    void    *tee_context;               // TEE/TrustZone context (NULL if not using TEE)
    uint32_t timer_freq_hz;             // Lease check frequency (default: 10 Hz)
    char    *validator_endpoints[16];   // Array of validator URLs (NULL-terminated)
    qsafp_storage_backend_t storage;    // Audit log storage backend
    uint32_t lease_duration_sec;        // Default lease duration (default: 3600)
    uint8_t  quorum_threshold;          // Minimum validator approvals (default: 4)
    uint8_t  total_validators;          // Total validator count (default: 6)
} qsafp_init_params_t;

typedef enum {
    STORAGE_FLASH,
    STORAGE_TPM,
    STORAGE_SECURE_ELEMENT,
    STORAGE_NVRAM
} qsafp_storage_backend_t;
```

**Returns:**
- `QSAFP_OK` - Initialization successful
- `QSAFP_ERR_INVALID_PARAMS` - Invalid configuration
- `QSAFP_ERR_TEE_UNAVAILABLE` - TEE required but not available
- `QSAFP_ERR_STORAGE_INIT_FAILED` - Cannot initialize audit storage

**Thread Safety:** Not thread-safe. Call once during boot.

**Example:**

```c
qsafp_init_params_t params = {
    .hardware_id = {/* chip serial number */},
    .tee_context = get_trustzone_context(),
    .timer_freq_hz = 10,
    .validator_endpoints = {
        "https://validator1.example.com:8443",
        "https://validator2.example.com:8443",
        NULL
    },
    .storage = STORAGE_TPM,
    .lease_duration_sec = 3600,
    .quorum_threshold = 4,
    .total_validators = 6
};

qsafp_status_t status = qsafp_init(&params);
if (status != QSAFP_OK) {
    panic("QSAFP initialization failed");
}
```

---

### `qsafp_deinit()`

Shutdown QSAFP and release resources.

```c
void qsafp_deinit(void);
```

**Thread Safety:** Not thread-safe. Call during shutdown only.

---

## Lease Management

### `qsafp_validate_lease()`

Check if current execution lease is valid. Call before each inference batch.

```c
qsafp_lease_status_t qsafp_validate_lease(void);
```

**Returns:**

```c
typedef enum {
    QSAFP_LEASE_VALID,          // Lease is active, proceed with inference
    QSAFP_LEASE_EXPIRED,        // Lease expired, halt execution
    QSAFP_LEASE_DENIED,         // Validators denied lease renewal
    QSAFP_LEASE_PENDING,        // Validator query in progress
    QSAFP_LEASE_UNINITIALIZED   // qsafp_init() not called
} qsafp_lease_status_t;
```

**Thread Safety:** Thread-safe (read-only operation).

**Typical Latency:** <100μs (cache hit), <500μs (requires signature verification)

**Example:**

```c
int run_inference(model_t *model, tensor_t *input, tensor_t *output) {
    qsafp_lease_status_t status = qsafp_validate_lease();
    
    if (status != QSAFP_LEASE_VALID) {
        log_error("Lease validation failed: %d", status);
        return -1;
    }
    
    // Proceed with inference
    return model->forward(input, output);
}
```

---

### `qsafp_get_lease_info()`

Retrieve detailed information about the current lease.

```c
qsafp_status_t qsafp_get_lease_info(qsafp_lease_info_t *info);
```

**Parameters:**

```c
typedef struct {
    uint64_t lease_id;              // Unique lease identifier
    uint64_t issued_at;             // Unix timestamp (seconds)
    uint64_t expires_at;            // Unix timestamp (seconds)
    uint64_t remaining_sec;         // Seconds until expiration
    uint8_t  validator_approvals;   // Number of validators that approved
    uint8_t  validator_total;       // Total validators queried
    uint8_t  renewal_count;         // Times this lease has been renewed
    bool     is_expired;            // True if lease expired
} qsafp_lease_info_t;
```

**Returns:**
- `QSAFP_OK` - Info retrieved successfully
- `QSAFP_ERR_NO_ACTIVE_LEASE` - No lease currently active

**Thread Safety:** Thread-safe.

**Example:**

```c
qsafp_lease_info_t info;
if (qsafp_get_lease_info(&info) == QSAFP_OK) {
    printf("Lease expires in %lu seconds\n", info.remaining_sec);
    printf("Approved by %d/%d validators\n", 
           info.validator_approvals, info.validator_total);
}
```

---

### `qsafp_check_lease_expiry()`

Internal function called by timer ISR. **Do not call directly from application code.**

```c
void qsafp_check_lease_expiry(void);
```

**Thread Safety:** Not thread-safe. Called from ISR context only.

---

## Validator Interface

### `qsafp_request_lease_renewal()`

Asynchronously request lease renewal from validator quorum.
> **Timing and Consensus Behavior**  
> QVN operates on a dual-track renewal system:
> - **Track A (Machine Attestation):** Local firmware attestation completes in <1 second, ensuring uninterrupted runtime safety.  
> - **Track B (Validator Consensus):** Validator quorum (3-of-5) typically finalizes within ~60 seconds asynchronously.  
> Human validators may review logs within policy-defined windows (5–30 minutes) without affecting runtime performance.  
> 
> This API call initiates the renewal request asynchronously, allowing inference workloads to continue while consensus and human validation complete in parallel.

```c
qsafp_status_t qsafp_request_lease_renewal(
    const qsafp_renewal_request_t *request,
    qsafp_renewal_callback_t callback,
    void *user_data
);
```

**Parameters:**

```c
typedef struct {
    uint8_t  model_hash[32];        // SHA-256 of model weights
    uint8_t  input_hash[32];        // SHA-256 of input tensor (optional)
    uint32_t requested_duration;    // Requested lease duration (seconds)
    uint8_t  justification[256];    // Human-readable reason (optional)
} qsafp_renewal_request_t;

typedef void (*qsafp_renewal_callback_t)(
    qsafp_lease_status_t status,
    const qsafp_lease_info_t *new_lease,
    void *user_data
);
```

**Returns:**
- `QSAFP_OK` - Request sent successfully (callback will be invoked)
- `QSAFP_ERR_NETWORK_UNAVAILABLE` - Cannot reach validators
- `QSAFP_ERR_INVALID_REQUEST` - Request parameters invalid

**Thread Safety:** Thread-safe.

**Example:**

```c
void renewal_callback(qsafp_lease_status_t status, 
                      const qsafp_lease_info_t *lease,
                      void *ctx) {
    if (status == QSAFP_LEASE_VALID) {
        printf("Lease renewed until %lu\n", lease->expires_at);
    } else {
        printf("Lease renewal denied\n");
        trigger_shutdown();
    }
}

qsafp_renewal_request_t req = {
    .model_hash = {/* computed hash */},
    .requested_duration = 7200,  // 2 hours
};

qsafp_request_lease_renewal(&req, renewal_callback, NULL);
```

---

### `qsafp_query_validator_sync()`

Synchronously query a single validator (blocks until response).

```c
qsafp_status_t qsafp_query_validator_sync(
    const char *validator_url,
    const qsafp_validator_query_t *query,
    qsafp_validator_response_t *response,
    uint32_t timeout_ms
);
```

**Parameters:**

```c
typedef struct {
    uint64_t timestamp;
    uint8_t  model_hash[32];
    uint8_t  chip_signature[64];    // Signed by chip's private key
} qsafp_validator_query_t;

typedef struct {
    bool     approved;
    uint64_t new_lease_duration;
    uint8_t  validator_signature[64];  // Dilithium-3 or Ed25519
    char     denial_reason[256];
} qsafp_validator_response_t;
```

**Returns:**
- `QSAFP_OK` - Response received
- `QSAFP_ERR_TIMEOUT` - Validator didn't respond within timeout
- `QSAFP_ERR_INVALID_SIGNATURE` - Validator signature verification failed

**Thread Safety:** Thread-safe (but blocks caller).

---

## Audit Logging

### `qsafp_log_event()`

Append an event to the cryptographic audit trail.

```c
qsafp_status_t qsafp_log_event(
    qsafp_event_type_t event_type,
    const void *event_data,
    size_t data_len
);
```

**Parameters:**

```c
typedef enum {
    EVENT_LEASE_ISSUED,
    EVENT_LEASE_RENEWED,
    EVENT_LEASE_EXPIRED,
    EVENT_LEASE_DENIED,
    EVENT_VALIDATOR_QUERY,
    EVENT_VALIDATOR_RESPONSE,
    EVENT_FAILSAFE_TRIGGERED,
    EVENT_INFERENCE_STARTED,
    EVENT_INFERENCE_COMPLETED,
    EVENT_ANOMALY_DETECTED
} qsafp_event_type_t;
```

**Returns:**
- `QSAFP_OK` - Event logged successfully
- `QSAFP_ERR_LOG_FULL` - Audit log storage exhausted
- `QSAFP_ERR_STORAGE_WRITE_FAILED` - Flash/TPM write error

**Thread Safety:** Thread-safe (uses internal mutex).

**Example:**

```c
typedef struct {
    uint64_t inference_id;
    uint64_t duration_us;
    uint8_t  output_hash[32];
} inference_completed_event_t;

inference_completed_event_t evt = {
    .inference_id = 12345,
    .duration_us = 8200,
    .output_hash = {/* SHA-256 of output tensor */}
};

qsafp_log_event(EVENT_INFERENCE_COMPLETED, &evt, sizeof(evt));
```

---

### `qsafp_retrieve_audit_log()`

Read audit log entries for external analysis.

```c
qsafp_status_t qsafp_retrieve_audit_log(
    uint64_t start_index,
    uint32_t max_entries,
    qsafp_audit_entry_t *entries_out,
    uint32_t *num_entries_out
);
```

**Parameters:**

```c
typedef struct {
    uint64_t timestamp;
    uint32_t event_type;
    uint8_t  event_data[256];
    uint8_t  hash_chain[32];        // SHA-256 of (prev_hash || current_entry)
    uint8_t  signature[64];         // Signed by chip's key
} qsafp_audit_entry_t;
```

**Returns:**
- `QSAFP_OK` - Entries retrieved
- `QSAFP_ERR_INVALID_INDEX` - Start index out of bounds

**Thread Safety:** Thread-safe.

---

### `qsafp_verify_audit_chain()`

Verify integrity of the audit log hash chain.

```c
bool qsafp_verify_audit_chain(uint64_t start_index, uint64_t end_index);
```

**Returns:** `true` if hash chain valid, `false` if tampered.

**Thread Safety:** Thread-safe.

---

## Fail-Safe Control

### `qsafp_trigger_failsafe()`

Immediately halt inference and enter containment mode.

```c
void qsafp_trigger_failsafe(qsafp_failsafe_reason_t reason);
```

**Parameters:**

```c
typedef enum {
    FAILSAFE_LEASE_EXPIRED,
    FAILSAFE_VALIDATOR_DENIED,
    FAILSAFE_ANOMALY_DETECTED,
    FAILSAFE_INVALID_SIGNATURES,
    FAILSAFE_NETWORK_TIMEOUT,
    FAILSAFE_MANUAL_TRIGGER
} qsafp_failsafe_reason_t;
```
---

## 6. Cryptographic Operations *(Reserved)*  
Interfaces for post-quantum key exchange and signature verification will be defined in version 1.1.

## 7. Configuration *(Reserved)*  
Runtime configuration and lease tuning parameters (firmware-level).

## 8. Error Codes *(Reserved)*  
Comprehensive list of error enumerations will be consolidated in Appendix A of the integration guide.

---

### Timing Clarification
> **Note:** All sub-second timing references in this API refer exclusively to automated machine attestation cycles (Track A).  
> Human validator reviews (Track B) occur asynchronously within configurable policy windows and do not impact live runtime or inference throughput.

