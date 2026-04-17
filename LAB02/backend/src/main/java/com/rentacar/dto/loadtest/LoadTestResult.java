package com.rentacar.dto.loadtest;

import io.micronaut.serde.annotation.Serdeable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class LoadTestResult {
    private String architecture;        // SPRING_MVC or SPRING_WEBFLUX
    private String testType;
    private int totalRequests;
    private int successCount;
    private int errorCount;
    private long totalTimeMs;
    private double avgResponseTimeMs;
    private double minResponseTimeMs;
    private double maxResponseTimeMs;
    private double p50Ms;
    private double p95Ms;
    private double p99Ms;
    private double throughputReqPerSec;
    private int peakThreadCount;
    private long memoryUsedMb;
}
