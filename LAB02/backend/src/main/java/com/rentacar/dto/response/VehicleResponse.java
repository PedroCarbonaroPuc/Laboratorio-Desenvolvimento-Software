package com.rentacar.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
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
@JsonInclude(JsonInclude.Include.ALWAYS)
public class VehicleResponse {

    @JsonProperty("id")
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
