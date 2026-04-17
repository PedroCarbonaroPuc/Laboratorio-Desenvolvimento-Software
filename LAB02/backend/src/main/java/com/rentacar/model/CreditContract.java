package com.rentacar.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rentacar.model.enums.ContractStatus;
import io.micronaut.core.annotation.Creator;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor(onConstructor_ = @Creator)
@AllArgsConstructor
@Serdeable
@MappedEntity("credit_contracts")
public class CreditContract {

    @Id
    @GeneratedValue
    @JsonProperty("_id")
    private String id;

    private String rentalOrderId;

    private String bankAgentId;

    private String clientId;

    private BigDecimal amount;

    private BigDecimal interestRate;

    private Integer installments;

    private BigDecimal installmentAmount;

    @Builder.Default
    private ContractStatus status = ContractStatus.PENDING;

    private LocalDateTime createdAt;

    public void calculateInstallmentAmount() {
        if (amount != null && installments != null && installments > 0 && interestRate != null) {
            BigDecimal rate = interestRate.divide(BigDecimal.valueOf(100), 10, RoundingMode.HALF_UP);
            BigDecimal totalWithInterest = amount.multiply(BigDecimal.ONE.add(rate.multiply(BigDecimal.valueOf(installments))));
            this.installmentAmount = totalWithInterest.divide(BigDecimal.valueOf(installments), 2, RoundingMode.HALF_UP);
        }
    }
}
