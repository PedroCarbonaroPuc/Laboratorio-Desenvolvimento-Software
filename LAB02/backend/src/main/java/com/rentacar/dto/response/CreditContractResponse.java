package com.rentacar.dto.response;

import io.micronaut.serde.annotation.Serdeable;

import com.rentacar.model.enums.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class CreditContractResponse {

    private String id;
    private String rentalOrderId;
    private String bankAgentId;
    private String clientId;
    private BigDecimal amount;
    private BigDecimal interestRate;
    private Integer installments;
    private BigDecimal installmentAmount;
    private ContractStatus status;
    private LocalDateTime createdAt;
}
