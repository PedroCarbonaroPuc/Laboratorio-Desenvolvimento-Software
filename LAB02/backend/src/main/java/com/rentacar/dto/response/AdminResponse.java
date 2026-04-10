package com.rentacar.dto.response;

import io.micronaut.serde.annotation.Serdeable;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
public class AdminResponse {

    private String id;
    private String email;
    private String name;
    private LocalDateTime createdAt;
}
