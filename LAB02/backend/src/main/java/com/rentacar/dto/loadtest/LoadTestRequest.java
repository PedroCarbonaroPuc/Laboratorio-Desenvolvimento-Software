package com.rentacar.dto.loadtest;

import lombok.Data;

@Data
public class LoadTestRequest {
    private String testType;       // database_read, io_simulation, concurrent_load, mixed_workload
    private int totalRequests;     // total operations
    private int concurrencyLevel;  // parallel threads/tasks
    private int ioDelayMs;         // simulated I/O latency (ms) for io_simulation
}
