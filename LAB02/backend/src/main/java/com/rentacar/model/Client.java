package com.rentacar.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "users")
public class Client extends User {

    private String rg;

    @Indexed(unique = true)
    private String cpf;

    private String name;

    private Address address;

    private String profession;

    private List<Employer> employers = new ArrayList<>();

    public BigDecimal getTotalIncome() {
        if (employers == null || employers.isEmpty()) {
            return BigDecimal.ZERO;
        }
        return employers.stream()
                .map(Employer::getIncome)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
