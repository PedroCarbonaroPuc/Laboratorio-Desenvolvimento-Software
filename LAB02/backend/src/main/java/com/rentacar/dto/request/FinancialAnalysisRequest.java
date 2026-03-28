package com.rentacar.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FinancialAnalysisRequest {

    @NotNull(message = "Resultado da análise é obrigatório")
    private Boolean approved;

    private String notes;
}
