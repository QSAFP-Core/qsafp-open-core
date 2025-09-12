BUILD := build
CORE_SRCS := \
    core/ekl/ekl.c \
    core/session/session.c \
    core/consensus/consensus.c

CFLAGS := -O2 -Wall -Wextra -Icore/ekl -Icore/session -Icore/consensus

HAL_STUB := hal/stub/qsafp_hal_stub.c
DEMO_SRC := demo/demo_main.c

all: demo

$(BUILD):
	mkdir $(BUILD)

demo: $(BUILD)
	gcc $(CFLAGS) $(CORE_SRCS) $(HAL_STUB) $(DEMO_SRC) -o $(BUILD)/qsafp_demo.exe

test-all: demo
	@echo "Running QSAFP full demo..."
	./$(BUILD)/qsafp_demo.exe

clean:
	rm -rf $(BUILD)
