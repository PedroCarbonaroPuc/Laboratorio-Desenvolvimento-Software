package com.rentacar.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.micronaut.core.annotation.Creator;
import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor(onConstructor_ = @Creator)
@AllArgsConstructor
@Serdeable
public class CreateRentalOrderRequest {

    @JsonProperty("vehicleId")
    @NotBlank(message = "ID do veículo é obrigatório")
    private String vehicleId;

    @JsonProperty("startDate")
    @NotNull(message = "Data de início é obrigatória")
    @FutureOrPresent(message = "Data de início deve ser hoje ou no futuro")
    private LocalDate startDate;

    @JsonProperty("endDate")
    @NotNull(message = "Data de término é obrigatória")
    @Future(message = "Data de término deve ser no futuro")
    private LocalDate endDate;
}
