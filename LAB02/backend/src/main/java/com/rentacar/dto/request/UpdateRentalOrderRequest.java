package com.rentacar.dto.request;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateRentalOrderRequest {

    private String vehicleId;

    @FutureOrPresent(message = "Data de início deve ser hoje ou no futuro")
    private LocalDate startDate;

    @Future(message = "Data de término deve ser no futuro")
    private LocalDate endDate;
}
