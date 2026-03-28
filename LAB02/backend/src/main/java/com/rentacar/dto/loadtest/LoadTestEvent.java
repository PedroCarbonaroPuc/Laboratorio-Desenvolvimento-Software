package com.rentacar.dto.loadtest;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoadTestEvent {
    private String type;              // progress, result, error, complete
    private String architecture;      // SPRING_MVC or SPRING_WEBFLUX
    private int completedRequests;
    private int totalRequests;
    private double currentAvgMs;
    private String message;
    private LoadTestResult result;
}
