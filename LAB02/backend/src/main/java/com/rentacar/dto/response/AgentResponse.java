package com.rentacar.dto.response;

import com.rentacar.model.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentResponse {

    private String id;
    private String email;
    private String companyName;
    private String cnpj;
    private Address address;
    private String phone;
    private LocalDateTime createdAt;
}
