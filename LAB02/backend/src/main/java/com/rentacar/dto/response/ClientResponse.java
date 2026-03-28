package com.rentacar.dto.response;

import com.rentacar.model.Address;
import com.rentacar.model.Employer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientResponse {

    private String id;
    private String email;
    private String name;
    private String rg;
    private String cpf;
    private Address address;
    private String profession;
    private List<Employer> employers;
    private BigDecimal totalIncome;
    private LocalDateTime createdAt;
}
