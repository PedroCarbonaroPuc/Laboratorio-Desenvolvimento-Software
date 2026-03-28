package com.rentacar.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminAgentDetailResponse {

    private AgentResponse agent;
    private List<VehicleResponse> vehicles;
    private List<RentalOrderResponse> orders;
}
