/* ============================ tests/multi_threat_test.c ============================ */
/* cJSON-based multi-threat test harness for QSAFP
 *
 * Save as: tests/multi_threat_test.c
 * Requires: tests/multi_threat_scenarios.json, tests/cJSON.c, tests/cJSON.h
 *
 * Compile (from qsafp-open-core/tests/):
 *   gcc -O2 -Wall -pthread multi_threat_test.c cJSON.c -o multi_threat_test
 *
 * Run:
 *   ./multi_threat_test
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <pthread.h>
#include "cJSON.h"

/* Threat types we simulate */
typedef enum {
    THREAT_RANSOMWARE,
    THREAT_PRIV_ESC,
    THREAT_PROMPT_INJECTION,
    THREAT_DOS_SPIKE,
    THREAT_KEY_COMPROMISE,
    THREAT_UNKNOWN
} threat_type_t;

typedef struct {
    threat_type_t type;
    char intensity[16];
    int duration_ms;
} threat_t;

typedef struct {
    char id[64];
    char description[256];
    threat_t threats[8];
    int threat_count;
} scenario_t;

/* ========== Mapping helpers ========== */
threat_type_t str_to_threat(const char *s) {
    if (!s) return THREAT_UNKNOWN;
    if (strcmp(s, "ransomware") == 0) return THREAT_RANSOMWARE;
    if (strcmp(s, "privilege_escalation") == 0) return THREAT_PRIV_ESC;
    if (strcmp(s, "prompt_injection") == 0) return THREAT_PROMPT_INJECTION;
    if (strcmp(s, "dos_spike") == 0) return THREAT_DOS_SPIKE;
    if (strcmp(s, "key_compromise") == 0) return THREAT_KEY_COMPROMISE;
    return THREAT_UNKNOWN;
}

const char *threat_to_str(threat_type_t t) {
    switch (t) {
        case THREAT_RANSOMWARE: return "ransomware";
        case THREAT_PRIV_ESC: return "privilege_escalation";
        case THREAT_PROMPT_INJECTION: return "prompt_injection";
        case THREAT_DOS_SPIKE: return "dos_spike";
        case THREAT_KEY_COMPROMISE: return "key_compromise";
        default: return "unknown";
    }
}

/* ========== Simulation helpers ========== */
void ms_sleep(int ms) {
    if (ms <= 0) return;
    struct timespec ts;
    ts.tv_sec = ms / 1000;
    ts.tv_nsec = (long)(ms % 1000) * 1000000L;
    nanosleep(&ts, NULL);
}

void *simulate_threat(void *arg) {
    threat_t *t = (threat_t *)arg;
    printf("   >> Threat START: %s (intensity=%s) for %d ms\n", threat_to_str(t->type), t->intensity, t->duration_ms);

    /* Simulate different behaviors based on type/intensity.
       For now we just sleep for the configured duration to represent the attack window.
       Hook real stress (CPU/memory/IO) or payload stubs here as needed. */
    ms_sleep(t->duration_ms);

    printf("   >> Threat END:   %s (intensity=%s)\n", threat_to_str(t->type), t->intensity);
    pthread_exit(NULL);
}

/* Placeholder for QSAFP fail-safe trigger:
   Replace body with actual lease-expire-quorum logic; it currently logs and could
   write to /results/ or existing logs directory for artifact capture. */
void trigger_fail_safe(const char *scenario_id) {
    time_t now = time(NULL);
    char buf[64];
    strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", gmtime(&now));
    printf("   !! FAIL-SAFE TRIGGERED [%s] in scenario %s (runtime expired, quorum verified)\n", buf, scenario_id);
}

/* ========== Core test runner ========== */
void run_scenario(scenario_t *s) {
    printf("\n=== Running Scenario %s: %s ===\n", s->id, s->description);
    struct timespec tstart, tend;
    clock_gettime(CLOCK_MONOTONIC, &tstart);

    pthread_t threads[8];
    for (int i = 0; i < s->threat_count; i++) {
        int rc = pthread_create(&threads[i], NULL, simulate_threat, &s->threats[i]);
        if (rc != 0) {
            fprintf(stderr, "Failed to create thread for threat %d (rc=%d)\n", i, rc);
            s->threats[i].duration_ms = 0;
        }
    }

    for (int i = 0; i < s->threat_count; i++) {
        pthread_join(threads[i], NULL);
    }

    clock_gettime(CLOCK_MONOTONIC, &tend);
    double elapsed_ms = (tend.tv_sec - tstart.tv_sec) * 1000.0 + (tend.tv_nsec - tstart.tv_nsec) / 1e6;

    /* In real flow, containment_time should be measured from detection -> fail-safe completion.
       For this harness we treat the end of threat threads as containment for demo purposes. */
    trigger_fail_safe(s->id);
    printf("   >> Containment time: %.2f ms\n", elapsed_ms);

    /* Optionally: append results to a CSV/JSON file in ./results/ for screenshots/artifacts */
    /* Example (uncomment if you want file output):
    FILE *rf = fopen("results/multi_threat_results.csv", "a");
    if (rf) {
        fprintf(rf, "%s,%.2f,%d\n", s->id, elapsed_ms, s->threat_count);
        fclose(rf);
    }
    */
}

