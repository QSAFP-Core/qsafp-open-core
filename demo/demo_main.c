#include <stdio.h>
#include "../core/ekl/ekl.h"
#include "../core/session/session.h"
#include "../core/consensus/consensus.h"
#include "../hal/stub/qsafp_hal_stub.h"

int main() {
    run_ekl();
    run_session();
    run_consensus();
    run_biometric_quorum();
    return 0;
}
