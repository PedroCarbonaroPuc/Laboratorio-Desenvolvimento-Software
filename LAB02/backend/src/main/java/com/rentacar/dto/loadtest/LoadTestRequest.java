package com.rentacar.dto.loadtest;

import io.micronaut.serde.annotation.Serdeable;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class LoadTestRequest {
    private String testType;       // database_read, io_simulation, concurrent_load, mixed_workload
    private int totalRequests;     // total operations
    private int concurrencyLevel;  // parallel threads/tasks
    private int ioDelayMs;         // simulated I/O latency (ms) for io_simulation
}
