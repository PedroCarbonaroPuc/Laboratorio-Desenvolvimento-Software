package com.rentacar.dto.response;

import io.micronaut.serde.annotation.Serdeable;

import com.rentacar.model.enums.OwnerType;
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
public class VehicleResponse {

    private String id;
    private String registrationNumber;
    private Integer year;
    private String brand;
    private String model;
    private String licensePlate;
    private OwnerType ownerType;
    private String ownerId;
    private BigDecimal dailyRate;
    private Boolean available;
    private LocalDateTime createdAt;
}