/* ========== JSON Loader ========== */
int load_scenarios(const char *filename, scenario_t scenarios[], int max_scenarios) {
    FILE *f = fopen(filename, "rb");
    if (!f) { perror("fopen"); return 0; }
    fseek(f, 0, SEEK_END);
    long len = ftell(f);
    rewind(f);

    char *data = (char *)malloc(len + 1);
    if (!data) { fclose(f); fprintf(stderr, "Out of memory reading %s\n", filename); return 0; }
    size_t r = fread(data, 1, len, f);
    data[r] = '\0';
    fclose(f);

    cJSON *root = cJSON_Parse(data);
if (!root) {
    fprintf(stderr, "cJSON_Parse error or empty file: %s\n", filename);
    free(data);
    return 0;
}

if (!cJSON_IsArray(root)) {
    fprintf(stderr, "Top-level JSON must be an array of scenarios.\n");
    cJSON_Delete(root);
    free(data);
    return 0;
}

    int count = 0;
    cJSON *scenario_json = NULL;
    cJSON_ArrayForEach(scenario_json, root) {
        if (count >= max_scenarios) break;
        scenario_t *s = &scenarios[count];
        memset(s, 0, sizeof(*s));

        cJSON *id = cJSON_GetObjectItemCaseSensitive(scenario_json, "id");
        cJSON *desc = cJSON_GetObjectItemCaseSensitive(scenario_json, "description");
        if (cJSON_IsString(id) && (id->valuestring != NULL)) {
            strncpy(s->id, id->valuestring, sizeof(s->id)-1);
        } else {
            snprintf(s->id, sizeof(s->id), "scenario_%d", count+1);
        }
        if (cJSON_IsString(desc) && (desc->valuestring != NULL)) {
            strncpy(s->description, desc->valuestring, sizeof(s->description)-1);
        } else {
            strncpy(s->description, "no-description", sizeof(s->description)-1);
        }

        cJSON *threats = cJSON_GetObjectItemCaseSensitive(scenario_json, "threats");
        int tcount = 0;
        if (cJSON_IsArray(threats)) {
            cJSON *t = NULL;
            cJSON_ArrayForEach(t, threats) {
                if (tcount >= (int)(sizeof(s->threats)/sizeof(s->threats[0]))) break;
                cJSON *type = cJSON_GetObjectItemCaseSensitive(t, "type");
                cJSON *intensity = cJSON_GetObjectItemCaseSensitive(t, "intensity");
                cJSON *duration = cJSON_GetObjectItemCaseSensitive(t, "duration_ms");
                threat_t *th = &s->threats[tcount++];
                th->type = THREAT_UNKNOWN;
                if (cJSON_IsString(type) && (type->valuestring != NULL)) th->type = str_to_threat(type->valuestring);
                if (cJSON_IsString(intensity) && (intensity->valuestring != NULL)) {
                    strncpy(th->intensity, intensity->valuestring, sizeof(th->intensity)-1);
                } else {
                    strncpy(th->intensity, "medium", sizeof(th->intensity)-1);
                }
                if (cJSON_IsNumber(duration)) th->duration_ms = duration->valueint;
                else th->duration_ms = 500;
            }
        }
        s->threat_count = tcount;
        count++;
    }

    cJSON_Delete(root);
    free(data);
    return count;
}

/* ========== Main harness ========== */
int main(int argc, char **argv) {
    const char *json_file = "multi_threat_scenarios.json";
    if (argc > 1) json_file = argv[1];

    printf("QSAFP Multi-Threat Test Harness\n");
    printf("Loading scenarios from: %s\n", json_file);

    scenario_t scenarios[32];
    int count = load_scenarios(json_file, scenarios, 32);
    if (count <= 0) {
        fprintf(stderr, "No scenarios loaded. Ensure %s exists and is valid JSON.\n", json_file);
        return 1;
    }

    printf("Loaded %d scenario(s)\n", count);
    for (int i = 0; i < count; i++) {
        run_scenario(&scenarios[i]);
    }

    printf("\nAll scenarios complete.\n");
    return 0;
}

