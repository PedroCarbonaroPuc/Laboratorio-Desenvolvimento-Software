package com.rentacar.dto.loadtest;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
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
