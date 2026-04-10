package com.rentacar.model;

import com.rentacar.model.enums.UserRole;
import io.micronaut.data.annotation.GeneratedValue;
import io.micronaut.data.annotation.Id;
import io.micronaut.data.annotation.MappedEntity;
import io.micronaut.serde.annotation.Serdeable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Serdeable
@MappedEntity("users")
public class User {

    @Id
    @GeneratedValue
    private String id;

    private String email;

    private String password;

    private UserRole role;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // Admin + Client field
    private String name;

    // Client-specific fields
    private String rg;

    private String cpf;

    private Address address;

    private String profession;

    @Builder.Default
    private List<Employer> employers = new ArrayList<>();

    // Agent-specific fields
    private String companyName;

    private String cnpj;

    private String phone;

    public BigDecimal getTotalIncome() {
        if (employers == null || employers.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return employers.stream()
                .map(Employer::getIncome)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
