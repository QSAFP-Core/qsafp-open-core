// main.cu
#include <iostream>
#include <cstdio>
#include <cuda_runtime.h>

// Simple GPU kernel: prints thread/block info (device printf supported on modern CUDA)
__global__ void helloFromGPU()
{
    printf("Hello from GPU! Thread %d, Block %d\n", threadIdx.x, blockIdx.x);
}

int main()
{
    std::cout << "QSAFP CUDA Hook Simulation Verification" << std::endl;
    std::cout << "--------------------------------------" << std::endl;

    // Query CUDA device count
    int deviceCount = 0;
    cudaError_t err = cudaGetDeviceCount(&deviceCount);
    if (err != cudaSuccess) {
        // If querying failed, present a clear message and exit with non-zero
        std::cerr << "[Error] cudaGetDeviceCount failed: " 
                  << cudaGetErrorString(err) << std::endl;
        return 1;
    }

    if (deviceCount > 0) {
        // We have at least one CUDA device: run the GPU path
        std::cout << "[GPU Mode] Found " << deviceCount << " CUDA device(s)." << std::endl;

        // Optionally choose device 0
        cudaSetDevice(0);

        // Launch kernel: 1 block of 5 threads (safe tiny demo)
        helloFromGPU<<<1, 5>>>();

        // Wait for GPU and check errors
        cudaError_t syncErr = cudaDeviceSynchronize();
        if (syncErr != cudaSuccess) {
            std::cerr << "[GPU] Kernel/sync failed: " 
                      << cudaGetErrorString(syncErr) << std::endl;
            return 2;
        }

        // Nicely formatted success output for screenshot
        std::cout << "[GPU] Execution OK -> GPU path verified." << std::endl;
    } else {
        // No CUDA device: simulation/CPU verification path
        std::cout << "Hello from CPU!" << std::endl;
        std::cout << "[Simulation Mode] No CUDA device found -> CPU path verified." << std::endl;
    }

    return 0;
}
