package com.rentacar.dto.request;

import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class FinancialAnalysisRequest {

    @NotNull(message = "Resultado da análise é obrigatório")
    private Boolean approved;

    private String notes;
}
