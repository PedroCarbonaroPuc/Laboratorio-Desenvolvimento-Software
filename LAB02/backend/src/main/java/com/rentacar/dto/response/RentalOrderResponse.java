package com.rentacar.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.micronaut.serde.annotation.Serdeable;

import com.rentacar.model.FinancialAnalysis;
import com.rentacar.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
@JsonInclude(JsonInclude.Include.ALWAYS)
public class RentalOrderResponse {

    @JsonProperty("id")
    private String id;
    @JsonProperty("clientId")
    private String clientId;
    private String clientName;
    private String vehicleId;
    private String vehicleDescription;
    private LocalDate startDate;
    private LocalDate endDate;
    private long rentalDays;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private FinancialAnalysis financialAnalysis;
    private String creditContractId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
