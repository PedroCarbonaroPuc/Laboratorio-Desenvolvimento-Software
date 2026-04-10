package com.rentacar.model;

import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class FinancialAnalysis {

    private String agentId;
    private Boolean approved;
    private String notes;
    private LocalDateTime analyzedAt;
}
