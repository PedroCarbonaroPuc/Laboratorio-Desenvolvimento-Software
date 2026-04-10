package com.rentacar.model;

import com.rentacar.model.enums.OwnerType;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.serde.annotation.Serdeable;
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
@MappedEntity("vehicles")
public class Vehicle {

    @Id
    @GeneratedValue
    private String id;

    private String registrationNumber;

    private Integer year;

    private String brand;

    private String model;

    private String licensePlate;

    private OwnerType ownerType;

    private String ownerId;

    private BigDecimal dailyRate;

    @Builder.Default
    private Boolean available = true;

    private LocalDateTime createdAt;
}
