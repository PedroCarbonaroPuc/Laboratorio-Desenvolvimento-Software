package com.rentacar.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.micronaut.core.annotation.Creator;
import io.micronaut.serde.annotation.Serdeable;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor(onConstructor_ = @Creator)
@AllArgsConstructor
@Serdeable
public class UpdateRentalOrderRequest {

    @JsonProperty("vehicleId")
    private String vehicleId;

    @JsonProperty("startDate")
    @FutureOrPresent(message = "Data de início deve ser hoje ou no futuro")
    private LocalDate startDate;

    @JsonProperty("endDate")
    @Future(message = "Data de término deve ser no futuro")
    private LocalDate endDate;
}
