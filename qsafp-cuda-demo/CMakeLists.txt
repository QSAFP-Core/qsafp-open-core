cmake_minimum_required(VERSION 3.18 FATAL_ERROR)
project(QSAFP_CUDA_DEMO LANGUAGES CXX CUDA)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CUDA_STANDARD 17)

add_executable(qsafp_demo src/main.cu)

# Second demo: fail-safe / threat-detection run
add_executable(qsafp_demo_bad
    src/main_bad.cu
)

# Include headers (same as your first target)
target_include_directories(qsafp_demo_bad PRIVATE ${PROJECT_SOURCE_DIR}/include)
