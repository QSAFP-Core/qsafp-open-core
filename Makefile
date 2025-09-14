DEMO_SRC := demo/demo_main.c
BUILD := build
CORE_SRCS := \
    core/ekl/ekl.c \
    core/session/session.c \
    core/consensus/consensus.c

CFLAGS := -O2 -Wall -Wextra -Icore/ekl -Icore/session -Icore/consensus

# Default HAL (stub)
HAL_SRC := hal/stub/qsafp_hal_stub.c

# Partner overrides
ifeq ($(PARTNER),xai)
  HAL_SRC := hal/xai/qsafp_hal_xai.c
endif

.PHONY: all demo clean test-all

all: demo

$(BUILD):
	mkdir -p $(BUILD)

demo: $(BUILD)
	@echo "[QSAFP] Building with HAL: $(HAL_SRC)"
	gcc $(CFLAGS) $(CORE_SRCS) $(HAL_SRC) $(DEMO_SRC) -o $(BUILD)/qsafp_demo.exe

test-all: demo
	@echo "Running QSAFP demo..."
	./$(BUILD)/qsafp_demo.exe

clean:
	rm -rf $(BUILD)

