package com.rentacar.model;

import com.rentacar.model.enums.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "credit_contracts")
public class CreditContract {

    @Id
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
