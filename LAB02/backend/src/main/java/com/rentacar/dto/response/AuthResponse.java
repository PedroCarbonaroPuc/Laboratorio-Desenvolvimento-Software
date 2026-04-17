package com.rentacar.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.micronaut.serde.annotation.Serdeable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
@JsonInclude(JsonInclude.Include.ALWAYS)
public class AuthResponse {

    private String token;
    private String role;
    private String userId;
    private String name;
}
