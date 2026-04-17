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
public class LoadTestEvent {
    private String type;              // progress, result, error, complete
    private String architecture;      // SPRING_MVC or SPRING_WEBFLUX
    private int completedRequests;
    private int totalRequests;
    private double currentAvgMs;
    private String message;
    private LoadTestResult result;
}
