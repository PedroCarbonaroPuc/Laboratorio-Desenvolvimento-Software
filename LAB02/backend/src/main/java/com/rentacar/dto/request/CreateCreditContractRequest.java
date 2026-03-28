package com.rentacar.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateCreditContractRequest {

    @NotBlank(message = "ID do pedido de aluguel é obrigatório")
    private String rentalOrderId;

    @NotBlank(message = "ID do banco agente é obrigatório")
    private String bankAgentId;

    @NotNull(message = "Valor é obrigatório")
    @Positive(message = "Valor deve ser positivo")
    private BigDecimal amount;

    @NotNull(message = "Taxa de juros é obrigatória")
    @Positive(message = "Taxa de juros deve ser positiva")
    private BigDecimal interestRate;

    @NotNull(message = "Número de parcelas é obrigatório")
    @Positive(message = "Número de parcelas deve ser positivo")
    private Integer installments;
}
