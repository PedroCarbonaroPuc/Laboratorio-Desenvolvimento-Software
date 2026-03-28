package com.rentacar.model;

import com.rentacar.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "rental_orders")
public class RentalOrder {

    @Id
    private String id;

    private String clientId;

    private String vehicleId;

    private LocalDate startDate;

    private LocalDate endDate;

    private BigDecimal totalAmount;

    @Builder.Default
    private OrderStatus status = OrderStatus.PENDING;

    private FinancialAnalysis financialAnalysis;

    private String creditContractId;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    public long getRentalDays() {
        if (startDate == null || endDate == null) {
            return 0;
        }
        long days = ChronoUnit.DAYS.between(startDate, endDate);
        return Math.max(days, 1);
    }

    public void calculateTotalAmount(BigDecimal dailyRate) {
        this.totalAmount = dailyRate.multiply(BigDecimal.valueOf(getRentalDays()));
    }
}
