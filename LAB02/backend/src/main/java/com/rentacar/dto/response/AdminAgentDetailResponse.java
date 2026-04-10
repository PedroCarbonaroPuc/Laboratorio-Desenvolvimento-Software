package com.rentacar.dto.response;

import io.micronaut.serde.annotation.Serdeable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class AdminAgentDetailResponse {

    private AgentResponse agent;
    private List<VehicleResponse> vehicles;
    private List<RentalOrderResponse> orders;
}
