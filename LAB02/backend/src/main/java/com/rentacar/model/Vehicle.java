package com.rentacar.model;

import com.rentacar.model.enums.OwnerType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "vehicles")
public class Vehicle {

    @Id
    private String id;

    private String registrationNumber;

    private Integer year;

    private String brand;

    private String model;

    @Indexed(unique = true)
    private String licensePlate;

    private OwnerType ownerType;

    private String ownerId;

    private BigDecimal dailyRate;

    @Builder.Default
    private Boolean available = true;

    private LocalDateTime createdAt;
}
