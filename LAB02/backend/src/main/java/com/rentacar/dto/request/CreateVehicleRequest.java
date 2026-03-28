package com.rentacar.dto.request;

import com.rentacar.model.enums.OwnerType;
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
public class CreateVehicleRequest {

    @NotBlank(message = "Matrícula é obrigatória")
    private String registrationNumber;

    @NotNull(message = "Ano é obrigatório")
    private Integer year;

    @NotBlank(message = "Marca é obrigatória")
    private String brand;

    @NotBlank(message = "Modelo é obrigatório")
    private String model;

    @NotBlank(message = "Placa é obrigatória")
    private String licensePlate;

    @NotNull(message = "Tipo de propriedade é obrigatório")
    private OwnerType ownerType;

    private String ownerId;

    @NotNull(message = "Valor da diária é obrigatório")
    @Positive(message = "Valor da diária deve ser positivo")
    private BigDecimal dailyRate;
}
