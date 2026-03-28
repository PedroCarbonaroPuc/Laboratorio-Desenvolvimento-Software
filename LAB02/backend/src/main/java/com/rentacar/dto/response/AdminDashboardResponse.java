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
public class AdminDashboardResponse {

    private long totalClients;
    private long totalAgents;
    private long totalVehicles;
    private long totalOrders;
    private long activeOrders;
    private List<UserSummaryResponse> users;
}
