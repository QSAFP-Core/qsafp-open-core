CORE_SRCS := \
    core/ekl/ekl.c \
    core/session/session.c \
    core/consensus/consensus.c

CFLAGS := -O2 -Wall -Wextra -Icore/ekl -Icore/session -Icore/consensus

